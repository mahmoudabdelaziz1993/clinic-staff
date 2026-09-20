// actions/appointments.ts
"use server";

import { sql } from "@/lib/db";
import { z } from "zod";
import { createAppointmentSchema, CreateAppointmentInput, AppointmentWithDoctor, AppointmentFilters, appointmentFiltersSchema, AppointmentStatus, Appointment, updateStatusSchema } from "@/lib/schemas/appointments";
import { revalidatePath } from "next/cache";

// create a new appointment
export async function createAppointmentAction(
    input: CreateAppointmentInput
) {
    try {
        const data = createAppointmentSchema.parse(input);

        const result = await sql`
      INSERT INTO appointments (
        doctor_id,
        patient_name,
        patient_phone,
        appointment_date,
        start_time,
        end_time,
        notes
      )
      VALUES (
        ${data.doctorId},
        ${data.patientName},
        ${data.patientPhone || null},
        ${data.appointmentDate},
        ${data.startTime},
        ${data.endTime},
        ${data.notes || null})
      RETURNING
        id,
        doctor_id,
        patient_name,
        patient_phone,
        appointment_date,
        start_time,
        end_time,
        notes,
        created_at`;
        revalidatePath("/");

        return {
            success: true,
            appointment: result[0],
        };
    } catch (error: any) {
        console.error("Error creating appointment:", error);

        if (error?.code === "23P01") {
            return {
                success: false,
                error: "This doctor already has an appointment during this time.",
            };
        }

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message ?? "Invalid appointment data.",
            };
        }

        return {
            success: false,
            error: "Unable to create appointment.",
        };
    }
}

export async function getAppointments(
    filters: AppointmentFilters = {}
): Promise<AppointmentWithDoctor[]> {
    const { doctorId, status } = appointmentFiltersSchema.parse(filters);

    const rows = await sql`
        SELECT
            a.id,
            a.doctor_id,
            a.patient_name,
            a.patient_phone,
            a.appointment_date,
            a.start_time,
            a.end_time,
            a.notes,
            a.status,
            a.created_at,
            d.name      AS doctor_name,
            d.specialty AS doctor_specialty
        FROM appointments a
        JOIN doctors d ON d.id = a.doctor_id
        WHERE
            (${doctorId ?? null}::int IS NULL OR a.doctor_id = ${doctorId ?? null})
            AND (${status ?? null}::appointment_status IS NULL OR a.status = ${status ?? null})
        ORDER BY a.appointment_date DESC, a.start_time DESC
    `;

    return rows as AppointmentWithDoctor[];
}

export async function updateAppointmentStatusAction(
    input: { id: number; status: AppointmentStatus }
): Promise<
    | { success: true; appointment: Appointment }
    | { success: false; error: string }
> {
    try {
        const { id, status } = updateStatusSchema.parse(input);

        const result = await sql`
            UPDATE appointments
            SET status = ${status}
            WHERE id = ${id}
            RETURNING
                id, doctor_id, patient_name, patient_phone,
                appointment_date, start_time, end_time, notes,
                status, created_at
        `;

        if (result.length === 0) {
            return { success: false, error: "Appointment not found." };
        }

        return { success: true, appointment: result[0] as Appointment };
    } catch (error) {
        console.error("Error updating appointment status:", error);

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0]?.message ?? "Invalid input.",
            };
        }

        return { success: false, error: "Unable to update status." };
    }
}