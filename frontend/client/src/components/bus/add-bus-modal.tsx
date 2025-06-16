import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { X, Wifi, Snowflake, Zap, Armchair, Tv, Cookie } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBusCompanies } from "@/api/busCompanies";
import { getSeatLayouts } from "@/api/seatLayouts";
import { createBus } from "@/api/buses";
import type { Bus, BusCompany, SeatLayout } from "@shared/schema";

// Create a Zod schema for form validation based on the Bus interface
const busFormSchema = z.object({
  name: z.string().min(1, "Bus name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  companyId: z.string().min(1, "Company is required"),
  busType: z.string().min(1, "Bus type is required"),
  manufacturingYear: z.number().default(new Date().getFullYear()),
  engineType: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  seatLayoutId: z.string().min(1, "Seat layout is required"),
  status: z.string().default("active"),
  certifications: z.string().optional(),
  additionalFeatures: z.string().optional(),
});

type BusFormData = z.infer<typeof busFormSchema>;

interface AddBusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddBusModal({ open, onOpenChange }: AddBusModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companies = [] } = useQuery<BusCompany[]>({
    queryKey: ['bus-companies'],
    queryFn: getBusCompanies,
  });

  const { data: seatLayouts = [] } = useQuery<SeatLayout[]>({
    queryKey: ['seatLayouts'],
    queryFn: getSeatLayouts,
  });

  const form = useForm<BusFormData>({
    resolver: zodResolver(busFormSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
      companyId: "",
      busType: "",
      manufacturingYear: new Date().getFullYear(),
      engineType: "",
      description: "",
      features: [],
      seatLayoutId: "",
      status: "active",
      certifications: "",
      additionalFeatures: "",
    },
  });

  const createBusMutation = useMutation({
    mutationFn: (data: BusFormData) => {
      const selectedLayoutData = seatLayouts?.find(layout => layout.id === data.seatLayoutId);
      if (!selectedLayoutData) {
        throw new Error("Selected seat layout not found");
      }

      const busData = {
        ...data,
        certifications: data.certifications || "",
        additionalFeatures: data.additionalFeatures || "",
        seatLayout: selectedLayoutData,
        totalSeats: selectedLayoutData.seats.length,
      };

      return createBus(busData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buses'] });
      toast({
        title: "Bus Added Successfully",
        description: "The new bus has been added to your fleet.",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add bus. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedLayout("");
    form.reset();
  };

  const steps = [
    { title: "Basic Information", description: "Enter basic bus details" },
    { title: "Amenities & Features", description: "Select available amenities" },
    { title: "Seat Layout", description: "Choose seat configuration" },
    { title: "Review & Confirm", description: "Review all details" },
  ];

  const availableFeatures = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "ac", label: "Air Conditioning", icon: Snowflake },
    { id: "usb", label: "USB Charging", icon: Zap },
    { id: "reclining", label: "Reclining Seats", icon: Armchair },
    { id: "entertainment", label: "Entertainment System", icon: Tv },
    { id: "refreshments", label: "Refreshments", icon: Cookie },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: BusFormData) => {
    createBusMutation.mutate(data);
  };

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    const currentFeatures = form.getValues("features");
    if (checked) {
      form.setValue("features", [...currentFeatures, featureId]);
    } else {
      form.setValue("features", currentFeatures.filter(f => f !== featureId));
    }
  };

  const renderSeatLayoutPreview = (layout: SeatLayout) => {
    return (
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="space-y-1">
          {Object.entries(layout.layout).map(([row, seats]) => (
            <div key={row} className="flex items-center justify-center space-x-1">
              {seats.map((seatLabel, seatIndex) => (
                <div 
                  key={`${row}-${seatIndex}`}
                  className={`w-5 h-5 rounded text-white text-xs flex items-center justify-center ${seatLabel ? 'bg-blue-500' : 'bg-transparent'}`}>
                  {seatLabel}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">{layout.seats.length} seats</p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto overflow-x-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Add New Bus</DialogTitle>
          <DialogDescription>Complete the bus onboarding process</DialogDescription>
        </DialogHeader>

        {/* Progress Steps - Compact Design */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    index === currentStep 
                      ? 'bg-primary text-white' 
                      : index < currentStep
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === currentStep 
                        ? 'bg-white text-primary' 
                        : index < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                    }`}>
                      {index < currentStep ? '✓' : index + 1}
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-medium">{step.title}</div>
                      <div className="text-xs opacity-75 hidden lg:block">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-4 sm:w-8 h-0.5 transition-colors ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6">
          <div>
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="name">Bus Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Daewoo Express DX-001"
                      {...form.register("name")}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      placeholder="e.g., LHR-2024-001"
                      {...form.register("registrationNumber")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyId">Bus Company</Label>
                    <Select onValueChange={(value) => form.setValue("companyId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies?.map((company: BusCompany) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="busType">Bus Type</Label>
                    <Select onValueChange={(value) => form.setValue("busType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="manufacturingYear">Manufacturing Year</Label>
                    <Input
                      id="manufacturingYear"
                      type="number"
                      placeholder="2024"
                      {...form.register("manufacturingYear", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="engineType">Engine Type</Label>
                    <Input
                      id="engineType"
                      placeholder="e.g., Diesel Euro 5"
                      {...form.register("engineType")}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Brief description of the bus..."
                    {...form.register("description")}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Features & Amenities */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Bus Features & Amenities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableFeatures.map((feature) => (
                      <Card key={feature.id} className="p-3 cursor-pointer hover:bg-gray-50">
                        <CardContent className="p-0">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <Checkbox
                              onCheckedChange={(checked) => 
                                handleFeatureChange(feature.id, checked as boolean)
                              }
                            />
                            <div className="flex items-center space-x-2">
                              <feature.icon className="h-5 w-5 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">
                                {feature.label}
                              </span>
                            </div>
                          </label>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="certifications">Safety Certifications</Label>
                    <Textarea
                      id="certifications"
                      rows={3}
                      placeholder="List safety certifications..."
                      {...form.register("certifications")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalFeatures">Additional Features</Label>
                    <Textarea
                      id="additionalFeatures"
                      rows={3}
                      placeholder="Any other special features..."
                      {...form.register("additionalFeatures")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Seat Layout */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Select Seat Layout</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {seatLayouts?.map((layout) => (
                      <Card 
                        key={layout.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedLayout === layout.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:border-primary'
                        }`}
                        onClick={() => {
                          setSelectedLayout(layout.id);
                          form.setValue("seatLayoutId", layout.id);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="text-center mb-3">
                            <h5 className="font-semibold text-gray-900">{layout.name}</h5>
                            <p className="text-sm text-gray-500">{layout.seats.length} Seats</p>
                          </div>
                          {renderSeatLayoutPreview(layout)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="text-white text-2xl">✓</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Review & Confirm</h3>
                  <p className="text-gray-600 dark:text-gray-400">Review all details and preview how your bus will look to customers</p>
                </div>

                {/* Bus Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">🚌</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{form.getValues("name") || "Bus Name"}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{form.getValues("busType") || "Bus Type"}</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">⚙️</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{form.getValues("features")?.length || 0} Amenities</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Features included</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">💺</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{(seatLayouts as any[])?.find((l: any) => l.id === selectedLayout)?.totalSeats || 0} Seats</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{(seatLayouts as any[])?.find((l: any) => l.id === selectedLayout)?.name || "Layout"}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview Bus Layout Button */}
                <div className="text-center mb-6">
                  <Button 
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      toast({
                        title: "Bus Preview",
                        description: "Opening bus layout preview...",
                      });
                    }}
                  >
                    🚌 Preview Bus Layout
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="w-full sm:w-auto">
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext} className="w-full sm:w-auto">
                  Next Step
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={handlePrevious}
                  >
                    Preview Bus
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createBusMutation.isPending || (currentStep === 2 && !selectedLayout)}
                    className="w-full sm:w-auto"
                  >
                    {createBusMutation.isPending ? "Creating..." : "Confirm & Create"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}