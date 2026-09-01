import { CURRENCY, CURRENCY_LOCALE } from "./constants";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency: CURRENCY,
  }).format(cents / 100);
}
