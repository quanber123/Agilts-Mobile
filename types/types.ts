export type ParamsApi = {
  search: string | null;
  skip: boolean;
};
export type Login = {
  email: string;
  password: string;
  remember: boolean;
};
export type Register = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
export type ReestPassword = {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
};
export type ChangePassword = {
  current_password: string;
  password: string;
  password_confirmation: string;
};
export type User = {
  id: string | number;
  name: string;
  birthday: string;
  gender: 0 | 1 | 2 | any;
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
  customer_name: string;
  customer_phone_number: string;
  country: string;
  province: {
    id: number;
    ghn_id: number;
    name: string;
    name_extensions: string[];
  };
  district: {
    id: number;
    ghn_id: number;
    name: string;
    name_extensions: string[];
  };
  ward: {
    id: number;
    ghn_id: number;
    name: string;
    name_extensions: string[];
  };
  address_detail: string;
  address_preview: string;
  type: number;
  type_preview: string;
  default: boolean;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: number;
  name: string;
  image: SingleImage;
  phone_number: number | string;
  address_detail: string;
  address_preview: string;
  country: string;
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
export type SingleImage = {
  url: string;
  alt: string;
  isLarger?: boolean;
  loading?: boolean;
};
export type ProductOption = {
  color: string;
  created_at: string;
  id: number;
  images_preview: SingleImage[];
  price_preview: {
    raw: number;
    preview: string;
  };
  value_added_tax: number;
  product_id: string | number;
  quantity: number;
  sku: string;
  specifications: [
    {
      key: string;
      value: string;
    }
  ];
  status_preview: string;
  type_preview: string;
  updated_at: string;
  version: string | null;
  volume?: string | number | null;
  width?: string | number | null;
  weight?: string | number | null;
  length?: string | number | null;
  height?: string | number | null;
};
export type Product = {
  type_preview: string;
  id: number;
  name: string;
  search_url: string;
  description: string;
  must_direct_purchase: boolean;
  manufacturer: string;
  options_min_price: {
    raw: number;
    preview: string;
  };
  options_max_price: {
    raw: number;
    preview: string;
  };
  images_preview: SingleImage[];
  videos_preview: [
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
  reviews_avg_rate: string;
  reviews_count: number | string;
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
  seo: {
    id: number;
    title_preview: string;
    description: string;
    image_preview: string;
    author: any;
    robots: any;
    created_at: string;
    updated_at: string;
  };
  cross_sell: Product[];
  upsell: Product[];
  related_products: Product[];
};
export type ProductDetails = Product & {
  seo: {
    id: number;
    title: string;
    description: string;
    image: string;
    author: string | null;
    robots: [
      {
        key: string;
        value: number;
      }
    ];
    created_at: string;
    updated_at: string;
  };
};

export type Review = {
  id: number | string;
  content: string;
  created_at: string;
  images_preview: SingleImage[];
  rate: number;
  reply: {
    id: number;
    content: string;
    created_at: string;
    images_preview: SingleImage[] | [];
    employee: {
      name: string;
    };
    updated_at: string;
  } | null;
  option: {
    id: number;
    sku: string;
    price_preview: {
      raw: number;
      preview: string;
    };
    value_added_tax_preview: {
      raw: number;
      preview: string;
    };
    images_preview: SingleImage[] | [];
    color: string;
    version: string;
    volume: null;
    type_preview: string;
    status_preview: string;
    quantity: number;
    weight: null;
    length: null;
    width: null;
    height: null;
    specifications: {
      title: string;
      description: string;
    }[];
    product: {
      id: number;
      search_url: string;
      name: string;
      description: string;
      images_preview: SingleImage[] | [];
      videos_preview: {
        video: {
          provider: string;
          id: string;
          title: string;
          image: {
            url: string;
            alt: string;
          };
          url: string;
        };
      }[];
      published: boolean;
      visibility_preview: string;
      type_preview: string;
      manufacturer: string;
      specifications: {
        title: string;
        description: string;
      }[];
      categories: {
        id: number;
        search_url: string;
        name: string;
        description: null;
        image_preview: null;
      }[];
      deleted_at: string;
      created_at: string;
      updated_at: string;
    };
    deleted_at: string;
    created_at: string;
    updated_at: string;
  };
  customer: {
    name: string;
  };
  updated_at: string;
};

export type Cart = {
  id: number;
  amount: number;
  option: {
    id: number;
    sku: string;
    price_preview: {
      raw: number;
      preview: string;
    };
    value_added_tax_preview: {
      raw: number;
      preview: string;
    };
    images_preview: SingleImage[];
    color: string;
    version: string;
    volume: number | null;
    type_preview: string;
    status_preview: string;
    quantity: number;
    weight: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    specifications: [
      {
        title: string;
        description: string;
      }
    ];
    product: Product;
    deleted_at: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
};
export type Wishlist = {
  id: number;
  option: {
    id: number;
    sku: string;
    price_preview: {
      raw: number;
      preview: string;
    };
    value_added_tax_preview: {
      raw: number;
      preview: string;
    };
    images_preview: SingleImage[];
    color: string;
    version: string;
    volume: number | null;
    type_preview: string;
    status_preview: string;
    quantity: number;
    weight: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    specifications: [
      {
        title: string;
        description: string;
      }
    ];
    product: Product;
    deleted_at: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
};

export type BannerPage = {
  id: number;
  key: string;
  name: string;
  value:
    | [
        {
          image: SingleImage;
          subtitle: string;
          title: string;
          description: string;
          page_name: string;
          banner_description: string;
          actions: {
            title: string;
            link: string;
          };
        }
      ]
    | boolean
    | number;
};
export type FooterTime = {
  title: string;
  description: string;
};
export type FooterBranch = {
  name: string;
  phone_number: string;
  image: SingleImage | null;
  address: {
    country: string;
    province: string;
    district: string;
    ward: string;
    address_detail: string;
    address_preview: string;
  };
};
export type FooterService = {
  title: string;
  link: string;
};

export type Order = {
  id: number;
  shipping_fee_preview?: {
    raw: number;
    preview: string;
  };
  shipping_method_preview?: string;
  shipping_code?: string;
  payment_method_preview: string;
  payment_checkout_url: string;
  motorcycle_registration_support: boolean;
  registration_option_preview: string;
  license_plate_registration_option_preview: string;
  status_preview: string;
  price_preview: {
    raw: number;
    preview: string;
  };
  value_added_tax_preview: {
    raw: number;
    preview: number;
  };
  motorcycle_registration_support_fee_preview: {
    raw: number;
    preview: number;
  };
  registration_fee_preview: {
    raw: number;
    preview: string;
  };
  license_plate_registration_fee_preview: {
    raw: number;
    preview: string;
  };
  tax_preview: {
    raw: number;
    preview: string;
  };
  handling_fee_preview: {
    raw: number;
    preview: string;
  };
  total_preview: {
    raw: number;
    preview: string;
  };
  note: string | null;
  amount: number;
  option: {
    id: number;
    sku: string;
    price_preview: {
      raw: number;
      preview: string;
    };
    value_added_tax_preview: {
      raw: number;
      preview: string;
    };
    images_preview: SingleImage[];
    color: string;
    version: string;
    volume: string | number | null;
    type_preview: string;
    status_preview: string;
    quantity: number;
    weight: string | null;
    length: string | null;
    width: string | null;
    height: string | null;
    specifications: [
      {
        title: string;
        description: string;
      }
    ];
    product: {
      id: number;
      search_url: string;
      name: string;
      description: string;
      images_preview: SingleImage[];
      videos_preview: [
        {
          video: {
            provider: string;
            id: string;
            title: string;
            image: {
              url: string;
              alt: string;
            };
            url: string;
          };
        }
      ];
      published: true;
      visibility_preview: string;
      type_preview: string;
      manufacturer: string;
      specifications: [
        {
          title: string;
          description: string;
        }
      ];
      categories: [
        {
          id: number;
          search_url: string;
          name: string;
          description: null;
          image_preview: null;
          deleted_at: string;
          created_at: string;
          updated_at: string;
          pivot: {
            product_id: number;
            category_id: number;
          };
        }
      ];
      deleted_at: string;
      created_at: string;
      updated_at: string;
    };
    deleted_at: string;
    created_at: string;
    updated_at: string;
  };
  options: [
    {
      id: number;
      price_preview: {
        raw: number;
        preview: string;
      };
      value_added_tax_preview: {
        raw: number;
        preview: string;
      };
      amount: number;
      option: {
        id: number;
        sku: string;
        price_preview: {
          raw: number;
          preview: string;
        };
        value_added_tax_preview: {
          raw: number;
          preview: string;
        };
        images_preview: SingleImage[];
        color: string;
        version: string;
        volume: string | number | null;
        type_preview: string;
        status_preview: string;
        quantity: number;
        weight: string | null;
        length: string | null;
        width: string | null;
        height: string | null;
        specifications: [
          {
            title: string;
            description: string;
          }
        ];
        product: {
          id: number;
          search_url: string;
          name: string;
          description: string;
          images_preview: SingleImage[];
          videos_preview: [
            {
              video: {
                provider: string;
                id: string;
                title: string;
                image: {
                  url: string;
                  alt: string;
                };
                url: string;
              };
            }
          ];
          published: true;
          visibility_preview: string;
          type_preview: string;
          manufacturer: string;
          specifications: [
            {
              title: string;
              description: string;
            }
          ];
          categories: [
            {
              id: number;
              search_url: string;
              name: string;
              description: null;
              image_preview: null;
              deleted_at: string;
              created_at: string;
              updated_at: string;
              pivot: {
                product_id: number;
                category_id: number;
              };
            }
          ];
          deleted_at: string;
          created_at: string;
          updated_at: string;
        };
        deleted_at: string;
        created_at: string;
        updated_at: string;
      };
    }
  ];
  address: Address;
  identification: Document;
  transactions: [
    {
      id: number;
      status_preview: string;
      reference: number;
      amount_preview: {
        raw: number;
        preview: string;
      };
      created_at: string;
      updated_at: string;
    }
  ];
  created_at: string;
  updated_at: string;
};
