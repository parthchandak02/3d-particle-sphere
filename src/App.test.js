import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/SplineScene', () => {
  return function MockSplineScene() {
    return <div data-testid="spline-scene">Spline Scene</div>;
  };
});

test('renders live data dashboard shell', () => {
  render(<App />);
  expect(screen.getByText(/Particle Core Observatory/i)).toBeInTheDocument();
  expect(screen.getByText(/Real-time cross-origin capture/i)).toBeInTheDocument();
  expect(screen.getByTestId('spline-scene')).toBeInTheDocument();
});
