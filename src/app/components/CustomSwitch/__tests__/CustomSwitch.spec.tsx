import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomSwitch from '../CustomSwitch';

describe('CustomSwitch', () => {
  it('renders switch', () => {
    render(<CustomSwitch checked={false} onChange={() => {}} label="Test Switch" />);
    const switchElement = screen.getByText('Test Switch');
    expect(switchElement).toBeVisible();
  });

  it('disables switch when disabled prop is true', () => {
    const onChange = jest.fn();
    render(<CustomSwitch checked={false} onChange={onChange} label="Disabled Switch" disabled />);

    const switchElement = screen.getByText('Disabled Switch');
    const switchInput = screen.getByRole('switch');

    fireEvent.click(switchElement);
    expect(onChange).not.toHaveBeenCalled();
    expect(switchInput).toBeDisabled();
  });

  it('renders switch with label and calls onChange when clicked', () => {
    const onChange = jest.fn();
    render(<CustomSwitch checked={false} onChange={onChange} label="Test Switch" />);

    const switchInput = screen.getByRole('switch');
    expect(switchInput).toBeInTheDocument();
    expect(screen.getByText('Test Switch')).toBeInTheDocument();

    fireEvent.click(switchInput);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
