type UserProfile = {
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
};

export function isProfileComplete(user: UserProfile | undefined): boolean {
  if (!user) return false;

  if (!user.name || user.name.trim() === '') return false;
  if (!user.phone || user.phone.trim() === '') return false;

  if (!user.address) return false;

  const { line1, city, state, pincode } = user.address;
  if (!line1 || !city || !state || !pincode) return false;

  return true;
}