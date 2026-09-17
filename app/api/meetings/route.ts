import { getMeetings, getMeetingByDate } from '@/lib/meetings-db';

// GET /api/meetings
// GET /api/meetings?date=2026-09-13
// GET /api/meetings?query=smith&page=2
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const date = params.get('date');

  // The date filter keeps working exactly as it did in Week 02, because
  // /meetings/current depends on it and the assignment's manual check list
  // still asks for /api/meetings?date=...
  if (date) {
    const meeting = await getMeetingByDate(date);
    return Response.json(meeting ? [meeting] : []);
  }

  const query = params.get('query') ?? '';
  const currentPage = Number(params.get('page')) || 1;
  const meetings = await getMeetings(query, currentPage);

  return Response.json(meetings);
}
