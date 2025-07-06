// Common API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// Entity types will be added here as needed

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// Navigation Types
export interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

export interface DropdownItem {
  label: string;
  href: string;
  children?: DropdownItem[];
}

export interface NavigationState {
  activeDropdown: string | null;
  isLoading: boolean;
}

// Feature Types
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}
