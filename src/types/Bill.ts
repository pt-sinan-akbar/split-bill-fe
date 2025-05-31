export interface Bill {
  id: string,
  name: string,
  raw_image: string | null,
  data: BillData,
  items: BillItem[],
  members: BillMember[],
  items_members: BillItemMember[],
  owner: BillOwner | null,
}

export interface BillData {
  id: number,
  store_name: string,
  discount: number,
  misc: string,
  service: number,
  tax: number,
  sub_total: number,
  total: number,
}

export interface BillItem {
  id: number,
  name: string,
  discount: number,
  price: number,
  qty: number,
  tax: number,
  service: number,
  subtotal: number,
}

export interface BillMember {
  id: number,
  name: string,
}

export interface BillItemMember {
  id: number,
  item_id: number,
  member_id: number,
  qty: number | null,
}

export interface BillOwner {
  id?: number,
  name: string,
  contact: string,
  pay_to: string,
}
