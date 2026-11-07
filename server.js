const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
function handler(req,res){
  const route=new URL(req.url,'http://localhost').pathname;
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Cache-Control','no-store');
  if(route==='/api/config'){
    const key=process.env.SUPABASE_PUBLISHABLE_KEY||'';
    let secret=key.startsWith('sb_secret_');
    try{secret=secret||JSON.parse(Buffer.from(key.split('.')[1]||'', 'base64url').toString()).role==='service_role';}catch{}
    if(secret){res.writeHead(503);return res.end('Invalid public authentication configuration');}
    res.setHeader('Content-Type','application/json');
    return res.end(JSON.stringify({supabaseUrl:process.env.SUPABASE_URL||'',supabasePublishableKey:process.env.SUPABASE_PUBLISHABLE_KEY||''}));
  }
  const files={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/health.js':'health.js','/auth.js':'dist/auth.js'};
  if(!files[route]){res.writeHead(404);return res.end('Not found');}
  res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(files[route])]);
  const stream=fs.createReadStream(path.join(__dirname,files[route]));stream.on('error',()=>{res.statusCode=500;res.end('Asset unavailable. Run npm run build.');});stream.pipe(res);
}
module.exports=handler;
if(require.main===module)http.createServer(handler).listen(process.env.PORT||3000,'0.0.0.0');
