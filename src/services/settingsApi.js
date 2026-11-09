import Axios from "../utils/Axios";
import { decryptSettingsPayload } from "../utils/payloadDecrypt";

// Fetch public settings for this tenant (walletEnabled, wishlistEnabled, isCODEnabled, etc.)
// Decrypts AES-256 payload so raw network responses cannot be read by inspect/sniffers
export const getPublicSettings = async () => {
  try {
    const res = await Axios.get("/admin/settings/public");
    
    // If backend sent encrypted payload, decrypt client-side
    if (res.data?.encrypted && res.data?.payload) {
      const decrypted = await decryptSettingsPayload(res.data.payload);
      return decrypted;
    }

    // Fallback if returned raw settings
    return res.data?.settings || null;
  } catch (error) {
    console.warn("Failed to fetch public settings:", error?.message);
    return null;
  }
};

