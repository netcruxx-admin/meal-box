import { baseApi } from './baseApi';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          fullName: data.name,
          phone: data.phone,
          password: data.password,
          role: "user"
        },
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          phone: data.phone,
          password: data.password,
          role: data.role || 'user'
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
} = authApi;