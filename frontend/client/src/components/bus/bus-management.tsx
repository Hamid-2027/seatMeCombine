import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Bus as BusIcon } from "lucide-react";
import { Link } from "wouter";
import AddBusModal from "./add-bus-modal";
import { getBuses } from "@/api/buses";
import type { Bus } from "@shared/schema";
import { getBusCompanies } from "@/api/busCompanies";
import type { BusCompany } from "@shared/schema";

export default function BusManagement() {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: buses, isLoading, isError } = useQuery<Bus[], Error>({
    queryKey: ["buses"],
    queryFn: getBuses,
  });

  const { data: companies = [] } = useQuery<BusCompany[], Error>({
    queryKey: ["bus-companies"],
    queryFn: getBusCompanies,
  });

  const getCompanyName = (companyId: string) => {
    const company = (companies as BusCompany[])?.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getBusTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'business':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container-responsive p-4 sm:p-6">
        <div className="flex-responsive justify-between mb-6">
          <div>
            <h3 className="heading-responsive font-semibold text-gray-900 dark:text-white">Bus Management</h3>
            <p className="text-responsive text-gray-600 dark:text-gray-400">Manage your bus fleet and configurations</p>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive p-4 sm:p-6">
      <div className="flex-responsive justify-between mb-6">
        {/* <div>
          <h3 className="heading-responsive font-semibold text-gray-900 dark:text-white">Bus Management</h3>
          <p className="text-responsive text-gray-600 dark:text-gray-400">Manage your bus fleet and configurations</p>
        </div> */}
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add New Bus
        </Button>
      </div>

      {buses && (buses as Bus[]).length === 0 ? (
        <Card className="p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
            <BusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Buses Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first bus to get started with fleet management</p>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Bus
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {(buses as Bus[]).map((bus: Bus) => (
            <Card key={bus.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Bus Header Info */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg shrink-0">
                      <BusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{bus.name}</h3>
                        <Badge className={getBusTypeColor(bus.busType)}>
                          {bus.busType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{bus.registrationNumber} • {getCompanyName(bus.companyId)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Link to={`/bus/${bus.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddBusModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}