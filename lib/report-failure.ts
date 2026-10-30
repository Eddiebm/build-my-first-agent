/**
 * For work that shouldn't stop the request when it fails (an email, releasing
 * a phone number) but must never fail silently: a lead notification that
 * doesn't arrive, or a phone number that keeps billing, has to show up in the
 * logs.
 *
 *   sendEmail(...).catch(reportFailure("lead notification email"))
 */
export function reportFailure(what: string) {
  return (error: unknown) => {
    console.error(`[failed] ${what}`, error);
  };
}
