import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import Overview from "@/components/dashboard/overview";
import BusManagement from "@/components/bus/bus-management";
import RouteManagement from "@/components/route/route-management";
import ScheduleManagement from "@/components/schedule/schedule-management";
import SeatLayoutManager from "@/components/seat/seat-layout-manager";
import Analytics from "@/components/analytics/analytics";

type DashboardSection = 'overview' | 'bus-management' | 'route-management' | 'schedule-management' | 'seat-layouts' | 'analytics';

interface DashboardProps {
  section: DashboardSection;
}

export default function Dashboard({ section }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeSection = section;


  const sectionConfig = {
    overview: {
      title: 'Dashboard Overview',
      subtitle: 'Monitor your bus operations and booking performance'
    },
    'bus-management': {
      title: 'Bus Management',
      subtitle: 'Manage your bus fleet and configurations'
    },
    'route-management': {
      title: 'Route Management',
      subtitle: 'Manage bus routes and destinations'
    },
    'schedule-management': {
      title: 'Schedule Management',
      subtitle: 'Manage bus schedules and timing'
    },
    'seat-layouts': {
      title: 'Seat Layout Manager',
      subtitle: 'Manage and configure bus seat layouts'
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'Detailed insights and performance metrics'
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />;
      case 'bus-management':
        return <BusManagement />;
      case 'route-management':
        return <RouteManagement />;
      case 'schedule-management':
        return <ScheduleManagement />;
      case 'seat-layouts':
        return <SeatLayoutManager />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <Sidebar 
              activeSection={activeSection}
              onSectionChange={() => setSidebarOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={() => {}}
          isMobile={false}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={sectionConfig[activeSection].title}
          subtitle={sectionConfig[activeSection].subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
