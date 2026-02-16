import { useState, useCallback } from 'react';
import { Loader2, Lock, Send, RotateCcw } from 'lucide-react';
import PhoneInput from '@/components/PhoneInput';
import ContextInput from '@/components/ContextInput';
import ModeToggle from '@/components/ModeToggle';
import SuccessScreen from '@/components/SuccessScreen';
import ErrorMessage from '@/components/ErrorMessage';
import { validateForm, type FormData, type FormErrors } from '@/utils/validation';
import { sendNumer } from '@/utils/api';
import { Button } from '@/components/ui/button';

/** Get user geolocation (non-blocking) */
async function getLocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null)
    );
  });
}

const initialForm: FormData = {
  fromNumber: '',
  toNumber: '',
  context: '',
  sharedContext: false,
};

const Index = () => {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const handleReset = useCallback(() => {
    setFormData(initialForm);
    setErrors({});
    setSuccess(false);
    setApiError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const location = await getLocation();
      await sendNumer({
        ...formData,
        location,
        timestamp: new Date().toISOString(),
      });
      setSuccess(true);
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to send Numer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
            Numer<span className="text-primary">.me</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Create shared context between phone numbers via WhatsApp
          </p>
        </div>

        {success ? (
          <SuccessScreen sharedContext={formData.sharedContext} onReset={handleReset} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-5">
              {apiError && <ErrorMessage message={apiError} onClose={() => setApiError(null)} />}

              <PhoneInput
                label="Your Number (From)"
                value={formData.fromNumber}
                onChange={(v) => updateField('fromNumber', v)}
                error={errors.fromNumber}
              />

              <PhoneInput
                label="Recipient Number (To)"
                value={formData.toNumber}
                onChange={(v) => updateField('toNumber', v)}
                error={errors.toNumber}
              />

              <ContextInput
                value={formData.context}
                onChange={(v) => updateField('context', v)}
                error={errors.context}
              />

              <ModeToggle
                checked={formData.sharedContext}
                onChange={(v) => updateField('sharedContext', v)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={loading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button type="submit" disabled={loading} className="flex-[2]">
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Sending...' : 'Send Numer'}
              </Button>
            </div>

            {/* Privacy notice */}
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Your data is never stored. Privacy-first design.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;
