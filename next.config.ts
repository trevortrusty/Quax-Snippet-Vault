import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Only run Tailwind on the global stylesheet. A bare "*.css" rule also
      // captures *.module.css and re-emits it as plain global CSS, so the
      // class names never get hashed/exported and `styles.shell` etc. don't apply.
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
