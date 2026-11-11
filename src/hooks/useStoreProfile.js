import { useQuery } from '@tanstack/react-query';
import { getPublicSettings } from '../services/settingsApi';

const env = import.meta.env;
const pick = (...vals) => vals.find((v) => typeof v === 'string' && v.trim()) || '';

/**
 * Store identity for policy pages, footer and contact. Reads the public tenant settings and falls
 * back to optional VITE_STORE_* variables. Fields the tenant has not configured come back empty
 * (callers hide them) - never hard-code another brand's details here.
 */
export default function useStoreProfile() {
  const { data: s, isLoading } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });
  const c = s?.contact || s?.storeContact || {};
  const social = s?.socialLinks || s?.social || c.social || {};
  const addr = c.address || s?.address || s?.storeAddress;

  return {
    isLoading,
    settings: s,
    name: pick(s?.storeName, env.VITE_STORE_NAME, 'MantraVanni'),
    supportEmail: pick(c.email, c.supportEmail, s?.supportEmail, s?.contactEmail, env.VITE_STORE_SUPPORT_EMAIL),
    supportPhone: pick(c.phone, c.supportPhone, s?.supportPhone, s?.contactPhone, env.VITE_STORE_SUPPORT_PHONE),
    address: pick(typeof addr === 'string' ? addr : '', env.VITE_STORE_ADDRESS),
    legalName: pick(s?.legalName, c.legalName, env.VITE_STORE_LEGAL_NAME),
    social: {
      instagram: pick(social.instagram, env.VITE_SOCIAL_INSTAGRAM),
      facebook: pick(social.facebook, env.VITE_SOCIAL_FACEBOOK),
      youtube: pick(social.youtube, env.VITE_SOCIAL_YOUTUBE),
      whatsapp: pick(social.whatsapp, env.VITE_SOCIAL_WHATSAPP),
    },
  };
}
