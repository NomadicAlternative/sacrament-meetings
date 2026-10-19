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
  // Hymns are optional: a leader can leave them blank and the music director
  // fills them in separately.
  openingHymnNumber: z.coerce.number().optional(),
  openingHymnTitle: z.string().optional(),
  openingPrayer: z.string().min(1, { message: 'Opening prayer is required.' }),
  sacramentHymnNumber: z.coerce.number().optional(),
  sacramentHymnTitle: z.string().optional(),
  // The intermediate hymn is omitted on the first Sunday of the month, so both
  // fields are optional: absent (first Sunday) maps to undefined.
  intermediateHymnNumber: z.coerce.number().optional(),
  intermediateHymnTitle: z.string().optional(),
  closingHymnNumber: z.coerce.number().optional(),
  closingHymnTitle: z.string().optional(),
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
