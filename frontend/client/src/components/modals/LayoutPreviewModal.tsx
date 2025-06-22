import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BusSeatLayout from '@/components/schedule/BusSeatLayout';
import { Badge } from '@/components/ui/badge';
import type { SeatLayout } from '@shared/schema';
import { X } from 'lucide-react';

interface LayoutPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  layout: SeatLayout | null;
}

export default function LayoutPreviewModal({ isOpen, onClose, layout }: LayoutPreviewModalProps) {
  if (!layout) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Layout: {layout.name}</DialogTitle>
            <Badge variant="secondary">ID: {layout.id}</Badge>
          </div>
          <DialogDescription>A preview of the bus seat arrangement.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center p-2 border bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <BusSeatLayout layout={layout} readOnly />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">Rows: <span className="font-semibold">{layout.rows}</span></div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">Columns: <span className="font-semibold">{layout.columns}</span></div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
