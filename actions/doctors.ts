import { sql } from "@/lib/db";

export async function getDoctors() {
    const result = await sql`SELECT * FROM doctors`;
    return result;
}
