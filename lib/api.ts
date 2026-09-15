import { headers } from 'next/headers';

// En un Server Component no existen las URLs relativas: fetch necesita una
// absoluta. Como no sabemos en que dominio corre la app (localhost en
// desarrollo, un dominio de Vercel en produccion), el origen se reconstruye
// a partir de los headers de la peticion entrante.
export async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const protocol =
    host.startsWith('localhost') || host.startsWith('127.0.0.1')
      ? 'http'
      : 'https';

  return `${protocol}://${host}`;
}
