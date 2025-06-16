import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBusById } from "@/api/buses";
import { updateBusSchedule } from "@/api/busSchedules";
import { apiClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScheduleSeatLayout, BusSchedule, ScheduledSeat, SeatStatus, ScheduleStatus } from "@shared/schema";
import BusSeatLayout from "./BusSeatLayout";
import Loader from "../ui/Loader";

interface EditScheduleWizardProps {
  schedule: BusSchedule;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditScheduleWizard({ schedule, onClose, onSuccess }: EditScheduleWizardProps) {
  // Step and form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ ...schedule });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Fetch dropdown data (buses, routes, companies)
  const { data: buses = [], isLoading: isLoadingBuses, error: busesError } = useQuery<any[]>({
    queryKey: ['buses'],
  });
  const { data: routes = [], isLoading: isLoadingRoutes, error: routesError } = useQuery<any[]>({
    queryKey: ['busRoutes'],
  });
  const { data: companies = [], isLoading: isLoadingCompanies, error: companiesError } = useQuery<any[]>({
    queryKey: ['bus-companies'],
  });

  // Fetch bus details for seat layout in step 2
  const { data: busDetails, isLoading: isLoadingBusDetails } = useQuery<any>({
    queryKey: ['bus', formData.busId],
    queryFn: () => getBusById(formData.busId),
    enabled: !!formData.busId && currentStep === 2,
  });

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleNext = () => setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber) // Deselect
        : [...prev, seatNumber] // Select
    );
  };

  // On submit, update schedule
  const queryClient = useQueryClient();
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Prepare updated data (format times, amenities, seatLayout, etc.)
      const updatedData = {
        ...formData,
        departureTime: formData.departureTime ? new Date(formData.departureTime).toISOString() : '',
        arrivalTime: formData.arrivalTime ? new Date(formData.arrivalTime).toISOString() : '',
        amenities: Array.isArray(formData.amenities)
          ? formData.amenities
          : (typeof formData.amenities === 'string' ? formData.amenities.split(',').map((a: string) => a.trim()) : []),
      };
      // If busDetails and seatLayout exist, update seatLayout and availableSeats
      if (busDetails?.seatLayout) {
        const seatLayout = {
          ...busDetails.seatLayout,
        };
        updatedData.seatLayout = seatLayout;
        updatedData.availableSeats = seatLayout.layout
          ? Object.values(seatLayout.layout).flat().filter(Boolean).length
          : 0;
      }
      await updateBusSchedule(schedule.id, updatedData);
      await queryClient.invalidateQueries({ queryKey: ['busSchedules'] });
      onSuccess();
      onClose();
    } catch (e) {
      // Optionally show error
    } finally {
      setIsLoading(false);
    }
  };

  // Steps UI
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Bus Schedule</CardTitle>
            <div className="pt-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    {[{id:1,name:'Schedule Details'},{id:2,name:'Seat Selection'}].map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {step.id}
                        </div>
                        <div className={`ml-2 text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>{step.name}</div>
                        {index < 1 && (<div className="mx-4 h-px w-12 bg-gray-300"></div>)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-500">Step {currentStep} of 2</div>
              </div>
              <div className="mt-4">
                <Progress value={(currentStep/2)*100} className="h-2" />
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
                      onValueChange={value => handleSelectChange('busId', value)}
                      disabled={isLoadingBuses || !!busesError}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingBuses ? 'Loading buses...' : busesError ? 'Error loading buses' : 'Select a bus'} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingBuses ? (
                          <div className="py-2 text-center text-sm text-muted-foreground">Loading buses...</div>
                        ) : busesError ? (
                          <div className="py-2 text-center text-sm text-destructive">Failed to load buses</div>
                        ) : (
                          buses.map((bus) => (
                            <SelectItem key={bus.id} value={bus.id}>{bus.name} - {bus.registrationNumber}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Route</Label>
                    <Select 
                      value={formData.routeId}
                      onValueChange={value => handleSelectChange('routeId', value)}
                      disabled={isLoadingRoutes}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingRoutes ? 'Loading routes...' : routesError ? 'Error loading routes' : 'Select a route'} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingRoutes ? (
                          <div className="py-2 text-center text-sm text-muted-foreground">Loading routes...</div>
                        ) : routesError ? (
                          <div className="py-2 text-center text-sm text-destructive">Failed to load routes</div>
                        ) : (
                          routes.map((route) => (
                            <SelectItem key={route.id} value={route.id}>{route.origin} → {route.destination}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Select 
                      value={formData.companyId}
                      onValueChange={value => handleSelectChange('companyId', value)}
                      disabled={isLoadingCompanies}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCompanies ? 'Loading companies...' : companiesError ? 'Error loading companies' : 'Select a company'} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCompanies ? (
                          <div className="py-2 text-center text-sm text-muted-foreground">Loading companies...</div>
                        ) : companiesError ? (
                          <div className="py-2 text-center text-sm text-destructive">Failed to load companies</div>
                        ) : (
                          companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Driver ID</Label>
                    <Input name="driverId" value={formData.driverId} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Departure Time</Label>
                    <Input name="departureTime" type="datetime-local" value={formData.departureTime ? new Date(formData.departureTime).toISOString().substring(0, 16) : ''} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Arrival Time</Label>
                    <Input name="arrivalTime" type="datetime-local" value={formData.arrivalTime ? new Date(formData.arrivalTime).toISOString().substring(0, 16) : ''} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fare</Label>
                    <Input name="fare" type="number" value={formData.fare} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Amenities (comma separated)</Label>
                    <Input name="amenities" value={Array.isArray(formData.amenities) ? formData.amenities.join(', ') : ''} onChange={e => setFormData(prev => ({ ...prev, amenities: e.target.value.split(',').map(item => item.trim()) }))} />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                  <Button onClick={handleNext} disabled={isLoading}>Continue <span className="ml-2">→</span></Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Seat Layout</h3>
                {isLoadingBusDetails ? (
                  <Loader />
                ) : busDetails?.seatLayout ? (
                  <BusSeatLayout 
                    layout={busDetails.seatLayout} 
                    selectedSeats={selectedSeats} 
                    onSelect={handleSeatSelect} 
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">No seat layout available for this bus</div>
                )}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} disabled={isLoading}>Back</Button>
                  <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? <Loader /> : 'Update Schedule'}</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
