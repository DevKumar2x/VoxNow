import { render, screen } from '@testing-library/react';
import News from './components/News';

const defaultProps = {
  category: 'general',
  country: 'us',
  pageSize: 9,
  setProgress: jest.fn(),
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders articles returned by the news API', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      status: 'ok',
      totalResults: 1,
      articles: [{
        url: 'https://example.com/story',
        title: 'A current headline',
        description: 'A short summary',
        publishedAt: '2026-10-11T10:00:00Z',
      }],
    }),
  });

  render(<News {...defaultProps} />);

  expect(await screen.findByText('A current headline')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /top headlines of general/i })).toBeInTheDocument();
  expect(global.fetch.mock.calls[0][0]).toMatch(/^\/api\/news\?/);
  expect(global.fetch.mock.calls[0][0]).not.toContain('apiKey');
});

test('shows a recoverable message when the news API rejects the request', async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 401,
    json: async () => ({ status: 'error', message: 'Invalid API key' }),
  });

  render(<News {...defaultProps} />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid API key');
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
});
