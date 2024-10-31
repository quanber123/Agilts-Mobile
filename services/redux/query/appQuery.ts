import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'address',
    'document',
    'wishlist',
    'cart',
    'branch',
    'order-motor-cycle',
    'order-item',
    'settings',
    'invoice',
    'review',
  ],
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
      updateUser: builder.mutation({
        query: (body) => ({
          url: `/api/user/profile-information`,
          method: 'PUT',
          data: body,
        }),
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
        query: ({ type, search }) => ({
          url: `/api/product/${type}/filter?${search ? search : ''}`,
          method: 'GET',
        }),
      }),
      getProducts: builder.query({
        query: ({ type, search, perPage }) => ({
          url: `/api/product/${type}?perPage=${perPage ? perPage : 16}&${search ? search : ''}`,
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
      getBranches: builder.query({
        query: (search) => ({
          url: `/api/branch?${search ? search : ''}`,
          method: 'GET',
        }),
        providesTags: ['branch'],
      }),
      postPriceQuote: builder.mutation({
        query: ({ type, body }) => ({
          url: `/api/${type}`,
          method: 'POST',
          data: body,
        }),
      }),
      getOrdersMotorcycle: builder.query({
        query: (search) => ({
          url: `/api/order-motorcycle?${search}`,
          method: 'GET',
        }),
        providesTags: ['order-motor-cycle'],
      }),
      createOrderMotorcycle: builder.mutation({
        query: (body) => ({
          url: `/api/order-motorcycle`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['order-motor-cycle'],
      }),
      getOrderMotorcycleDetails: builder.query({
        query: (id) => ({
          url: `/api/order-motorcycle/${id}`,
          method: 'GET',
        }),
        providesTags: ['order-motor-cycle'],
      }),
      getOrders: builder.query({
        query: (search) => ({
          url: `/api/order?${search}`,
          method: 'GET',
        }),
        providesTags: ['order-item'],
      }),
      createOrder: builder.mutation({
        query: (body) => ({
          url: `/api/order`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['order-item'],
      }),
      getOrderDetails: builder.query({
        query: (id) => ({
          url: `/api/order/${id}`,
          method: 'GET',
        }),
        providesTags: ['order-item'],
      }),
      cancelOrder: builder.mutation({
        query: (id) => ({
          url: `/api/order/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['order-item'],
      }),
      getSettings: builder.query({
        query: (type) => ({
          url: `/api/setting/${type}`,
          method: 'GET',
        }),
        providesTags: ['settings'],
      }),
      getInvoice: builder.query({
        query: ({ type, id }) => ({
          url: `/invoice/${type}/${id}`,
          method: 'GET',
        }),
        providesTags: ['invoice'],
      }),
      getUserReview: builder.query({
        query: (search) => ({
          url: `/api/review-customer?${search}`,
          method: 'GET',
        }),
        providesTags: ['review'],
      }),
      createReview: builder.mutation({
        query: (body) => ({
          url: `/api/review-customer`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['review'],
      }),
      postImage: builder.mutation({
        query: (body) => ({
          url: `/api/review-customer/image`,
          method: 'POST',
          data: body,
        }),
      }),
    };
  },
});

export const {
  useGetCSRFCookieMutation,
  useGetUserMutation,
  useUpdateUserMutation,
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
  useGetBranchesQuery,
  usePostPriceQuoteMutation,
  useGetOrdersMotorcycleQuery,
  useCreateOrderMotorcycleMutation,
  useGetOrderMotorcycleDetailsQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useCancelOrderMutation,
  useGetSettingsQuery,
  useGetInvoiceQuery,
  useGetUserReviewQuery,
  useCreateReviewMutation,
  usePostImageMutation,
} = appApi;
