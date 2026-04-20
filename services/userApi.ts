import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/users/me',
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/users/me',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'], // 🔥 auto refetch profile
        }),
        deleteAccount: builder.mutation({
            query: () => ({
                url: "/users/delete",
                method: "PATCH",
            }),
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useDeleteAccountMutation
} = userApi;
