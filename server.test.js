const {test}=require('node:test');
const assert=require('node:assert/strict');
const handler=require('./server');
function request(url){let body;const headers={};const res={statusCode:200,setHeader(k,v){headers[k]=v;},writeHead(status){this.statusCode=status;},end(value){body=value;}};handler({url},res);return {status:res.statusCode,body,headers};}
test('configuration exposes only browser-safe settings and refuses privileged keys',()=>{
 const oldUrl=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_PUBLISHABLE_KEY;
 try{
 process.env.SUPABASE_URL='https://example.supabase.co';process.env.SUPABASE_PUBLISHABLE_KEY='sb_publishable_test';
 assert.deepEqual(JSON.parse(request('/api/config').body),{supabaseUrl:'https://example.supabase.co',supabasePublishableKey:'sb_publishable_test'});
 process.env.SUPABASE_PUBLISHABLE_KEY='sb_secret_do_not_expose';assert.equal(request('/api/config').status,503);assert.ok(!request('/api/config').body.includes('sb_secret'));
 process.env.SUPABASE_PUBLISHABLE_KEY='eyJ.'+Buffer.from(JSON.stringify({role:'service_role'})).toString('base64url')+'.signature';assert.equal(request('/api/config').status,503);
 }finally{if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;if(oldKey===undefined)delete process.env.SUPABASE_PUBLISHABLE_KEY;else process.env.SUPABASE_PUBLISHABLE_KEY=oldKey;}
});
test('environment and database setup files are not publicly served',()=>{for(const p of ['/.env','/supabase/schema.sql','/package.json','/../server.js'])assert.equal(request(p).status,404);});
