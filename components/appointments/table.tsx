import { formatTimeIntl } from "@/lib/format-time-strings";
import { AppointmentWithDoctor } from "@/lib/schemas/appointments";
import { StatusSelect } from "./status-select";

const statusStyles: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    no_show: "bg-amber-100 text-amber-800",
};

export function AppointmentsTable({
    appointments,
}: {
    appointments: AppointmentWithDoctor[];
}) {
    if (appointments.length === 0) {
        return (
            <p className=" border p-8 text-center text-sm text-muted-foreground">
                No appointments match these filters.
            </p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                    <tr>
                        <th className="p-3">Patient</th>
                        <th className="p-3">Doctor</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((a) => (
                        <tr key={a.id} className="border-t">
                            <td className="p-3">
                                <div className="font-medium">{a.patient_name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {a.patient_phone ?? "—"}
                                </div>
                            </td>
                            <td className="p-3">
                                <div>{a.doctor_name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {a.doctor_specialty}
                                </div>
                            </td>
                            <td className="p-3">
                                {new Date(a.appointment_date).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </td>
                            <td className="p-3">
                                {`${formatTimeIntl(a.start_time)} – ${formatTimeIntl(a.end_time)}`}
                            </td>
                            <td className="p-3">
                                <span

                                >
                                    <StatusSelect
                                        appointmentId={a.id}
                                        status={a.status}
                                    />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}