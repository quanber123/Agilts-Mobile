import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_COUNTRY as string,
  }),
  endpoints: (builder) => {
    return {
      getProvinces: builder.query({
        query: () => ({
          url: `/1/0.htm`,
          method: 'GET',
        }),
      }),
      getDistricts: builder.query({
        query: (provinceCode) => ({
          url: `/2/${provinceCode}.htm`,
          method: 'GET',
        }),
      }),
      getWards: builder.query({
        query: (districtCode) => ({
          url: `/3/${districtCode}.htm`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } =
  countryApi;
