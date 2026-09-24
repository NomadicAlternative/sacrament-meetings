'use client';

import { useActionState } from 'react';
import { MEETING_TYPE_LABELS } from '@/lib/format';
import type { MeetingFormState } from '@/lib/meeting-form-schema';
import type { SacramentMeeting } from '@/lib/types';

// Shared by the create and edit pages. `action` is the Server Action to run on
// submit (already bound with the id when editing); `defaultValues` pre-fills
// the fields for editing and is absent when creating.
interface MeetingFormProps {
  action: (
    state: MeetingFormState,
    formData: FormData,
  ) => Promise<MeetingFormState>;
  defaultValues?: SacramentMeeting | null;
}

const initialState: MeetingFormState = {
  message: null,
  errors: {},
};

// The inputs sit on top of the bg-card container, so they use bg-background to
// stay visible instead of blending into the card.
const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const labelClass = 'text-sm font-medium';

// Renders a field's validation errors. `id` is referenced by the input's
// aria-describedby, and aria-live announces errors to screen readers.
function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div id={id} aria-live="polite" className="mt-1 text-sm text-red-600">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

export default function MeetingForm({ action, defaultValues }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const isEditing = defaultValues != null;

  // The three list-like fields are textareas with one entry per line. For
  // editing, the stored arrays are flattened back into that line format so the
  // user can read and change what is already saved.
  const speakersDefault = defaultValues
    ? defaultValues.speakers
        .map((item) => `${item.name} | ${item.topic} | ${item.type}`)
        .join('\n')
    : '';

  const wardBusinessDefault = defaultValues
    ? defaultValues.wardBusiness.map((item) => item.description).join('\n')
    : '';

  const announcementsDefault = defaultValues
    ? (defaultValues.announcements ?? []).join('\n')
    : '';

  const idleLabel = isEditing ? 'Save changes' : 'Create meeting';
  const pendingLabel = isEditing ? 'Saving...' : 'Creating...';

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-6">
      {state.message ? (
        <p aria-live="polite" className="text-sm text-red-600">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-1">
        <label htmlFor="date" className={labelClass}>
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={defaultValues?.date}
          aria-describedby="date-error"
          className={inputClass}
        />
        <FieldError id="date-error" errors={state.errors?.date} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="meetingType" className={labelClass}>
          Meeting type
        </label>
        <select
          id="meetingType"
          name="meetingType"
          required
          defaultValue={defaultValues?.meetingType}
          aria-describedby="meetingType-error"
          className={inputClass}
        >
          <option value="" disabled>
            Select a type
          </option>
          {(Object.keys(MEETING_TYPE_LABELS) as Array<keyof typeof MEETING_TYPE_LABELS>).map(
            (type) => (
              <option key={type} value={type}>
                {MEETING_TYPE_LABELS[type]}
              </option>
            )
          )}
        </select>
        <FieldError id="meetingType-error" errors={state.errors?.meetingType} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="presiding" className={labelClass}>
          Presiding
        </label>
        <input
          id="presiding"
          name="presiding"
          type="text"
          required
          defaultValue={defaultValues?.presiding}
          aria-describedby="presiding-error"
          className={inputClass}
        />
        <FieldError id="presiding-error" errors={state.errors?.presiding} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="conducting" className={labelClass}>
          Conducting
        </label>
        <input
          id="conducting"
          name="conducting"
          type="text"
          required
          defaultValue={defaultValues?.conducting}
          aria-describedby="conducting-error"
          className={inputClass}
        />
        <FieldError id="conducting-error" errors={state.errors?.conducting} />
      </div>

      <fieldset className="flex flex-col gap-1">
        <legend className={labelClass}>Opening hymn</legend>
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <div className="flex flex-col gap-1">
            <label htmlFor="openingHymnNumber" className="text-xs text-muted">
              Number
            </label>
            <input
              id="openingHymnNumber"
              name="openingHymnNumber"
              type="number"
              min={1}
              required
              defaultValue={defaultValues?.openingHymn.number}
              aria-describedby="openingHymnNumber-error"
              className={inputClass}
            />
            <FieldError
              id="openingHymnNumber-error"
              errors={state.errors?.openingHymnNumber}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="openingHymnTitle" className="text-xs text-muted">
              Title
            </label>
            <input
              id="openingHymnTitle"
              name="openingHymnTitle"
              type="text"
              required
              defaultValue={defaultValues?.openingHymn.title}
              aria-describedby="openingHymnTitle-error"
              className={inputClass}
            />
            <FieldError
              id="openingHymnTitle-error"
              errors={state.errors?.openingHymnTitle}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="openingPrayer" className={labelClass}>
          Opening prayer
        </label>
        <input
          id="openingPrayer"
          name="openingPrayer"
          type="text"
          required
          defaultValue={defaultValues?.openingPrayer}
          aria-describedby="openingPrayer-error"
          className={inputClass}
        />
        <FieldError id="openingPrayer-error" errors={state.errors?.openingPrayer} />
      </div>

      <fieldset className="flex flex-col gap-1">
        <legend className={labelClass}>Sacrament hymn</legend>
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <div className="flex flex-col gap-1">
            <label htmlFor="sacramentHymnNumber" className="text-xs text-muted">
              Number
            </label>
            <input
              id="sacramentHymnNumber"
              name="sacramentHymnNumber"
              type="number"
              min={1}
              required
              defaultValue={defaultValues?.sacramentHymn.number}
              aria-describedby="sacramentHymnNumber-error"
              className={inputClass}
            />
            <FieldError
              id="sacramentHymnNumber-error"
              errors={state.errors?.sacramentHymnNumber}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="sacramentHymnTitle" className="text-xs text-muted">
              Title
            </label>
            <input
              id="sacramentHymnTitle"
              name="sacramentHymnTitle"
              type="text"
              required
              defaultValue={defaultValues?.sacramentHymn.title}
              aria-describedby="sacramentHymnTitle-error"
              className={inputClass}
            />
            <FieldError
              id="sacramentHymnTitle-error"
              errors={state.errors?.sacramentHymnTitle}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1">
        <legend className={labelClass}>Closing hymn</legend>
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <div className="flex flex-col gap-1">
            <label htmlFor="closingHymnNumber" className="text-xs text-muted">
              Number
            </label>
            <input
              id="closingHymnNumber"
              name="closingHymnNumber"
              type="number"
              min={1}
              required
              defaultValue={defaultValues?.closingHymn.number}
              aria-describedby="closingHymnNumber-error"
              className={inputClass}
            />
            <FieldError
              id="closingHymnNumber-error"
              errors={state.errors?.closingHymnNumber}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="closingHymnTitle" className="text-xs text-muted">
              Title
            </label>
            <input
              id="closingHymnTitle"
              name="closingHymnTitle"
              type="text"
              required
              defaultValue={defaultValues?.closingHymn.title}
              aria-describedby="closingHymnTitle-error"
              className={inputClass}
            />
            <FieldError
              id="closingHymnTitle-error"
              errors={state.errors?.closingHymnTitle}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="closingPrayer" className={labelClass}>
          Closing prayer
        </label>
        <input
          id="closingPrayer"
          name="closingPrayer"
          type="text"
          required
          defaultValue={defaultValues?.closingPrayer}
          aria-describedby="closingPrayer-error"
          className={inputClass}
        />
        <FieldError id="closingPrayer-error" errors={state.errors?.closingPrayer} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="stakeBusiness"
          name="stakeBusiness"
          type="checkbox"
          defaultChecked={defaultValues?.stakeBusiness ?? false}
          aria-describedby="stakeBusiness-error"
          className="h-4 w-4 rounded border-border accent-accent"
        />
        <label htmlFor="stakeBusiness" className="text-sm">
          Stake business
        </label>
      </div>
      <FieldError id="stakeBusiness-error" errors={state.errors?.stakeBusiness} />

      <div className="flex flex-col gap-1">
        <label htmlFor="announcements" className={labelClass}>
          Announcements
        </label>
        <textarea
          id="announcements"
          name="announcements"
          rows={3}
          defaultValue={announcementsDefault}
          aria-describedby="announcements-error"
          className={inputClass}
        />
        <p className="text-xs text-muted">One announcement per line.</p>
        <FieldError id="announcements-error" errors={state.errors?.announcements} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="wardBusiness" className={labelClass}>
          Ward business
        </label>
        <textarea
          id="wardBusiness"
          name="wardBusiness"
          rows={3}
          defaultValue={wardBusinessDefault}
          aria-describedby="wardBusiness-error"
          className={inputClass}
        />
        <p className="text-xs text-muted">One item per line.</p>
        <FieldError id="wardBusiness-error" errors={state.errors?.wardBusiness} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="speakers" className={labelClass}>
          Speakers and musical numbers
        </label>
        <textarea
          id="speakers"
          name="speakers"
          rows={5}
          defaultValue={speakersDefault}
          aria-describedby="speakers-error"
          className={inputClass}
        />
        <p className="text-xs text-muted">
          One per line: Name | Topic | speaker (use &ldquo;musical-number&rdquo;
          instead of &ldquo;speaker&rdquo; for musical numbers).
        </p>
        <FieldError id="speakers-error" errors={state.errors?.speakers} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition duration-150 ease-out hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? pendingLabel : idleLabel}
      </button>
    </form>
  );
}
