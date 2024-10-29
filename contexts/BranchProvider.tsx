import { Branch } from '@/types/types';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useGetBranchesQuery } from '@/services/redux/query/appQuery';

type CTX = {
  branches: Branch[] | [];
  hasMoreBranch: boolean;
  loadMoreBranch: () => void;
  isLoadingBranch: boolean;
};

export const BranchContext = createContext({} as CTX);

export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const [branches, setBranches] = useState<Branch[] | []>([]);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { data, isFetching, isSuccess } = useGetBranchesQuery(
    `page=${curPage}`
  );
  const loadMoreBranch = useCallback(() => {
    if (hasMore && !isFetching && isSuccess) {
      setCurPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isFetching, isSuccess]);
  useEffect(() => {
    if (!isFetching && isSuccess && data && hasMore) {
      if (data?.data?.length === 0) {
        setBranches((prevBranches) => [...prevBranches]);
      } else {
        setBranches((prevBranches) => [...prevBranches, ...data?.data]);
      }
      if (curPage + 1 > data?.total_pages) {
        setHasMore(false);
      }
    }
  }, [isFetching, isSuccess, data, hasMore]);
  const contextValue = {
    branches,
    isLoadingBranch: isFetching,
    loadMoreBranch,
    hasMoreBranch: hasMore,
  };
  return (
    <BranchContext.Provider value={contextValue}>
      {children}
    </BranchContext.Provider>
  );
};
