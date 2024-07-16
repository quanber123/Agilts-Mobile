import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BACKEND_URL as string,
  }),
  tagTypes: ['users'],
  endpoints: (builder) => {
    return {
      getCSRFCookie: builder.mutation({
        query: () => ({
          url: `/sanctum/csrf-cookie`,
          method: 'GET',
        }),
      }),
      getUser: builder.query({
        query: () => ({
          url: `/api/user`,
          method: 'GET',
        }),
        providesTags: ['users'],
      }),
      login: builder.mutation({
        query: (body) => ({
          url: `/login`,
          method: 'POST',
          data: body,
        }),
      }),
      register: builder.mutation({
        query: (body) => ({
          url: `/register`,
          method: 'POST',
          data: body,
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          url: `/logout`,
          method: 'POST',
        }),
        invalidatesTags: ['users'],
      }),
    };
  },
});

export const {
  useGetCSRFCookieMutation,
  useGetUserQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} = appApi;
