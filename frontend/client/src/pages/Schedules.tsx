import { useQuery } from "@tanstack/react-query";
import { getBusSchedules } from "@/api/busSchedules";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/schedules/columns";

export default function SchedulesPage() {
  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ["busSchedules"],
    queryFn: getBusSchedules,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading schedules</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Bus Schedules</h1>
      {schedules && <DataTable columns={columns} data={schedules} />}
    </div>
  );
}
