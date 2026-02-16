import { useState, useMemo } from 'react';
import Input from 'react-phone-number-input/input';
import { getCountries, getCountryCallingCode, Country } from 'react-phone-number-input';
import { ChevronDown } from 'lucide-react';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

type CountryOption = {
  country: Country;
  code: string;
  name: string;
};

const CustomPhoneInput = ({ label, value, onChange, placeholder = 'Enter phone number', error }: PhoneInputProps) => {
  // Get localized country names
  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(['en'], { type: 'region' });
    } catch (e) {
      // Fallback if Intl is not supported (unlikely in modern browsers)
      return {
        of: (code: string) => code,
      };
    }
  }, []);

  // Get all supported countries
  const countryOptions = useMemo(() => {
    const countries = getCountries();

    const options = countries.map((country) => {
      const code = getCountryCallingCode(country);
      const name = regionNames.of(country) || country;
      return { country, code, name };
    });

    // Sort alphabetically by country name
    return options.sort((a, b) => a.name.localeCompare(b.name));
  }, [regionNames]);

  // Default to US unless user specifically wants something else.
  const [country, setCountry] = useState<Country>('IN');

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        className={`
          flex items-center rounded-lg border bg-card transition-all duration-200
          focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent
          ${error ? 'border-destructive focus-within:ring-destructive' : ''}
          ${!error ? 'border-input' : ''}
        `}
      >
        {/* Country Code Select */}
        <div className="relative flex items-center h-full border-r border-border bg-muted/50 rounded-l-lg px-3 hover:bg-muted/70 transition-colors">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as Country)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            aria-label="Select Country Code"
          >
            {countryOptions.map((opt) => (
              <option key={opt.country} value={opt.country}>
                {opt.name} +{opt.code}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium text-foreground flex items-center gap-1.5 min-w-[3rem]">
            +{getCountryCallingCode(country)}
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
          </span>
        </div>

        {/* Phone Input */}
        <Input
          country={country}
          value={value}
          onChange={(v) => onChange(v || '')}
          placeholder={placeholder}
          className="flex w-full px-4 py-2.5 bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomPhoneInput;
