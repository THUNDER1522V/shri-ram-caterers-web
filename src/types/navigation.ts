export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  description?: string;
}

export interface NavigationConfig {
  mainNav: NavItem[];
  footerNav: {
    title: string;
    items: NavItem[];
  }[];
}
