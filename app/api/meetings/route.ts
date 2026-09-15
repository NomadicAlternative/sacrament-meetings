import { getMeetings } from '@/lib/meetings-db';

// GET /api/meetings          -> todos los meetings
// GET /api/meetings?date=... -> solo los de esa fecha
export async function GET(request: Request) {
  // searchParams.get devuelve string cuando el parametro viene, o null cuando
  // no viene. Por eso getMeetings acepta 'string | null'.
  const date = new URL(request.url).searchParams.get('date');
  const meetings = getMeetings(date);

  return Response.json(meetings);
}
