import Axios from "../utils/Axios";

// Fetch public settings for this tenant (walletEnabled, wishlistEnabled, isCODEnabled, etc.)
export const getPublicSettings = async () => {
  try {
    const res = await Axios.get("/admin/settings/public");
    return res.data?.settings || null;
  } catch (error) {
    console.warn("Failed to fetch public settings:", error?.message);
    return null;
  }
};

