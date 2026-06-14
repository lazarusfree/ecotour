import { describe, it, expect } from 'vitest';
import {
  DEFAULT_LEVY_PCT,
  levyPct,
  roundMoney,
  priceBreakdown,
  buildCartItem,
  cartTotals,
  formatRM,
  todayISO,
  defaultBookingDate,
} from './booking';

describe('levyPct', () => {
  it('sums fund allocation percentages', () => {
    expect(levyPct([
      { allocation_pct: '15.00' },
      { allocation_pct: '10.00' },
      { allocation_pct: '5.00' },
    ])).toBe(30);
  });

  it('handles per-tour allocations that are not 30%', () => {
    expect(levyPct([{ allocation_pct: '12.00' }, { allocation_pct: '8.00' }])).toBe(20);
  });

  it('falls back to the default when funds are missing', () => {
    expect(levyPct(undefined)).toBe(DEFAULT_LEVY_PCT);
    expect(levyPct([])).toBe(DEFAULT_LEVY_PCT);
  });
});

describe('roundMoney', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundMoney(3.3335)).toBe(3.33);
    expect(roundMoney(1.005)).toBe(1.01);
  });
});

describe('priceBreakdown', () => {
  it('matches the server math for the Orangutan Canopy Trek', () => {
    // RM280 x 2 with 30% allocations => 560 + 168 = 728
    expect(priceBreakdown(280, 2, 30)).toEqual({ subtotal: 560, levy: 168, total: 728 });
  });

  it('uses the real per-tour percentage, not a flat 30%', () => {
    // Village Stay: RM195 x 2 at 20% => 390 + 78 = 468
    expect(priceBreakdown(195, 2, 20)).toEqual({ subtotal: 390, levy: 78, total: 468 });
  });

  it('accepts string prices as returned by the API (DECIMAL columns)', () => {
    expect(priceBreakdown('90.00', 1, 15)).toEqual({ subtotal: 90, levy: 13.5, total: 103.5 });
  });
});

describe('buildCartItem', () => {
  const tour = {
    tour_id: 2,
    title: 'Orang Asli Village Stay',
    location: 'Taman Negara',
    business_name: 'Taman Negara Eco Adventures',
    price: '195.00',
    funds: [{ allocation_pct: '12.00' }, { allocation_pct: '8.00' }],
  };

  it('snapshots the levy percentage from the tour funds', () => {
    const item = buildCartItem(tour, '2026-07-15', 2);
    expect(item.levy_pct).toBe(20);
    expect(item.levy).toBe(78);
    expect(item.total).toBe(468);
  });
});

describe('cartTotals', () => {
  it('sums subtotal, levy, and total across items', () => {
    const cart = [
      { subtotal: 560, levy: 168 },
      { subtotal: 390, levy: 78 },
    ];
    expect(cartTotals(cart)).toEqual({ subtotal: 950, levy: 246, total: 1196 });
  });

  it('returns zeros for an empty cart', () => {
    expect(cartTotals([])).toEqual({ subtotal: 0, levy: 0, total: 0 });
  });
});

describe('formatRM', () => {
  it('formats with two decimals', () => {
    expect(formatRM(728)).toBe('RM 728.00');
    expect(formatRM('13.5')).toBe('RM 13.50');
  });
});

describe('dates', () => {
  it('todayISO returns the local calendar date', () => {
    expect(todayISO(new Date(2026, 5, 13, 23, 30))).toBe('2026-06-13');
  });

  it('defaultBookingDate is 30 days ahead', () => {
    expect(defaultBookingDate(new Date(2026, 5, 13))).toBe('2026-07-13');
  });
});
