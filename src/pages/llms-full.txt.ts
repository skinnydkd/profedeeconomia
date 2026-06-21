import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ASIGNATURA_SLUGS, ASIGNATURAS, SECCIONES_TRANSVERSALES } from '@/lib/asignaturas';
import { buildLlmsFull, type LlmsSubject } from '@/lib/llms-full';

export const prerender = true;

const idToSlug = (id: string) => id.split('/').pop()?.replace(/\.mdx?$/, '') ?? id;

export const GET: APIRoute = async () => {
  const allUnits = await getCollection('libro');

  const subjects: LlmsSubject[] = ASIGNATURA_SLUGS.map((slug) => ASIGNATURAS[slug])
    .filter((a) => a.estado === 'publicado')
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      level: a.level,
      marcoNormativo: a.marcoNormativo,
      modalidad: a.modalidad,
      units: allUnits
        .filter((u) => u.data.asignatura === a.slug && u.data.estado === 'publicado')
        .sort((x, y) => x.data.unidad - y.data.unidad)
        .map((u) => ({
          unidad: u.data.unidad,
          title: u.data.title,
          lema: u.data.lema,
          objetivos: u.data.objetivos,
          conceptos_clave: u.data.conceptos_clave,
          sabers: u.data.sabers,
          slug: idToSlug(u.id),
        })),
    }))
    .filter((s) => s.units.length > 0);

  const body = buildLlmsFull(subjects, [...SECCIONES_TRANSVERSALES]);

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
