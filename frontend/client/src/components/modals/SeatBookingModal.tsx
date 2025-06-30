import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface SeatBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (gender: 'MALE' | 'FEMALE') => void;
  seatNumber: string | null;
}

const genderStyles = {
  male: "bg-[#003660] text-white border-[#003660] hover:bg-[#003660]/90",
  female: "bg-[#f32bbe] text-white border-[#f32bbe] hover:bg-[#f32bbe]/90",
};

export default function SeatBookingModal({ isOpen, onClose, onConfirm, seatNumber }: SeatBookingModalProps) {
  const [step, setStep] = useState<'gender' | 'confirm'>('gender');
  const [selectedGender, setSelectedGender] = useState<'MALE' | 'FEMALE' | null>(null);

  const handleGenderSelect = (gender: 'MALE' | 'FEMALE') => {
    setSelectedGender(gender);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (selectedGender) {
      onConfirm(selectedGender);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setStep('gender');
    setSelectedGender(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 'gender' && (
          <>
            <DialogHeader>
              <DialogTitle>Book Seat {seatNumber}</DialogTitle>
              <DialogDescription>Select the passenger's gender for this seat.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button className={genderStyles.male} onClick={() => handleGenderSelect('MALE')}>Male</Button>
              <Button className={genderStyles.female} onClick={() => handleGenderSelect('FEMALE')}>Female</Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
            </DialogFooter>
          </>
        )}
        {step === 'confirm' && selectedGender && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to book seat {seatNumber} for a {selectedGender.toLowerCase()} passenger?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('gender')}>Back</Button>
              <Button className={genderStyles[selectedGender.toLowerCase() as 'male' | 'female']} onClick={handleConfirm}>Confirm Booking</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
