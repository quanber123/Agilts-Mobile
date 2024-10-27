import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';
export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => {
    return {
      getProvinces: builder.query({
        query: (page) => ({
          url: `/api/province?page=${page}`,
          method: 'GET',
        }),
      }),
      getDistricts: builder.query({
        query: ({ provinceCode, page }) => ({
          url: `/api/district/${provinceCode}?page=${page}`,
          method: 'GET',
        }),
      }),
      getWards: builder.query({
        query: ({ districtCode, page }) => ({
          url: `/api/ward/${districtCode}?page=${page}`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } =
  countryApi;
