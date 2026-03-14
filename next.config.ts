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
  {
    // Forces HTTPS for 1 year, including subdomains
    // Prevents protocol downgrade attacks and cookie hijacking
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Content Security Policy — the primary XSS mitigation layer
    // - default-src 'self': only load resources from same origin
    // - script-src 'self' 'unsafe-inline' 'unsafe-eval': Next.js requires inline scripts and eval for dev/HMR
    // - style-src 'self' 'unsafe-inline': Tailwind and Framer Motion inject inline styles
    // - connect-src 'self' https://api.openai.com: only allow API calls to self and OpenAI
    // - img-src 'self' data: blob:: allow images from self, data URIs (icons), and blob (canvas)
    // - font-src 'self': only load fonts from same origin (Press Start 2P is bundled)
    // - frame-ancestors 'self': equivalent to X-Frame-Options but CSP-level
    // - base-uri 'self': prevents <base> tag injection attacks
    // - form-action 'self': prevents form submission to external domains
    // - object-src 'none': blocks Flash/Java plugin-based attacks entirely
    // - upgrade-insecure-requests: auto-upgrades HTTP→HTTPS for all resources
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://api.openai.com",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
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
