import { Download } from "lucide-react";
import DownloadsPage from "../digital/DownloadsPage";
import DownloadsList from "../digital/DownloadsList";
import DigitalBadge from "../digital/DigitalBadge";

/** Digital products: /downloads page, a "Downloads" account tab, and an instant-download note on digital product pages. */
export const slots = {
  "productPage.afterActions": { module: "digitalProducts", Component: DigitalBadge },
};

export const profileTabs = [
  { module: "digitalProducts", key: "downloads", label: "Downloads", short: "Downloads", icon: Download, Component: DownloadsList },
];

export const pages = { "digitalProducts:downloads": DownloadsPage };
