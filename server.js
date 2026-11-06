const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
http.createServer((req, res) => {
  const route = new URL(req.url, 'http://localhost').pathname;
  const files = {'/':'index.html','/app.js':'app.js','/style.css':'style.css','/health.js':'health.js'};
  const file = files[route];
  if (!file) { res.writeHead(404); return res.end('Not found'); }
  res.setHeader('Content-Type', {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]);
  fs.createReadStream(path.join(root, file)).pipe(res);
}).listen(process.env.PORT || 3000, '0.0.0.0');
