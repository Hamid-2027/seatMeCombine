import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, Star, TrendingUp } from "lucide-react";

export default function Analytics() {
  const performanceMetrics = [
    {
      title: "Occupancy Rate",
      value: "87.5%",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-900"
    },
    {
      title: "On-Time Performance",
      value: "92.1%",
      icon: Clock,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-900"
    },
    {
      title: "Customer Satisfaction",
      value: "4.6/5",
      icon: Star,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-900"
    }
  ];

  const topRoutes = [
    {
      route: "Lahore → Islamabad",
      bookings: "1,245 bookings this month",
      revenue: "PKR 3.2M",
      progress: 90,
      progressColor: "bg-blue-600"
    },
    {
      route: "Karachi → Lahore",
      bookings: "892 bookings this month",
      revenue: "PKR 4.8M",
      progress: 75,
      progressColor: "bg-green-600"
    },
    {
      route: "Islamabad → Peshawar",
      bookings: "567 bookings this month",
      revenue: "PKR 1.1M",
      progress: 60,
      progressColor: "bg-purple-600"
    }
  ];

  return (
    <div className="p-6">
      {/* <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600">Detailed insights and performance metrics</p>
      </div> */}

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className={`flex items-center justify-between p-4 ${metric.bgColor} rounded-lg`}>
                  <div>
                    <p className={`text-sm font-medium ${metric.textColor}`}>{metric.title}</p>
                    <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                    <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Routes */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Routes</h3>
            
            <div className="space-y-4">
              {topRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{route.route}</p>
                    <p className="text-xs text-gray-600">{route.bookings}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{route.revenue}</p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`${route.progressColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${route.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
            <p className="text-2xl font-bold text-gray-900">+24%</p>
            <p className="text-xs text-green-600">vs last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">New Passengers</p>
            <p className="text-2xl font-bold text-gray-900">1,284</p>
            <p className="text-xs text-blue-600">this month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Avg Trip Time</p>
            <p className="text-2xl font-bold text-gray-900">4.2h</p>
            <p className="text-xs text-purple-600">average</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Rating Trend</p>
            <p className="text-2xl font-bold text-gray-900">↑0.3</p>
            <p className="text-xs text-yellow-600">this quarter</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
