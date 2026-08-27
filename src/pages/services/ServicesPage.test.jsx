import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ServicesPage from './index';

describe('ServicesPage Search Bar & Filtering', () => {
  it('renders search bar and category pills', () => {
    render(
      <MemoryRouter initialEntries={['/our-services']}>
        <Routes>
          <Route path="/our-services/*" element={<ServicesPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Search products or services/i)).toBeInTheDocument();
    expect(screen.getAllByText('Houses & Land').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vehicles').length).toBeGreaterThan(0);
  });

  it('filters services based on search query', () => {
    render(
      <MemoryRouter initialEntries={['/our-services']}>
        <Routes>
          <Route path="/our-services/*" element={<ServicesPage />} />
        </Routes>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search products or services/i);
    fireEvent.change(searchInput, { target: { value: 'Gold' } });

    // The card for Jewellery & Gold should be present
    expect(screen.getByRole('heading', { name: 'Jewellery & Gold' })).toBeInTheDocument();
    // The card for Houses & Land heading should not be present
    expect(screen.queryByRole('heading', { name: 'Houses & Land' })).not.toBeInTheDocument();
  });

  it('shows empty state when search query matches nothing', () => {
    render(
      <MemoryRouter initialEntries={['/our-services']}>
        <Routes>
          <Route path="/our-services/*" element={<ServicesPage />} />
        </Routes>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search products or services/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentProductQuery123' } });

    expect(screen.getByText('No products or services found')).toBeInTheDocument();
    expect(screen.getByText(/Clear Search/i)).toBeInTheDocument();
  });

  it('clears search when clear search button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/our-services']}>
        <Routes>
          <Route path="/our-services/*" element={<ServicesPage />} />
        </Routes>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search products or services/i);
    fireEvent.change(searchInput, { target: { value: 'Gold' } });
    expect(screen.queryByRole('heading', { name: 'Houses & Land' })).not.toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /Clear search/i });
    fireEvent.click(clearButton);

    expect(screen.getByRole('heading', { name: 'Houses & Land' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Jewellery & Gold' })).toBeInTheDocument();
  });
});

