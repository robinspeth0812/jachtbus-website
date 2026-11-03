import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photos and attachments go through server actions; phone photos are easily 5 MB.
  experimental: { serverActions: { bodySizeLimit: "22mb" } },
  devIndicators: false,
  // The portal must never appear in search engines.
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
