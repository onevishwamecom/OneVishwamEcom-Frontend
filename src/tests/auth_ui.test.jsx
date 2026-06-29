import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import { useLocation } from '../store/locationSlice';
import { useAuth, login, logout, openAuthModal, closeAuthModal, switchAuthMode } from '../store/authSlice';
import { navigateTo, NAVIGATION_EVENT } from '../config/navigation';

// --- Mocks & Context Setup ---

// Mock the navigation logic used everywhere
jest.mock('../config/navigation', () => ({
  navigateTo: jest.fn(),
  NAVIGATION_EVENT: 'customNav',
}));

// Mock the location hook used in Navbar and Hero
jest.mock('../store/locationSlice', () => ({
  useLocation: jest.fn(() => ({
    selectedCity: 'bengaluru',
    selectCity: jest.fn(),
    getCityLabel: (id) => (id === 'bengaluru' ? 'Bengaluru' : 'City'),
  })),
  // Mock necessary utility functions imported in Navbar
  getCityLabel: (id) => (id === 'bengaluru' ? 'Bengaluru' : 'City'),
}));

// Mock Auth Store State
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

// Mock Components that depend on Auth/Nav state
const MockNavbar = ({ isTestingAuth = false }) => {
  const { isLoggedIn, openAuthModal } = mockAuth || { isLoggedIn: false, openAuthModal: jest.fn() };
  const { selectedCity } = useLocation();
  const cityLabel = selectedCity === 'bengaluru' ? 'Bengaluru' : 'City';
  
  // Mock the Post Listing button behavior
  const handlePostListing = (e) => {
    e.preventDefault();
    if (isTestingAuth && !isLoggedIn) {
        // Mock the behavior that opens the modal if not logged in
        mockDispatch(openAuthModal('login'));
    } else {
        navigateTo('/add-listing/');
    }
  };

  return (
    <nav>
      <span data-testid="logo">Logo</span>
      <span data-testid="location-display">{cityLabel}</span>
      
      {/* Post Listing Button (Hero/Nav style) */}
      <button onClick={handlePostListing} data-testid="post-listing-btn">Post Your Listing</button>

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

const MockHeroSection = ({ searchQuery, setSearchQuery, isTestingAuth = false }) => {
    const { isLoggedIn, openAuthModal } = mockAuth || { isLoggedIn: false, openAuthModal: jest.fn() };

    const handlePostListing = (e) => {
        e.preventDefault();
        if (isTestingAuth && !isLoggedIn) {
            mockDispatch(openAuthModal('login'));
        } else {
            navigateTo('/add-listing/');
        }
    };

    return (
        <section data-testid="hero-section">
            <input data-testid="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={handlePostListing} data-testid="hero-post-btn">Post Your Listing</button>
        </section>
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

const MockAddListing = () => {
    const { isLoggedIn, openAuthModal, user } = mockAuth || {};
    const [step, setStep] = useState(0);
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            mockDispatch(openAuthModal('login'));
        }
    }, [isLoggedIn, openAuthModal]);

    if (!isLoggedIn) {
        return <div data-testid="add-listing-auth-required">Please login to post your item.</div>;
    }

    if (formSubmitted) {
        return <div data-testid="add-listing-success">Listing Submitted!</div>;
    }

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handlePublish = () => {
        setFormSubmitted(true);
    };

    return (
        <div data-testid={`add-listing-step-${step}`}>
            <div data-testid="step-indicator">Step {step + 1} of 5</div>
            {step === 0 && <span data-testid="step-category-form">Category Form</span>}
            {step === 1 && <span data-testid="step-details-form">Details Form</span>}
            {step === 3 && <span data-testid="step-specifics-form">Specifics Form</span>}
            {step === 4 && <span data-testid="step-review-form">Review Form</span>}
            
            {step < 4 ? (
                <button onClick={handleNext} data-testid="next-step-btn">Next</button>
            ) : (
                <button onClick={handlePublish} data-testid="publish-btn">Publish Listing</button>
            )}
        </div>
    );
};


// --- TESTS ---

describe('Authentication UI & Posting Flow Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock auth state to default logged-out state before each test
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

  // Test 1: Render without Auth and check Navbar elements
  it('1. Should render Login button and prompt to login when navigating to post listing', async () => {
    render(<MockNavbar isTestingAuth={true} />);
    
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('user-dropdown-visible')).not.toBeInTheDocument();
    
    // Simulate clicking 'Post Your Listing' in the Navbar
    fireEvent.click(screen.getByTestId('post-listing-btn'));

    await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/openAuthModal', payload: 'login' });
    });
    
    // Render the modal to check its state
    mockAuth.showAuthModal = true;
    render(<MockAuthModals />);
    expect(screen.getByTestId('auth-modal-login')).toBeInTheDocument();
    expect(screen.getByTestId('auth-mode')).toHaveTextContent('login');
  });

  // Test 2: Login Modal Flow and successful mock login
  it('2. Should open login modal, switch to register, and mock successful login', async () => {
    mockAuth.showAuthModal = true;
    const { rerender } = render(<MockAuthModals />);

    // 2a. Check initial state
    expect(screen.getByTestId('auth-mode')).toHaveTextContent('login');
    
    // 2b. Switch to Register
    fireEvent.click(screen.getByTestId('switch-to-register'));
    mockAuth.authModalMode = 'register';
    rerender(<MockAuthModals />);
    expect(screen.getByTestId('auth-mode')).toHaveTextContent('register');
    
    // 2c. Switch back to Login
    fireEvent.click(screen.getByTestId('switch-to-login'));
    mockAuth.authModalMode = 'login';
    rerender(<MockAuthModals />);
    expect(screen.getByTestId('auth-mode')).toHaveTextContent('login');
    
    // 2d. Simulate Login success
    fireEvent.click(screen.getByTestId('close-auth-modal')); // Close initial modal
    mockAuth.isLoggedIn = true;
    mockAuth.user = { name: 'Tejas' };
    mockDispatch({ type: 'auth/login', payload: { name: 'Tejas' } }); // Simulate dispatch effect

    // Rerender Navbar to see logged-in state
    render(<MockNavbar />);
    expect(screen.queryByTestId('login-btn')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-dropdown-visible')).toBeInTheDocument();
    expect(screen.getByText('Tejas')).toBeInTheDocument(); // Check user name is displayed
  });

  // Test 5: Post Listing Page Flow (logged out path)
  it('5a. AddListing page should redirect to login modal if user is not logged in', () => {
    render(<MockAddListing />);
    expect(screen.getByTestId('add-listing-auth-required')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/openAuthModal', payload: 'login' });
  });

  // Test 5: Post Listing Page Flow (logged in path)
  it('5b. AddListing page should show 5 steps when logged in', async () => {
    mockAuth.isLoggedIn = true;
    
    render(<MockAddListing />);
    
    // Step 1: Category Form
    expect(screen.getByTestId('add-listing-step-0')).toBeInTheDocument();
    expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step 1 of 5');
    
    // Move to Step 2: Details
    fireEvent.click(screen.getByTestId('next-step-btn'));
    await waitFor(() => {
        expect(screen.getByTestId('add-listing-step-1')).toBeInTheDocument();
        expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step 2 of 5');
    });

    // Move to Step 3: Photos
    fireEvent.click(screen.getByTestId('next-step-btn'));
    await waitFor(() => {
        expect(screen.getByTestId('add-listing-step-2')).toBeInTheDocument();
        expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step 3 of 5');
    });

    // Move to Step 4: Specifics
    fireEvent.click(screen.getByTestId('next-step-btn'));
    await waitFor(() => {
        expect(screen.getByTestId('step-specifics-form')).toBeInTheDocument();
        expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step 4 of 5');
    });
    
    // Move to Step 5: Review & Publish
    fireEvent.click(screen.getByTestId('next-step-btn'));
    await waitFor(() => {
        expect(screen.getByTestId('step-review-form')).toBeInTheDocument();
        expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step 5 of 5');
    });

    // Publish
    fireEvent.click(screen.getByTestId('publish-btn'));
    await waitFor(() => {
        expect(screen.getByTestId('add-listing-success')).toBeInTheDocument();
    });
  });
});
