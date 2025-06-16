import { ChartLine, Home, BarChart3, Users, ShoppingCart, DollarSign, Settings, X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '#', icon: Home, current: true },
  { name: 'Analytics', href: '#', icon: BarChart3, current: false },
  { name: 'Users', href: '#', icon: Users, current: false },
  { name: 'Orders', href: '#', icon: ShoppingCart, current: false },
  { name: 'Revenue', href: '#', icon: DollarSign, current: false },
  { name: 'Settings', href: '#', icon: Settings, current: false },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={onClose}></div>
      <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ChartLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Analytics</span>
          </div>
          <button 
            className="text-slate-400 hover:text-slate-500"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
