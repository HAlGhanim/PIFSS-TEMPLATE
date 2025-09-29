export interface GCCCountry {
  code: string; // ISO country code
  arabicName: string;
  englishName: string;
  phoneCode: string; // International dialing code
  phoneFormat: string; // Display format
  phoneLength: number; // Number of digits after country code
  phoneRegex: RegExp; // Validation regex
  phoneExample: string; // Example for placeholder
  flagSvg: string; // SVG flag as string
}

export const GCC_COUNTRIES: GCCCountry[] = [
  {
    code: 'KW',
    arabicName: 'الكويت',
    englishName: 'Kuwait',
    phoneCode: '+965',
    phoneFormat: '+965 XXXX-XXXX',
    phoneLength: 8,
    phoneRegex: /^(\+965|00965)?[569]\d{7}$/,
    phoneExample: '9999-9999',
    flagSvg: `../../../assets/SVG/gcc-flags/kuwait_flag.svg`,
  },
  {
    code: 'SA',
    arabicName: 'السعودية',
    englishName: 'Saudi Arabia',
    phoneCode: '+966',
    phoneFormat: '+966 5X XXX-XXXX',
    phoneLength: 9,
    phoneRegex: /^(\+966|00966)?\d{9}$/,
    phoneExample: '50 123-4567',
    flagSvg: `../../../assets/SVG/gcc-flags/ksa_flag.svg`,
  },
  {
    code: 'AE',
    arabicName: 'الإمارات',
    englishName: 'United Arab Emirates',
    phoneCode: '+971',
    phoneFormat: '+971 5X XXX-XXXX',
    phoneLength: 9,
    phoneRegex: /^(\+971|00971)?[0-9]{7,9}$/,
    phoneExample: '50 123-4567',
    flagSvg: `../../../assets/SVG/gcc-flags/uae_flag.svg`,
  },
  {
    code: 'QA',
    arabicName: 'قطر',
    englishName: 'Qatar',
    phoneCode: '+974',
    phoneFormat: '+974 XXXX-XXXX',
    phoneLength: 8,
    phoneRegex: /^(\+974|00974)?\d{8}$/,
    phoneExample: '5555-5555',
    flagSvg: `../../../assets/SVG/gcc-flags/qatar_flag.svg`,
  },
  {
    code: 'BH',
    arabicName: 'البحرين',
    englishName: 'Bahrain',
    phoneCode: '+973',
    phoneFormat: '+973 XXXX-XXXX',
    phoneLength: 8,
    phoneRegex: /^(\+973|00973)?\d{8}$/,
    phoneExample: '3333-3333',
    flagSvg: `../../../assets/SVG/gcc-flags/bahrain_flag.svg`,
  },
  {
    code: 'OM',
    arabicName: 'عُمان',
    englishName: 'Oman',
    phoneCode: '+968',
    phoneFormat: '+968 XXXX-XXXX',
    phoneLength: 8,
    phoneRegex: /^(\+968|00968)?\d{8}$/,
    phoneExample: '9999-9999',
    flagSvg: `../../../assets/SVG/gcc-flags/oman_flag.svg`,
  },
];
