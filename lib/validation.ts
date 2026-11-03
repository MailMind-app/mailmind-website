// Validatie die zowel in formulieren (client) als in de API-routes draait.

export const EMAIL_MAX_LENGTH = 254
// Pragmatic format check; the real test is whether a reply arrives.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string) {
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email)
}
