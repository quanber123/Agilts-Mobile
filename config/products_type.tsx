// config.ts
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const productsType = [
  {
    key: 'motor-cycle',
    value: 'Xe máy',
    icon: <FontAwesome6 name='motorcycle' size={24} color='#262626' />,
  },
  {
    key: 'square-parts',
    value: 'Phụ tùng',
    icon: <FontAwesome5 name='tools' size={24} color='#262626' />,
  },
  {
    key: 'accessories',
    value: 'Phụ kiện',
    icon: <MaterialCommunityIcons name='toolbox' size={24} color='#262626' />,
  },
];

export const listTypes = [
  {
    key: '0',
    value: 'Sản phẩm mới',
  },
  {
    key: '1',
    value: 'Sản phẩm cũ',
  },
  {
    key: '2',
    value: 'Sản phẩm tân trang',
  },
];
