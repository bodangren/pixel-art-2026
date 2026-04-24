import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StyleFilter from './StyleFilter';

describe('StyleFilter', () => {
  it('renders all style options', () => {
    render(<StyleFilter selectedStyle="all" onStyleChange={() => {}} />);

    expect(screen.getByText('All Styles')).toBeInTheDocument();
    expect(screen.getByText('16-bit RPG')).toBeInTheDocument();
    expect(screen.getByText('Isometric')).toBeInTheDocument();
    expect(screen.getByText('Top-down Sci-fi')).toBeInTheDocument();
    expect(screen.getByText('UI Buttons')).toBeInTheDocument();
    expect(screen.getByText('Font Sheets')).toBeInTheDocument();
  });

  it('calls onStyleChange when style is clicked', () => {
    const handleChange = vi.fn();
    render(<StyleFilter selectedStyle="all" onStyleChange={handleChange} />);

    fireEvent.click(screen.getByText('16-bit RPG'));

    expect(handleChange).toHaveBeenCalledWith('rpg');
  });

  it('shows pressed state for selected style', () => {
    render(<StyleFilter selectedStyle="rpg" onStyleChange={() => {}} />);

    const rpgButton = screen.getByRole('button', { name: '16-bit RPG' });
    expect(rpgButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows not pressed state for unselected style', () => {
    render(<StyleFilter selectedStyle="all" onStyleChange={() => {}} />);

    const rpgButton = screen.getByRole('button', { name: '16-bit RPG' });
    expect(rpgButton).toHaveAttribute('aria-pressed', 'false');
  });
});