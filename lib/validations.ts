import { z } from "zod";

export const submitSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  title: z.string().min(3, "Title too short").max(200),
  description: z.string().max(500).optional(),
  type: z.enum(["website", "video"]),
});

export type SubmitInput = z.infer<typeof submitSchema>;
