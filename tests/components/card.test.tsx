import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '@/components/ui/Card';

describe('Card', () => {
  it('applies padding and glass styling variants', () => {
    render(
      <Card padding="lg" glass className="custom-card">
        Calm support
      </Card>
    );

    const card = screen.getByText('Calm support');

    expect(card).toHaveClass('p-8');
    expect(card).toHaveClass('bg-white/70');
    expect(card).toHaveClass('backdrop-blur-sm');
    expect(card).toHaveClass('custom-card');
  });
});
