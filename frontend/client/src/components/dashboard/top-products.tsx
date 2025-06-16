import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Laptop, Headphones, Smartphone, Tablet } from "lucide-react";
import type { Product } from "@shared/schema";

interface TopProductsProps {
  products: Product[];
  isLoading: boolean;
}

export default function TopProducts({ products, isLoading }: TopProductsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'laptop':
        return Laptop;
      case 'headphones':
        return Headphones;
      case 'mobile-alt':
        return Smartphone;
      case 'tablet-alt':
        return Tablet;
      default:
        return Laptop;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product) => {
            const Icon = getIcon(product.icon);
            const isPositive = parseFloat(product.changePercent) > 0;
            
            return (
              <div key={product.id} className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${product.gradient} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                  <p className="text-sm text-slate-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    ${parseFloat(product.price).toLocaleString()}
                  </p>
                  <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{product.changePercent}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
