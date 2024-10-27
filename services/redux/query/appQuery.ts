import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['address', 'document', 'wishlist', 'cart'],
  endpoints: (builder) => {
    return {
      getCSRFCookie: builder.mutation({
        query: () => ({
          url: `/sanctum/csrf-cookie`,
          method: 'GET',
        }),
      }),
      getUser: builder.mutation({
        query: (token) => {
          return {
            url: `/api/user/profile-information`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),
      login: builder.mutation({
        query: (body) => ({
          url: `/api/login`,
          method: 'POST',
          data: body,
        }),
      }),
      register: builder.mutation({
        query: (body) => ({
          url: `/api/register`,
          method: 'POST',
          data: body,
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          url: `/api/logout`,
          method: 'POST',
        }),
      }),
      confirmPassword: builder.mutation({
        query: (body) => ({
          url: `/api/user/confirm-password`,
          method: 'POST',
          data: body,
        }),
      }),
      confirmPasswordStatus: builder.query({
        query: () => ({
          url: `/api/user/confirmed-password-status`,
          method: 'GET',
        }),
      }),
      forgotPassword: builder.mutation({
        query: (body) => ({
          url: `/api/forgot-password`,
          method: 'POST',
          data: body,
        }),
      }),
      resetPassword: builder.mutation({
        query: (body) => ({
          url: `/api/reset-password`,
          method: 'POST',
          data: body,
        }),
      }),
      changePassword: builder.mutation({
        query: (body) => ({
          url: `/api/user/password`,
          method: 'POST',
          data: body,
        }),
      }),
      turnOn2fa: builder.mutation({
        query: (body) => ({
          url: `/api/user/two-factor-authentication`,
          method: 'POST',
          data: body,
        }),
      }),
      twoFactorQrCode: builder.query({
        query: () => ({
          url: `/api/user/two-factor-qr-code`,
          method: 'GET',
        }),
      }),
      twoFactorSecretKey: builder.query({
        query: () => ({
          url: `/api/user/two-factor-secret-key`,
          method: 'GET',
        }),
      }),
      confirm2FA: builder.mutation({
        query: (body) => ({
          url: `/api/user/confirmed-two-factor-authentication`,
          method: 'POST',
          data: body,
        }),
      }),
      getRecoveryCodes: builder.query({
        query: () => ({
          url: `/api/user/two-factor-recovery-codes`,
          method: 'GET',
        }),
      }),
      postRecoveryCodes: builder.query({
        query: () => ({
          url: `/api/user/two-factor-recovery-codes`,
          method: 'POST',
        }),
      }),
      verifyTwoFactor: builder.mutation({
        query: (body) => {
          return {
            url: `/api/two-factor-challenge`,
            method: 'POST',
            data: body,
          };
        },
      }),
      turnOf2FA: builder.mutation({
        query: () => ({
          url: `/api/user/two-factor-authentication`,
          method: 'POST',
        }),
      }),
      getWishlist: builder.query({
        query: () => ({
          url: `/api/wishlist`,
          method: 'GET',
        }),
        providesTags: ['wishlist'],
      }),
      createWishlist: builder.mutation({
        query: (body) => {
          return {
            url: `/api/wishlist`,
            method: 'POST',
            data: { ...body },
          };
        },
        invalidatesTags: ['wishlist'],
      }),
      deleteWishlist: builder.mutation({
        query: (id) => ({
          url: `/api/wishlist/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['wishlist'],
      }),
      getCart: builder.query({
        query: () => ({
          url: `/api/cart`,
          method: 'GET',
        }),
        providesTags: ['cart'],
      }),
      createCart: builder.mutation({
        query: (body) => ({
          url: `/api/cart`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['cart'],
      }),
      updateCart: builder.mutation({
        query: ({ id, body }) => ({
          url: `/api/cart/${id}`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['cart'],
      }),
      deleteCart: builder.mutation({
        query: (id) => ({
          url: `/api/cart/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['cart'],
      }),
      getAddress: builder.query({
        query: () => ({
          url: `/api/address`,
          method: 'GET',
        }),
        providesTags: ['address'],
      }),
      createAddress: builder.mutation({
        query: (body) => ({
          url: `/api/address`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['address'],
      }),
      updateAddress: builder.mutation({
        query: ({ body, id }) => ({
          url: `/api/address/${id}`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['address'],
      }),
      deleteAddress: builder.mutation({
        query: (id) => ({
          url: `/api/address/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['address'],
      }),
      getProductFilter: builder.query({
        query: (type) => ({
          url: `/api/product/${type}/filter`,
          method: 'GET',
        }),
      }),
      getProducts: builder.query({
        query: ({ type, search }) => ({
          url: `/api/product/${type}?perPage=16&${search ? search : ''}`,
          method: 'GET',
        }),
      }),
      getProductDetail: builder.query({
        query: ({ type, id }) => ({
          url: `/api/product/${type}/${id}`,
          method: 'GET',
        }),
      }),
      getProductReviews: builder.query({
        query: ({ search, id }) => ({
          url: `/api/review-product/${id}?${search ? search : ''}`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const {
  useGetCSRFCookieMutation,
  useGetUserMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useConfirmPasswordMutation,
  useConfirmPasswordStatusQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useTurnOn2faMutation,
  useTwoFactorQrCodeQuery,
  useTwoFactorSecretKeyQuery,
  useConfirm2FAMutation,
  useGetRecoveryCodesQuery,
  usePostRecoveryCodesQuery,
  useVerifyTwoFactorMutation,
  useTurnOf2FAMutation,
  useGetWishlistQuery,
  useCreateWishlistMutation,
  useDeleteWishlistMutation,
  useGetCartQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetProductFilterQuery,
  useGetProductsQuery,
  useGetProductDetailQuery,
  useGetProductReviewsQuery,
} = appApi;
