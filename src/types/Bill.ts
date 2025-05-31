export interface Bill {
  id: string,
  bill_owner_id: number | null,
  name: string,
  raw_image: string | null,
  created_at: string,
  updated_at: string,
  bill_data: BillData,
  bill_item: BillItem[],
  bill_member: BillMember[],
  bill_member_item: BillMemberItem[],
  bill_owner: BillOwner | null,
}

export interface BillData {
  id: number,
  bill_id: string,
  store_name: string,
  discount: number,
  misc: string,
  service: number,
  tax: number,
  sub_total: number,
  total: number,
  created_at: string,
  updated_at: string,
}

export interface BillItem {
  id?: number,
  bill_id: string,
  name: string,
  discount: number,
  price: number,
  qty: number,
  tax: number,
  service: number,
  subtotal: number,
  created_at?: string,
  updated_at?: string,
}

export interface BillMember {
  id?: number,
  bill_id: string,
  name: string,
  price_owe: number | null,
  created_at?: string,
  updated_at?: string,
}

export interface BillMemberItem {
  bill_id: string,
  bill_item_id: number,
  bill_member_id: number,
  qty: number | null,
}

export interface BillOwner {
  id?: number,
  user_id?: number,
  name: string,
  contact: string,
  bank_account: string,
  created_at?: string,
  updated_at?: string,
}
