export interface IconConfig {
  path: string;
  viewBox?: string;
  fillRule?: 'evenodd' | 'nonzero';
  clipRule?: 'evenodd' | 'nonzero';
}
export type LogoVariant = 'default' | 'horizontal' | 'vertical';

export interface LogoConfig {
  viewBox: string;
  width?: number;
  height?: number;
  polygons?: string[];
  paths?: Array<{ d: string; class?: string }>;
}
