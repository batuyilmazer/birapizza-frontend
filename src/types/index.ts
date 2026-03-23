export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface Pizza extends MenuItem {
  toppings: string[];
}

export interface Drink extends MenuItem {
  volume: string;
}
