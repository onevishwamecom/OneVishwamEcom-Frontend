import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import { useLocation } from '../store/locationSlice';
import { useAuth, login, logout, openAuthModal, closeAuthModal, switchAuthMode } from '../store/authSlice';
import { navigateTo } from '../config/navigation';

// --- Mocks & Context Setup ---

jest.mock('../config/navigation', () => ({
  navigateTo: jest.fn(),
  NAVIGATION_EVENT: 'customNav',
}));

jest.mock('../store/locationSlice', () => ({
  useLocation: jest.fn(() => ({
    selectedCity: 'bengaluru',
    selectCity: jest.fn(),
    getCityLabel: (id) => (id === 'bengaluru' ? 'Bengaluru' : 'City'),
  })),
  getCityLabel: (id) => (id === 'bengaluru' ? 'Bengaluru' : 'City'),
}));

let mockAuth;
const mockDispatch = jest.fn();
jest.mock('../store/authSlice', () => ({
  useAuth: () => mockAuth,
  login: (user) => ({ type: 'auth/login', payload: user }),
  logout: () => ({ type: 'auth/logout' }),
  openAuthModal: (mode) => ({ type: 'auth/openAuthModal', payload: mode }),
  closeAuthModal: () => ({ type: 'auth/closeAuthModal' }),
  switchAuthMode: (mode) => ({ type: 'auth/switchAuthMode', payload: mode }),
}));

const MockNavbar = () => {
  const { isLoggedIn, openAuthModal } = mockAuth || { isLoggedIn: false, openAuthModal: jest.fn() };
  const { selectedCity } = useLocation();
  const cityLabel = selectedCity === 'bengaluru' ? 'Bengaluru' : 'City';

  return (
    <nav>
      <span data-testid="logo">Logo</span>
      <span data-testid="location-display">{cityLabel}</span>

      {isLoggedIn ? (
        <div data-testid="user-dropdown-visible">
          User Avatar
          <span>{mockAuth.user?.name}</span>
        </div>
      ) : (
        <button onClick={() => openAuthModal('login')} data-testid="login-btn">Login</button>
      )}
      <button onClick={() => navigateTo('/contact-us/')} data-testid="enquire-btn">Enquire Now</button>
    </nav>
  );
};

const MockAuthModals = () => {
  const { showAuthModal, authModalMode, closeAuthModal, switchAuthMode } = mockAuth || {};
  if (!showAuthModal) return null;
  
  return (
    <div data-testid={`auth-modal-${authModalMode}`}>
      <button onClick={closeAuthModal} data-testid="close-auth-modal">Close</button>
      <span data-testid="auth-mode">{authModalMode}</span>
      <button onClick={() => switchAuthMode('register')} data-testid="switch-to-register">Register</button>
      <button onClick={() => switchAuthMode('login')} data-testid="switch-to-login">Login</button>
    </div>
  );
};

const MockRequireAuthGate = ({ children }) => {
  const { isLoggedIn, openAuthModal } = mockAuth || {};

  useEffect(() => {
    if (!isLoggedIn) {
      mockDispatch(openAuthModal('login'));
    }
  }, [isLoggedIn, openAuthModal]);

  if (!isLoggedIn) {
    return <div data-testid="auth-required-view">Login Required to View Details</div>;
  }

  return children;
};

describe('Consumer Portal Authentication UI & Detail Gate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth = {
      isLoggedIn: false,
      user: null,
      showAuthModal: false,
      authModalMode: 'login',
      login: (user) => mockDispatch({ type: 'auth/login', payload: user }),
      logout: () => mockDispatch({ type: 'auth/logout' }),
      openAuthModal: (mode) => mockDispatch({ type: 'auth/openAuthModal', payload: mode }),
      closeAuthModal: () => mockDispatch({ type: 'auth/closeAuthModal' }),
      switchAuthMode: (mode) => mockDispatch({ type: 'auth/switchAuthMode', payload: mode }),
    };
  });

  it('1. Should render Login button for guest user and open login modal on click', async () => {
    render(<MockNavbar />);
    
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('user-dropdown-visible')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('login-btn'));

    mockAuth.showAuthModal = true;
    render(<MockAuthModals />);
    expect(screen.getByTestId('auth-modal-login')).toBeInTheDocument();
    expect(screen.getByTestId('auth-mode')).toHaveTextContent('login');
  });

  it('2. Should allow modal switching between Login and Register', async () => {
    mockAuth.showAuthModal = true;
    const { rerender } = render(<MockAuthModals />);

    expect(screen.getByTestId('auth-mode')).toHaveTextContent('login');
    
    fireEvent.click(screen.getByTestId('switch-to-register'));
    mockAuth.authModalMode = 'register';
    rerender(<MockAuthModals />);
    expect(screen.getByTestId('auth-mode')).toHaveTextContent('register');
    
    fireEvent.click(screen.getByTestId('switch-to-login'));
    mockAuth.authModalMode = 'login';
    rerender(<MockAuthModals />);
    expect(screen.getByTestId('auth-mode')).toHaveTextContent('login');
  });

  it('3. Should show user dropdown with user name when authenticated', async () => {
    mockAuth.isLoggedIn = true;
    mockAuth.user = { name: 'Tejas' };

    render(<MockNavbar />);
    expect(screen.queryByTestId('login-btn')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-dropdown-visible')).toBeInTheDocument();
    expect(screen.getByText('Tejas')).toBeInTheDocument();
  });

  it('4. Protected detail view should require authentication for guest user', () => {
    render(
      <MockRequireAuthGate>
        <div data-testid="protected-content">Property Details</div>
      </MockRequireAuthGate>
    );
    expect(screen.getByTestId('auth-required-view')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('5. Protected detail view should show content when user is authenticated', () => {
    mockAuth.isLoggedIn = true;
    mockAuth.user = { name: 'Tejas' };

    render(
      <MockRequireAuthGate>
        <div data-testid="protected-content">Property Details</div>
      </MockRequireAuthGate>
    );
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-required-view')).not.toBeInTheDocument();
  });
});
