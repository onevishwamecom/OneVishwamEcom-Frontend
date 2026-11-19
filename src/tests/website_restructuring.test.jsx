import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import WelcomeGateway from '../components/welcome/WelcomeGateway';

// Mock logo
jest.mock('../assets/logo.png', () => 'logo.png');

describe('Website Restructuring: WelcomeGateway & Pre-Website Flow', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('1. WelcomeGateway renders company profile, CEO message, 4 pillars, and Explore CTA', () => {
    const onEnterMock = jest.fn();

    render(
      <MemoryRouter>
        <WelcomeGateway onEnter={onEnterMock} />
      </MemoryRouter>
    );

    // Header & Brand title
    expect(screen.getAllByText(/Welcome to/i).length).toBeGreaterThan(0);
    expect(screen.getByText('OneVishwam')).toBeInTheDocument();

    // Leadership section
    expect(screen.getByText(/Building a Complete Ecosystem for Capital & Commodity/i)).toBeInTheDocument();
    expect(screen.getByText(/Message from the CEO/i)).toBeInTheDocument();

    // Four core pillars
    expect(screen.getByText('Co-Operative Finance')).toBeInTheDocument();
    expect(screen.getByText('Value-Driven Investments')).toBeInTheDocument();
    expect(screen.getByText('Customer-First Approach')).toBeInTheDocument();
    expect(screen.getByText('Direct From Manufacturer')).toBeInTheDocument();

    // Explore CTA buttons exist
    const visitButtons = screen.getAllByRole('button', { name: /Explore/i });
    expect(visitButtons.length).toBeGreaterThan(0);
  });

  test('2. Clicking Explore sets vishwam_entered_shop in sessionStorage and invokes onEnter', () => {
    const onEnterMock = jest.fn();

    render(
      <MemoryRouter>
        <WelcomeGateway onEnter={onEnterMock} />
      </MemoryRouter>
    );

    const visitButtons = screen.getAllByRole('button', { name: /Explore/i });
    fireEvent.click(visitButtons[0]);

    expect(sessionStorage.getItem('vishwam_entered_shop')).toBe('true');
    expect(onEnterMock).toHaveBeenCalledTimes(1);
  });

  test('3. Bottom action banner has Explore / Enter Marketplace button that sets session', () => {
    const onEnterMock = jest.fn();

    render(
      <MemoryRouter>
        <WelcomeGateway onEnter={onEnterMock} />
      </MemoryRouter>
    );

    const enterBtn = screen.getByRole('button', { name: /Enter the Marketplace/i });
    fireEvent.click(enterBtn);

    expect(sessionStorage.getItem('vishwam_entered_shop')).toBe('true');
    expect(onEnterMock).toHaveBeenCalledTimes(1);
  });
});
