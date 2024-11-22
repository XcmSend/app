export type ActionType = "action" | "completed";

export interface Parameter {
  name: string;
  label: string;
  type?: string; // Ensure type is optional if it can be missing
  userEditable?: boolean;
  value?: string;
}
export interface Arg {
  key: string;
  type: 'u128' | 'AccountId' | 'enum' | string; 
  label: string;
  userEditable: boolean;
  options?: string[]; 
  createPresets?: boolean; 
  info?: string;
}

export interface LinkedAction {
  label: string;
  href: string;
  type?: string;
  parameters: Parameter[];
  args?: Arg[]; 
}


interface ActionError {
  message: string;
}

export interface Action<T extends ActionType> {
  id: string;
  recipient: string; // Recipient address TODO - we can be more specific here
  type: T;
  icon: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
  actionType: string;
  links: {
    actions: LinkedAction[];
  };
  error?: ActionError;
}

export interface BlinkMetadata<T extends ActionType> extends Action<T> {
  selectedUserAddress?: string;
  selectedUserAddressName?: string;
  selectedCreatorAccount?: string;
  selectedChain?: string;
}

export interface NewActionForm {
  label: string;
  amount: string;
  inputName: string;
  amountType: string; // "fixedAmount" or "inputAmount"
}
