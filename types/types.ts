import { ReactElement } from 'react';

export type User = {
  id: string | number;
  name: string;
  birthday: string;
  gender: 0 | 1 | 2;
  gender_preview: string;
  email: string;
  email_verified_at: string;
  phone_number: string;
  phone_number_verified_at: string;
  two_factor_confirmed_at: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  two_factor?: boolean;
};

export type Address = {
  id: number;
  country: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  address_preview: string;
  type: number;
  type_preview: string;
  default: boolean;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: number | string;
  name: string;
  phone_number: number | string;
  address: Address;
  deleted_at: string;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: number;
  type: number;
  type_preview: string;
  number: number;
  issued_name: string;
  issuance_date: string;
  expiry_date: string;
  default: boolean;
  customer_id: number;
  created_at: string;
  updated_at: string;
};

export type Social = {
  [key: string]: {
    name: string;
    element: ReactElement;
  };
};
export type SocialProvider = {
  id: number;
  customer_id: number;
  provider_id: number;
  provider_name: string;
  created_at: string;
  updated_at: string;
};
type KeyObject = {
  [key: string]: string;
};
export type ProductFilter = {
  name: string;
  label: string;
  data: string | number | KeyObject;
};
export type ProductOption = {
  color: string;
  created_at: string;
  id: number | string;
  images: string[];
  price: string;
  price_preview: string;
  product_id: string | number;
  quantity: number;
  sku: string;
  specifications: [
    {
      key: string;
      value: string;
    }
  ];
  status: string;
  type: string;
  updated_at: string;
  version: string;
  weight: string | null;
};
export type Product = {
  id: number;
  name: string;
  description: string;
  min_price: {
    raw: number;
    preview: string;
  };
  max_price: {
    raw: number;
    preview: string;
  };
  images: [
    {
      image: string;
      alt: string;
    }
  ];
  videos: [
    {
      image: string;
      title: string;
      description: string;
      video: {
        provider: string;
        id: string;
        url: string;
      };
    }
  ];
  options: ProductOption[];
  categories: [
    {
      id: number;
      name: string;
      pivot: {
        product_id: number;
        category_id: number;
      };
      deleted_at: string;
      created_at: string;
      updated_at: string;
    }
  ];
  enabled: boolean;
  visibility: string;
  type: string;
  status: string;
  specifications: [
    {
      key: string;
      value: string;
    }
  ];
  deleted_at: string;
  created_at: string;
  updated_at: string;
};
