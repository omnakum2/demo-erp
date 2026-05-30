import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function BaseInput({ label, error, required, id, ...props }: BaseInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>
        {label}
        {required && ' *'}
      </Label>
      <Input id={inputId} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
