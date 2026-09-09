'use client';

export interface SnapPriceUser {
  id: string;
  name: string;
  email: string;
  role: 'hunter' | 'arbitrageur' | 'developer';
  createdAt: string;
}

const SESSION_KEY = 'snapprice_active_session';
const USERS_KEY = 'snapprice_registered_users';

// Default seeded demo account
export const DEMO_USER: SnapPriceUser = {
  id: 'demo-user-001',
  name: 'Alex Vance',
  email: 'pro_hunter@SnapPrice',
  role: 'arbitrageur',
  createdAt: new Date().toISOString()
};

export const DEMO_PASSWORD = 'CyberSync2026!';

interface StoredAccount extends SnapPriceUser {
  passwordHash: string;
}

// Helper to safely get stored users
function getStoredAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      // Seed with demo account
      const initial: StoredAccount[] = [
        {
          ...DEMO_USER,
          passwordHash: DEMO_PASSWORD
        }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Register a new user
export function registerUser(
  name: string,
  email: string,
  password: string,
  role: 'hunter' | 'arbitrageur' | 'developer' = 'hunter'
): { success: boolean; error?: string; user?: SnapPriceUser } {
  if (typeof window === 'undefined') return { success: false, error: 'Window not available' };

  const accounts = getStoredAccounts();
  const normalizedEmail = email.trim().toLowerCase();

  // Check if account already exists
  if (accounts.some((a) => a.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newAccount: StoredAccount = {
    id: 'user-' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    role,
    createdAt: new Date().toISOString(),
    passwordHash: password
  };

  accounts.push(newAccount);
  localStorage.setItem(USERS_KEY, JSON.stringify(accounts));

  const { passwordHash: _, ...publicUser } = newAccount;
  return { success: true, user: publicUser };
}

// Log in user
export function loginUser(
  email: string,
  password: string
): { success: boolean; error?: string; user?: SnapPriceUser } {
  if (typeof window === 'undefined') return { success: false, error: 'Window not available' };

  const accounts = getStoredAccounts();
  const normalizedEmail = email.trim().toLowerCase();

  // Check demo credentials directly
  if (normalizedEmail === DEMO_USER.email.toLowerCase() && password === DEMO_PASSWORD) {
    const user = { ...DEMO_USER };
    setStoredSession(user);
    return { success: true, user };
  }

  // Check registered accounts
  const match = accounts.find(
    (a) => a.email.toLowerCase() === normalizedEmail && a.passwordHash === password
  );

  if (!match) {
    return { success: false, error: 'Invalid email or password. Please verify your credentials or register.' };
  }

  const { passwordHash: _, ...publicUser } = match;
  setStoredSession(publicUser);
  return { success: true, user: publicUser };
}

// Save active session
export function setStoredSession(user: SnapPriceUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('snapprice_auth_change'));
}

// Get active session
export function getCurrentUser(): SnapPriceUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Check if authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Log out user
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('snapprice_auth_change'));
}
