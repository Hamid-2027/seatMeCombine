import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SeatLayout } from "@shared/schema";

interface SeatLayoutCardProps {
  seatLayout?: SeatLayout;
}

export default function SeatLayoutCard({ seatLayout }: SeatLayoutCardProps) {
  if (!seatLayout) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seat Layout</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading seat layout...</p>
        </CardContent>
      </Card>
    );
  }

  const availableSeatsCount = seatLayout.seats.filter(seat => seat.isAvailable).length;
  const seatsMap = new Map(seatLayout.seats.map(seat => [seat.seatNumber, seat]));

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{seatLayout.name}</CardTitle>
        <p className="text-muted-foreground">{availableSeatsCount} Seats Available</p>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col gap-2">
            {seatLayout.layout && Object.values(seatLayout.layout).map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {row.map((seatNumber, seatIndex) => {
                  if (seatNumber === null) {
                    return <div key={seatIndex} className="w-10 h-10" />; // Aisle
                  }
                  const seat = seatsMap.get(seatNumber);
                  return (
                    <div
                      key={seatIndex}
                      className={cn(
                        "w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold text-white",
                        seat?.isAvailable
                          ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                          : "bg-gray-400 cursor-not-allowed"
                      )}
                    >
                      {seatNumber}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
