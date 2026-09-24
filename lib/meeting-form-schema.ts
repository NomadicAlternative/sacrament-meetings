import { z } from 'zod';

// The schema validates the FORM shape (flat fields), not the stored
// SacramentMeeting. The flat shape is what FormData delivers; the transform
// into hymns/speakers/wardBusiness happens only after validation passes.
//
// It lives in its own file (not next to the actions) because a 'use server'
// module can only export async functions. A Zod schema is a value, so it must
// be exported from a plain module and imported by the actions.
export const MeetingFormSchema = z.object({
  date: z.string().min(1, { message: 'Date is required.' }),
  meetingType: z.enum(['testimony', 'regular', 'stake', 'general', 'special'], {
    message: 'Select a meeting type.',
  }),
  presiding: z.string().min(1, { message: 'Presiding is required.' }),
  conducting: z.string().min(1, { message: 'Conducting is required.' }),
  openingHymnNumber: z.coerce.number(),
  openingHymnTitle: z.string().min(1, { message: 'Opening hymn title is required.' }),
  openingPrayer: z.string().min(1, { message: 'Opening prayer is required.' }),
  sacramentHymnNumber: z.coerce.number(),
  sacramentHymnTitle: z
    .string()
    .min(1, { message: 'Sacrament hymn title is required.' }),
  closingHymnNumber: z.coerce.number(),
  closingHymnTitle: z.string().min(1, { message: 'Closing hymn title is required.' }),
  closingPrayer: z.string().min(1, { message: 'Closing prayer is required.' }),
  // A checkbox only exists in FormData when checked. The value is 'on' when
  // checked and absent otherwise, so preprocess maps that to a boolean before
  // the boolean schema runs.
  stakeBusiness: z
    .preprocess((value) => value === 'on', z.boolean())
    .default(false),
  announcements: z.string().optional(),
  wardBusiness: z.string().optional(),
  speakers: z.string().optional(),
});

// The validated (output) shape of the form fields.
export type MeetingFormInput = z.infer<typeof MeetingFormSchema>;

// The state useActionState hands back to the form. `errors` is keyed by field
// name (flatten().fieldErrors), `message` carries a form-level error.
export type MeetingFormState = {
  errors?: Record<string, string[]>;
  message?: string | null;
};
