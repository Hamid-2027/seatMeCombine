import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { getBusById } from "@/api/buses";
import type { Bus } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BusSeatLayout from '@/components/schedule/BusSeatLayout';

interface BusDetailsPageProps {
  params: {
    id: string;
  };
}

export default function BusDetailsPage({ params }: BusDetailsPageProps) {
  const { id } = params;
  console.log('Bus ID:', id);

  const { data: bus, isLoading, isError, error } = useQuery<Bus, Error>({
    queryKey: ["bus", id],
    queryFn: () => getBusById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 text-red-500">
        <h1>Error loading bus details</h1>
        <p>{error?.message}</p>
      </div>
    );
  }

  if (!bus) {
    return <div>Bus not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Link href="/bus-management">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Bus List</span>
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{bus.name}</h1>
          <Badge 
            className={`text-sm px-3 py-1 ${bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {bus.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Bus Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bus Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Registration Number</p>
                  <p className="text-lg text-gray-800">{bus.registrationNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Bus Type</p>
                  <p className="text-lg text-gray-800">{bus.busType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Manufacturing Year</p>
                  <p className="text-lg text-gray-800">{bus.manufacturingYear}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Seats</p>
                  <p className="text-lg text-gray-800">{bus.totalSeats}</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {bus.features?.map(feature => <Badge key={feature} variant="secondary">{feature}</Badge>)}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500">Certifications</p>
                  <p className="text-gray-800">{bus.certifications || 'N/A'}</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500">Additional Features</p>
                  <p className="text-gray-800">{bus.additionalFeatures || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Seat Layout */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{bus.seatLayout.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <BusSeatLayout layout={bus.seatLayout} readOnly />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
