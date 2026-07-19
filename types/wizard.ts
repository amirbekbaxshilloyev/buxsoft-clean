export type WizardStep = 1 | 2 | 3 | 4 | 5;

export type WizardFormData = {
  name: string;
  phoneDigits: string;
  groupId: string;
  categoryId: string;
  tariffId: string;
  serviceIds: string[];
  comment: string;
  tgSubscribed: boolean;
};

export type PersistedWizardState = {
  step: WizardStep;
  form: WizardFormData;
  leadStarted: boolean;
};
