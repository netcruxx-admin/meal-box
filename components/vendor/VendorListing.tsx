import { colors } from '@/constants/theme'
import { useGetVendorsQuery } from '@/services/vendorApi'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@react-navigation/elements'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import AppText from '../AppText'
import VendorCard from './VendorCard'

export default function VendorListing() {
    const router = useRouter();
    const FILTERS = ['All', 'veg', 'non-veg'] as const
    type Filter = typeof FILTERS[number]

    const [selectedFilter, setSelectedFilter] = useState<Filter>('All')
    const [search, setSearch] = useState('')

    const foodTypeParam = selectedFilter !== 'All' ? selectedFilter : undefined
    const { data, isLoading } = useGetVendorsQuery(foodTypeParam ? { foodType: foodTypeParam } : undefined)
    const vendors = data?.vendors ?? []

    const filteredVendors = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return vendors

        return vendors.filter((v) =>
            v.businessName?.toLowerCase().includes(query) ||
            v.address?.line1?.toLowerCase().includes(query) ||
            v.address?.city?.toLowerCase().includes(query)
        )
    }, [vendors, search])

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}>
                <AppText type='title'>Vendors</AppText>

                <View style={styles.iconsContainer}>
                    {/* <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={22} color="#111827" />
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/Profile')}>
                        <Ionicons name="person-outline" size={22} color="#111827" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchBox}>
                <AppText style={styles.searchIcon}>🔍 </AppText>
                <TextInput
                    placeholder="Search vendors, cuisine..."
                    placeholderTextColor='#6B7280'
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Filters */}
            <View style={styles.filters}>
                {FILTERS.map(filter => {
                    const active = filter === selectedFilter
                    return (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setSelectedFilter(filter)}
                            style={[
                                styles.filterChip,
                                active && styles.filterChipActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    active && styles.filterTextActive,
                                ]}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            {/* Vendor List */}
            {filteredVendors.length === 0 ? (
                <View style={styles.emptyState}>
                    <AppText style={styles.emptyEmoji}>🍽️</AppText>
                    <AppText type='subTitle' style={styles.emptyTitle}>No vendors found</AppText>
                    <AppText style={styles.emptySubText}>
                        {search.trim()
                            ? `No results for "${search.trim()}"`
                            : `No ${selectedFilter === 'All' ? '' : selectedFilter + ' '}vendors available right now`}
                    </AppText>
                </View>
            ) : (
                <FlatList
                    data={filteredVendors}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <VendorCard vendor={item} />}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    iconsContainer: {
        flexDirection: 'row',
        gap: 14,
    },

    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
        marginVertical: 15,
    },

    searchIcon: {
        fontSize: 16,
        marginRight: 8,
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.text,
    },

    filters: {
        flexDirection: 'row',
        marginBottom: 15,
    },

    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        marginRight: 8,
    },

    filterChipActive: {
        backgroundColor: colors.primary,
    },

    filterText: {
        fontSize: 13,
        color: '#374151',
        textTransform: 'uppercase'
    },

    filterTextActive: {
        color: '#fff'
    },

    list: {
        paddingBottom: 20,
    },

    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },

    emptyEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: 18,
        marginBottom: 6,
    },

    emptySubText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
})