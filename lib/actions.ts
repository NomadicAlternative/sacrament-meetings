'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { requireLeaderSession } from '@/lib/auth-guards';
import {
  MeetingFormSchema,
  type MeetingFormInput,
  type MeetingFormState,
} from '@/lib/meeting-form-schema';
import {
  addMeeting,
  updateMeeting as updateMeetingRow,
  deleteMeeting as deleteMeetingRow,
} from '@/lib/meetings-db';
import { createMembershipRequest, getUserByEmail } from '@/lib/users';
import type { Locale } from '@/lib/i18n';
import {
  REQUESTABLE_ROLES,
  type Hymn,
  type MeetingType,
  type Role,
  type SacramentMeeting,
  type SpeakerItem,
  type WardBusinessItem,
} from '@/lib/types';

// Turns each non-empty line into a WardBusinessItem. Blank lines are ignored.
function parseWardBusiness(raw: string | undefined): WardBusinessItem[] {
  if (!raw) return [];

  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((description) => ({ description }));
}

// Parses the "Name | Topic | speaker" textarea. The third part defaults to
// 'speaker', and anything that is not exactly 'musical-number' is treated as a
// speaker, so a stray extra token never produces an invalid type.
function parseSpeakers(raw: string | undefined): SpeakerItem[] {
  if (!raw) return [];

  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [name = '', topic = '', typeRaw = 'speaker'] = line
        .split('|')
        .map((part) => part.trim());

      const type: SpeakerItem['type'] =
        typeRaw === 'musical-number' ? 'musical-number' : 'speaker';

      return { name, topic, type };
    });
}

// Splits the announcements textarea into lines. Returns undefined when there
// are none, so the detail page keeps hiding the section entirely rather than
// rendering an empty one.
function parseAnnouncements(raw: string | undefined): string[] | undefined {
  if (!raw) return undefined;

  const items = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return items.length > 0 ? items : undefined;
}

// Builds the flat, form-shaped object from FormData. createMeeting and
// updateMeeting both validate this exact shape, so it lives in one place.
function formDataToInput(formData: FormData) {
  return {
    date: formData.get('date'),
    meetingType: formData.get('meetingType'),
    presiding: formData.get('presiding'),
    conducting: formData.get('conducting'),
    openingHymnNumber: formData.get('openingHymnNumber'),
    openingHymnTitle: formData.get('openingHymnTitle'),
    openingPrayer: formData.get('openingPrayer'),
    sacramentHymnNumber: formData.get('sacramentHymnNumber'),
    sacramentHymnTitle: formData.get('sacramentHymnTitle'),
    intermediateHymnNumber: formData.get('intermediateHymnNumber'),
    intermediateHymnTitle: formData.get('intermediateHymnTitle'),
    closingHymnNumber: formData.get('closingHymnNumber'),
    closingHymnTitle: formData.get('closingHymnTitle'),
    closingPrayer: formData.get('closingPrayer'),
    stakeBusiness: formData.get('stakeBusiness'),
    announcements: formData.get('announcements'),
    wardBusiness: formData.get('wardBusiness'),
    speakers: formData.get('speakers'),
  };
}

// The intermediate hymn only exists when a title was actually entered. The
// first Sunday of the month omits the field entirely, so an absent title means
// "no intermediate hymn" and maps to undefined.
function buildOptionalHymn(
  number: number | undefined,
  title: string | undefined,
): Hymn | undefined {
  if (!title || title.trim().length === 0) return undefined;
  return { number: number ?? 0, title };
}

