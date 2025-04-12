
export type BureauType = 'Normalized Evaluation' |'CIBIL' | 'Experian' | 'Equifax';

export interface Loan {
  amount: number;
  bank: string;
  timePeriod: number; // in months
}

export interface Default {
  bank: string;
  count: number;
}

export interface MissedPayment {
  bank: string;
  count: number;
}

export interface CreditReport {
  bureau: BureauType;
  panNumber: string;
  username: string;
  creditScore: number;
  scoreRange: {
    min: number;
    max: number;
  };
  lastUpdated: string;
  currentLoans: Loan[];
  defaults: Default[];
  settledLoans: Loan[];
  missedPayments: MissedPayment[];
}

export interface CreditState {
  selectedBureau: BureauType;
  reports: Record<BureauType, CreditReport>;
}
