import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Keep the project agent instructions unchanged when running next dev.
  agentRules: false,
};

export default nextConfig;
