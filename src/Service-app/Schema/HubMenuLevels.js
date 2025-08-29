import { z } from "zod";

export const VendorSearchLineSchema = z.object({
    id: z.number(),
    origin: z.number(),
    dt_parsed: z.string(),
    url: z.string(),
    title: z.string()
});

export const VendorSearchLineListSchema = z.array(VendorSearchLineSchema);
