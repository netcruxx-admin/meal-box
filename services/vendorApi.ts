import { baseApi } from './baseApi';

type VendorResponse = {
    count: number;
    vendors: Vendor[];
};

type Vendor = {
    _id: string;
    businessName: string;
    foodType: 'veg' | 'non-veg' | 'both';
    serviceAreas: string[];
    address?: {
        line1?: string;
        line2?: string;
        city?: string;
    };
    description?: string;
    user: {
        name: string;
        phone: string;
    };
};

type VendorQueryParams = {
    foodType?: 'veg' | 'non-veg' | 'both';
};

export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVendors: builder.query<VendorResponse, VendorQueryParams | void>({
            query: (params) => ({
                url: '/vendors',
                params: params ?? {},
            }),
            providesTags: ['Vendors'],
        }),
        getVendorById: builder.query<{ vendor: Vendor }, string>({
            query: (id) => `/vendors/${id}`,
        }),
        getVendorMenu: builder.query({
            query: (vendorId: string) => `/vendors/${vendorId}/menu`,
        }),
        getVendorPlans: builder.query({
            query: (vendorId: string) => `/vendors/${vendorId}/plans`,
        }),
    }),
});

export const {
    useGetVendorsQuery,
    useGetVendorByIdQuery,
    useGetVendorMenuQuery,
    useGetVendorPlansQuery
} = vendorApi;
