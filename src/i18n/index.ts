import type { Lang } from './routes';
import type { UI } from './types';
import { tr } from './tr';
import { ka } from './ka';

export type { Lang, UI };
export { LOCALES, KA_NOINDEX, KA_ROUTES, KA_SERVICE_ROUTES, KA_SERVICE_SLUGS, alternates, switcherTarget, langOfPath, serviceHref } from './routes';

const DICT: Record<Lang, UI> = { tr, ka };
export const getT = (lang: Lang = 'tr'): UI => DICT[lang] ?? tr;
