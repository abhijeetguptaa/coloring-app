import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Coloring Books header', () => {
  render(<App />);
  const headerElement = screen.getByText(/AI Coloring Books/i);
  expect(headerElement).toBeInTheDocument();
});
