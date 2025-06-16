import { Bell, Settings, UserCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuClick?: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center min-w-0 flex-1">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden mr-3"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </Button>
        
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>
        
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Settings className="h-5 w-5 text-gray-400" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <UserCircle className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
    </header>
  );
}
