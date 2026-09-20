import { z } from "zod";

export const doctorSchema = z.object({
    id: z.number(),
    name: z.string(),
    specialty: z.string(),

});

export type Doctor = z.infer<typeof doctorSchema>;
