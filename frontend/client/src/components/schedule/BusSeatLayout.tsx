import { useState } from "react";
import { FaFemale as FemaleIcon, FaMale as MaleIcon } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { SeatStatus } from "@shared/schema";

interface Seat {
  seatNumber: string;
  status?: SeatStatus;
  gender?: 'MALE' | 'FEMALE';
  passengerId?: string;
}

interface BusSeatLayoutProps {
  layout: {
    layout?: Record<string, (string | null)[]>;
    rows: number;
    columns: number;
    seats: Seat[];
  };
  selectedSeats?: string[];
  onSelect?: (seatNumber: string) => void;
  readOnly?: boolean;
}

// Strict HEX color mapping for seat statuses, with high-contrast text
const seatColors = {
  available: "bg-[#ffffff] border-blue-500 text-blue-700",      // White, blue border, blue text
  selected: "bg-[#f6b300] text-black border-[#f6b300]",        // Yellow-Orange, black text
  male: "bg-[#003660] text-white border-[#003660]",            // Navy Blue, white text
  female: "bg-[#f32bbe] text-white border-[#f32bbe]",          // Bright Pink, white text
  unavailable: "bg-gray-400 text-white border-gray-400",        // Fallback grey, white text
};

export default function BusSeatLayout({ layout, selectedSeats = [], onSelect, readOnly = false }: BusSeatLayoutProps) {
  // Build a seat map from layout.seats and validate layout structure
  const seatsMap = new Map<string, Seat>(layout.seats.map(s => [s.seatNumber, s]));
  const allRows = layout.layout ? Object.entries(layout.layout) : [];

  return (
    <div className="flex flex-col items-center">
      {/* Legend */}
      <div className="flex flex-row flex-nowrap items-center justify-center gap-x-3 text-xs mb-4">
        <div className="flex items-center gap-1.5"><div className={`w-4 h-4 border-2 ${seatColors.available} rounded-sm mr-1`} />Available</div>
        <div className="flex items-center gap-1.5"><div className={`w-4 h-4 border-2 ${seatColors.selected} rounded-sm mr-1`} />Selected</div>
        <div className="flex items-center gap-1.5"><div className={`w-4 h-4 border-2 ${seatColors.male} rounded-sm mr-1`} />Male</div>
        <div className="flex items-center gap-1.5"><div className={`w-4 h-4 border-2 ${seatColors.female} rounded-sm mr-1`} />Female</div>
      </div>

      {/* Steering wheel icon */}
      <div className="flex justify-center mb-2">
        <GiSteeringWheel className="text-2xl text-gray-500" />
      </div>

      {/* Seat Grid */}
      {layout && layout.layout ? (
        <div className="flex flex-col gap-2 p-4 bg-[#f5f5f5] rounded-lg">
          {allRows.map(([rowKey, row], rowIndex) => (
            <div key={rowKey} className="flex gap-2 justify-center">
              {row.map((seatNumber, seatIndex) => {
                if (!seatNumber || seatNumber.toUpperCase() === 'A') {
                  return <div key={`${rowKey}-${seatIndex}`} className="w-10 h-10" />; // Aisle
                }

                const seat = seatsMap.get(seatNumber);
                
                // Create a default available seat if not found in seatsMap
                const seatData = seat || {
                  seatNumber,
                  status: SeatStatus.AVAILABLE,
                  gender: undefined,
                  passengerId: undefined
                };

                const isBooked = seatData.status === SeatStatus.BOOKED;
                const isSelected = selectedSeats.includes(seatNumber);

                // Priority: Booked (gendered), Selected, Available
                let colorClass = seatColors.available;
                let textClass = "font-semibold";

                // Set colors based on seat status
                if (isBooked) {
                  if (seatData.gender === 'MALE') {
                    colorClass = seatColors.male;
                    textClass += " text-white";
                  } else if (seatData.gender === 'FEMALE') {
                    colorClass = seatColors.female;
                    textClass += " text-white";
                  } else {
                    colorClass = seatColors.unavailable;
                    textClass += " text-white";
                  }
                } else if (isSelected) {
                  colorClass = seatColors.selected;
                  textClass += " text-black";
                } else {
                  colorClass = seatColors.available;
                  textClass += " text-blue-700";
                }

                // Handle clickability
                const isClickable = seatData.status === SeatStatus.AVAILABLE && !readOnly;
                const hoverClass = isClickable ? "hover:opacity-90" : "cursor-not-allowed";

                return (
                  <button
                    key={`${rowKey}-${seatIndex}`}
                    disabled={!isClickable}
                    className={`w-10 h-10 rounded-md flex items-center justify-center border-2 transition-colors duration-150 ${colorClass} ${textClass} ${hoverClass}`}
                    onClick={() => isClickable && onSelect?.(seatNumber)}
                    title={
                      isBooked 
                        ? `Booked - ${seatData.gender ? seatData.gender : 'Unknown'}`
                        : isSelected
                          ? 'Selected'
                          : 'Available'
                    }
                  >
                    {seatNumber.toLowerCase()}
                    {seatData.gender === 'MALE' && isBooked && <MaleIcon className="ml-1 text-xs" />}
                    {seatData.gender === 'FEMALE' && isBooked && <FemaleIcon className="ml-1 text-xs" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 py-8">No seat layout available</div>
      )}
    </div>
  );
}
