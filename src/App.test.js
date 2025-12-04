import { render, screen } from '@testing-library/react';
import App from './App';

test('renders EduConnect app', () => {
  render(<App />);
  const linkElements = screen.getAllByText(/EduConnect/i);
  expect(linkElements.length).toBeGreaterThan(0);
});
