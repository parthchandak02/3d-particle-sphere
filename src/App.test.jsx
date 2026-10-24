import { render } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('@splinetool/react-spline', () => ({
  default: ({ scene }) => <div data-testid="spline" data-scene={scene} />,
}));

test('renders the Spline scene full-screen', () => {
  const { getByTestId } = render(<App />);
  const spline = getByTestId('spline');
  expect(spline.dataset.scene).toMatch(/^https:\/\/prod\.spline\.design\/.+\/scene\.splinecode$/);
  expect(spline.parentElement).toHaveStyle({ width: '100vw', height: '100vh' });
});
