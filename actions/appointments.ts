// actions/appointments.ts
"use server";

import { sql } from "@/lib/db";
import { z } from "zod";
import { createAppointmentSchema, CreateAppointmentInput } from "@/lib/schemas/appointments";

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