"use server"

import { sql } from "@/lib/db";
import { z } from "zod";

const doctorSchema = z.object({
    id: z.number(),
    name: z.string(),
    specialty: z.string(),

});

export type Doctor = z.infer<typeof doctorSchema>;

export async function getDoctors(): Promise<Doctor[]> {
    try {
        const result = await sql`SELECT * FROM doctors`;
        return result.map((row: any) => doctorSchema.parse(row));
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
}
