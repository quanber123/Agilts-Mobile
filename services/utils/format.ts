export const formatQueryToString = (
  params: Partial<URLSearchParams>,
  remove_key: string,
  list_remove_key?: string[]
) => {
  return Object.entries(params)
    .map(([key, value]) => ({
      key,
      value,
    }))
    .filter((q) => q.key !== remove_key)
    .filter((q) => {
      if (list_remove_key) {
        return !list_remove_key.includes(q.key);
      } else {
        q;
      }
    })
    .reduce((acc, currentValue, currentIndex) => {
      return currentIndex === 0
        ? `${currentValue.key}=${currentValue.value}`
        : `${acc}&${currentValue.key}=${currentValue.value}`;
    }, '');
};

export const formatPrice = (str: string | number) => {
  return str.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};
