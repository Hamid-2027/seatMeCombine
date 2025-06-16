import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  Bus,
  Route,
  Trash2,
  X
} from "lucide-react";
import { AddScheduleWizard } from "./add-schedule-wizard";
import { apiClient } from "@/lib/queryClient";

export default function ScheduleManagement() {
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['busSchedules'],
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['busRoutes'],
  });

  const { data: buses = [] } = useQuery({
    queryKey: ['buses'],
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['bus-companies'],
  });

  const getRouteInfo = (routeId: string) => {
    return (routes as any[])?.find((route: any) => route.id === routeId);
  };

  const getBusInfo = (busId: string) => {
    return (buses as any[])?.find((bus: any) => bus.id === busId);
  };

  const getCompanyInfo = (companyId: string) => {
    return (companies as any[])?.find((company: any) => company.id === companyId);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/busSchedules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['busSchedules'] });
      setScheduleToDelete(null);
    },
    onError: (error: any) => {
      console.error('Failed to delete schedule', error);
      setScheduleToDelete(null);
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            {/* <h3 className="text-lg font-semibold">Schedule Management</h3>
            <p className="text-sm text-gray-600">Manage bus schedules and routes</p> */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bus Schedules</h1>
        <Button onClick={() => setShowAddWizard(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Schedule
        </Button>
      </div>

      {schedules && (schedules as any[]).length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Schedules Yet</h3>
          <p className="text-gray-600 mb-4">Create your first bus schedule to get started</p>
          <Button onClick={() => setShowAddWizard(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First Schedule
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(schedules as any[])?.map((schedule: any) => {
            const route = getRouteInfo(schedule.routeId);
            const bus = getBusInfo(schedule.busId);
            const company = getCompanyInfo(schedule.companyId);

            return (
              <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {schedule.busType}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {schedule.availableSeats}/{schedule.totalSeats} seats
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {route ? `${route.from} → ${route.to}` : 'Route N/A'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{schedule.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>PKR {schedule.fare}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Departure</div>
                        <div className="text-gray-600">{schedule.departureTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">Arrival</div>
                        <div className="text-gray-600">{schedule.arrivalTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Bus className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {bus?.name || 'Bus N/A'}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {company?.name || 'Company N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setLocation(`/schedule/${schedule.id}`)}>
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => setScheduleToDelete(schedule.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showAddWizard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <AddScheduleWizard
              onClose={() => setShowAddWizard(false)}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ['busSchedules'] });
                setShowAddWizard(false);
              }}
            />
          </div>
        </div>
      )}

      <AlertDialog open={!!scheduleToDelete} onOpenChange={(open) => !open && setScheduleToDelete(null)}>
        <AlertDialogContent className="text-center">
          <AlertDialogCancel asChild>
            <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </AlertDialogCancel>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center">Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription className="px-12 pt:8 text-center">
              This may affect already booked seats and this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2 pt-4">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => scheduleToDelete && deleteMutation.mutate(scheduleToDelete)}
              disabled={deleteMutation.isPending}
              className={`${buttonVariants({ variant: "destructive" })} flex-1`}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}