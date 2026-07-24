import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const labels: Record<string, string> = {
      skipToMain: 'Skip to main content',
    };

    return labels[key] ?? key;
  },
}));

import { SkipToMain } from '@/components/accessibility/SkipToMain';

describe('SkipToMain', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a skip link to the main landmark', () => {
    render(<SkipToMain />);

    const link = screen.getByRole('link', { name: 'Skip to main content' });

    expect(link).toHaveAttribute('href', '#main-content');
  });
});
