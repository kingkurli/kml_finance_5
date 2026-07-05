export interface LoanApplication {
  name: string;
  age: number;
  contactNo: string;
  occupation: 'Salary' | 'Business';
  loanType: 'Personal' | 'Business' | 'Housing' | 'Education';
  income: number;
  enquiredDate: string;
}

export interface UserAuth {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ConsultationApplication {
  name: string;
  phone: string;
  service: string;
  city: string;
  enquiredDate: string;
}

