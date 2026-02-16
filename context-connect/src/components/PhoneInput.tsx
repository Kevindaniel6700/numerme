import { useId } from 'react';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

/** Phone number input with E.164 validation feedback */
const PhoneInput = ({ label, value, onChange, placeholder = '+1234567890', error }: PhoneInputProps) => {
  const id = useId();
  const hasValue = value.trim().length > 0;
  const isValid = hasValue && !error;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full px-4 py-2.5 rounded-lg border text-foreground bg-card
          outline-none transition-all duration-200
          placeholder:text-muted-foreground
          focus:ring-2 focus:ring-ring focus:border-transparent
          ${error ? 'border-destructive focus:ring-destructive' : ''}
          ${isValid ? 'border-success' : ''}
          ${!error && !isValid ? 'border-input' : ''}
        `}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
