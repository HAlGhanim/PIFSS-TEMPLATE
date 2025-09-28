import { GCC_COUNTRIES, GCCCountry } from '../interfaces';

// Helper function to get country by code
export function getCountryByCode(code: string): GCCCountry | undefined {
  return GCC_COUNTRIES.find((country) => country.code === code);
}

// Helper function to get country by phone code
export function getCountryByPhoneCode(
  phoneCode: string
): GCCCountry | undefined {
  return GCC_COUNTRIES.find(
    (country) =>
      phoneCode.startsWith(country.phoneCode) ||
      phoneCode.startsWith(country.phoneCode.replace('+', '00'))
  );
}

// Helper function to format phone number
export function formatGCCPhone(
  phoneNumber: string,
  countryCode: string
): string {
  const country = getCountryByCode(countryCode);
  if (!country) return phoneNumber;

  // Remove country code and any non-digits
  let cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.startsWith(country.phoneCode.substring(1))) {
    cleaned = cleaned.substring(country.phoneCode.length - 1);
  }

  // Format based on country
  switch (countryCode) {
    case 'KW':
    case 'QA':
    case 'BH':
    case 'OM':
      // Format as XXXX-XXXX
      if (cleaned.length === 8) {
        return `${country.phoneCode} ${cleaned.substring(
          0,
          4
        )}-${cleaned.substring(4)}`;
      }
      break;
    case 'SA':
    case 'AE':
      // Format as 5X XXX-XXXX
      if (cleaned.length === 9) {
        return `${country.phoneCode} ${cleaned.substring(
          0,
          2
        )} ${cleaned.substring(2, 5)}-${cleaned.substring(5)}`;
      }
      break;
  }

  return phoneNumber;
}

// Validate phone number for a specific country
export function validateGCCPhone(
  phoneNumber: string,
  countryCode: string
): boolean {
  const country = getCountryByCode(countryCode);
  if (!country) return false;

  // Clean the number
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

  return country.phoneRegex.test(cleaned);
}
