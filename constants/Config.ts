export const defaultCountry = 'Việt Nam';
export const defaultTimezone = 'Asia/Ho_Chi_Minh';
export const documentsType = [
  {
    code: 0,
    label: 'Chứng minh nhân dân',
  },
  {
    code: 1,
    label: 'Căn cước công dân',
  },
  {
    code: 2,
    label: 'Hộ chiếu',
  },
];

export const registration_options = [
  {
    label: 'Lần đầu (5%)',
    value: 0,
  },
  {
    label: 'Lần 2 trở đi (1%)',
    value: 1,
  },
];

export const license_plate_registration_option = [
  {
    label:
      'Khu vực I (Thành phố Hà Nội, Thành phố Hồ Chí Minh bao gồm tất cả các quận, huyện trực thuộc thành phố không phân biệt nội thành hay ngoại thành)',
    value: 0,
  },
  {
    label:
      'Khu vực II (Thành phố trực thuộc Trung ương (trừ Thành phố Hà Nội, Thành phố Hồ Chí Minh) bao gồm tất cả các quận,huyện trực thuộc thành phố không phân biệt nội thành hay ngoại thành; thành phố trực thuộc tỉnh, thị xã bao gồm tất cả các phường, xã thuộc thành phố, thị xã không phân biệt phường nội thành, nội thị hay xã ngoại thành, ngoại thị)',
    value: 1,
  },
  {
    label: 'Khu vực III (Các khu vực khác ngoài khu vực I và khu vực II)',
    value: 2,
  },
];
export const statusOrder = [
  {
    label: 'Chờ thanh toán',
    value: 0,
    color: '#eab308',
  },
  {
    label: 'Chờ vận chuyển',
    value: 1,
    color: '#06b6d4',
  },
  {
    label: 'Chờ nhận hàng',
    value: 2,
    color: '#3b82f6',
  },
  {
    label: 'Đã nhận hàng',
    value: 3,
    color: '#22c55e',
  },
  {
    label: 'Hủy',
    value: 4,
    color: '#ef4444',
  },
  {
    label: 'Trả hàng/Hoàn tiền',
    value: 5,
    color: '#f97316',
  },
];
