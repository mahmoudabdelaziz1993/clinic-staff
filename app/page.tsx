import { getAppointments } from "@/actions/appointments";
import { getDoctors } from "@/actions/doctors";
import AppointmentPageHeader from "@/components/appointments/page-header";
import { AppointmentsTable } from "@/components/appointments/table";
import AppointmentsTableFilters from "@/components/appointments/table-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointmentStatusEnum } from "@/lib/schemas/appointments";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    doctor?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const doctorId = params.doctor ? Number(params.doctor) : undefined;

  const parsedStatus = appointmentStatusEnum.safeParse(params.status);
  const status = parsedStatus.success ? parsedStatus.data : undefined;

  const [appointments, doctors] = await Promise.all([
    getAppointments({ doctorId, status }),
    getDoctors(),
  ]);

  return (
    <div className="flex min-h-svh p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <AppointmentPageHeader doctors={doctors} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsTableFilters
            doctors={doctors}
            selectedDoctor={doctorId}
            selectedStatus={status}
          />
          <AppointmentsTable appointments={appointments} />
        </CardContent>
      </Card>

    </div>
  )
}
