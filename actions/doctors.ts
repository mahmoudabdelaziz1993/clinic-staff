"use server"

import { sql } from "@/lib/db";
import { Doctor, doctorSchema } from "@/lib/schemas/doctors";

export async function getDoctors(): Promise<Doctor[]> {
    try {
        const result = await sql`SELECT * FROM doctors`;
        return result.map((row: any) => doctorSchema.parse(row));
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
}
