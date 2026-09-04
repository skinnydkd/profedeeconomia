/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import { type Locale } from '@/i18n/locale';
import { auditar, ACCIONES, type Area } from '../../lib/calc/huella-digital';

/** UI strings, Valencian (AVL) alongside the ES source. */
export const COPY = {
  es: {
    intro: 'Esto no es un test ni te puntúa: es una lista de cosas que se pueden hacer. Marca las que ya tengas y quedará ordenado lo que falta, empezando por lo que más quita de en medio en menos tiempo.',
    privacidadAviso: 'Nada de lo que marques sale de tu navegador ni se guarda en ninguna parte. Nadie tiene por qué ver tu lista.',
    areas: {
      acceso: 'Acceso a tus cuentas',
      privacidad: 'Lo que se ve de ti',
      reputacion: 'Lo que se encuentra al buscarte',
      derechos: 'Lo que la ley te reconoce',
    },
    acciones: {
      'contrasenas-distintas': 'Uso contraseñas distintas en las cuentas importantes',
      'verificacion-dos-pasos': 'Tengo activada la verificación en dos pasos donde se puede',
      'gestor-contrasenas': 'Uso un gestor de contraseñas en vez de memorizarlas o apuntarlas',
      'sesiones-abiertas': 'He revisado en qué dispositivos tengo la sesión abierta',
      'perfiles-privados': 'Sé qué perfiles tengo públicos y cuáles privados, y es lo que quiero',
      'ubicacion-desactivada': 'No comparto ubicación en tiempo real con desconocidos',
      'revisar-apps-conectadas': 'He revisado qué aplicaciones tienen acceso a mis cuentas',
      'datos-en-bio': 'En mi biografía no aparecen mi instituto, mi barrio ni mi teléfono',
      'buscarse-el-nombre': 'He buscado mi propio nombre a ver qué sale',
      'revisar-etiquetas': 'He revisado en qué fotos me han etiquetado',
      'correo-serio': 'Tengo un correo con un nombre serio para cosas de estudios o trabajo',
      'borrar-cuentas-viejas': 'He cerrado cuentas viejas que ya no uso',
      'conoce-derecho-supresion': 'Sé que puedo pedir que borren datos míos y cómo se pide',
      'sabe-denunciar': 'Sé dónde denunciar si alguien difunde algo mío sin permiso',
      'pide-permiso-fotos': 'Pido permiso antes de subir una foto en la que sale otra persona',
    },
    resumenTitulo: 'Cómo va',
    hechas: 'Hechas',
    pendientes: 'Pendientes',
    minutos: 'Minutos para ponerte al día',
    siguientesTitulo: 'Por dónde empezar',
    siguientesAyuda: 'Estas dos son las que más quitan de en medio. No hace falta hacerlo todo hoy.',
    porAreaTitulo: 'Por bloques',
    todoHecho: 'Está todo marcado. Vale la pena repetir la revisión de vez en cuando: las cuentas y las apps cambian solas.',
    minutosCorto: 'min',
    avisoTitulo: 'Dos cosas que no arregla una lista',
    aviso: 'Si alguien está difundiendo algo tuyo sin permiso o te está acosando, esto no es lo que necesitas: eso se cuenta a un adulto de confianza y se denuncia. Y el derecho al olvido existe, pero no borra internet: retira resultados de un buscador en ciertos casos, no el contenido original.',
    marcarTodo: 'Marcar todo',
    limpiar: 'Empezar de cero',
  },
  ca: {
    intro: "Això no és un test ni et puntua: és una llista de coses que es poden fer. Marca les que ja tingues i quedarà ordenat el que falta, començant pel que més lleva de damunt en menys temps.",
    privacidadAviso: 'Res del que marques no ix del teu navegador ni es guarda enlloc. Ningú no ha de vore la teua llista.',
    areas: {
      acceso: 'Accés als teus comptes',
      privacidad: 'El que es veu de tu',
      reputacion: 'El que es troba en buscar-te',
      derechos: 'El que la llei et reconeix',
    },
    acciones: {
      'contrasenas-distintas': 'Faig servir contrasenyes diferents als comptes importants',
      'verificacion-dos-pasos': 'Tinc activada la verificació en dos passos on es pot',
      'gestor-contrasenas': 'Faig servir un gestor de contrasenyes en compte de memoritzar-les o apuntar-les',
      'sesiones-abiertas': 'He revisat en quins dispositius tinc la sessió oberta',
      'perfiles-privados': 'Sé quins perfils tinc públics i quins privats, i és el que vull',
      'ubicacion-desactivada': 'No compartisc ubicació en temps real amb desconeguts',
      'revisar-apps-conectadas': 'He revisat quines aplicacions tenen accés als meus comptes',
      'datos-en-bio': 'A la meua biografia no apareixen el meu institut, el meu barri ni el meu telèfon',
      'buscarse-el-nombre': 'He buscat el meu propi nom a vore què ix',
      'revisar-etiquetas': 'He revisat en quines fotos m\'han etiquetat',
      'correo-serio': 'Tinc un correu amb un nom seriós per a coses d\'estudis o faena',
      'borrar-cuentas-viejas': 'He tancat comptes vells que ja no faig servir',
      'conoce-derecho-supresion': 'Sé que puc demanar que esborren dades meues i com es demana',
      'sabe-denunciar': 'Sé on denunciar si algú difon alguna cosa meua sense permís',
      'pide-permiso-fotos': 'Demane permís abans de pujar una foto on ix una altra persona',
    },
    resumenTitulo: 'Com va',
    hechas: 'Fetes',
    pendientes: 'Pendents',
    minutos: 'Minuts per a posar-te al dia',
    siguientesTitulo: 'Per on començar',
    siguientesAyuda: "Estes dues són les que més lleven de damunt. No cal fer-ho tot hui.",
    porAreaTitulo: 'Per blocs',
    todoHecho: 'Està tot marcat. Val la pena repetir la revisió de tant en tant: els comptes i les apps canvien sols.',
    minutosCorto: 'min',
    avisoTitulo: 'Dues coses que no arregla una llista',
    aviso: "Si algú està difonent alguna cosa teua sense permís o t'està assetjant, això no és el que necessites: això es conta a un adult de confiança i es denuncia. I el dret a l'oblit existix, però no esborra internet: retira resultats d'un cercador en certs casos, no el contingut original.",
    marcarTodo: 'Marcar tot',
    limpiar: 'Començar de zero',
  },
} as const;

