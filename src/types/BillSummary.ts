export interface BillSummary {
  bill_id: string;
  name: string;
  members: BillSummaryMember[];
  contact: BillSummaryContact;
}

export interface BillSummaryContact {
  name: string;
  contact: string;
  bank_account: string;
}

export interface BillSummaryMember {
  name: string;
  price_owe: number;
  items: BillSummaryItem[];
}

export interface BillSummaryItem {
  name: string;
  price: number;
  qty: number;
  discount: number;
  tax: number;
  service: number;
  total: number;
}
