import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevents YouTube Error 153 and other embed failures by sending
    // origin info on cross-origin requests without leaking full URL paths
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Prevents MIME-type sniffing attacks
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Controls iframe embedding — allows YouTube/external embeds
    // while preventing clickjacking on the app itself
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Enables XSS filter in legacy browsers
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    // Disables camera, microphone, geolocation, etc. unless explicitly needed
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
