import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBusById } from "@/api/buses";
import { createBusSchedule } from "@/api/busSchedules";
import { apiClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScheduleSeatLayout, BusSchedule, ScheduledSeat, SeatStatus, ScheduleStatus } from "@shared/schema";

// Define types for our API responses
interface Bus {
  id: string;
  name: string;
  registrationNumber: string;
  companyId: string;
  seatLayout?: {
    layout: Record<string, (string | null)[]>;
    rows: number;
    columns: number;
  };
}

interface Route {
  id: string;
  origin: string;
  destination: string;
}

interface Company {
  id: string;
  name: string;
}

interface BusDetails extends Bus {
  seatLayout: {
    layout: Record<string, (string | null)[]>;
    rows: number;
    columns: number;
  };
}

// Extend the BusSchedule interface to include all required fields
interface ScheduleFormData extends Omit<BusSchedule, 'id'> {
  // Add any additional fields if needed
}

interface AddScheduleWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddScheduleWizard({ onClose, onSuccess }: AddScheduleWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ScheduleFormData>({
    routeId: '',
    companyId: '',
    busId: '',
    driverId: '', // Added missing required field
    departureTime: '',
    arrivalTime: '',
    fare: 0,
    currency: 'PKR',
    status: ScheduleStatus.ON_TIME, // Use the enum value
    availableSeats: 0,
    amenities: [],
    seatLayout: {
      layoutId: '',
      name: '',
      rows: 0,
      columns: 0,
      layout: {},
      seats: []
    }
  });

  // Define types for our API responses
  interface ScheduleResponse {
    routeId: string;
    companyId: string;
  }

    // Fetch all routes directly for the dropdown
  const { data: routes = [], isLoading: isLoadingRoutes, error: routesError } = useQuery<Route[]>({
    queryKey: ['busRoutes'],
  });

  const steps = [
    { id: 1, name: 'Schedule Details', description: 'Basic information about the schedule' },
    { id: 2, name: 'Seat Selection', description: 'Configure seat layout and availability' },
  ];

  const queryClient = useQueryClient();

  // Fetch data for dropdowns with optimized settings
  const { data: buses = [], isLoading: isLoadingBuses, error: busesError } = useQuery<Bus[]>({
    queryKey: ['buses'],
  });


  const {
    data: companies = [],
    isLoading: isLoadingCompanies,
    error: companiesError
  } = useQuery<Company[]>({
    queryKey: ['bus-companies'],
  });

  // Log companies data for debugging
  useEffect(() => {
    if (companies.length > 0) {
      console.log('Companies loaded:', companies);
    }
    if (companiesError) {
      console.error('Error loading companies:', companiesError);
    }
  }, [companies, companiesError]);

  // Only fetch bus details when in step 2 and busId is available
  const { data: busDetails, isLoading: isLoadingBusDetails } = useQuery<BusDetails | null>({
    queryKey: ['bus', formData.busId],
    queryFn: () => getBusById(formData.busId) as Promise<BusDetails | null>,
    enabled: !!formData.busId && currentStep === 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const progress = useMemo(() => {
    return (currentStep / steps.length) * 100;
  }, [currentStep, steps.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      if (name === 'status') {
        return {
          ...prev,
          status: value as ScheduleStatus
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Front-end validation for required fields
    if (!formData.busId || !formData.routeId || !busDetails?.seatLayout || !formData.companyId || !formData.departureTime || !formData.arrivalTime || !formData.fare) {
      alert('Please fill all required fields: Bus, Route, Company, Departure/Arrival Time, and Fare.');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare the seat data
      const seatLayout: ScheduleSeatLayout = {
        layoutId: `layout_${Date.now()}`,
        name: `${busDetails.name} Layout`,
        rows: busDetails.seatLayout.rows,
        columns: busDetails.seatLayout.columns,
        layout: {},
        seats: []
      };

      Object.entries(busDetails.seatLayout.layout || {}).forEach(([row, rowSeats]) => {
        const seatRow: string[] = [];
        rowSeats.forEach((seatLabel, index) => {
          seatRow.push(seatLabel || "");
          if (seatLabel) {
            const newSeat: ScheduledSeat = {
              id: `seat_${seatLabel}`,
              seatNumber: seatLabel,
              row: parseInt(row.replace(/\D/g, "")),
              column: index + 1,
              type: 'standard',
              price: Number(formData.fare),
              currency: formData.currency,
              isHandicapped: false,
              status: SeatStatus.AVAILABLE
            };
            seatLayout.seats.push(newSeat);
          }
        });
        seatLayout.layout[row] = seatRow;
      });

      // Prepare all required/optional fields for backend
      const departureDate = new Date(formData.departureTime);
      const dateISO = departureDate.toISOString().slice(0, 10); // YYYY-MM-DD

      // Remove driverId if empty
      const { driverId, ...restForm } = formData;
      const driverIdToSend = driverId && driverId.trim() !== '' ? driverId : undefined;

      let scheduleData: any = {
        ...restForm,
        ...(driverIdToSend ? { driverId: driverIdToSend } : {}),
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString(),
        availableSeats: seatLayout.seats.length,
        totalSeats: seatLayout.seats.length,
        seatLayout,
        date: dateISO,
        busType: busDetails.busType || 'Standard',
        amenities: formData.amenities || [],
        boardingPoints: formData.boardingPoints || [],
        droppingPoints: formData.droppingPoints || [],
        features: formData.features || [],
        cancellationPolicy: formData.cancellationPolicy || '',
        fare: Number(formData.fare),
        currency: formData.currency || 'PKR',
        status: formData.status || ScheduleStatus.ON_TIME,
      };

      // Remove null/undefined/empty string fields (except those required by backend)
      Object.keys(scheduleData).forEach(key => {
        if (scheduleData[key] === undefined || scheduleData[key] === null || scheduleData[key] === '') {
          // Only remove if not required by backend
          if (!["routeId","companyId","departureTime","arrivalTime","busId","fare","seatLayout"].includes(key)) {
            delete scheduleData[key];
          }
        }
      });

      // Log payload for debugging
      console.log('Submitting scheduleData:', scheduleData);

      await createBusSchedule(scheduleData);
      await queryClient.invalidateQueries({ queryKey: ['busSchedules'] });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Bus Schedule</CardTitle>
            <div className="pt-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div 
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            currentStep >= step.id 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {step.id}
                        </div>
                        <div className={`ml-2 text-sm font-medium ${
                          currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="mx-4 h-px w-12 bg-gray-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </div>
              </div>
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 max-h-[70vh] overflow-y-auto">
            {currentStep === 1 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bus</Label>
                    <Select 
                      value={formData.busId}
                      onValueChange={(value) => handleSelectChange('busId', value)}
                      disabled={isLoadingBuses || !!busesError}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingBuses 
                            ? 'Loading buses...' 
                            : busesError ? 'Error loading buses' : 'Select a bus'
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom">
                        {isLoadingBuses ? (
                          <div className="py-2 text-center text-sm text-muted-foreground">
                            Loading buses...
                          </div>
                        ) : busesError ? (
                          <div className="py-2 text-center text-sm text-destructive">
                            Failed to load buses
                          </div>
                        ) : (
                          buses.map((bus) => (
                            <SelectItem key={bus.id} value={bus.id}>
                              {bus.name} - {bus.registrationNumber}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Route</Label>
                    <Select 
                      value={formData.routeId}
                      onValueChange={(value) => handleSelectChange('routeId', value)}
                      disabled={isLoadingRoutes}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingRoutes 
                            ? 'Loading routes...' 
                            : routesError ? 'Error loading routes' : 'Select a route'
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom">
                        {isLoadingRoutes ? (
                          <div className="py-2 text-center text-sm text-muted-foreground">
                            Loading routes...
                          </div>
                        ) : routesError ? (
                          <div className="py-2 text-center text-sm text-destructive">
                            Failed to load routes
                          </div>
                        ) : (routes as Route[]).length === 0 ? (
                          <div className="py-2 text-center text-sm text-muted-foreground">
                            No routes available
                          </div>
                        ) : (
                          (routes as Route[]).map((route: Route) => (
                            <SelectItem key={route.id} value={route.id}>
                              {(route.origin || (route as any).from || 'Unknown Origin') + ' → ' + (route.destination || (route as any).to || 'Unknown Destination')}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Select 
                      value={formData.companyId}
                      onValueChange={(value) => handleSelectChange('companyId', value)}
                      disabled={isLoadingCompanies}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingCompanies 
                            ? 'Loading companies...' 
                            : companiesError ? 'Error loading companies' : 'Select a company'
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom">
                        {isLoadingCompanies ? (
                          <div className="py-2 text-center text-sm text-muted-foreground">
                            Loading companies...
                          </div>
                        ) : companiesError ? (
                          <div className="py-2 text-center text-sm text-destructive">
                            Failed to load companies
                          </div>
                        ) : companies.length === 0 ? (
                          <div className="py-2 text-center text-sm text-muted-foreground">
                            No companies available
                          </div>
                        ) : (
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Driver ID</Label>
                    <Input
                      name="driverId"
                      value={formData.driverId}
                      onChange={handleChange}
                      placeholder="Enter driver ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fare</Label>
                    <Input
                      name="fare"
                      type="number"
                      min="0"
                      value={formData.fare}
                      onChange={e => setFormData(prev => ({ ...prev, fare: Number(e.target.value) }))}
                      placeholder="Enter fare price"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Departure Time</Label>
                    <Input
                      type="datetime-local"
                      name="departureTime"
                      value={formData.departureTime}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Arrival Time</Label>
                    <Input
                      type="datetime-local"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={!formData.busId || !formData.routeId || !formData.companyId || isLoading}
                  >
                    Continue
                    <span className="ml-2">→</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Seat Layout</h3>
                {isLoadingBusDetails ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading seat layout...</p>
                  </div>
                ) : busDetails?.seatLayout ? (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      {busDetails.name || 'Bus'} - {busDetails.registrationNumber || 'N/A'}
                    </h4>
                    <div className="flex flex-col items-center space-y-2">
                      {Object.entries(busDetails.seatLayout.layout || {}).map(([rowName, seatsArray]) => {
                        const seatA = Array.isArray(seatsArray) ? seatsArray[0] : null;
                        const seatB = Array.isArray(seatsArray) ? seatsArray[1] : null;
                        const seatC = Array.isArray(seatsArray) ? seatsArray[2] : null;

                        return (
                          <div key={rowName} className="flex items-center gap-2"> {/* A single row */}
                            {/* Seat 1 */}
                            <div className="w-10 h-10 border rounded-md flex items-center justify-center font-medium bg-white text-black">
                              {seatA || ''}
                            </div>
                            {/* Seat 2 */}
                            <div className="w-10 h-10 border rounded-md flex items-center justify-center font-medium bg-white text-black">
                              {seatB || ''}
                            </div>
                            {/* Aisle */}
                            <div className="w-10 h-10"></div> {/* Aisle spacer */}
                            {/* Seat 3 */}
                            <div className="w-10 h-10 border rounded-md flex items-center justify-center font-medium bg-white text-black">
                              {seatC || ''}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No seat layout available for this bus
                  </div>
                )}
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Schedule'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}