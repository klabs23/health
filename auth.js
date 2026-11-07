import { createClient } from '@supabase/supabase-js';
const gate=document.querySelector('#auth-gate');
const message=document.querySelector('#auth-message');
const login=document.querySelector('#google-login');
let client, user, generation=0;
function locked(text){document.querySelector('#app-shell').hidden=true;gate.hidden=false;message.textContent=text;}
window.VitalAuth={
 async save(profile){if(!user)throw Error('Sign in to save your profile.');const {error}=await client.from('health_profiles').upsert({user_id:user.id,profile,updated_at:new Date().toISOString()});if(error)throw error;},
 async clear(){if(!user)throw Error('Sign in first.');const {error}=await client.from('health_profiles').delete().eq('user_id',user.id);if(error)throw error;}
};
async function sync(session){
 const version=++generation;user=null;window.setVitalProfile({});
 if(!session){locked('Sign in with Google to open your personal wellness space.');return;}
 locked('Loading your health profile…');
 const {data:{user:verified},error:verifyError}=await client.auth.getUser();
 if(version!==generation)return;
 if(verifyError||!verified){locked('Your session could not be verified. Please sign in again.');return;}
 const {data,error}=await client.from('health_profiles').select('profile').eq('user_id',verified.id).maybeSingle();
 if(version!==generation)return;
 if(error){locked('We could not load your profile. Check your connection and try signing in again.');return;}
 user=verified;window.setVitalProfile(data?.profile||{});
 document.querySelector('#account-name').textContent=verified.email||'Signed in';
 gate.hidden=true;document.querySelector('#app-shell').hidden=false;
}
login.onclick=async()=>{if(!client)return;login.disabled=true;message.textContent='Connecting to Google…';try{const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/',scopes:'openid email profile'}});if(error)throw error;}catch{message.textContent='Google sign-in could not start. Please try again.';login.disabled=false;}};
document.querySelector('#signout').onclick=async()=>{const {error}=await client.auth.signOut({scope:'local'});if(error){alert('Sign-out failed. Please try again.');return;}await sync(null);};
(async()=>{try{
 const response=await fetch('/api/config');if(!response.ok)throw Error();const config=await response.json();
 if(!config.supabaseUrl||!config.supabasePublishableKey){locked('Google sign-in is not configured yet. The site owner needs to connect Supabase and enable Google authentication.');return;}
 client=createClient(config.supabaseUrl,config.supabasePublishableKey,{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
 client.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>sync(session).catch(()=>locked('Unable to load your account. Please try again.')),0);});
 const {data,error}=await client.auth.getSession();if(error)throw error;login.disabled=false;await sync(data.session);
 }catch{locked('Authentication is temporarily unavailable. Please reload to try again.');}})();
