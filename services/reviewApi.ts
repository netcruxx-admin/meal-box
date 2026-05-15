import { baseApi } from './baseApi';

export type Review = {
    _id: string;
    user: { _id: string; name: string };
    vendor: string;
    rating: number;
    comment?: string;
    createdAt: string;
};

type VendorReviewsResponse = {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
};

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVendorReviews: builder.query<VendorReviewsResponse, string>({
            query: (vendorId) => `/reviews/vendor/${vendorId}`,
            providesTags: ['Reviews'],
        }),
        submitReview: builder.mutation<{ message: string; review: Review }, { vendorId: string; rating: number; comment?: string }>({
            query: (data) => ({
                url: '/reviews',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Reviews'],
        }),
        updateReview: builder.mutation<{ message: string; review: Review }, { id: string; data: { rating?: number; comment?: string } }>({
            query: ({ id, data }) => ({
                url: `/reviews/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Reviews'],
        }),
        deleteReview: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reviews'],
        }),
    }),
});

export const {
    useGetVendorReviewsQuery,
    useSubmitReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
} = reviewApi;
