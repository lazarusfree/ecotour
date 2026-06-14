// Pure pricing helpers shared by the booking UI.
//
// The conservation levy is NOT a flat 30%: each tour pays into one or more
// funds (tour_fund table) and the levy is the sum of those allocations.
// The server is authoritative; these helpers mirror its math so the cart
// preview matches what will actually be charged.

/** Used only when a tour's fund allocations have not been loaded yet. */
export const DEFAULT_LEVY_PCT = 30;

/** Sums a tour's fund allocation percentages (e.g. 15 + 10 + 5 = 30). */
export function levyPct(funds) {
  if (!Array.isArray(funds) || funds.length === 0) return DEFAULT_LEVY_PCT;
  return funds.reduce((sum, f) => sum + Number(f.allocation_pct || 0), 0);
}

/** Rounds to 2 decimal places, avoiding float drift (e.g. 1.005 -> 1.01). */
export function roundMoney(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Price breakdown for one tour booking. All amounts rounded to 2dp. */
export function priceBreakdown(price, participants, pct) {
  const subtotal = roundMoney(Number(price) * participants);
  const levy = roundMoney(subtotal * (pct / 100));
  return { subtotal, levy, total: roundMoney(subtotal + levy) };
}

/** Builds the cart line item stored in localStorage. */
export function buildCartItem(tour, date, participants) {
  const pct = levyPct(tour.funds);
  const { subtotal, levy, total } = priceBreakdown(tour.price, participants, pct);
  return {
    tour_id: tour.tour_id,
    title: tour.title,
    location: tour.location,
    operator: tour.business_name,
    date,
    participants,
    price: tour.price,
    levy_pct: pct,
    subtotal,
    levy,
    total,
  };
}

/** Totals across the whole cart. */
export function cartTotals(cart) {
  const subtotal = roundMoney(cart.reduce((s, i) => s + i.subtotal, 0));
  const levy = roundMoney(cart.reduce((s, i) => s + i.levy, 0));
  return { subtotal, levy, total: roundMoney(subtotal + levy) };
}

/** Formats a number as Malaysian Ringgit text, e.g. "RM 728.00". */
export function formatRM(n) {
  return 'RM ' + Number(n).toFixed(2);
}

/** Today's date as YYYY-MM-DD (local time) — used as the date input minimum. */
export function todayISO(now = new Date()) {
  const tz = now.getTimezoneOffset() * 60000;
  return new Date(now - tz).toISOString().slice(0, 10);
}

/** Default booking date: 30 days from now. */
export function defaultBookingDate(now = new Date()) {
  const d = new Date(now);
  d.setDate(d.getDate() + 30);
  return todayISO(d);
}
