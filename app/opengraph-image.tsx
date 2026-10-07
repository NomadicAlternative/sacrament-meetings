import { ImageResponse } from 'next/og';

// File-based Open Graph image. Next.js renders this at build/request time with
// ImageResponse (Satori), so no system fonts or image tooling are required.

export const alt = 'Sacrament Meeting Planner — Maplewood Ward';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#3f5a48',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          Sacrament Meeting Planner
        </div>
        <div style={{ fontSize: 30, marginTop: 18, opacity: 0.8 }}>
          Maplewood Ward
        </div>
      </div>
    ),
    { ...size },
  );
}
