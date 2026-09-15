import { getMeetingById } from '@/lib/meetings-db';

// GET /api/meetings/[id]
//   200 -> meeting encontrado
//   400 -> el id no es un numero entero
//   404 -> el id es valido pero no existe
//
// RouteContext<'...'> es el helper global de Next.js 16 para tipar el segundo
// argumento, y params tambien es una Promise.
export async function GET(
  _request: Request,
  context: RouteContext<'/api/meetings/[id]'>
) {
  const { id } = await context.params;
  const numericId = Number(id);

  // Number('abc') da NaN, y Number.isInteger(NaN) es false.
  if (!Number.isInteger(numericId)) {
    return Response.json(
      { error: `Invalid meeting id: ${id}` },
      { status: 400 }
    );
  }

  const meeting = getMeetingById(numericId);

  if (!meeting) {
    return Response.json(
      { error: `Meeting ${numericId} not found` },
      { status: 404 }
    );
  }

  return Response.json(meeting);
}
