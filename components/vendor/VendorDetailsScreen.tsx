import AppText from '@/components/AppText';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import {
    useDeleteReviewMutation,
    useGetVendorReviewsQuery,
    useSubmitReviewMutation,
    useUpdateReviewMutation,
    type Review,
} from '@/services/reviewApi';
import { useGetMySubscriptionsQuery } from '@/services/subscriptionApi';
import { useGetProfileQuery } from '@/services/userApi';
import { useGetVendorByIdQuery, useGetVendorMenuQuery } from '@/services/vendorApi';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

type Props = {
    vendorId: string;
};

function StarPicker({ rating, onSelect }: { rating: number; onSelect: (r: number) => void }) {
    return (
        <View style={pickerStyles.row}>
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => onSelect(star)}>
                    <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={32}
                        color={star <= rating ? '#F59E0B' : '#9CA3AF'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

function StarDisplay({ rating }: { rating: number }) {
    return (
        <View style={pickerStyles.row}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                    key={star}
                    name={star <= Math.round(rating) ? 'star' : 'star-outline'}
                    size={14}
                    color={star <= Math.round(rating) ? '#F59E0B' : '#9CA3AF'}
                />
            ))}
        </View>
    );
}

const pickerStyles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 4 },
});

export default function VendorDetailsScreen({ vendorId }: Props) {
    const navigation = useNavigation();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
    const [formRating, setFormRating] = useState(0);
    const [formComment, setFormComment] = useState('');
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    const { data: vendorData, isLoading, isError } = useGetVendorByIdQuery(vendorId);
    const { data: menuData } = useGetVendorMenuQuery(vendorId);
    const { data: reviewsData, isLoading: reviewsLoading } = useGetVendorReviewsQuery(vendorId);
    const { data: profileData } = useGetProfileQuery(undefined);
    const { data: mySubscriptions } = useGetMySubscriptionsQuery(undefined);

    const existingRequest = mySubscriptions?.subscriptions?.find(
        (s: any) => s.vendor?._id === vendorId && ['pending', 'accepted', 'active', 'paused'].includes(s.status)
    );

    const [submitReview, { isLoading: submitting }] = useSubmitReviewMutation();
    const [updateReview, { isLoading: updating }] = useUpdateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    const currentUserId = profileData?.user?._id;
    const reviews: Review[] = reviewsData?.reviews ?? [];
    const myReview = reviews.find((r) => r.user?._id === currentUserId);

    const handleStartEdit = (review: Review) => {
        setEditingReview(review);
        setFormRating(review.rating);
        setFormComment(review.comment ?? '');
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setFormRating(0);
        setFormComment('');
    };

    const handleSubmit = async () => {
        if (formRating === 0) {
            Toast.show({ type: 'error', text1: 'Please select a star rating' });
            return;
        }
        try {
            if (editingReview) {
                await updateReview({
                    id: editingReview._id,
                    data: { rating: formRating, comment: formComment || undefined },
                }).unwrap();
                Toast.show({ type: 'success', text1: 'Review updated' });
                handleCancelEdit();
            } else {
                await submitReview({
                    vendorId,
                    rating: formRating,
                    comment: formComment || undefined,
                }).unwrap();
                Toast.show({ type: 'success', text1: 'Review submitted' });
                setFormRating(0);
                setFormComment('');
            }
        } catch (err: any) {
            Toast.show({ type: 'error', text1: err?.data?.message ?? 'Something went wrong' });
        }
    };

    const handleDelete = (reviewId: string) => {
        Alert.alert('Delete Review', 'Are you sure you want to delete your review?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteReview(reviewId).unwrap();
                        Toast.show({ type: 'success', text1: 'Review deleted' });
                    } catch (err: any) {
                        Toast.show({ type: 'error', text1: err?.data?.message ?? 'Something went wrong' });
                    }
                },
            },
        ]);
    };

    if (isLoading) {
        return (
            <View style={styles.wrapper}>
                <View style={[styles.header, { backgroundColor: '#E5E7EB' }]} />
                <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
                    <Skeleton height={32} width="60%" borderRadius={8} style={{ marginBottom: 10 }} />
                    <Skeleton height={16} width="40%" borderRadius={6} style={{ marginBottom: 6 }} />
                    <Skeleton height={34} width="50%" borderRadius={10} style={{ marginBottom: 14 }} />
                    <Skeleton height={16} width="90%" borderRadius={6} style={{ marginBottom: 6 }} />
                    <Skeleton height={16} width="75%" borderRadius={6} style={{ marginBottom: 24 }} />
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                        <Skeleton height={48} width="48%" borderRadius={12} />
                        <Skeleton height={48} width="48%" borderRadius={12} />
                    </View>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={{ marginBottom: 14, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Skeleton height={18} width="35%" borderRadius={6} />
                                <Skeleton height={18} width="20%" borderRadius={6} />
                            </View>
                            <Skeleton height={14} width="80%" borderRadius={5} style={{ marginBottom: 6 }} />
                            <Skeleton height={14} width="70%" borderRadius={5} style={{ marginBottom: 6 }} />
                            <Skeleton height={14} width="60%" borderRadius={5} />
                        </View>
                    ))}
                </ScrollView>
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

    const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const getDateForDay = (dayIndex: number) => {
        const today = new Date();
        const currentDay = today.getDay();
        const mondayOffset = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
        const monday = new Date(today.setDate(mondayOffset));
        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + dayIndex);
        return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const avgRating = reviewsData?.averageRating;
    const totalReviews = reviewsData?.totalReviews ?? 0;

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
                        <View style={styles.ratingBadge}>
                            <AppText>
                                ⭐ {avgRating ? avgRating.toFixed(1) : '—'} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                            </AppText>
                        </View>
                    </View>

                    <AppText style={styles.description}>{vendor.description}</AppText>

                    {/* Tabs */}
                    <View style={styles.tabs}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
                            onPress={() => setActiveTab('menu')}
                        >
                            <Text style={activeTab === 'menu' ? styles.activeTabText : styles.tabText}>
                                Weekly Menu
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
                            onPress={() => setActiveTab('reviews')}
                        >
                            <Text style={activeTab === 'reviews' ? styles.activeTabText : styles.tabText}>
                                Reviews{totalReviews > 0 ? ` (${totalReviews})` : ''}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Weekly Menu Tab */}
                    {activeTab === 'menu' && (
                        <>
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
                                            {dayMenu.breakfast?.items?.join(', ') || 'Not available'}
                                        </AppText>
                                        <AppText style={styles.menuItem}>
                                            <AppText weight="semiBold">Lunch: </AppText>
                                            {dayMenu.lunch?.items?.join(', ') || 'Not available'}
                                        </AppText>
                                        <AppText style={styles.menuItem}>
                                            <AppText weight="semiBold">Dinner: </AppText>
                                            {dayMenu.dinner?.items?.join(', ') || 'Not available'}
                                        </AppText>
                                    </View>
                                );
                            })}
                        </>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <>
                            {/* Write a Review form (only if not yet reviewed and not editing) */}
                            {!myReview && !editingReview && (
                                <View style={styles.reviewForm}>
                                    <Text style={styles.sectionTitle}>Write a Review</Text>
                                    <StarPicker rating={formRating} onSelect={setFormRating} />
                                    <TextInput
                                        style={styles.commentInput}
                                        placeholder="Share your experience (optional)"
                                        multiline
                                        maxLength={500}
                                        value={formComment}
                                        onChangeText={setFormComment}
                                    />
                                    <Button
                                        title={submitting ? 'Submitting...' : 'Submit Review'}
                                        variant="fill"
                                        fullWidth
                                        onPress={handleSubmit}
                                    />
                                </View>
                            )}

                            {/* Edit review form */}
                            {editingReview && (
                                <View style={styles.reviewForm}>
                                    <Text style={styles.sectionTitle}>Edit Your Review</Text>
                                    <StarPicker rating={formRating} onSelect={setFormRating} />
                                    <TextInput
                                        style={styles.commentInput}
                                        placeholder="Share your experience (optional)"
                                        multiline
                                        maxLength={500}
                                        value={formComment}
                                        onChangeText={setFormComment}
                                    />
                                    <View style={styles.editActions}>
                                        <View style={{ flex: 1 }}>
                                            <Button
                                                title={updating ? 'Saving...' : 'Save Changes'}
                                                variant="fill"
                                                fullWidth
                                                onPress={handleSubmit}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Button
                                                title="Cancel"
                                                variant="outline"
                                                fullWidth
                                                onPress={handleCancelEdit}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Review list */}
                            {reviewsLoading ? (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <View key={i} style={styles.reviewCard}>
                                            <View style={styles.reviewHeader}>
                                                <View style={{ gap: 6 }}>
                                                    <Skeleton height={16} width={120} borderRadius={6} />
                                                    <Skeleton height={14} width={80} borderRadius={5} />
                                                </View>
                                                <Skeleton height={12} width={70} borderRadius={5} />
                                            </View>
                                            <Skeleton height={14} width="90%" borderRadius={5} style={{ marginBottom: 6 }} />
                                            <Skeleton height={14} width="70%" borderRadius={5} />
                                        </View>
                                    ))}
                                </>
                            ) : reviews.length === 0 ? (
                                <View style={styles.emptyReviews}>
                                    <AppText style={styles.emptyText}>No reviews yet. Be the first!</AppText>
                                </View>
                            ) : (
                                reviews.map((review) => (
                                    <View key={review._id} style={styles.reviewCard}>
                                        <View style={styles.reviewHeader}>
                                            <View style={{ gap: 4 }}>
                                                <AppText weight="semiBold">{review.user?.name ?? 'Deleted User'}</AppText>
                                                <StarDisplay rating={review.rating} />
                                            </View>
                                            <AppText style={styles.reviewDate} type='description'>
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </AppText>
                                        </View>

                                        {review.comment ? (
                                            <AppText style={styles.reviewComment}>{review.comment}</AppText>
                                        ) : null}

                                        {/* Edit/Delete actions hidden until backend supports it
                                        {review.user?._id === currentUserId && !editingReview && (
                                            <View style={styles.reviewActions}>
                                                <TouchableOpacity
                                                    style={styles.actionBtn}
                                                    onPress={() => handleStartEdit(review)}
                                                >
                                                    <Ionicons name="pencil-outline" size={15} color="#374151" />
                                                    <AppText style={styles.actionText}>Edit</AppText>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.actionBtn}
                                                    onPress={() => handleDelete(review._id)}
                                                >
                                                    <Ionicons name="trash-outline" size={15} color="#EF4444" />
                                                    <AppText style={[styles.actionText, { color: '#EF4444' }]}>Delete</AppText>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        */}
                                    </View>
                                ))
                            )}
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    title={
                        existingRequest?.status === 'active'
                            ? 'View Active Subscription'
                            : existingRequest?.status === 'pending'
                            ? 'Request Pending...'
                            : 'Subscribe Now'
                    }
                    variant="fill"
                    fullWidth
                    onPress={() => router.push(`/vendor/${vendorId}/subscription` as any)}
                />
            </View>
        </View>
    );
}

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
    ratingBadge: {
        backgroundColor: '#E8F8EF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
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
        marginBottom: 12,
    },
    menuCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 13,
        color: '#6B7280',
    },
    menuItem: {
        fontSize: 14,
        marginBottom: 4,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFF',
    },

    // Reviews
    reviewForm: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    commentInput: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        minHeight: 80,
        textAlignVertical: 'top',
        marginTop: 10,
        marginBottom: 12,
    },
    editActions: {
        flexDirection: 'row',
        gap: 10,
    },
    reviewCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    reviewComment: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    reviewActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 13,
        color: '#374151',
    },
    emptyReviews: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    centeredMsg: {
        textAlign: 'center',
        marginTop: 20,
        color: '#9CA3AF',
    },
});
