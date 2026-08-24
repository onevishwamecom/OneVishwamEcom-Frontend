import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import * as navigation from '../../config/navigation';

jest.mock('../../config/navigation', () => ({
  navigateTo: jest.fn(),
}));

let mockIsLoggedIn = true;
const mockOpenAuthModal = jest.fn();

jest.mock('../../store/authSlice', () => ({
  useAuth: () => ({
    isLoggedIn: mockIsLoggedIn,
    openAuthModal: mockOpenAuthModal,
  }),
}));

describe('ProductCard Component', () => {
  const defaultProps = {
    title: 'Test Product',
    price: '₹10,000',
    priceSuffix: '/ month',
    location: 'Mumbai',
    pincode: '400001',
    tags: ['New', 'Sale'],
    badges: [{ label: 'Featured', className: 'bg-red-500 text-white' }],
    link: '/test-link',
    image: 'test.jpg',
    alt: 'Test Alt',
    overline: 'Electronics'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLoggedIn = true;
  });

  it('renders all product details correctly', () => {
    render(<ProductCard {...defaultProps} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₹10,000')).toBeInTheDocument();
    expect(screen.getByText('/ month')).toBeInTheDocument();
    // The location rendering splits location and pincode: {location} - {pincode}
    expect(screen.getByText('Mumbai - 400001')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Sale')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    
    const image = screen.getByAltText('Test Alt');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test.jpg');
  });

  it('calls navigateTo when clicked if logged in', () => {
    mockIsLoggedIn = true;
    render(<ProductCard {...defaultProps} />);
    
    const titleEl = screen.getByText('Test Product');
    const cardEl = titleEl.closest('.cursor-pointer');
    fireEvent.click(cardEl);
    
    expect(navigation.navigateTo).toHaveBeenCalledWith('/test-link');
  });

  it('opens login modal and stores redirect when clicked if not logged in', () => {
    mockIsLoggedIn = false;
    render(<ProductCard {...defaultProps} />);
    
    const titleEl = screen.getByText('Test Product');
    const cardEl = titleEl.closest('.cursor-pointer');
    fireEvent.click(cardEl);
    
    expect(mockOpenAuthModal).toHaveBeenCalledWith('login');
    expect(sessionStorage.getItem('vishwam_auth_redirect')).toBe('/test-link');
  });
});
