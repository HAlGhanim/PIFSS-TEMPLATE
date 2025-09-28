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
    phoneExample: '+965 9999-9999',
    flagSvg: `<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#00a651"/>
      <rect y="200" width="900" height="200" fill="#fff"/>
      <rect y="400" width="900" height="200" fill="#ce1126"/>
      <path d="M0 0l300 300L0 600z" fill="#000"/>
    </svg>`,
  },
  {
    code: 'SA',
    arabicName: 'المملكة العربية السعودية',
    englishName: 'Saudi Arabia',
    phoneCode: '+966',
    phoneFormat: '+966 5X XXX-XXXX',
    phoneLength: 9,
    phoneRegex: /^(\+966|00966)?5\d{8}$/,
    phoneExample: '+966 50 123-4567',
    flagSvg: `<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#006c35"/>
      <g transform="translate(180,170)" fill="#fff">
        <path d="M0 0h120v40h40v-40h40v40h40v-40h40v120h-40v40h40v40h-40v40h40v120h-280v-320z"/>
        <path d="M320 80c0-44.183 35.817-80 80-80s80 35.817 80 80-35.817 80-80 80-80-35.817-80-80zm20 0c0 33.137 26.863 60 60 60s60-26.863 60-60-26.863-60-60-60-60 26.863-60 60z"/>
      </g>
    </svg>`,
  },
  {
    code: 'AE',
    arabicName: 'الإمارات العربية المتحدة',
    englishName: 'United Arab Emirates',
    phoneCode: '+971',
    phoneFormat: '+971 5X XXX-XXXX',
    phoneLength: 9,
    phoneRegex: /^(\+971|00971)?5\d{8}$/,
    phoneExample: '+971 50 123-4567',
    flagSvg: `<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#00732f"/>
      <rect y="200" width="900" height="200" fill="#fff"/>
      <rect y="400" width="900" height="200" fill="#000"/>
      <rect width="300" height="600" fill="#ff0000"/>
    </svg>`,
  },
  {
    code: 'QA',
    arabicName: 'قطر',
    englishName: 'Qatar',
    phoneCode: '+974',
    phoneFormat: '+974 XXXX-XXXX',
    phoneLength: 8,
    phoneRegex: /^(\+974|00974)?[3-7]\d{7}$/,
    phoneExample: '+974 5555-5555',
    flagSvg: `<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#8d1b3d"/>
      <path d="M0 0v600l250-50-50-25 50-25-50-25 50-25-50-25 50-25-50-25 50-25-50-25 50-25-50-25 50-25-50-25 50-25-50-25 50-25-50-25 50-25-50-25 50-25-50-25 50-25-50-25z" fill="#fff"/>
    </svg>`,
  },
  {
    code: 'BH',
    arabicName: 'البحرين',
    englishName: 'Bahrain',
    phoneCode: '+973',
    phoneFormat: '+973 XXXX-XXXX',
    phoneLength: 8,
    phoneRegex: /^(\+973|00973)?[3-6]\d{7}$/,
    phoneExample: '+973 3333-3333',
    flagSvg: `<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#ce1126"/>
      <path d="M225 0l75 60-75 60 75 60-75 60 75 60-75 60 75 60-75 60 75 60-75 60v-600z" fill="#fff"/>
    </svg>`,
  },
  {
    code: 'OM',
    arabicName: 'عُمان',
    englishName: 'Oman',
    phoneCode: '+968',
    phoneFormat: '+968 XXXX-XXXX',
    phoneLength: 8,
    phoneRegex: /^(\+968|00968)?[79]\d{7}$/,
    phoneExample: '+968 9999-9999',
    flagSvg: `<svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#fff"/>
      <rect y="200" width="900" height="200" fill="#ef2229"/>
      <rect y="400" width="900" height="200" fill="#009025"/>
      <rect width="300" height="600" fill="#ef2229"/>
      <g transform="translate(150,100)" fill="#fff">
        <path d="M0 0l20 60L80 60l-50 40 20 60L0 120l-50 40 20-60-50-40h60z"/>
        <path d="M-60 0v20h140v-20z"/>
        <path d="M10-60v140h-20v-140z"/>
      </g>
    </svg>`,
  },
];
