import { ChatSearchRequest } from 'src/app/shared/generated';
import { z, ZodTypeAny } from 'zod';

export const chatSearchCriteriasSchema = z.object({
  changeMe: z.string().optional(),
  // ACTION S2: Please define the members for your chatSearchCriteriasSchema here
} satisfies Partial<Record<keyof ChatSearchRequest, ZodTypeAny>>);

export type ChatSearchCriteria = z.infer<typeof chatSearchCriteriasSchema>;
