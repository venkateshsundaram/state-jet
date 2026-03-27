export interface ProductType {
  name: string;
  price: number;
}

export interface CartType extends ProductType {
  count: number;
}