interface Props { locale?: Locale }
const AREAS: Area[] = ['acceso', 'privacidad', 'reputacion', 'derechos'];

export default function HuellaDigitalCalc({ locale = 'es' }: Props) {
  const t = COPY[locale];
  const [hechas, setHechas] = useState<string[]>([]);
  const r = useMemo(() => auditar(hechas), [hechas]);

  const toggle = (id: string) =>
    setHechas((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div class="calc">
      <p class="hd__intro">{t.intro}</p>
      <div class="calc__tip calc__tip--info">{t.privacidadAviso}</div>

      <div class="calc__presets">
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setHechas(ACCIONES.map((a) => a.id))}>{t.marcarTodo}</button>
        <button type="button" class="calc__btn calc__btn--ghost" onClick={() => setHechas([])}>{t.limpiar}</button>
      </div>

      {AREAS.map((area) => (
        <div class="hd__bloque" key={area}>
          <div class="hd__label">
            {t.areas[area]}
            <span class="hd__contador">{r.porArea[area].hechas} / {r.porArea[area].total}</span>
          </div>
          <ul class="hd__lista">
            {ACCIONES.filter((a) => a.area === area).map((a) => (
              <li key={a.id}>
                <label class="hd__check">
                  <input type="checkbox" checked={hechas.includes(a.id)} onChange={() => toggle(a.id)} />
                  <span>{t.acciones[a.id as keyof typeof t.acciones]}</span>
                  {a.minutos > 0 && <span class="hd__min">{a.minutos} {t.minutosCorto}</span>}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div class="calc__results">
        <div class="hd__label">{t.resumenTitulo}</div>
        <div class="calc__metric-grid calc__metric-grid--three">
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.hechas}</span>
            <span class="calc__metric-mini-value ok">{r.hechas} / {r.total}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.pendientes}</span>
            <span class="calc__metric-mini-value">{r.pendientes.length}</span>
          </div>
          <div class="calc__metric-mini">
            <span class="calc__metric-mini-label">{t.minutos}</span>
            <span class="calc__metric-mini-value">{r.minutosPendientes} {t.minutosCorto}</span>
          </div>
        </div>

        {r.siguientes.length > 0 ? (
          <div class="hd__panel">
            <div class="hd__label">{t.siguientesTitulo}</div>
            <ol class="hd__siguientes">
              {r.siguientes.map((a) => (
                <li key={a.id}>{t.acciones[a.id as keyof typeof t.acciones]}</li>
              ))}
            </ol>
            <p class="hd__note">{t.siguientesAyuda}</p>
          </div>
        ) : (
          <div class="calc__tip calc__tip--ok">{t.todoHecho}</div>
        )}

        <div class="calc__tip calc__tip--warn">
          <strong>{t.avisoTitulo}</strong> {t.aviso}
        </div>
      </div>

      <style>{`
        .hd__intro { font-family: var(--font-sans); font-size: 0.95rem; color: var(--color-ink-soft, #5C4A3D); margin: 0 0 1rem; }
        .hd__label {
          display: flex; align-items: baseline; justify-content: space-between; gap: 1rem;
          font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-ink-mute, #8A7868); margin: 1.3rem 0 0.5rem;
        }
        .hd__contador { font-family: var(--font-mono, monospace); letter-spacing: 0; text-transform: none; }
        .hd__lista { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; }
        .hd__check {
          display: flex; align-items: flex-start; gap: 0.65rem;
          padding: 0.6rem 0.8rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 6px;
          font-family: var(--font-sans); font-size: 0.92rem;
          cursor: pointer;
        }
        .hd__check input { margin-top: 0.2rem; flex: 0 0 auto; }
        .hd__check span:first-of-type { flex: 1; }
        .hd__min {
          font-family: var(--font-mono, monospace); font-size: 0.75rem;
          color: var(--color-ink-mute, #8A7868); white-space: nowrap;
        }
        .hd__panel {
          margin-top: 1rem; padding: 1rem 1.1rem;
          background: var(--color-paper, #FFFFFF);
          border: 1px solid var(--color-line, #E5D4BD);
          border-radius: 8px;
        }
        .hd__siguientes { margin: 0.3rem 0 0; padding-left: 1.2rem; font-family: var(--font-sans); font-size: 0.95rem; }
        .hd__note { font-family: var(--font-sans); font-size: 0.87rem; color: var(--color-ink-soft, #5C4A3D); margin-top: 0.7rem; }
      `}</style>
    </div>
  );
}
