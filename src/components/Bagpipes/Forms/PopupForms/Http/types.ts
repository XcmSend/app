export interface FormFieldOption {
    label: string;
    value: string;
    description?: string;
    showFields?: string[];
  }
  
  export interface FormField {
    key: string;
    type: 'input' | 'select' | 'radio' | 'items' | 'fileUpload';
    label: string;
    default?: string | boolean;
    options?: FormFieldOption[];
    advanced?: boolean;
    dependsOn?: string;
    hasToggle?: boolean;
  }
  
  export interface FormSection {
    title: string;
    fields: FormField[];
  }

  