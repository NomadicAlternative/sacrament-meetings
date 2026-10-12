import { ImageResponse } from 'next/og';
import { getDictionary, isLocale } from '@/lib/i18n';

// File-based Open Graph image. Next.js renders this at build/request time with
// ImageResponse (Satori), so no system fonts or image tooling are required.
// It is localized: the title renders in the active locale's language.

export const alt = 'Rama Elda';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'es');

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#1f4b88',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          {dict['brand.title']}
        </div>
        <div style={{ fontSize: 30, marginTop: 18, opacity: 0.8 }}>
          {dict['brand.name']}
        </div>
      </div>
    ),
    { ...size },
  );
}
