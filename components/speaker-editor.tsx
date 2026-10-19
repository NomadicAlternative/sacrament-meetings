'use client';

import { useState } from 'react';
import { useLocale } from '@/components/locale-provider';
import type { SpeakerItem } from '@/lib/types';

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

// Editor claro de discursantes: nombre + tema (y tipo). Reemplaza el textarea
// "Nombre | Tema | speaker" por campos explicitos. Serializa a ese mismo
// formato en un hidden input para que parseSpeakers siga funcionando igual.
export function SpeakerEditor({
  defaultSpeakers,
}: {
  defaultSpeakers: SpeakerItem[];
}) {
  const { t } = useLocale();
  const [items, setItems] = useState<SpeakerItem[]>(defaultSpeakers);
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'speaker' | 'musical-number'>('speaker');

  const add = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setItems((prev) => [
      ...prev,
      { name: trimmedName, topic: topic.trim(), type },
    ]);
    setName('');
    setTopic('');
  };

  const remove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const serialized = items
    .map((item) => `${item.name} | ${item.topic} | ${item.type}`)
    .join('\n');

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="speakers" value={serialized} />

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium">{item.name}</span>
                {item.topic ? (
                  <span className="text-muted"> — {item.topic}</span>
                ) : null}
                {item.type === 'musical-number' ? (
                  <span className="text-muted"> ({t('form.musicalType')})</span>
                ) : null}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs text-red-600 underline-offset-4 hover:underline"
              >
                {t('form.remove')}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('form.speakerName')}
          aria-label={t('form.speakerName')}
          className={inputClass}
        />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('form.speakerTopic')}
          aria-label={t('form.speakerTopic')}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
        >
          {t('form.addSpeaker')}
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted">
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={type === 'speaker'}
            onChange={() => setType('speaker')}
          />
          {t('form.speakerType')}
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={type === 'musical-number'}
            onChange={() => setType('musical-number')}
          />
          {t('form.musicalType')}
        </label>
      </div>
    </div>
  );
}
