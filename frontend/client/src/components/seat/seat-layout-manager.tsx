import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BusSeatLayout from '@/components/schedule/BusSeatLayout';
import { Plus, Eye } from "lucide-react";
import type { SeatLayout } from "@shared/schema";
import LayoutPreviewModal from '@/components/modals/LayoutPreviewModal';
import PaymentMethods from '@/components/payment/PaymentMethods';

export default function SeatLayoutManager() {
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<SeatLayout | null>(null);

  const { data: templates, isLoading } = useQuery<SeatLayout[]>({
    queryKey: ['seatLayouts'],
  });

  const handlePreviewClick = (layout: SeatLayout) => {
    setSelectedLayout(layout);
    setPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container-responsive py-4 sm:py-6">
        <div className="flex-responsive justify-between mb-6">
          <div>
            <h2 className="heading-responsive font-bold text-gray-900 dark:text-white">Seat Layout Manager</h2>
            <p className="text-responsive text-gray-600 dark:text-gray-400">Manage and configure bus seat layouts</p>
          </div>
          <Button disabled className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Layout
          </Button>
        </div>
        <div className="grid-responsive">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 sm:p-6">
                <div className="h-32 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    );
  }

  return (
    <>
      <div className="container-responsive p-4 sm:p-6">
        <div className="flex-responsive justify-between mb-6">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Layout
          </Button>
          {/* <div>
        <PaymentMethods/>
        </div> */}
        </div>

        {/* Predefined Templates */}
        {templates && Array.isArray(templates) && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {templates.map((layout: SeatLayout) => (
              <Card key={layout.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {layout.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {layout.rows + "Rows"}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {layout.columns + "Columns"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Layout Info */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Rows: <span className="font-medium text-gray-900 dark:text-white">{layout.rows}</span></span>
                      <span>Columns: <span className="font-medium text-gray-900 dark:text-white">{layout.columns}</span></span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Layout Preview:</p>
                  </div>
                  
                  {/* Seat Preview */}
                  <div className="flex-1 mb-4">
                    <BusSeatLayout layout={layout} readOnly />
                  </div>
                  
                  {/* Action Buttons - Always at bottom */}
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      className="w-full h-9 flex items-center justify-center"
                      onClick={() => handlePreviewClick(layout)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="h-12 w-12 text-gray-400 mx-auto mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No seat layouts found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first seat layout template.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Layout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <LayoutPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setPreviewOpen(false)} 
        layout={selectedLayout} 
      />
    </>
  );
}
