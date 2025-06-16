import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBuses } from '@/api/buses';
import { getBusRoutes, BusRoute } from '@/api/busRoutes';
import { getBusCompanies } from '@/api/busCompanies';
import { createBusSchedule } from '@/api/busSchedules';
import type { Bus, BusCompany, BusSchedule } from '@shared/schema';

const CreateBusSchedule = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [companies, setCompanies] = useState<BusCompany[]>([]);
  const [formData, setFormData] = useState<Partial<Omit<BusSchedule, 'id' | 'seatLayout'>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busesData, routesData, companiesData] = await Promise.all([
          getBuses(),
          getBusRoutes(),
          getBusCompanies(),
        ]);
        setBuses(busesData);
        setRoutes(routesData);
        setCompanies(companiesData);
      } catch (err) {
        setError('Failed to fetch initial data. Please try again later.');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.busId || !formData.routeId || !formData.companyId || !formData.departureTime || !formData.arrivalTime || !formData.fare) {
        setError('Please fill out all required fields.');
        setIsLoading(false);
        return;
    }

    try {
        // The backend will generate the seatLayout, so we don't send it.
        const scheduleDataForApi = {
            ...formData,
            fare: Number(formData.fare),
            currency: formData.currency || 'PKR', // Default currency
            amenities: formData.amenities || [],
        } as Omit<BusSchedule, 'id'>;

        await createBusSchedule(scheduleDataForApi);
        alert('Bus schedule created successfully!');
        // Optionally, reset form or redirect
        setFormData({});
    } catch (err) {
        setError('Failed to create schedule. Please check the details and try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Bus Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="busId">Bus</Label>
              <Select name="busId" onValueChange={(value) => handleSelectChange('busId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bus" />
                </SelectTrigger>
                <SelectContent>
                  {buses.map(bus => (
                    <SelectItem key={bus.id} value={bus.id}>{bus.name} ({bus.registrationNumber})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="routeId">Route</Label>
              <Select name="routeId" onValueChange={(value) => handleSelectChange('routeId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(route => (
                    <SelectItem key={route.id} value={route.id}>{route.from} to {route.to}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="companyId">Company</Label>
              <Select name="companyId" onValueChange={(value) => handleSelectChange('companyId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="departureTime">Departure Time</Label>
              <Input id="departureTime" name="departureTime" type="datetime-local" onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <Input id="arrivalTime" name="arrivalTime" type="datetime-local" onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="fare">Fare</Label>
              <Input id="fare" name="fare" type="number" onChange={handleInputChange} placeholder="e.g., 1500" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Schedule'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBusSchedule;
