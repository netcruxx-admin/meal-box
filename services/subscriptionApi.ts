import { baseApi } from "./baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSubscription: builder.mutation({
            query: (data) => ({
                url: "/subscriptions/subscribe",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscriptions"],
        }),

        getMySubscriptions: builder.query({
            query: () => "/subscriptions/my-subscriptions",
            providesTags: ["Subscriptions"],
        }),

        cancelSubscription: builder.mutation<{ message: string; subscription: any }, string>({
            query: (id) => ({
                url: `/subscriptions/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Subscriptions"],
        }),

        stopSubscription: builder.mutation<{ message: string; subscription: any }, string>({
            query: (id) => ({
                url: `/subscriptions/${id}/stop`,
                method: "PATCH",
            }),
            invalidatesTags: ["Subscriptions"],
        }),

        pauseSubscription: builder.mutation<
            { message: string; subscription: any },
            { id: string; pauseStartDate: string; pauseEndDate: string }
        >({
            query: ({ id, pauseStartDate, pauseEndDate }) => ({
                url: `/subscriptions/${id}/pause`,
                method: "PATCH",
                body: { pauseStartDate, pauseEndDate },
            }),
            invalidatesTags: ["Subscriptions"],
        }),

        resumeSubscription: builder.mutation<{ message: string; subscription: any }, string>({
            query: (id) => ({
                url: `/subscriptions/${id}/resume`,
                method: "PATCH",
            }),
            invalidatesTags: ["Subscriptions"],
        }),
    }),
});

export const {
    useCreateSubscriptionMutation,
    useGetMySubscriptionsQuery,
    useCancelSubscriptionMutation,
    useStopSubscriptionMutation,
    usePauseSubscriptionMutation,
    useResumeSubscriptionMutation,
} = subscriptionApi;