import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import createBundleAnalyzerPlugin from '@next/bundle-analyzer';

const withBundleAnalyzer = createBundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
