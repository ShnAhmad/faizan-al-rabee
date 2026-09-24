import type {NextConfig} from "next";
const nextConfig:NextConfig={turbopack:{resolveAlias:{"far-inquiry-store":process.env.FAR_RUNTIME === "sites" ? "./lib/inquiry-store.sites.ts" : "./lib/inquiry-store.ts"}}};
export default nextConfig;
