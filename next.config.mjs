/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.json$/,
            type: "json",
        });
        return config;
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'",
                    },
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Accept, Accept-Language, Accept-Encoding, Authorization, X-Requested-With",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
