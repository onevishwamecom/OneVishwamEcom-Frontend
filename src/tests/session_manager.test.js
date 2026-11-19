import {
  SESSION_DURATION_MS,
  STORAGE_KEYS,
  startSession,
  isSessionActive,
  getActiveSessionUser,
  clearSession,
} from '../utils/sessionManager';

describe('24-Hour Trusted Session Manager', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('1. Should return false when no user is stored', () => {
    expect(isSessionActive()).toBe(false);
    expect(getActiveSessionUser()).toBeNull();
  });

  it('2. Should anchor 24-hour expiration upon startSession', () => {
    const mockUser = { id: 'u1', name: 'Test User', email: 'test@vishwam.com' };
    const fakeNow = 1700000000000;
    jest.spyOn(Date, 'now').mockReturnValue(fakeNow);

    startSession(mockUser, 'mock_token_123');

    expect(localStorage.getItem(STORAGE_KEYS.USER)).toBe(JSON.stringify(mockUser));
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('mock_token_123');
    expect(localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT)).toBe(String(fakeNow + SESSION_DURATION_MS));
    expect(isSessionActive()).toBe(true);
    expect(getActiveSessionUser()).toEqual(mockUser);
  });

  it('3. Should keep session active when user returns within 24 hours (e.g. after 23 hours)', () => {
    const mockUser = { id: 'u1', name: 'Test User' };
    const loginTime = 1700000000000;
    jest.spyOn(Date, 'now').mockReturnValue(loginTime);

    startSession(mockUser, 'token');

    // Simulate 23 hours later (within 24h)
    const twentyThreeHoursLater = loginTime + 23 * 60 * 60 * 1000;
    jest.spyOn(Date, 'now').mockReturnValue(twentyThreeHoursLater);

    expect(isSessionActive()).toBe(true);
    expect(getActiveSessionUser()).toEqual(mockUser);
  });

  it('4. Should expire session and clean storage when 24 hours have elapsed', () => {
    const mockUser = { id: 'u1', name: 'Test User' };
    const loginTime = 1700000000000;
    jest.spyOn(Date, 'now').mockReturnValue(loginTime);

    startSession(mockUser, 'token');

    // Simulate 24 hours and 1 minute later
    const expiredTime = loginTime + (24 * 60 * 60 * 1000) + 60000;
    jest.spyOn(Date, 'now').mockReturnValue(expiredTime);

    expect(isSessionActive()).toBe(false);
    expect(getActiveSessionUser()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT)).toBeNull();
  });

  it('5. Should immediately clear all session keys on clearSession (logout)', () => {
    const mockUser = { id: 'u1', name: 'Test User' };
    startSession(mockUser, 'token');

    clearSession();

    expect(isSessionActive()).toBe(false);
    expect(getActiveSessionUser()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES_AT)).toBeNull();
  });
});
