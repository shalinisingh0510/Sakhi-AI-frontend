import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HealthEmptyState } from '@/components/health/HealthEmptyState';

// Mock next-intl translations
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      comingSoon: 'Coming Soon',
      comingSoonDescription: 'We are building something special here. The Health Hub will be available in a future update.'
    };
    return translations[key] || key;
  }
}));

describe('HealthEmptyState', () => {
  it('renders correctly', () => {
    render(<HealthEmptyState />);
    
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('We are building something special here. The Health Hub will be available in a future update.')).toBeInTheDocument();
  });
  
  it('has aria-hidden icon', () => {
    const { container } = render(<HealthEmptyState />);
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });
});
