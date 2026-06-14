const API_BASE = '/ecotour/backend/api/';

/**
 * Thin fetch wrapper for the PHP backend. Auth uses the PHP session cookie,
 * which the browser sends automatically on same-origin requests.
 * Throws Error with a readable message (and .status when the server replied).
 */
async function request(endpoint, method = 'GET', data = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) options.body = JSON.stringify(data);

  let res;
  try {
    res = await fetch(API_BASE + endpoint, options);
  } catch {
    throw new Error('Cannot reach the server. Please check your connection.');
  }

  let result;
  try {
    result = await res.json();
  } catch {
    throw new Error(`Unexpected server response (HTTP ${res.status})`);
  }

  if (!result.success) {
    const err = new Error(result.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return result;
}

const API = {
  // Tours
  getTours: () => request('get_tours.php'),
  getTour: (id) => request('get_tour.php?id=' + encodeURIComponent(id)),

  // Operators
  getOperators: () => request('get_operators.php'),

  // Stats & fund tracker
  getStats: () => request('get_stats.php'),
  getFundStats: () => request('get_fund_stats.php'),
  getLedger: () => request('get_ledger.php'),

  // Bookings (require an active session)
  createBooking: (data) => request('create_booking.php', 'POST', data),
  getBookings: () => request('get_bookings.php'),

  // Auth
  login: (email, password) => request('login.php', 'POST', { email, password }),
  register: (data) => request('register.php', 'POST', data),
  logout: () => request('logout.php', 'POST'),
  getSession: () => request('session.php'),

  // Admin (require an admin session)
  getPendingOperators: () => request('get_pending_operators.php'),
  verifyOperator: (id, action) => request('verify_operator.php', 'POST', { id, action }),
};

export default API;
export { API_BASE };
