import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBuses, getBusById } from "@/api/buses";
import { getBusRoutes } from "@/api/busRoutes";
import { getBusCompanies } from "@/api/busCompanies";
import { updateBusSchedule } from "@/api/busSchedules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BusSchedule, SeatStatus } from "@shared/schema";
import BusSeatLayout from "@/components/schedule/BusSeatLayout";
import Loader from "@/components/ui/Loader";
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface EditSchedulePageProps {
  params: { id: string };
}

interface ScheduleFormData {
  busId: string;
  routeId: string;
  companyId: string;
  driverId: string;
  departureTime: string;
  arrivalTime: string;
  fare: string;
  amenities: string;
}

export default function EditSchedulePage({ params }: EditSchedulePageProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [originallyBookedSeats, setOriginallyBookedSeats] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<ScheduleFormData>>({});

  // Main query for the schedule
  const { 
    data: schedule,
    isLoading: isLoadingSchedule,
    isError: isErrorSchedule,
    error: scheduleError 
  } = useQuery<BusSchedule>({ 
    queryKey: ['schedule', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/schedules/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch schedule');
      return response.json();
    },
  });

  // Queries for dropdowns
  const { data: buses = [], isLoading: isLoadingBuses, isError: isErrorBuses } = useQuery<any[]>({ queryKey: ['buses'], queryFn: getBuses });
  const { data: routes = [], isLoading: isLoadingRoutes, isError: isErrorRoutes } = useQuery<any[]>({ queryKey: ['busRoutes'], queryFn: getBusRoutes });
  const { data: companies = [], isLoading: isLoadingCompanies, isError: isErrorCompanies } = useQuery<any[]>({ queryKey: ['bus-companies'], queryFn: getBusCompanies });
  
  // Query for bus details for seat layout
  const { data: busDetails, isLoading: isLoadingBusDetails } = useQuery<any>({
    queryKey: ['bus', formData.busId],
    queryFn: () => formData.busId ? getBusById(formData.busId) : Promise.resolve(null),
    enabled: !!formData.busId,
  });

  // Effect to populate form when schedule data loads
  useEffect(() => {
    if (schedule) {
      setFormData({
        busId: schedule.busId,
        routeId: schedule.routeId,
        departureTime: schedule.departureTime ? new Date(schedule.departureTime).toISOString().substring(0, 16) : '',
        arrivalTime: schedule.arrivalTime ? new Date(schedule.arrivalTime).toISOString().substring(0, 16) : '',
        fare: schedule.fare?.toString() ?? '',
        companyId: schedule.companyId ?? '',
        driverId: schedule.driverId ?? '',
        amenities: Array.isArray(schedule.amenities) ? schedule.amenities.join(', ') : '',
      });
      if (schedule.seatLayout?.seats) {
        const bookedSeats = Object.values(schedule.seatLayout.seats)
          .filter(seat => seat.status === SeatStatus.BOOKED)
          .map(seat => seat.seatNumber);
        setSelectedSeats(bookedSeats);
        setOriginallyBookedSeats(bookedSeats); // Store initial state
      }
    }
  }, [schedule]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeatSelect = (seatNumber: string) => {
    if (originallyBookedSeats.includes(seatNumber)) {
      toast({ variant: "destructive", title: "Seat Locked", description: "This seat is already booked and cannot be changed." });
      return;
    }
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule) return;

    // --- Validation ---
    if (!formData.busId || !formData.routeId || !formData.companyId || !formData.departureTime || !formData.arrivalTime || !formData.fare) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please fill out all required fields." });
      return;
    }
    if (parseFloat(formData.fare) <= 0) {
      toast({ variant: "destructive", title: "Validation Error", description: "Fare must be a positive number." });
      return;
    }
    if (new Date(formData.arrivalTime) <= new Date(formData.departureTime)) {
      toast({ variant: "destructive", title: "Validation Error", description: "Arrival time must be after departure time." });
      return;
    }
    // --- End Validation ---

    setIsLoading(true);
    try {
      const updatedData = {
        ...formData,
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString(),
        amenities: typeof formData.amenities === 'string' ? formData.amenities.split(',').map((item: string) => item.trim()) : [],
        fare: parseFloat(formData.fare),
        seatLayout: {
          ...busDetails.seatLayout,
          seats: busDetails.seatLayout.seats.map((seat: any) => ({
            ...seat,
            status: selectedSeats.includes(seat.seatNumber) ? SeatStatus.BOOKED : SeatStatus.AVAILABLE,
          })),
        },
      };
      await updateBusSchedule(schedule.id, updatedData as any);
      await queryClient.invalidateQueries({ queryKey: ['schedule', params.id] });
      await queryClient.invalidateQueries({ queryKey: ['busSchedules'] });
      toast({ title: "Success", description: "Schedule updated successfully." });
      setLocation(`/schedule/${schedule.id}`);
    } catch (err) {
      console.error('Error updating schedule:', err);
      toast({ variant: "destructive", title: "Error", description: "Failed to update schedule. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Render logic
  if (isLoadingSchedule) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen"><Loader /></div>
    );
  }

  if (isErrorSchedule) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Error loading schedule: {scheduleError?.message}
      </div>
    );
  }

  if (!schedule) {
    return <div className="container mx-auto p-4 text-center">Schedule not found.</div>;
  }

  return (
    <div className="flex flex-col h-full p-4">
      <header className="flex items-center gap-4 pb-4 border-b">
        <Button variant="outline" size="icon" onClick={() => setLocation(`/schedule/${params.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Schedule</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto pt-4">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Details</CardTitle>
              <CardDescription>Update the schedule information below.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="busId">Bus</Label>
                <Select value={formData.busId || ''} onValueChange={value => handleSelectChange('busId', value)} disabled={isLoadingBuses || isErrorBuses}>
                  <SelectTrigger id="busId">
                    <SelectValue placeholder={isLoadingBuses ? "Loading..." : (isErrorBuses ? "Error loading buses" : "Select a bus")} />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map(bus => <SelectItem key={bus.id} value={bus.id}>{bus.name} - {bus.registrationNumber}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="routeId">Route</Label>
                <Select value={formData.routeId || ''} onValueChange={value => handleSelectChange('routeId', value)} disabled={isLoadingRoutes || isErrorRoutes}>
                  <SelectTrigger id="routeId">
                    <SelectValue placeholder={isLoadingRoutes ? "Loading..." : (isErrorRoutes ? "Error loading routes" : "Select a route")} />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map(route => <SelectItem key={route.id} value={route.id}>{route.from} to {route.to}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyId">Company</Label>
                <Select value={formData.companyId || ''} onValueChange={value => handleSelectChange('companyId', value)} disabled={isLoadingCompanies || isErrorCompanies}>
                  <SelectTrigger id="companyId">
                    <SelectValue placeholder={isLoadingCompanies ? "Loading..." : (isErrorCompanies ? "Error loading companies" : "Select a company")} />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverId">Driver ID</Label>
                <Input id="driverId" name="driverId" value={formData.driverId || ''} onChange={handleChange} placeholder="Enter driver ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input id="departureTime" name="departureTime" type="datetime-local" value={formData.departureTime || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input id="arrivalTime" name="arrivalTime" type="datetime-local" value={formData.arrivalTime || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fare">Fare</Label>
                <Input id="fare" name="fare" type="number" value={formData.fare || ''} onChange={handleChange} placeholder="Enter fare" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input id="amenities" name="amenities" value={formData.amenities || ''} onChange={handleChange} placeholder="e.g., WiFi, AC, TV" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setLocation(`/schedule/${params.id}`)} disabled={isLoading}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader size="sm" /> : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Seat Layout */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Seat Layout</CardTitle>
              <CardDescription>Overview of the bus's seat arrangement.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-4">
              {isLoadingBusDetails ? (
                <div className="flex justify-center items-center h-64"><Loader /></div>
              ) : busDetails?.seatLayout ? (
                <BusSeatLayout 
                  layout={busDetails.seatLayout} 
                  selectedSeats={selectedSeats} 
                  onSelect={handleSeatSelect} 
                />
              ) : (
                <div className="flex justify-center items-center h-64 text-muted-foreground">
                  <p>Select a bus to see the seat layout.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
