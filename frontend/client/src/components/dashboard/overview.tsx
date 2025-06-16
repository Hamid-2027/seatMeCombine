import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Bus, Route, Clock, TicketCheck, TrendingUp, Users, Star, Timer } from "lucide-react";

export default function Overview() {
  const { data: buses = [] } = useQuery({
    queryKey: ['buses'],
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['busRoutes'],
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['busSchedules'],
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
  });

  const isLoading = false; // Data is loading from individual endpoints

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Buses",
      value: Array.isArray(buses) ? buses.length : 0,
      change: "+7.5% Active fleet",
      icon: Bus,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Routes",
      value: Array.isArray(routes) ? routes.length : 0,
      change: "+5% Operational routes",
      icon: Route,
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Daily Schedules",
      value: Array.isArray(schedules) ? schedules.length : 0,
      change: "+12% Today's trips",
      icon: Clock,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Total Bookings",
      value: Array.isArray(bookings) ? bookings.length : 0,
      change: "+8% This month",
      icon: TicketCheck,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{metric.value.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">{metric.change}</p>
                </div>
                <div className={`w-12 h-12 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Overview & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Overview */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <p className="text-sm text-gray-600 mb-6">Monthly revenue performance</p>
            
            <div className="space-y-4">
              {[
                { month: "January", amount: 2500000, percentage: 85 },
                { month: "February", amount: 2800000, percentage: 95 },
                { month: "March", amount: 3100000, percentage: 100 }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.month}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      PKR {(item.amount / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
            <p className="text-sm text-gray-600 mb-6">Latest booking activities</p>
            
            <div className="space-y-4">
              {Array.isArray(bookings) ? bookings.slice(0, 5).map((booking: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.id}</p>
                    <p className="text-xs text-gray-600">{booking.routeId || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{booking.passengers?.[0]?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">PKR {booking.totalAmount?.toLocaleString() || '0'}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      booking.bookingStatus === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.bookingStatus || 'PENDING'}
                    </span>
                  </div>
                </div>
              )) : [
                <p key="no-bookings" className="text-sm text-gray-500">No recent bookings</p>
              ]}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
