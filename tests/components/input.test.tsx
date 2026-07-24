import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('connects the label, hint, and input description', () => {
    render(<Input label="Email address" hint="We will never share this." />);

    const input = screen.getByLabelText('Email address');

    expect(input).toHaveAttribute('aria-describedby', 'email-address-hint');
    expect(screen.getByText('We will never share this.')).toHaveAttribute('id', 'email-address-hint');
  });

  it('shows validation errors with alert semantics', () => {
    render(<Input label="Password" error="Password is required" />);

    const input = screen.getByLabelText('Password');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'password-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Password is required');
  });
});
