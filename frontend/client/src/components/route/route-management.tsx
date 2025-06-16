import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MapPin, 
  Clock, 
  Route as RouteIcon,
  Star,
  Truck
} from "lucide-react";
import AddRouteModal from "./add-route-modal";

export default function RouteManagement() {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ['busRoutes'],
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['bus-companies'],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Route Management</h3>
            <p className="text-sm text-gray-600">Manage bus routes and destinations</p>
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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        {/* <div>
          <h3 className="text-lg font-semibold">Route Management</h3>
          <p className="text-sm text-gray-600">Manage bus routes and destinations</p>
        </div> */}
        <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </Button>
      </div>

      {(routes as any[]).length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <RouteIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Routes Yet</h3>
          <p className="text-gray-600 mb-4">Create your first bus route to get started</p>
          <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add First Route
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(routes as any[]).map((route: any) => (
            <Card key={route.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RouteIcon className="h-5 w-5 text-green-600" />
                    {route.isPopular && (
                      <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {route.distance}
                  </Badge>
                </div>
                <CardTitle className="text-lg">
                  {route.from} → {route.to}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{route.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span>{Array.isArray(route.availableBusTypes) ? route.availableBusTypes.length : 0} bus types</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600 mb-2">Available Bus Types:</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(route.availableBusTypes) && route.availableBusTypes.map((type: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddRouteModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}