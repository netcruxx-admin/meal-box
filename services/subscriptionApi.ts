import { baseApi } from "./baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSubscription: builder.mutation({
            query: (data) => ({
                url: "/subscriptions/subscribe",
                method: "POST",
                body: data,
            }),
        }),

        getMySubscriptions: builder.query({
            query: () => "/subscriptions/my-subscriptions",
            providesTags: ["Subscriptions"],
        }),
    }),
});

export const {
    useCreateSubscriptionMutation,
    useGetMySubscriptionsQuery,
} = subscriptionApi;