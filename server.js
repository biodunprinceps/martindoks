const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0'; // Use 0.0.0.0 for local network access, 'localhost' for localhost only
const port = process.env.PORT || 3000;

// For cPanel/production, ensure we're in production mode
const isProduction = process.env.NODE_ENV === 'production' || !dev;
const app = next({ 
  dev: !isProduction, 
  hostname, 
  port,
  // Ensure proper error handling in production
  conf: isProduction ? { distDir: '.next' } : undefined
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      
      // Let Next.js handle content-type automatically
      // Only set fallback for error cases
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    const displayHostname = hostname === '0.0.0.0' ? 'localhost' : hostname;
    console.log(`> Ready on http://${displayHostname}:${port}`);
    if (hostname === '0.0.0.0') {
      console.log(`> Also accessible on your local network`);
      console.log(`> Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)`);
    }
  });
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  console.error('Make sure you have run: npm run build');
  process.exit(1);
});

