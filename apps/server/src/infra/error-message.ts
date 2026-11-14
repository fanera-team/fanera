/**
 * Текст ошибки для лога: в catch приходит unknown, а не Error.
 * У сетевых ошибок message бывает пустым (AggregateError, когда `localhost`
 * не отвечает ни по IPv4, ни по IPv6) — тогда берём code, например ECONNREFUSED.
 */
export function errorMessage(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  if (err.message) return err.message;

  const code: unknown = Reflect.get(err, 'code');
  return typeof code === 'string' ? code : err.name;
}
