/**
 * In-memory state tracking intro playback during SPA client navigation.
 *
 * Behavior:
 * - Resets to `false` on every hard page reload (F5 / browser refresh) or direct URL entry.
 * - Stays `true` during Next.js internal client transitions (<Link>).
 */
let hasIntroPlayedInClientSession = false;

export function getHasIntroPlayed(): boolean {
  return hasIntroPlayedInClientSession;
}

export function setHasIntroPlayed(value: boolean): void {
  hasIntroPlayedInClientSession = value;
}
