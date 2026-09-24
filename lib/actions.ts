'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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
import type {
  MeetingType,
  SacramentMeeting,
  SpeakerItem,
  WardBusinessItem,
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
    closingHymnNumber: formData.get('closingHymnNumber'),
    closingHymnTitle: formData.get('closingHymnTitle'),
    closingPrayer: formData.get('closingPrayer'),
    stakeBusiness: formData.get('stakeBusiness'),
    announcements: formData.get('announcements'),
    wardBusiness: formData.get('wardBusiness'),
    speakers: formData.get('speakers'),
  };
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
    speakers: parseSpeakers(data.speakers),
    closingHymn: {
      number: data.closingHymnNumber,
      title: data.closingHymnTitle,
    },
    closingPrayer: data.closingPrayer,
  };
}

export async function createMeeting(
  prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
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

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  const validatedFields = MeetingFormSchema.safeParse(formDataToInput(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the fields highlighted below.',
    };
  }

  try {
    const updated = await updateMeetingRow(id, buildMeeting(validatedFields.data));

    if (!updated) {
      return { message: 'This meeting no longer exists.' };
    }
  } catch {
    return { message: 'Database error: could not update the meeting.' };
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function deleteMeeting(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'));

  try {
    await deleteMeetingRow(id);
  } catch {
    // A failed delete leaves the row in place. Falling through to the redirect
    // re-renders the list so the user can retry, rather than swallowing the
    // error into a dead end.
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}
