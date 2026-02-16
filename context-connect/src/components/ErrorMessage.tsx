import { AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

/** Dismissible error banner with auto-dismiss */
const ErrorMessage = ({ message, onClose }: ErrorMessageProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      role="alert"
      className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive animate-in slide-in-from-top-2 duration-300"
    >
      <AlertCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      <button onClick={onClose} className="shrink-0 hover:opacity-70 transition-opacity" aria-label="Dismiss error">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ErrorMessage;
