import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const routeFormSchema = z.object({
  from: z.string().min(1, "From location is required"),
  to: z.string().min(1, "To location is required"),
  distance: z.string().min(1, "Distance is required"),
  estimatedDuration: z.string().min(1, "Duration is required"),
  availableBusTypes: z.array(z.string()).min(1, "At least one bus type required"),
  isPopular: z.boolean().default(false),
  companyIds: z.array(z.string()).min(1, "At least one company required"),
});

type RouteFormData = z.infer<typeof routeFormSchema>;

interface AddRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddRouteModal({ open, onOpenChange }: AddRouteModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [] } = useQuery({
    queryKey: ['bus-companies'],
  });

  const form = useForm<RouteFormData>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      from: "",
      to: "",
      distance: "",
      estimatedDuration: "",
      availableBusTypes: [],
      isPopular: false,
      companyIds: [],
    },
  });

  const createRouteMutation = useMutation({
    mutationFn: async (data: RouteFormData) => {
      const response = await apiClient.post('/busRoutes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['busRoutes'] });
      toast({
        title: "Route Added Successfully",
        description: "The new route has been created.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data || "Failed to add route. Please try again.",
        variant: "destructive",
      });
    },
  });

  const busTypes = ["Standard", "Business", "Premium"];

  const handleBusTypeChange = (busType: string, checked: boolean) => {
    const currentTypes = form.getValues("availableBusTypes");
    if (checked) {
      form.setValue("availableBusTypes", [...currentTypes, busType]);
    } else {
      form.setValue("availableBusTypes", currentTypes.filter(t => t !== busType));
    }
  };

  const handleCompanyChange = (companyId: string, checked: boolean) => {
    const currentCompanies = form.getValues("companyIds");
    if (checked) {
      form.setValue("companyIds", [...currentCompanies, companyId]);
    } else {
      form.setValue("companyIds", currentCompanies.filter(c => c !== companyId));
    }
  };

  const onSubmit = (data: RouteFormData) => {
    createRouteMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Route</DialogTitle>
          <DialogDescription>Create a new bus route between cities</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from">From City</Label>
              <Input
                id="from"
                placeholder="e.g., Lahore"
                {...form.register("from")}
              />
              {form.formState.errors.from && (
                <p className="text-sm text-red-600">{form.formState.errors.from.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="to">To City</Label>
              <Input
                id="to"
                placeholder="e.g., Islamabad"
                {...form.register("to")}
              />
              {form.formState.errors.to && (
                <p className="text-sm text-red-600">{form.formState.errors.to.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="distance">Distance</Label>
              <Input
                id="distance"
                placeholder="e.g., 375 km"
                {...form.register("distance")}
              />
              {form.formState.errors.distance && (
                <p className="text-sm text-red-600">{form.formState.errors.distance.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="estimatedDuration">Estimated Duration</Label>
              <Input
                id="estimatedDuration"
                placeholder="e.g., 5h 30m"
                {...form.register("estimatedDuration")}
              />
              {form.formState.errors.estimatedDuration && (
                <p className="text-sm text-red-600">{form.formState.errors.estimatedDuration.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Available Bus Types</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {busTypes.map((busType) => (
                <div key={busType} className="flex items-center space-x-2">
                  <Checkbox
                    id={busType}
                    onCheckedChange={(checked) => 
                      handleBusTypeChange(busType, checked as boolean)
                    }
                  />
                  <Label htmlFor={busType} className="text-sm font-medium">
                    {busType}
                  </Label>
                </div>
              ))}
            </div>
            {form.formState.errors.availableBusTypes && (
              <p className="text-sm text-red-600">{form.formState.errors.availableBusTypes.message}</p>
            )}
          </div>

          <div>
            <Label>Operating Companies</Label>
            <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
              {(companies as any[]).map((company: any) => (
                <div key={company.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={company.id}
                    onCheckedChange={(checked) => 
                      handleCompanyChange(company.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={company.id} className="text-sm font-medium">
                    {company.name}
                  </Label>
                </div>
              ))}
            </div>
            {form.formState.errors.companyIds && (
              <p className="text-sm text-red-600">{form.formState.errors.companyIds.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPopular"
              onCheckedChange={(checked) => 
                form.setValue("isPopular", checked as boolean)
              }
            />
            <Label htmlFor="isPopular" className="text-sm font-medium">
              Mark as Popular Route
            </Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRouteMutation.isPending}>
              {createRouteMutation.isPending ? "Creating..." : "Create Route"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}