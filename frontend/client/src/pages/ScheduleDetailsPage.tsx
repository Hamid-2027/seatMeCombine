import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBusScheduleById, updateBusSchedule } from "@/api/busSchedules";
import { getBusById } from "@/api/buses";
import { getBusCompanyById } from "@/api/busCompanies";

import type { Bus, BusCompany, SeatLayout, Seat } from "@shared/schema";
import type { BusSchedule } from "@/api/busSchedules";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BusSeatLayout from '@/components/schedule/BusSeatLayout';
import EditScheduleWizard from '@/components/schedule/EditScheduleWizard';
import Loader from '@/components/ui/Loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ScheduleDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ScheduleDetailsPage({ params }: ScheduleDetailsPageProps) {
  const { id } = params;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: schedule, isLoading, isError, error } = useQuery<BusSchedule, Error>({
    queryKey: ["schedule", id],
    queryFn: () => getBusScheduleById(id!),
    enabled: !!id,
  });

  const { data: bus } = useQuery<Bus, Error>({
    queryKey: ["bus", schedule?.busId],
    queryFn: () => getBusById(schedule?.busId!),
    enabled: !!schedule?.busId,
  });

  const { data: company } = useQuery<BusCompany, Error>({
    queryKey: ["company", schedule?.companyId],
    queryFn: () => getBusCompanyById(schedule?.companyId!),
    enabled: !!schedule?.companyId,
  });

  





  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 text-red-500">
        <h1>Error loading schedule details</h1>
        <p>{error?.message}</p>
      </div>
    );
  }

  if (!schedule) {
    return <div>Schedule not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Link href="/schedule-management">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Schedule List</span>
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Schedule Details</h1>
          <div className="flex items-center space-x-2">
            <Badge 
              className={`text-sm px-3 py-1 ${schedule.status === 'ON_TIME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {schedule.status}
            </Badge>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Schedule Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bus & Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {bus ? (
                        <div className="space-y-2">
                          <p><strong>Bus Name:</strong> {bus.name}</p>
                          <p><strong>Registration:</strong> {bus.registrationNumber}</p>
                          <p><strong>Type:</strong> {bus.busType}</p>
                          <p><strong>Year:</strong> {bus.manufacturingYear}</p>
                          <p><strong>Capacity:</strong> {bus.totalSeats}</p>
                        </div>
                      ) : <p>Loading bus details...</p>}
                    </div>
                    <div>
                      {company ? (
                        <p><strong>Company:</strong> {company.name}</p>
                      ) : <p>Loading company details...</p>}
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Schedule Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Departure Time</p>
                      <p className="text-lg text-gray-800">{new Date(schedule.departureTime).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Arrival Time</p>
                      <p className="text-lg text-gray-800">{new Date(schedule.arrivalTime).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Fare</p>
                      <p className="text-lg text-gray-800">{schedule.currency} {schedule.fare}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Available Seats</p>
                      <p className="text-lg text-gray-800">{schedule.availableSeats}</p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <p className="text-sm font-medium text-gray-500">Amenities</p>
                      <div className="flex flex-wrap gap-2 mt-1">
  {(schedule.amenities || []).map(amenity => <Badge key={amenity} variant="outline">{amenity}</Badge>)}
</div>
                    </div>
                  </div>
                </div>
              </CardContent>

            </Card>
          </div>
          <div>
            {bus?.seatLayout ? (
              <BusSeatLayout layout={bus.seatLayout} />
            ) : (
              <div className="py-10 text-center text-gray-400">No seat layout available</div>
            )}
          </div>
        </div>
      </div>
      {isEditing && schedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <EditScheduleWizard
              schedule={schedule}
              onClose={() => setIsEditing(false)}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['schedule', id] });
                queryClient.invalidateQueries({ queryKey: ['busSchedules'] });
                setIsEditing(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
