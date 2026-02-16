import { Switch } from '@/components/ui/switch';
import { useId } from 'react';

interface ModeToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Toggle for shared context mode */
const ModeToggle = ({ checked, onChange }: ModeToggleProps) => {
  const id = useId();

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-label="Shared Context" />
      <div className="space-y-0.5">
        <label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          Shared Context
        </label>
        <p className="text-xs text-muted-foreground">
          When enabled, both you and the other person will receive the same WhatsApp message with the context
        </p>
      </div>
    </div>
  );
};

export default ModeToggle;
