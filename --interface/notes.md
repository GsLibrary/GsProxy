app.use(
    '/proxy',
    createProxyMiddleware({
        target: 'https://example.com', // Target URL to proxy
        changeOrigin: true,             // Modify origin header
        pathRewrite: { '^/proxy': 's' }, // Remove /proxy from path
        secure: false,                  // Avoids issues with self-signed SSL
    })
);