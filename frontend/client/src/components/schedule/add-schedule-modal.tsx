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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const scheduleFormSchema = z.object({
  routeId: z.string().min(1, "Route is required"),
  companyId: z.string().min(1, "Company is required"),
  busId: z.string().min(1, "Bus is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  fare: z.number().min(1, "Fare must be greater than 0"),
  currency: z.string().default("PKR"),
  status: z.string().default("ON_TIME"),
  availableSeats: z.number().min(1, "Available seats required"),
  seatLayoutId: z.string().optional(),
  amenities: z.array(z.string()).default([]),
});

type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

interface AddScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddScheduleModal({ open, onOpenChange }: AddScheduleModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: routes = [] } = useQuery({
    queryKey: ['busRoutes'],
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['bus-companies'],
  });

  const { data: buses = [] } = useQuery({
    queryKey: ['buses'],
  });

  const { data: seatLayouts = [] } = useQuery({
    queryKey: ['seatLayouts'],
  });

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      routeId: "",
      companyId: "",
      busId: "",
      departureTime: "",
      arrivalTime: "",
      fare: 0,
      currency: "PKR",
      status: "ON_TIME",
      availableSeats: 0,
      seatLayoutId: "",
      amenities: [],
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: ScheduleFormData) => {
      const response = await apiClient.post('/busSchedules', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['busSchedules'] });
      toast({
        title: "Schedule Added Successfully",
        description: "The new bus schedule has been created.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data || "Failed to add schedule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ScheduleFormData) => {
    createScheduleMutation.mutate(data);
  };

  const selectedBus = buses.find((bus: any) => bus.id === form.watch("busId"));
  const selectedRoute = routes.find((route: any) => route.id === form.watch("routeId"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Schedule</DialogTitle>
          <DialogDescription>Create a new bus schedule for a route</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="routeId">Route</Label>
              <Select onValueChange={(value) => form.setValue("routeId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Route" />
                </SelectTrigger>
                <SelectContent>
                  {(routes as any[]).map((route: any) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.from} → {route.to} ({route.distance})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.routeId && (
                <p className="text-sm text-red-600">{form.formState.errors.routeId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="companyId">Company</Label>
              <Select onValueChange={(value) => form.setValue("companyId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {(companies as any[]).map((company: any) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.companyId && (
                <p className="text-sm text-red-600">{form.formState.errors.companyId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="busId">Bus</Label>
              <Select onValueChange={(value) => {
                form.setValue("busId", value);
                const bus = buses.find((b: any) => b.id === value);
                if (bus) {
                  form.setValue("availableSeats", bus.totalSeats || 45);
                  if (bus.seatLayout?.layoutId) {
                    form.setValue("seatLayoutId", bus.seatLayout.layoutId);
                  }
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Bus" />
                </SelectTrigger>
                <SelectContent>
                  {(buses as any[]).map((bus: any) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.name} ({bus.registrationNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.busId && (
                <p className="text-sm text-red-600">{form.formState.errors.busId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => form.setValue("status", value)} defaultValue="ON_TIME">
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON_TIME">On Time</SelectItem>
                  <SelectItem value="DELAYED">Delayed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="departureTime">Departure Time</Label>
              <Input
                id="departureTime"
                type="datetime-local"
                {...form.register("departureTime")}
              />
              {form.formState.errors.departureTime && (
                <p className="text-sm text-red-600">{form.formState.errors.departureTime.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <Input
                id="arrivalTime"
                type="datetime-local"
                {...form.register("arrivalTime")}
              />
              {form.formState.errors.arrivalTime && (
                <p className="text-sm text-red-600">{form.formState.errors.arrivalTime.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fare">Fare (PKR)</Label>
              <Input
                id="fare"
                type="number"
                placeholder="1500"
                {...form.register("fare", { valueAsNumber: true })}
              />
              {form.formState.errors.fare && (
                <p className="text-sm text-red-600">{form.formState.errors.fare.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="availableSeats">Available Seats</Label>
              <Input
                id="availableSeats"
                type="number"
                placeholder="45"
                {...form.register("availableSeats", { valueAsNumber: true })}
              />
              {form.formState.errors.availableSeats && (
                <p className="text-sm text-red-600">{form.formState.errors.availableSeats.message}</p>
              )}
            </div>
          </div>

          {selectedRoute && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Route Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Distance:</span> {selectedRoute.distance}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {selectedRoute.estimatedDuration}
                </div>
                <div>
                  <span className="font-medium">Bus Types:</span> {selectedRoute.availableBusTypes?.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Popular:</span> {selectedRoute.isPopular ? "Yes" : "No"}
                </div>
              </div>
            </div>
          )}

          {selectedBus && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Bus Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {selectedBus.busType}
                </div>
                <div>
                  <span className="font-medium">Total Seats:</span> {selectedBus.totalSeats}
                </div>
                <div>
                  <span className="font-medium">Year:</span> {selectedBus.manufacturingYear}
                </div>
                <div>
                  <span className="font-medium">Engine:</span> {selectedBus.engineType}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createScheduleMutation.isPending}>
              {createScheduleMutation.isPending ? "Creating..." : "Create Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}