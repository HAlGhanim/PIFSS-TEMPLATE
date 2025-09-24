export interface NavigationLink {
  label: string;
  path: string;
  icon?: string;
  badge?: string | number;
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children?: NavigationLink[];
  permissions?: string[];
  disabled?: boolean;
}

export interface UserInfo {
  name: string;
  email: string;
  initials?: string;
  avatar?: string;
}
