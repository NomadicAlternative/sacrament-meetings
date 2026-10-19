'use client';

import { useActionState } from 'react';
import { updateHymns, type HymnFormState } from '@/lib/actions';
import { useLocale } from '@/components/locale-provider';
import { isFirstSundayOfMonth } from '@/lib/format';
import type { SacramentMeeting } from '@/lib/types';

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const labelClass = 'text-sm font-medium';

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div id={id} aria-live="polite" className="mt-1 text-sm text-red-600">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

type HymnFieldsProps = {
  id: string;
  label: string;
  numberLabel: string;
  titleLabel: string;
  number?: number;
  title?: string;
  required?: boolean;
  errors?: { number?: string[]; title?: string[] };
};

function HymnFields({
  id,
  label,
  numberLabel,
  titleLabel,
  number,
  title,
  required,
  errors,
}: HymnFieldsProps) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className={labelClass}>{label}</legend>
      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}Number`} className="text-xs text-muted">
            {numberLabel}
          </label>
          <input
            id={`${id}Number`}
            name={`${id}Number`}
            type="number"
            min={1}
            required={required}
            defaultValue={number}
            aria-describedby={`${id}Number-error`}
            className={inputClass}
          />
          <FieldError id={`${id}Number-error`} errors={errors?.number} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={`${id}Title`} className="text-xs text-muted">
            {titleLabel}
          </label>
          <input
            id={`${id}Title`}
            name={`${id}Title`}
            type="text"
            required={required}
            defaultValue={title}
            aria-describedby={`${id}Title-error`}
            className={inputClass}
          />
          <FieldError id={`${id}Title-error`} errors={errors?.title} />
        </div>
      </div>
    </fieldset>
  );
}

// Hymns-only editor for a specific meeting. The music director (and leaders)
// set the four hymns; the intermediate hymn is omitted on the first Sunday.
export function HymnForm({ meeting }: { meeting: SacramentMeeting }) {
  const { locale, t } = useLocale();
  const [state, formAction, isPending] = useActionState<HymnFormState, FormData>(
    updateHymns.bind(null, meeting.id, locale),
    {},
  );

  const firstSunday = isFirstSundayOfMonth(meeting.date);

  const numberLabel = t('form.number');
  const titleLabel = t('form.title');

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-6">
      {state.message ? (
        <p aria-live="polite" className="text-sm text-red-600">
          {state.message}
        </p>
      ) : null}

      <HymnFields
        id="openingHymn"
        label={t('form.openingHymn')}
        numberLabel={numberLabel}
        titleLabel={titleLabel}
        number={meeting.openingHymn.number}
        title={meeting.openingHymn.title}
        required
        errors={{ number: state.errors?.openingHymnNumber, title: state.errors?.openingHymnTitle }}
      />
      <HymnFields
        id="sacramentHymn"
        label={t('form.sacramentHymn')}
        numberLabel={numberLabel}
        titleLabel={titleLabel}
        number={meeting.sacramentHymn.number}
        title={meeting.sacramentHymn.title}
        required
        errors={{ number: state.errors?.sacramentHymnNumber, title: state.errors?.sacramentHymnTitle }}
      />

      {!firstSunday ? (
        <HymnFields
          id="intermediateHymn"
          label={t('form.intermediateHymn')}
          numberLabel={numberLabel}
          titleLabel={titleLabel}
          number={meeting.intermediateHymn?.number}
          title={meeting.intermediateHymn?.title}
          required
          errors={{ number: state.errors?.intermediateHymnNumber, title: state.errors?.intermediateHymnTitle }}
        />
      ) : (
        <p className="text-sm text-muted">{t('form.firstSundayNote')}</p>
      )}

      <HymnFields
        id="closingHymn"
        label={t('form.closingHymn')}
        numberLabel={numberLabel}
        titleLabel={titleLabel}
        number={meeting.closingHymn.number}
        title={meeting.closingHymn.title}
        required
        errors={{ number: state.errors?.closingHymnNumber, title: state.errors?.closingHymnTitle }}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition duration-150 ease-out hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? t('form.saving') : t('form.save')}
      </button>
    </form>
  );
}
