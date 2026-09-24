import { z } from "zod";
export const inquirySchema = z.object({
  company: z.string().trim().min(2).max(150),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(35),
  city: z.string().trim().min(2).max(100),
  message: z.string().trim().max(5000),
  items: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(250),
        quantity: z.string().trim().min(1).max(80),
      }),
    )
    .min(1)
    .max(30),
  submissionId: z.string().uuid(),
  website: z.string().max(0),
});
export type Inquiry = z.infer<typeof inquirySchema>;
