import { Text } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../AppText';

const FOOD_EMOJIS = ['🍛', '🍱', '🥘', '🍲', '🥗', '🍜', '🍚']

const getEmojiForVendor = (id: string) => {
    const index =
        id
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        FOOD_EMOJIS.length

    return FOOD_EMOJIS[index]
}

const FOOD_TYPE_CONFIG = {
    veg: { bg: '#E8F8EF', color: '#1E7F4F', label: 'VEG' },
    'non-veg': { bg: '#FDECEC', color: '#B42318', label: 'NON-VEG' },
    both: { bg: '#FEF9C3', color: '#92400E', label: 'VEG & NON-VEG' },
}

export default function VendorCard({ vendor }: any) {
    const router = useRouter();
    const emoji = getEmojiForVendor(vendor._id)
    const foodType = vendor.foodType as keyof typeof FOOD_TYPE_CONFIG
    const typeConfig = FOOD_TYPE_CONFIG[foodType] ?? FOOD_TYPE_CONFIG.veg

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/vendor/${vendor._id}`)}
        >
            {/* Left Emoji Box */}
            <View style={styles.emojiBox}>
                <AppText style={styles.emoji}>{emoji}</AppText>
            </View>

            {/* Right Content */}
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.name}>{vendor.businessName}</Text>

                    {/* Food Type Ribbon */}
                    <View style={[styles.ribbon, { backgroundColor: typeConfig.bg }]}>
                        <Text style={[styles.ribbonText, { color: typeConfig.color }]}>
                            {typeConfig.label}
                        </Text>
                    </View>
                </View>

                <AppText style={styles.address}>
                    {vendor.address.line1}, {vendor.address.city}
                </AppText>

                {/* <View
                    style={styles.priceRibbon}
                >
                    <Text
                        style={styles.priceRibbonText}
                    >
                        120/day
                    </Text>
                </View> */}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'stretch',
        minHeight: 130
    },

    emojiBox: {
        width: '30%',
        borderRadius: 14,
        backgroundColor: '#FFEDD5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    emoji: {
        fontSize: 40,
    },

    content: {
        flex: 1,
        width: '70%',
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    name: {
        fontSize: 20,
        lineHeight: 24,
        flex: 1,
        marginRight: 8,
        marginBottom: 5
    },

    address: {
        fontSize: 13,
        color: 'fff',
    },

    ribbon: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ribbonText: {
        fontSize: 14,
    },
    priceRibbon: {
        alignSelf: 'flex-start',
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 10,
    },
    priceRibbonText: {
        color: '#1D4ED8',
        fontSize: 12,
        fontWeight: 400
    }
})