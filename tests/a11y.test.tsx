import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { configureAxe } from 'vitest-axe';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const labels: Record<string, string> = {
      skipToMain: 'Skip to main content',
    };

    return labels[key] ?? key;
  },
}));

import { SkipToMain } from '@/components/accessibility/SkipToMain';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
});

describe('Accessibility audit', () => {
  it('keeps the shared UI shell free of axe violations', async () => {
    const { container } = render(
      <div>
        <SkipToMain />
        <main id="main-content">
          <h1>Supportive health guidance</h1>
          <form aria-label="Support request">
            <Input label="Email address" hint="We will never share this." />
            <Button type="submit">Send</Button>
          </form>
        </main>
      </div>
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