// Transforms the validated flat fields into the stored SacramentMeeting shape.
function buildMeeting(data: MeetingFormInput): Omit<SacramentMeeting, 'id'> {
  return {
    date: data.date,
    meetingType: data.meetingType as MeetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: parseAnnouncements(data.announcements),
    openingHymn: {
      number: data.openingHymnNumber,
      title: data.openingHymnTitle,
    },
    openingPrayer: data.openingPrayer,
    wardBusiness: parseWardBusiness(data.wardBusiness),
    stakeBusiness: data.stakeBusiness,
    sacramentHymn: {
      number: data.sacramentHymnNumber,
      title: data.sacramentHymnTitle,
    },
    intermediateHymn: buildOptionalHymn(
      data.intermediateHymnNumber,
      data.intermediateHymnTitle,
    ),
    speakers: parseSpeakers(data.speakers),
    closingHymn: {
      number: data.closingHymnNumber,
      title: data.closingHymnTitle,
    },
    closingPrayer: data.closingPrayer,
  };
}

export async function createMeeting(
  locale: Locale,
  prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireLeaderSession();

  const validatedFields = MeetingFormSchema.safeParse(formDataToInput(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the fields highlighted below.',
    };
  }

  try {
    await addMeeting(buildMeeting(validatedFields.data));
  } catch {
    return { message: 'Database error: could not create the meeting.' };
  }

  revalidatePath(`/${locale}/meetings`);
  redirect(`/${locale}/meetings`);
}

export async function updateMeeting(
  id: number,
  locale: Locale,
  prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireLeaderSession();

  const validatedFields = MeetingFormSchema.safeParse(formDataToInput(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the fields highlighted below.',
    };
  }

  try {
    const updated = await updateMeetingRow(
      id,
      buildMeeting(validatedFields.data),
    );

    if (!updated) {
      return { message: 'This meeting no longer exists.' };
    }
  } catch {
    return { message: 'Database error: could not update the meeting.' };
  }

  revalidatePath(`/${locale}/meetings`);
  redirect(`/${locale}/meetings`);
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  await requireLeaderSession();

  const id = Number(formData.get('id'));
  const locale = (formData.get('locale') as string) || 'es';

  try {
    await deleteMeetingRow(id);
  } catch {
    // A failed delete leaves the row in place. Falling through to the redirect
    // re-renders the list so the user can retry, rather than swallowing the
    // error into a dead end.
  }

  revalidatePath(`/${locale}/meetings`);
  redirect(`/${locale}/meetings`);
}

// Result of the credentials sign-in attempt. `status` drives the client:
// not_registered opens the request modal, pending/rejected show the matching
// message, and `error` shows a credentials error.
export type LoginState = {
  status?: 'pending' | 'rejected' | 'not_registered';
  email?: string;
  error?: 'credentials' | 'generic';
};

// Sign-in Server Action consumed by the login form via useActionState.
// signIn throws a redirect on success, so it must not be swallowed here.
// Before signing in it checks the membership state, so a first-time email can
// be routed to the request modal instead of Auth.js's generic credentials error.
export async function authenticate(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const existing = await getUserByEmail(email);

  if (!existing) {
    return { status: 'not_registered', email };
  }
  if (existing.status === 'pending') {
    return { status: 'pending' };
  }
  if (existing.status === 'rejected') {
    return { status: 'rejected' };
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'credentials' };
        default:
          return { error: 'generic' };
      }
    }
    throw error; // re-throw so Next.js handles the redirect correctly
  }

  return {};
}

const RequestAccessSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(REQUESTABLE_ROLES),
  password: z.string().optional(),
});

export type RequestAccessState = {
  errors?: Record<string, string[]>;
  sent?: boolean;
};

// Creates a pending membership request. A password is optional: OAuth users
// have none; credentials users provide one so they can sign in later.
export async function requestAccess(
  prevState: RequestAccessState,
  formData: FormData,
): Promise<RequestAccessState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const role = String(formData.get('role') ?? '') as Role;
  const password = String(formData.get('password') ?? '');

  const parsed = RequestAccessSchema.safeParse({ name, email, role, password });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const passwordHash = password.length > 0
    ? await bcrypt.hash(password, 10)
    : null;

  await createMembershipRequest({
    email,
    name,
    role: parsed.data.role,
    passwordHash,
  });

  return { sent: true };
}
