import { Branch } from '@/types/types';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useGetProvincesQuery } from '@/services/redux/query/countryQuery';

type CTX = {
  provinces: any[] | [];
  hasMoreProvince: boolean;
  loadMoreProvince: () => void;
  isLoadingProvince: boolean;
};

export const ProvinceContext = createContext({} as CTX);

export const ProvinceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [provinces, setProvinces] = useState<Branch[] | []>([]);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { data, isFetching, isSuccess } = useGetProvincesQuery(
    `page=${curPage}`
  );
  const loadMoreProvince = useCallback(() => {
    if (hasMore && !isFetching && isSuccess) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching, isSuccess]);
  useEffect(() => {
    if (!isFetching && isSuccess && data && hasMore) {
      if (data?.data?.length === 0) {
        setProvinces((prevBranches) => [...prevBranches]);
      } else {
        setProvinces((prevBranches) => [...prevBranches, ...data?.data]);
      }
      if (curPage + 1 > data?.total_pages) {
        setHasMore(false);
      }
    }
  }, [isFetching, isSuccess, data, hasMore]);
  const contextValue = {
    provinces,
    isLoadingProvince: isFetching,
    loadMoreProvince,
    hasMoreProvince: hasMore,
  };
  return (
    <ProvinceContext.Provider value={contextValue}>
      {children}
    </ProvinceContext.Provider>
  );
};
