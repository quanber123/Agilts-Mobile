type SortItem = {
  [key: string]: {
    sortColumn: string;
    sortDirection: string | null;
    preview: string;
  };
};
export const sortItem: SortItem = {
  0: {
    sortColumn: 'name',
    sortDirection: 'asc',
    preview: 'Tên: A -> Z',
  },
  1: {
    sortColumn: 'name',
    sortDirection: 'desc',
    preview: 'Tên: Z -> A',
  },
  2: {
    sortColumn: 'latest',
    sortDirection: null,
    preview: 'Sản phẩm mới nhất',
  },
  3: {
    sortColumn: 'oldest',
    sortDirection: null,
    preview: 'Sản phẩm cũ',
  },
  4: {
    sortColumn: 'price',
    sortDirection: 'asc',
    preview: 'Giá từ thấp đến cao',
  },
  5: {
    sortColumn: 'price',
    sortDirection: 'desc',
    preview: 'Giá từ cao đến thấp',
  },
  6: {
    sortColumn: 'review',
    sortDirection: null,
    preview: 'Đánh giá trung bình',
  },
};
