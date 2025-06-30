import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import Overview from "@/components/dashboard/overview";
import BusManagement from "@/components/bus/bus-management";
import RouteManagement from "@/components/route/route-management";
import ScheduleManagement from "@/components/schedule/schedule-management";
import SeatLayoutManager from "@/components/seat/seat-layout-manager";
import Analytics from "@/components/analytics/analytics";
import { auth } from "@/lib/firebase"; // Import auth
import { signOut } from "firebase/auth"; // Import signOut
import { useLocation } from "wouter"; // Import for redirection

type DashboardSection = 'overview' | 'bus-management' | 'route-management' | 'schedule-management' | 'seat-layouts' | 'analytics';

interface DashboardProps {
  section: DashboardSection;
}

export default function Dashboard({ section }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const activeSection = section;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLocation('/'); // Redirect to landing page on sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const sectionConfig = {
    overview: { title: 'Dashboard Overview', subtitle: 'Monitor your bus operations and booking performance' },
    'bus-management': { title: 'Bus Management', subtitle: 'Manage your bus fleet and configurations' },
    'route-management': { title: 'Route Management', subtitle: 'Manage bus routes and destinations' },
    'schedule-management': { title: 'Schedule Management', subtitle: 'Manage bus schedules and timing' },
    'seat-layouts': { title: 'Seat Layout Manager', subtitle: 'Manage and configure bus seat layouts' },
    analytics: { title: 'Analytics', subtitle: 'Detailed insights and performance metrics' }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview': return <Overview />;
      case 'bus-management': return <BusManagement />;
      case 'route-management': return <RouteManagement />;
      case 'schedule-management': return <ScheduleManagement />;
      case 'seat-layouts': return <SeatLayoutManager />;
      case 'analytics': return <Analytics />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <Sidebar activeSection={activeSection} onSectionChange={() => setSidebarOpen(false)} isMobile={true} />
          </div>
        </div>
      )}
      <div className="hidden lg:flex">
        <Sidebar activeSection={activeSection} onSectionChange={() => {}} isMobile={false} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={sectionConfig[activeSection].title}
          subtitle={sectionConfig[activeSection].subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onSignOut={handleSignOut} // Pass the function here
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
