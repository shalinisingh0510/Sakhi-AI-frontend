import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders the label and can stretch full width', () => {
    render(<Button fullWidth>Continue</Button>);

    const button = screen.getByRole('button', { name: 'Continue' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-full');
  });

  it('shows a loading state and disables interaction', () => {
    render(<Button isLoading>Save</Button>);

    const button = screen.getByRole('button', { name: /loading/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveTextContent(/loading/i);
  });
});
