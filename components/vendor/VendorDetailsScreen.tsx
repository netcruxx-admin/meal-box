import AppText from '@/components/AppText';
import Button from '@/components/Button';
import { useGetVendorByIdQuery, useGetVendorMenuQuery } from '@/services/vendorApi';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Props = {
    vendorId: string;
};

export default function VendorDetailsScreen({ vendorId }: Props) {
    const navigation = useNavigation();
    const router = useRouter();

    const { data: vendorData, isLoading, isError } = useGetVendorByIdQuery(vendorId);
    const { data: menuData } = useGetVendorMenuQuery(vendorId);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <AppText>Loading...</AppText>
            </View>
        );
    }

    if (isError || !vendorData) {
        return (
            <View style={styles.center}>
                <AppText>Failed to load vendor</AppText>
            </View>
        );
    }

    const { vendor } = vendorData;
    const menu = menuData?.menu;

    const DAYS = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

    const getDateForDay = (dayIndex: number) => {
        const today = new Date();
        const currentDay = today.getDay(); // Sunday = 0

        const mondayOffset = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
        const monday = new Date(today.setDate(mondayOffset));

        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + dayIndex);

        return targetDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={20} />
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.favBtn}>
                        <Ionicons name="heart-outline" size={20} />
                    </TouchableOpacity> */}
                    <Text style={styles.emoji}>🍛</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.name}>{vendor.businessName}</Text>
                    <AppText style={styles.address}>
                        {vendor.address?.line1} {vendor.address?.line2} {vendor.address?.city}
                    </AppText>

                    <View style={styles.row}>
                        <View style={styles.rating}>
                            <AppText>⭐ 4.5 (250+ reviews)</AppText>
                        </View>
                    </View>

                    <AppText style={styles.description}>{vendor.description}</AppText>

                    {/* Tabs */}
                    <View style={styles.tabs}>
                        <View style={[styles.tab, styles.activeTab]}>
                            <Text style={styles.activeTabText}>Weekly Menu</Text>
                        </View>

                        <View style={styles.tab}>
                            <AppText style={styles.tabText}>Reviews</AppText>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>This Week's Menu</Text>

                    {DAYS.map((day, index) => {
                        const dayMenu = menu?.[day];

                        if (!dayMenu) return null;

                        return (
                            <View key={day} style={styles.menuCard}>
                                <View style={styles.menuHeader}>
                                    <Text style={styles.dayTitle}>
                                        {day.charAt(0).toUpperCase() + day.slice(1)}
                                    </Text>

                                    <AppText style={styles.dateText}>
                                        {getDateForDay(index)}
                                    </AppText>
                                </View>

                                <AppText style={styles.menuItem}>
                                    <AppText weight="semiBold">Breakfast: </AppText>
                                    {dayMenu.breakfast?.items?.join(", ") || "Not available"}
                                </AppText>

                                <AppText style={styles.menuItem}>
                                    <AppText weight="semiBold">Lunch: </AppText>
                                    {dayMenu.lunch?.items?.join(", ") || "Not available"}
                                </AppText>

                                <AppText style={styles.menuItem}>
                                    <AppText weight="semiBold">Dinner: </AppText>
                                    {dayMenu.dinner?.items?.join(", ") || "Not available"}
                                </AppText>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    title="View Subscription"
                    variant="fill"
                    fullWidth
                    onPress={() => router.push(`/vendor/${vendorId}/subscription` as any)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FFF',
    },

    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    header: {
        height: 220,
        backgroundColor: '#FFD7A8',
        alignItems: 'center',
        justifyContent: 'center',
    },

    backBtn: {
        position: 'absolute',
        left: 20,
        top: 50,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 20,
    },

    favBtn: {
        position: 'absolute',
        right: 20,
        top: 50,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 20,
    },

    emoji: {
        fontSize: 50,
    },

    content: {
        padding: 20,
    },

    name: {
        fontSize: 28,
        fontWeight: '700',
    },

    row: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },

    rating: {
        backgroundColor: '#E8F8EF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },

    tag: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },

    tagText: {
        color: '#1D4ED8',
    },

    address: {
        color: '#4B5563',
        marginBottom: 10,
        fontSize: 14,
    },

    description: {
        color: '#4B5563',
        marginBottom: 20,
        fontSize: 15,
    },

    tabs: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },

    tab: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
    },

    activeTab: {
        backgroundColor: '#111827',
    },

    tabText: {
        color: '#374151',
        fontWeight: '600',
    },

    activeTabText: {
        color: '#FFF',
        fontWeight: '600',
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 10,
    },

    menuCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },

    menuHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    dayTitle: {
        fontSize: 16,
        fontWeight: "600",
    },

    dateText: {
        fontSize: 13,
        color: '#6B7280',
    },

    menuItem: {
        fontSize: 14,
        marginBottom: 4,
    },

    bold: {
        fontWeight: "600",
    },

    menuLabel: {
        fontWeight: "600",
    },

    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFF',
    },
});
