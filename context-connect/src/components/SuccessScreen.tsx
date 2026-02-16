import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessScreenProps {
  sharedContext: boolean;
  onReset: () => void;
}

/** Full-screen success confirmation */
const SuccessScreen = ({ sharedContext, onReset }: SuccessScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 space-y-6 animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-success" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-display text-foreground">Numer Sent!</h2>
        <p className="text-muted-foreground">
          WhatsApp message{sharedContext ? 's' : ''} sent successfully
        </p>
      </div>
      <Button onClick={onReset} size="lg" className="mt-4">
        Send Another
      </Button>
    </div>
  );
};

export default SuccessScreen;
