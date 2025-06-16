import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { 
  BarChart3, 
  Bus, 
  Route, 
  Clock, 
  LayoutGrid, 
  PieChart,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isMobile = false }: SidebarProps) {
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: PieChart,
    },
    {
      id: 'bus-management',
      label: 'Bus Management',
      icon: Bus,
    },
    {
      id: 'route-management',
      label: 'Route Management',
      icon: Route,
    },
    {
      id: 'schedule-management',
      label: 'Schedule Management',
      icon: Clock,
    },
    {
      id: 'seat-layouts',
      label: 'Seat Layouts',
      icon: LayoutGrid,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">SeatMe Admin</h1>
            <p className="text-xs text-gray-500">Bus Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Management
          </div>
          
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.id === 'overview' ? '/' : `/${item.id}`} onClick={() => onSectionChange(item.id)}>
              <a className={cn(
                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left",
                activeSection === item.id
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}>
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
