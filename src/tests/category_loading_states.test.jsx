import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock lottie-react before components import it
jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-lottie" />,
  Lottie: () => <div data-testid="mock-lottie" />,
  useLottie: () => ({ View: <div data-testid="mock-lottie" /> }),
}));

// Mock cacheService and matchEvents to prevent import.meta issues in Jest
jest.mock('../services/cache/cacheService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    fetch: jest.fn(),
    isFresh: jest.fn(),
  },
  PUBLIC_NAMESPACE: 'public',
  CACHE_TTL: { products: 1000 },
  deterministicKey: (v) => JSON.stringify(v || {}),
}));

jest.mock('../utils/matchEvents', () => ({
  signalHomepageRefresh: jest.fn(),
}));

// Mock LottieFeedbackAnimation
jest.mock('../components/common/LottieFeedbackAnimation', () => () => (
  <div data-testid="lottie-empty-anim" />
));

// Mock useLocation from store
jest.mock('../store/locationSlice', () => ({
  useLocation: () => ({
    selectedCity: 'all',
    selectCity: jest.fn(),
  }),
}));

// Mock useAuth from authSlice
jest.mock('../store/authSlice', () => ({
  useAuth: () => ({
    isLoggedIn: false,
    user: null,
  }),
}));

import MarketplaceCategoryGallery from '../components/common/templates/MarketplaceCategoryGallery';
import UniversalCategoryGallery from '../components/common/templates/UniversalCategoryGallery';

describe('Category Gallery Loading and Empty States', () => {
  test('MarketplaceCategoryGallery displays skeleton loaders and NOT empty state when loading is true', () => {
    const { container } = render(
      <MemoryRouter>
        <MarketplaceCategoryGallery
          items={[]}
          loading={true}
          categoryTitle="Test Category"
        />
      </MemoryRouter>
    );

    // Empty state should NOT be rendered
    expect(screen.queryByText(/No matching listings found/i)).toBeNull();
    expect(screen.queryByTestId('lottie-empty-anim')).toBeNull();

    // Pulse skeleton elements should be rendered
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  });

  test('MarketplaceCategoryGallery displays empty state when loading is false and items array is empty', () => {
    render(
      <MemoryRouter>
        <MarketplaceCategoryGallery
          items={[]}
          loading={false}
          categoryTitle="Test Category"
        />
      </MemoryRouter>
    );

    // Empty state should be visible
    expect(screen.getByText(/No matching listings found/i)).toBeInTheDocument();
    expect(screen.getByTestId('lottie-empty-anim')).toBeInTheDocument();
  });

  test('MarketplaceCategoryGallery renders items when loading is false and items exist', () => {
    const mockItems = [
      { id: '1', title: 'Luxury Villa 1', price: '₹1.5 Cr', location: 'Whitefield' },
      { id: '2', title: 'Luxury Villa 2', price: '₹2.1 Cr', location: 'Indiranagar' },
    ];

    render(
      <MemoryRouter>
        <MarketplaceCategoryGallery
          items={mockItems}
          loading={false}
          categoryTitle="Test Category"
        />
      </MemoryRouter>
    );

    expect(screen.queryByText(/No matching listings found/i)).toBeNull();
    expect(screen.getByText('Luxury Villa 1')).toBeInTheDocument();
    expect(screen.getByText('Luxury Villa 2')).toBeInTheDocument();
  });

  test('UniversalCategoryGallery forwards loading state from useItems hook so empty state never flashes during fetch', () => {
    const mockHookLoading = () => ({
      items: [],
      loading: true,
      error: null,
    });

    const { container } = render(
      <MemoryRouter>
        <UniversalCategoryGallery
          useItems={mockHookLoading}
          categoryTitle="Test Category"
        />
      </MemoryRouter>
    );

    // While hook loading is true, empty state must NOT show
    expect(screen.queryByText(/No matching listings found/i)).toBeNull();
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThan(0);
  });
});
