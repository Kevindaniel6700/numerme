import { useId } from 'react';

interface ContextInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** Textarea for context with character count */
const ContextInput = ({ value, onChange, error }: ContextInputProps) => {
  const id = useId();
  const maxLength = 500;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        Where &amp; How You Met
      </label>
      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder="e.g., Met at Starbucks on Main Street, discussed React project"
        aria-invalid={!!error}
        aria-describedby={`${id}-helper`}
        className={`
          w-full px-4 py-2.5 rounded-lg border text-foreground bg-card resize-none
          outline-none transition-all duration-200
          placeholder:text-muted-foreground
          focus:ring-2 focus:ring-ring focus:border-transparent
          ${error ? 'border-destructive focus:ring-destructive' : 'border-input'}
        `}
      />
      <div className="flex justify-between items-center">
        <p id={`${id}-helper`} className="text-xs text-muted-foreground">
          {error ? (
            <span className="text-destructive" role="alert">{error}</span>
          ) : (
            'This context will be sent via WhatsApp to help you both remember'
          )}
        </p>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default ContextInput;
