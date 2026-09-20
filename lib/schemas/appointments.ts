import { z } from "zod";



export const appointmentStatusEnum = z.enum([
    "scheduled",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
]);

export type AppointmentStatus = z.infer<typeof appointmentStatusEnum>;

export const appointmentSchema = z.object({
    id: z.number(),
    doctor_id: z.number(),
    patient_name: z.string(),
    patient_phone: z.string().nullable(),
    appointment_date: z.coerce.date(),
    start_time: z.string(),
    end_time: z.string(),
    notes: z.string().nullable(),
    created_at: z.coerce.date(),
    status: appointmentStatusEnum.default("scheduled"),
});

export const createAppointmentSchema = z
    .object({
        doctorId: z.number().int().positive(),

        patientName: z
            .string()
            .trim()
            .min(1, "Patient name is required"),

        patientPhone: z
            .string()
            .trim()
            .optional(),

        appointmentDate: z
            .string()
            .min(1, "Appointment date is required"),

        startTime: z
            .string()
            .min(1, "Start time is required"),

        endTime: z
            .string()
            .min(1, "End time is required"),

        notes: z
            .string()
            .trim()
            .optional(),
    })
    .refine(
        (data) => data.endTime > data.startTime,
        {
            message: "End time must be after start time",
            path: ["endTime"],
        }
    );

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;


export const appointmentFiltersSchema = z.object({
    doctorId: z.coerce.number().int().positive().optional(),
    status: appointmentStatusEnum.optional(),
});

export type AppointmentFilters = z.infer<typeof appointmentFiltersSchema>;

export type AppointmentWithDoctor = Appointment & {
    doctor_name: string;
    doctor_specialty: string;
};

export const updateStatusSchema = z.object({
    id: z.coerce.number().int().positive(),
    status: appointmentStatusEnum,
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;