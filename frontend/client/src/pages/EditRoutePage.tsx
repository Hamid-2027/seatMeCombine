import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getBusRouteById, updateBusRoute } from '@/api/busRoutes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/ui/Loader';
import { ArrowLeft } from 'lucide-react';
import type { BusRoute } from '@shared/schema';

const routeSchema = z.object({
  from: z.string().min(1, 'Origin is required'),
  to: z.string().min(1, 'Destination is required'),
  distance: z.string().min(1, 'Distance is required'),
  estimatedDuration: z.string().min(1, 'Estimated duration is required'),
  availableBusTypes: z.array(z.string()).min(1, 'At least one bus type is required'),
});

type RouteFormData = z.infer<typeof routeSchema>;

export default function EditRoutePage() {
  const params = useParams();
  const routeId = params.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: route, isLoading: isLoadingRoute, isError } = useQuery<BusRoute, Error>({
    queryKey: ['busRoute', routeId],
    queryFn: () => getBusRouteById(routeId!),
    enabled: !!routeId,
  });

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      from: '',
      to: '',
      distance: '',
      estimatedDuration: '',
      availableBusTypes: [],
    },
  });

  useEffect(() => {
    if (route) {
      setValue('from', route.from);
      setValue('to', route.to);
      setValue('distance', route.distance);
      setValue('estimatedDuration', route.estimatedDuration);
      setValue('availableBusTypes', route.availableBusTypes);
    }
  }, [route, setValue]);

  const { mutate: updateRoute, isPending: isUpdating } = useMutation({
    mutationFn: (data: RouteFormData) => updateBusRoute(routeId!, data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Route updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['busRoutes'] });
      queryClient.invalidateQueries({ queryKey: ['busRoute', routeId] });
      setLocation('/route-management');
    },
    onError: (err: any) => {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to update route.' });
    },
  });

  const onSubmit = (data: RouteFormData) => {
    updateRoute(data);
  };

  if (isLoadingRoute) return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  if (isError) return <div className="p-4 sm:p-6 text-red-500">Error loading route details.</div>;

  return (
    <div className="p-4 sm:p-6">
      <header className="flex items-center gap-4 pb-4 border-b mb-6">
        <Button variant="outline" size="icon" onClick={() => setLocation('/route-management')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Route</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Route Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Controller
                  name="from"
                  control={control}
                  render={({ field }) => <Input id="from" {...field} />}
                />
                {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>}
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Controller
                  name="to"
                  control={control}
                  render={({ field }) => <Input id="to" {...field} />}
                />
                {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distance">Distance (e.g., 300KM)</Label>
                <Controller
                  name="distance"
                  control={control}
                  render={({ field }) => <Input id="distance" {...field} />}
                />
                {errors.distance && <p className="text-red-500 text-sm mt-1">{errors.distance.message}</p>}
              </div>
              <div>
                <Label htmlFor="estimatedDuration">Duration (e.g., 5H 30M)</Label>
                <Controller
                  name="estimatedDuration"
                  control={control}
                  render={({ field }) => <Input id="estimatedDuration" {...field} />}
                />
                {errors.estimatedDuration && <p className="text-red-500 text-sm mt-1">{errors.estimatedDuration.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="availableBusTypes">Available Bus Types (comma-separated)</Label>
              <Controller
                name="availableBusTypes"
                control={control}
                render={({ field }) => (
                  <Input
                    id="availableBusTypes"
                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                    onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim().replace(/,$/, '')))}
                  />
                )}
              />
              {errors.availableBusTypes && <p className="text-red-500 text-sm mt-1">{errors.availableBusTypes.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setLocation('/route-management')} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? <Loader size="sm" /> : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
