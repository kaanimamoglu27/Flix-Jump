/* Flix Jump · oyun döngüsü.
   Zıplama fiziği, platform üretimi, kamera ve ses motoru Nova Hop'tan uyarlandı
   (github.com/nikhilrana2715/Doodle-Jump-website-Game, ISC License, © 2025-2026 Nikhil Rana). */
'use strict';
const VERSION='1.3.4';
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const rand=(a,b)=>a+Math.random()*(b-a),chance=p=>Math.random()<p,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const GRAV=0.42,JUMP=-11.6,SPRING_V=-19.5,MAX_FALL=15,GW=390;
let GH=844;
// ---------- save
const SAVE_KEY='flixJump1';
let save={coins:0,tuy:0,best:0,bestEndless:0,skins:['kraliyet'],skin:'kraliyet',themes:['water'],theme:'water',muted:false,ctl:'tilt',enSkins:['none'],enSkin:'none',lang:null,how:false,noads:false,done:0,open:1,runs:0,tx:[]};
try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s)save=Object.assign(save,s);}catch(e){}
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));}catch(e){}}
if(!save.lang){const l=(navigator.language||'tr').slice(0,2).toLowerCase();save.lang=LANGS.includes(l)?l:'en';}
// ---------- i18n
function t(k,vars){let v=STR[k];v=v?v[LANGS.indexOf(save.lang)]||v[1]:k;if(vars)for(const q in vars)v=v.replace('{'+q+'}',vars[q]);return v;}
const lvName=n=>STR.L[n-1][LANGS.indexOf(save.lang)];
const skinName=id=>STR.skin[id][LANGS.indexOf(save.lang)],themeName=id=>STR.theme[id][LANGS.indexOf(save.lang)];
function applyLang(){document.documentElement.lang=save.lang;$$('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));$('#h1t').textContent=t(ctlEff()==='tilt'?'h1':'h1d');refreshMenu();}
// ---------- canvas / theme
const cv=$('#cv'),cx=cv.getContext('2d');
let TH=null,k=2,LV=LEVELS[0];
function setTheme(id){
  TH=buildTheme(id);fit();
  document.documentElement.style.setProperty('--hud',TH.font==='PS'?"'PS',monospace":TH.font==='Cinzel'?"'Cinzel',serif":TH.font==='Lucky'?"'Lucky',sans-serif":"'Baloo',sans-serif");
  cv.classList.toggle('pix',!!TH.pix);drawIcons();
}
function fit(){
  const r=$('#app').getBoundingClientRect();GH=clamp(Math.round(GW*r.height/Math.max(1,r.width)),560,1000);
  k=TH.k;cv.width=Math.round(GW*k);cv.height=Math.round(GH*k);TH.setLevel(LV,GW,GH);
}
window.addEventListener('resize',()=>{if(TH)fit();});
function sprInto(c,s,scale,ox,oy){const x=c.getContext('2d');x.imageSmoothingEnabled=!TH.pix;const sc=scale;x.drawImage(s.c,(ox!=null?ox:c.width/2)-s.ox*sc,(oy!=null?oy:c.height/2)-s.oy*sc,s.w*sc,s.h*sc);}
function drawIcons(){
  $$('.ic-tuy').forEach(c=>{c.getContext('2d').clearRect(0,0,44,44);sprInto(c,TH.spr.tuy,1.05,22,34);});
  $$('.ic-coin').forEach(c=>{c.getContext('2d').clearRect(0,0,44,44);sprInto(c,TH.spr.coin,1.7,22,22);});
}
// ---------- world
let state='menu',mode='level',tick=0,camY=0,alt=0,bonus=0,topGenY=0,lastEnemyY=0,shake=0,dyingT=0,winT=0,genDone=false,goalY=null;
let PL,plats,items,coins,tuys,ens,shots,orbs,parts,popups,boss,runCoins,runTuy,superCh,fireHeld=false,fireCd=0,passedBest=false,revived=false,lavaY=0,windT=0,windDir=1,segN=0,doubled=false,lastWon=false;
function mkPlat(x,y,w,type){return {x,y,w,type,vx:0,bounce:0,broken:false,fall:0,rot:0,dead:false,gone:0};}
const snapW=w=>PLAT_W.reduce((a,b)=>Math.abs(b-w)<Math.abs(a-w)?b:a);
function F(){return LV.f||{};}
let altBase=0,ckLv=0;
function ckBase(L){return L.boss?L.alt-420:Math.round(L.alt*.5);}
function resetWorld(base){altBase=base||0;
  plats=[];items=[];coins=[];tuys=[];ens=[];shots=[];orbs=[];parts=[];popups=[];boss=null;
  quipN=Math.floor(altBase/2600);alt=altBase;bonus=0;shake=0;dyingT=0;winT=0;lastEnemyY=0;runCoins=0;runTuy=0;superCh=0;passedBest=false;revived=false;genDone=false;goalY=null;windT=0;segN=0;doubled=false;
  plats.push(mkPlat(0,0,GW,'ground'));
  PL={x:GW/2,y:-34,vx:0,vy:0,r:34,hw:18,face:1,sx:1,sy:1,wing:0,shield:0,dead:false,throwT:0,rot:0,inv:0};
  camY=-GH*0.76;topGenY=0;lavaY=260;genUntil(camY-400);
}
function diff(){if(mode==='endless')return clamp(.05+alt/26000,0,1.15);return clamp(LV.D+(alt/LV.alt)*.12,0,1.1);}
function genUntil(lim){while(topGenY>lim&&!genDone)spawnRow();}
function spawnRow(){
  const d=diff(),f=F(),en=LV.en||{},bossPhase=!!LV.boss&&mode==='level'&&alt>=LV.alt-300;
  const lowg=f.lowg?1.35:1;
  const gap=rand(50+40*d,74+48*d)*lowg;topGenY-=gap;const y=topGenY;
  if(mode==='level'&&!LV.boss&&-y+altBase>=LV.alt){ // finish line
    const g=mkPlat(0,y,GW,'goal');plats.push(g);goalY=y;genDone=true;return;}
  let w=snapW(lerp(94,62,d)+rand(-6,6));if(f.tiny)w=snapW(rand(54,68));
  const x=rand(6,GW-w-6);
  let type=f.ice?'ice':'n';const r=Math.random();
  const pMove=(f.move||0)+(alt>500?.05+.12*d:0),pCloud=f.cloud||0;
  let moving=false;
  if(r<pMove)moving=true;else if(r<pMove+pCloud)type='cloud';
  const pl=mkPlat(x,y,w,type);
  if(moving){pl.mv=1;pl.vx=(rand(.7,1.3)+1.4*d)*(f.fast?1.5:1)*(chance(.5)?1:-1);}
  else if(f.vmove&&chance(f.vmove)){pl.by=y;pl.vt=rand(0,TAU);pl.va=rand(18,34);}
  if(f.blink&&chance(f.blink)&&type!=='cloud'){pl.blink=1;pl.ph=(Math.random()*170)|0;}
  plats.push(pl);
  if(!bossPhase&&alt>250&&chance((f.glass||0)+.06+.1*d)){const cw=snapW(rand(60,74));plats.push(mkPlat(rand(6,GW-cw-6),y+gap*.5,cw,'glass'));}
  let used=false;const q=Math.random(),pS=f.spring||.06;
  if(q<pS&&type!=='cloud'){items.push({kind:'spring',plat:pl,ox:rand(16,w-16),comp:0,t:0});used=true;}
  else if(q<pS+.012&&alt>1400){items.push({kind:'wing',plat:pl,ox:w/2,t:rand(0,60)});used=true;}
  else if(q<pS+.03&&alt>600){items.push({kind:'shield',plat:pl,ox:w/2,t:rand(0,60)});used=true;}
  const E=(name,base)=>(en[name]||0)*base*(.5+d);
  if(!used&&!bossPhase&&!pl.blink&&type!=='cloud'&&w>=72&&alt>600){
    if(chance(E('zombie',.12))){ens.push({k:'zombie',plat:pl,x:0,y:0,t:rand(0,100),vy:0,rot:0});used=true;}
    else if(chance(E('snake',.12))){ens.push({k:'snake',plat:pl,ox:w/2,dir:1,x:0,y:0,t:0,vy:0,rot:0});used=true;}
  }
  if(chance(.3)){const n=3+((Math.random()*3)|0),c0=rand(50,GW-50),col=chance(.5);
    for(let i=0;i<n;i++){const kk=n>1?i/(n-1):0;coins.push({x:col?c0:clamp(c0+(i-(n-1)/2)*26,14,GW-14),y:col?y-40-i*26:y-46-Math.sin(kk*Math.PI)*30,t:rand(0,TAU),got:false});}}
  if(alt>300&&chance(.03))tuys.push({x:rand(30,GW-30),y:y-60,t:0,got:false});
  if(!bossPhase&&alt>700&&y<lastEnemyY-(620-300*Math.min(1,d))){
    const pool=[['bat',E('bat',.16)],['ghost',E('ghost',.12)],['mine',E('mine',.14)],['drone',E('drone',.1)]];
    for(const [name,p] of pool){if(chance(p)){const amp=rand(20,90);const e={k:name,bx:rand(30+amp,GW-30-amp),x:0,y:y-gap*.5,t:rand(0,TAU),amp,spd:rand(.015,.03),vy:0,rot:0};
      if(name==='mine'){e.bx=rand(30,GW-30);e.amp=0;}if(name==='drone'){e.bx=chance(.5)?36:GW-36;e.amp=0;e.t=(Math.random()*200)|0;}
      e.x=e.bx;ens.push(e);lastEnemyY=y;break;}}
  }
}
// ---------- fx
function part(o){parts.push(Object.assign({x:0,y:0,vx:0,vy:0,g:0,life:30,size:3,color:'#fff',drag:.97,sq:false},o,{max:o.life||30}));}
function sparkle(x,y,n,cols){for(let i=0;i<n;i++){const a=rand(0,TAU),s=rand(1.5,4);part({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(16,30),size:rand(2.5,5),color:cols[i%cols.length],drag:.92});}}
function popup(x,y,text,col,size){popups.push({x,y,text,col,size:size||18,t:0});}
function toast(tx){const d=document.createElement('div');d.className='toast';d.textContent=tx;$('#app').appendChild(d);setTimeout(()=>d.remove(),1800);}
function note(tx){const d=document.createElement('div');d.className='note';d.textContent=tx;$('#app').appendChild(d);setTimeout(()=>d.remove(),4200);}
function vib(ms){try{if(window.FlixNative&&FlixNative.haptic)FlixNative.haptic(Array.isArray(ms)?ms[0]:ms);else navigator.vibrate&&navigator.vibrate(ms);}catch(e){}}
// ---------- input
let dragId=null,dragX=0,keys={l:false,r:false},sideDir=0,tiltX=0,tiltOn=false,tiltSeen=false,tiltWarned=false,tiltOrient=false;
function onOrient(e){let g=e.gamma;if(g==null)return;const ang=(screen.orientation&&screen.orientation.angle)||0;if(ang===90)g=e.beta||0;else if(ang===270||ang===-90)g=-(e.beta||0);tiltX=g;tiltSeen=true;tiltOrient=true;}
async function enableTilt(){if(tiltOn)return true;const D=window.DeviceOrientationEvent;if(!D)return false;
  if(typeof D.requestPermission==='function'){try{if((await D.requestPermission())!=='granted')return false;}catch(e){return false;}}
  window.addEventListener('deviceorientation',onOrient);tiltOn=true;
  try{const M=window.DeviceMotionEvent;if(M){const ios=typeof M.requestPermission==='function';if(ios){try{await M.requestPermission();}catch(e){}}
    window.addEventListener('devicemotion',e=>{const a=e.accelerationIncludingGravity;if(!a||a.x==null||tiltOrient)return;const gx=clamp((ios?1:-1)*a.x/9.81,-1,1);tiltX=Math.asin(gx)*57.3;tiltSeen=true;});}}catch(e){}
  return true;}
function ctlEff(){return save.ctl==='tilt'&&(tiltWarned&&!tiltSeen)?'drag':save.ctl;}
cv.addEventListener('pointerdown',e=>{if(state!=='play')return;const m=ctlEff();if(fireCd<=8)shoot();
  if(m==='tilt'){fireHeld=true;dragId=e.pointerId;return;}
  if(dragId!==null)return;
  dragId=e.pointerId;dragX=e.clientX;sideDir=e.clientX<cv.getBoundingClientRect().width/2?-1:1;try{cv.setPointerCapture(e.pointerId);}catch(er){}});
cv.addEventListener('pointermove',e=>{if(e.pointerId!==dragId||state!=='play'||!PL||PL.dead)return;const r=cv.getBoundingClientRect(),m=ctlEff();
  if(m==='drag'){const dx=(e.clientX-dragX)*GW/r.width*1.25;PL.x+=dx*(F().ice?.8:1);PL.vx=dx;if(Math.abs(dx)>.3)PL.face=dx>0?1:-1;}
  else if(m==='side')sideDir=e.clientX-r.left<r.width/2?-1:1;
  dragX=e.clientX;});
['pointerup','pointercancel','lostpointercapture'].forEach(n=>cv.addEventListener(n,e=>{if(e.pointerId===dragId){dragId=null;sideDir=0;if(ctlEff()==='tilt')fireHeld=false;}}));
window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='a')keys.l=true;if(e.key==='ArrowRight'||e.key==='d')keys.r=true;if(e.key===' '||e.key==='ArrowUp'){fireHeld=true;e.preventDefault();}if(e.key==='Shift')doSuper();if(e.key==='Escape'&&state==='play')pauseGame();});
window.addEventListener('keyup',e=>{if(e.key==='ArrowLeft'||e.key==='a')keys.l=false;if(e.key==='ArrowRight'||e.key==='d')keys.r=false;if(e.key===' '||e.key==='ArrowUp')fireHeld=false;});
$('#superB').addEventListener('pointerdown',e=>{e.preventDefault();doSuper();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pauseGame();});
// ---------- actions
function shoot(){if(state!=='play'||PL.dead)return;fireCd=15;PL.throwT=10;let vx=PL.vx*.2,vy=-14,bd=1e9,tg=null;for(const e of (boss&&!boss.dead?ens.concat([boss]):ens)){if(e.dead||e.y>PL.y-20||e.y<camY-10)continue;const d=Math.hypot(e.x-PL.x,e.y-PL.y);if(d<bd){bd=d;tg=e;}}
  if(tg){const dx=tg.x-PL.x,dy=tg.y-(PL.y-30),m=Math.hypot(dx,dy)||1;vx=dx/m*14;vy=Math.min(dy/m*14,-10);if(Math.abs(dx)>6)PL.face=dx>0?1:-1;}
  shots.push({x:PL.x+PL.face*14,y:PL.y-30,vx,vy,rot:0});Sfx.click();}
function doSuper(){if(state!=='play'||PL.dead||superCh<1)return;superCh=0;updSuper();Sfx.power();vib(40);shake=10;toast(t('super'));
  for(let i=0;i<14;i++)shots.push({x:rand(20,GW-20),y:camY+GH+rand(0,80),vx:0,vy:-rand(15,19),rot:rand(0,6),big:true});PL.wing=Math.max(PL.wing,80);}
function updSuper(){const b=$('#superB');b.style.setProperty('--ch',Math.round(superCh*100)+'%');b.classList.toggle('ready',superCh>=1);}
function land(pl){
  PL.y=pl.y-PL.r;pl.bounce=1;const jm=F().lowg?.9:1;
  if(pl.type==='goal'){PL.vy=JUMP;if(state==='play')winLevel();return;}
  const sp=items.find(it=>it.kind==='spring'&&it.plat===pl&&Math.abs(PL.x-(pl.x+it.ox))<PL.hw+12);
  if(sp){PL.vy=SPRING_V*jm;sp.comp=1;if(state==='play'){Sfx.spring();vib(15);popup(PL.x,PL.y-40,'BOING!','#ffc20e',22);shake=4;}}
  else{PL.vy=(state==='menu'?-9:JUMP)*jm;if(state==='play')Sfx.jump();}
  PL.sx=1.3;PL.sy=.72;
  if(pl.type==='cloud'){pl.gone=.01;Sfx.cloud();}
  for(let i=0;i<5;i++)part({x:PL.x+rand(-10,10),y:pl.y,vx:rand(-1.5,1.5),vy:rand(-1,0),life:18,size:rand(2,4),color:TH.C.white,drag:.9});
}
function breakPlat(pl){pl.broken=true;Sfx.crumble();for(let i=0;i<8;i++)part({x:pl.x+rand(0,pl.w),y:pl.y+5,vx:rand(-2,2),vy:rand(-2,1),g:.3,life:rand(30,45),size:rand(2,5),color:i%2?TH.C.pink:TH.C.glass,sq:true});}
function killFx(x,y,label,pts){bonus+=pts;Sfx.stomp();vib(25);shake=6;popup(x,y-24,'+'+pts,'#ffffff',15);sparkle(x,y,12,[TH.C.yellow,TH.C.white,TH.C.pink]);parts.push({burst:true,x,y,life:14,max:14});}
function hitPlayer(){if(PL.wing>0||PL.inv>0)return false;if(PL.shield){PL.shield=0;PL.inv=40;Sfx.shield();popup(PL.x,PL.y-40,t('shield'),'#2fe8ff',20);PL.vy=JUMP;return false;}die(false);return true;}
const EN={bat:{r:24,pts:50,stomp:1},ghost:{r:20,pts:60,stomp:1},mine:{r:18,pts:30,stomp:0},drone:{r:20,pts:70,stomp:1},zombie:{r:22,pts:40,stomp:1,oy:-42},snake:{r:16,pts:40,stomp:1,oy:-12}};
const BOSS={king:{hp:16,spr:'king',w:56,h:70},dragon:{hp:32,spr:'dragon',w:70,h:60},golem:{hp:62,spr:'golem',w:66,h:66},vorteks:{hp:56,spr:'vorteks',w:50,h:80}};
// ---------- update
function update(){
  tick++;
  if(state==='over'||state==='paused'||state==='hold')return;
  const playing=state==='play',f=F();
  if(fireCd>0)fireCd--;if(fireHeld&&fireCd<=0&&playing)shoot();if(PL.throwT>0)PL.throwT--;if(PL.inv>0)PL.inv--;
  if(state==='menu'){const nx=GW/2+Math.sin(tick*.012)*110;PL.vx=nx-PL.x;PL.x=nx;if(Math.abs(PL.vx)>.2)PL.face=PL.vx>0?1:-1;}
  else if(playing&&!PL.dead){
    const m=ctlEff();let ax=(keys.r?1:0)-(keys.l?1:0);
    if(!ax&&m==='side'&&dragId!==null)ax=sideDir;
    if(!ax&&m==='tilt'&&tiltSeen){const v=tiltX/15;ax=Math.abs(v)<.07?0:clamp(v,-1,1);}
    if(m==='tilt'&&!tiltSeen&&!tiltWarned&&tick>200){tiltWarned=true;note(t('tiltOff'));$('#h1t').textContent=t('h1d');}
    const grip=f.ice?.085:.24;
    if(ax||m!=='drag'||keys.l||keys.r){PL.vx+=(ax*(m==='tilt'?9:6.6)-PL.vx)*grip;PL.x+=PL.vx;if(Math.abs(ax)>.12)PL.face=ax>0?1:-1;}
    else if(dragId===null){if(f.ice){PL.vx*=.97;PL.x+=PL.vx*.5;}else PL.vx*=.8;}
    if(f.wind){windT++;const ph=windT%420;if(ph===240){windDir=chance(.5)?1:-1;popup(GW/2,camY+GH*.3,(windDir<0?'‹‹ ':'')+t('windL')+(windDir>0?' ››':''),'#ffffff',22);}
      if(ph>240&&ph<400){PL.x+=windDir*1.5;if(tick%2===0)part({x:windDir>0?-10:GW+10,y:camY+rand(0,GH),vx:windDir*rand(9,13),vy:0,life:40,size:rand(2,3),color:TH.C.white,drag:1,sq:true,wide:1});}}
  }
  if(PL.x<-PL.hw)PL.x+=GW+2*PL.hw;else if(PL.x>GW+PL.hw)PL.x-=GW+2*PL.hw;
  const g=GRAV*(f.lowg?.55:1);
  if(PL.wing>0){PL.wing--;PL.vy=Math.max(PL.vy-1.1,-15);if(tick%2===0)part({x:PL.x+rand(-8,8),y:PL.y+30,vx:rand(-1,1),vy:rand(3,5),life:20,size:rand(3,6),color:[TH.C.blue,TH.C.green,TH.C.yellow][tick%3],drag:.94});if(PL.wing===0)PL.vy=-7;}
  else PL.vy=Math.min(PL.vy+g,MAX_FALL);
  const prevFeet=PL.y+PL.r;PL.y+=PL.vy;const feet=PL.y+PL.r;
  if(PL.dead)PL.rot+=.15;
  const st=clamp(-PL.vy/30,-.12,.25);PL.sx=lerp(PL.sx,1-st*.5,.22);PL.sy=lerp(PL.sy,1+st,.22);
  for(const pl of plats){if(pl.bounce>0)pl.bounce=Math.max(0,pl.bounce-.06);
    if(pl.mv){pl.x+=pl.vx;if(pl.x<4){pl.x=4;pl.vx*=-1;}else if(pl.x+pl.w>GW-4){pl.x=GW-4-pl.w;pl.vx*=-1;}}
    if(pl.by!=null&&!pl.broken){pl.vt+=.03;pl.y=pl.by+Math.sin(pl.vt)*pl.va;}
    if(pl.broken){pl.fall+=.45;pl.y+=pl.fall;pl.rot+=.04;}
    if(pl.gone>0)pl.gone=Math.min(1,pl.gone+.06);
    if(pl.blink)pl.off=((tick+pl.ph)%170)>=110;}
  if(PL.vy>0&&!PL.dead&&PL.wing===0){for(const pl of plats){if(pl.broken||pl.gone>0||pl.off)continue;if(state==='menu'&&pl.type!=='ground')continue;
    if(prevFeet<=pl.y+6&&feet>=pl.y&&PL.x+PL.hw>pl.x&&PL.x-PL.hw<pl.x+pl.w){if(pl.type==='glass'){breakPlat(pl);continue;}land(pl);break;}}}
  for(const it of items){it.t++;if(it.comp>0)it.comp=Math.max(0,it.comp-.07);if(it.kind==='spring'||it.got||!playing||PL.dead)continue;
    const ix=it.plat.x+it.ox,iy=it.plat.y-30+Math.sin(it.t*.06)*4;
    if(Math.hypot(PL.x-ix,PL.y-iy)<PL.hw+20){it.got=true;Sfx.power();vib(20);sparkle(ix,iy,14,[TH.C.white,TH.C.cyan,TH.C.yellow]);
      if(it.kind==='wing'){PL.wing=140;popup(ix,iy-20,t('wing'),'#ffc20e',22);}else{PL.shield=1;popup(ix,iy-20,t('shield'),'#2fe8ff',22);}}}
  for(const c of coins){c.t+=.07;if(c.got||!playing||PL.dead)continue;if(Math.hypot(PL.x-c.x,PL.y-10-c.y)<PL.hw+14){c.got=true;runCoins++;bonus+=5;superCh=Math.min(1,superCh+1/25);updSuper();Sfx.coin(runCoins%8);sparkle(c.x,c.y,5,[TH.C.gold,TH.C.white]);}}
  for(const q of tuys){q.t++;if(q.got||!playing||PL.dead)continue;if(Math.hypot(PL.x-q.x,PL.y-10-q.y)<PL.hw+18){q.got=true;runTuy++;Sfx.unlock();vib(20);popup(q.x,q.y-20,'+1','#ffc20e',22);sparkle(q.x,q.y,14,[TH.C.blue,TH.C.green,TH.C.yellow]);}}
  // shots
  for(const s of shots){s.y+=s.vy;s.x+=s.vx;s.rot+=.35;s.life=(s.life||0)+1;if(s.vy>-10&&!s.big)s.vy-=.6;
    let best=null,bd=150;for(const e of ens){if(e.dead)continue;const dy=s.y-e.y;if(dy<0||dy>420)continue;const dx=Math.abs(e.x-s.x);if(dx<bd){bd=dx;best=e;}}
    if(boss&&!boss.dead&&boss.vis){const dx=Math.abs(boss.x-s.x);if(dx<bd){bd=dx;best=boss;}}
    if(best&&!s.big)s.vx=clamp(s.vx+Math.sign(best.x-s.x)*.45,-5,5);
    for(const e of ens){if(e.dead)continue;const d=EN[e.k];if(Math.hypot(e.x-s.x,e.y+(d.oy||0)-s.y)<d.r+8){e.dead=true;e.vy=-3;s.hit=true;killFx(e.x,e.y+(d.oy||0),t('pat'),d.pts);break;}}
    if(!s.hit&&boss&&!boss.dead&&boss.vis&&boss.y>camY-60){const B=BOSS[boss.kind];if(Math.abs(boss.x-s.x)<B.w&&Math.abs(boss.y-20-s.y)<B.h){s.hit=true;bossHit(s.big?2:1);}}
  }
  shots=shots.filter(s=>!s.hit&&s.y>camY-60&&s.life<150);
  // enemies
  for(const e of ens){const d=EN[e.k];
    if(e.dead){e.vy+=.5;e.y+=e.vy;e.rot+=.2;continue;}
    if(e.plat){if(e.plat.broken||e.plat.dead){e.dead=true;continue;}
      if(e.k==='snake'){e.ox+=e.dir*.8;if(e.ox>e.plat.w-14){e.dir=-1;}else if(e.ox<14){e.dir=1;}e.x=e.plat.x+e.ox;}else{e.t++;e.x=e.plat.x+e.plat.w/2;}
      e.y=e.plat.y;}
    else if(e.k==='ghost'){e.t+=.05;if(e.y>camY-40&&e.y<camY+GH+40&&playing){const dx=PL.x-e.x,dy=PL.y-e.y,dd=Math.hypot(dx,dy)||1;e.x+=dx/dd*(1+.6*diff());e.y+=dy/dd*(.8+.5*diff());}e.y+=Math.sin(e.t)*.4;}
    else if(e.k==='drone'){e.t++;e.x=e.bx;const ph=e.t%250;e.warn=ph>=130&&ph<180;e.fire=ph>=180&&ph<222;if(ph===180&&e.y>camY&&e.y<camY+GH)Sfx.shield();
      if(e.fire&&playing&&!PL.dead&&Math.abs(PL.y-(e.y+2))<24)hitPlayer();}
    else{e.t+=e.spd;e.x=e.bx+Math.sin(e.t)*e.amp;}
    if(!playing||PL.dead)continue;
    const ey=e.y+(d.oy||0);
    if(Math.abs(PL.x-e.x)<PL.hw+d.r-2&&Math.abs(PL.y-ey)<PL.r*.8+d.r){
      if(PL.wing>0){e.dead=true;e.vy=-3;killFx(e.x,ey,t('pat'),d.pts);}
      else if(d.stomp&&PL.vy>0&&PL.y<ey-d.r*.4){e.dead=true;e.vy=-3;killFx(e.x,ey,t('stomp'),d.pts);PL.vy=JUMP*1.15;}
      else if(!hitPlayer()){e.dead=true;e.vy=-3;}}
  }
  updateBoss(playing);
  for(const o of orbs){o.vy+=o.g||0;o.x+=o.vx;o.y+=o.vy;if(playing&&!PL.dead&&Math.hypot(PL.x-o.x,PL.y-o.y)<PL.hw+10){o.hit=true;hitPlayer();}}
  orbs=orbs.filter(o=>!o.hit&&o.y<camY+GH+40&&o.y>camY-300);
  // camera
  if(playing){
    const target=PL.y-GH*.42;if(target<camY)camY=lerp(camY,target,.22);if(PL.y-camY<90)camY=PL.y-90;
    if(f.auto&&alt>200&&!genDone)camY-=f.auto*(mode==='endless'?.7:1);
    alt=Math.max(alt,altBase-(PL.y+PL.r));
    if(mode==='level'&&ckLv!==LV.n&&alt>=ckBase(LV)+(LV.boss?0:40)&&altBase<ckBase(LV)){ckLv=LV.n;if(!LV.boss)note(t('ckpt'));}genUntil(camY-300);
    if(mode==='endless'){const sn=Math.floor(alt/2200);if(sn!==segN){segN=sn;endlessSegment();}}
    const bottom=camY+GH+140;
    plats=plats.filter(pl=>{const kp=pl.y<bottom&&pl.gone<1;if(!kp)pl.dead=true;return kp;});
    items=items.filter(it=>!it.got&&!it.plat.dead);coins=coins.filter(c=>!c.got&&c.y<bottom);tuys=tuys.filter(q=>!q.got&&q.y<bottom);
    ens=ens.filter(e=>e.y<bottom+200);
    if(f.lava&&mode!=='menu'){lavaY=Math.min(lavaY-f.lava*(.75+.3*diff()),camY+GH+70);if(PL.y+PL.r>lavaY+8&&PL.wing===0){if(PL.shield||PL.inv>0){PL.shield=0;PL.inv=50;PL.vy=SPRING_V;Sfx.shield();}else die(false);}}
    const best=mode==='endless'?save.bestEndless:save.best;
    if(!passedBest&&best>0&&score()>best){passedBest=true;popup(PL.x,PL.y-60,t('newBest'),'#ffc20e',24);Sfx.best();}
    quipTick();
    if(goalY!=null&&PL.y<goalY-140)winLevel();
    if(PL.y-PL.r>camY+GH)die(true);
    updHUD();
  }else if(state==='dying'){dyingT++;camY=lerp(camY,PL.y-GH*.5,.06);if(dyingT>60)gameOver();}
  else if(state==='win'){winT++;PL.wing=5;camY=lerp(camY,camY-2,.5);if(winT===70)finishWin();}
  for(const p of parts){if(p.burst){p.life--;continue;}p.vx*=p.drag;p.vy=p.vy*p.drag+p.g;p.x+=p.vx;p.y+=p.vy;p.life--;}
  parts=parts.filter(p=>p.life>0);if(parts.length>260)parts.splice(0,parts.length-260);
  if(skyFade>0)skyFade--;
  for(const u of popups)u.t++;popups=popups.filter(u=>u.t<50);
  if(shake>0)shake*=.85;if(shake<.3)shake=0;
}
let quipN=0;
function quip(tx,final){const d=document.createElement('div');d.className='quip '+(quipN%2?'r':'l')+(final?' fin':'');d.textContent=tx;$('#app').appendChild(d);setTimeout(()=>d.remove(),final?6000:4600);}
function quipTick(){const Q=STR.quips,li=LANGS.indexOf(save.lang)<0?0:LANGS.indexOf(save.lang);
  if(mode==='endless'){const N=Q.length;if(quipN>N)return;if(alt>=2500*(quipN+1)){quipN++;if(quipN>N){quip(STR.quipEnd[li],true);}else quip(Q[quipN-1][li]);}return;}
  if(mode!=='level'||LV.boss&&alt>=LV.alt-300)return;
  if(alt>=2600*(quipN+1)&&alt<LV.alt-500){quipN++;quip(Q[(LV.n*5+quipN*3)%Q.length][li]);}}
function endlessSegment(){ // new look + mechanics every 2200 units
  const pool=LEVELS.filter(L=>!L.boss);const L=pool[(segN*3+1)%pool.length];
  LV=Object.assign({},L,{boss:null,alt:1e9,en:Object.assign({zombie:.6,bat:.6},L.en)});
  TH.setLevel(LV,GW,GH);lavaY=camY+GH+260;toast(lvName(L.n));Sfx.zone();
}
function updateBoss(playing){
  if(playing&&!boss&&LV.boss&&mode==='level'&&alt>=LV.alt){const B=BOSS[LV.boss];boss={kind:LV.boss,x:GW/2,y:camY-220,hp:bossKeep[LV.n]||B.hp,max:B.hp,t:0,dead:false,flash:0,vy:0,rot:0,vis:true,a:1};
    $('#bossBar').hidden=false;$('#bossF').style.width=(boss.hp/boss.max*100)+'%';$('#bossN').textContent=t('b_'+LV.boss);toast(t('b_'+LV.boss)+'!');Sfx.zone();shake=8;PL.shield=1;}
  if(!boss)return;
  if(boss.dead){boss.vy+=.35;boss.y+=boss.vy;boss.rot+=.06;winT++;if(winT>90&&state==='play')winLevel();return;}
  boss.t++;if(boss.flash>0)boss.flash--;const b=boss,ty=camY+150,low=b.hp<b.max*.45;
  const orb=(vx,vy,spr,g)=>orbs.push({x:b.x,y:b.y-10,vx,vy,spr:spr||'orb',g:g||0});
  if(b.kind==='king'){b.y=lerp(b.y,ty,.05);b.x=GW/2+Math.sin(b.t*.018)*120;
    if(playing&&b.t>80&&b.t%(low?150:200)===0){orb(clamp((PL.x-b.x)/120,-1.4,1.4),2.1);Sfx.cloud();}}
  else if(b.kind==='dragon'){b.y=lerp(b.y,ty+Math.sin(b.t*.045)*46,.06);b.x=GW/2+Math.sin(b.t*.028)*150;
    if(playing&&b.t>80&&b.t%(low?52:72)===0){orb(0,2.8,'fire');}
    if(playing&&b.t%300===299)Sfx.zone();}
  else if(b.kind==='golem'){b.y=lerp(b.y,ty,.05);b.x=GW/2+Math.sin(b.t*.01)*70;
    if(playing&&b.t>100&&b.t%(low?130:180)===0){shake=14;Sfx.crumble();vib(40);
      const vis=plats.filter(p=>p.type!=='ground'&&!p.broken&&p.y>camY+220&&p.y<camY+GH&&!(Math.abs(p.x+p.w/2-PL.x)<70&&p.y>PL.y));
      for(let i=0;i<2&&vis.length;i++)breakPlat(vis.splice((Math.random()*vis.length)|0,1)[0]);
      orb(-2.2,-3,'rock',.14);orb(2.2,-3,'rock',.14);if(low)orb(clamp((PL.x-b.x)/60,-3,3),-2,'rock',.14);}}
  else if(b.kind==='vorteks'){b.y=lerp(b.y,ty,.08);const ph=b.t%170;
    if(ph===0){b.tx=rand(70,GW-70);}if(ph<16)b.a=1-ph/16;else if(ph===16){b.x=b.tx||b.x;}else if(ph<32)b.a=(ph-16)/16;else b.a=1;b.vis=b.a>.5;
    if(playing&&(ph===60||(low&&ph===110))){const n=low?4:3;for(let i=0;i<n;i++)orb((i-(n-1)/2)*1.5,2.7);Sfx.cloud();}
    if(playing&&b.t%420===200){ens.push({k:'bat',bx:GW/2,x:GW/2,y:camY-30,t:0,amp:120,spd:.03,vy:0,rot:0});}}
  if(playing&&!PL.dead&&b.vis&&Math.hypot(PL.x-b.x,PL.y-b.y-10)<PL.hw+42){if(PL.vy>0&&PL.y<b.y-44){bossHit(2);PL.vy=JUMP*1.2;}else hitPlayer();}
}
const bossKeep={};
function bossHit(n){if(!boss||boss.dead)return;boss.hp-=n;bossKeep[LV.n]=Math.max(4,boss.hp);if(boss.hp<=0)delete bossKeep[LV.n];boss.flash=8;Sfx.stomp();shake=5;sparkle(boss.x,boss.y-20,8,[TH.C.yellow,TH.C.white,TH.C.purple]);parts.push({burst:true,x:boss.x+rand(-20,20),y:boss.y-30,life:14,max:14});
  $('#bossF').style.width=Math.max(0,boss.hp/boss.max*100)+'%';
  if(boss.hp<=0){boss.dead=true;boss.vy=-6;boss.a=1;bonus+=500;popup(GW/2,boss.y-80,t('bossDown'),'#ffc20e',24);Sfx.best();vib(60);orbs=[];shake=14;winT=0;
    for(const e of ens)if(!e.dead){e.dead=true;e.vy=-3;}}}
function score(){return Math.floor(alt/10)+bonus;}
function die(fall){if(PL.dead||state!=='play')return;PL.dead=true;state='dying';dyingT=0;fireHeld=false;vib(80);PL.fell=fall;if(fall)Sfx.fall();else{Sfx.hit();PL.vy=-8;}}
// ---------- end of run
function fillOver(coinGain,tuyGain){const sc=score();$('#oScore').textContent=sc;$('#oBest').textContent=mode==='endless'?save.bestEndless:save.best;$('#oCoin').textContent='+'+coinGain;$('#oTuy').textContent='+'+tuyGain;}
let lastGain={c:0,t:0};
function settle(won){
  const sc=score();let tuyGain=runTuy,coinGain=runCoins;
  if(won){const first=save.done<LV.n;tuyGain+=first?levelReward(LV.n):3;coinGain+=60+LV.n*10;if(first){save.done=LV.n;}}
  save.coins+=coinGain;save.tuy+=tuyGain;save.runs++;
  if(mode==='endless'){if(sc>save.bestEndless)save.bestEndless=sc;}else if(sc>save.best)save.best=sc;
  persist();lastGain={c:coinGain,t:tuyGain};lastWon=won;fillOver(coinGain,tuyGain);
}
function overButtons(){
  const ad=$('#adB'),mb=$('#mainB');
  if(lastWon){ad.hidden=doubled;ad.textContent=t('dbl');ad.onclick=()=>Ads.rewarded().then(ok=>{if(!ok)return;doubled=true;save.coins+=lastGain.c;save.tuy+=lastGain.t;persist();fillOver(lastGain.c*2,lastGain.t*2);ad.hidden=true;Sfx.unlock();});
    const nx=LV.n+1;
    if(nx>20){mb.hidden=true;}
    else{mb.hidden=false;const open=save.open>=nx;mb.innerHTML=open?t('next'):`${t('unlockFor',{n:levelCost(nx)})} <canvas class="ic ic-tuy" width="44" height="44"></canvas>`;drawIcons();
      mb.onclick=()=>{if(save.open>=nx)return goLevel(nx);tryUnlock(nx,()=>goLevel(nx));};}
  }else{
    mb.hidden=true;ad.hidden=revived||mode==='menu';ad.textContent=t('revive');ad.onclick=()=>Ads.rewarded().then(ok=>{if(ok)revive();});
  }
}
function gameOver(){state='over';Sfx.over();settle(false);$('#overT').textContent=t(PL.fell?'fell':'hit');$('#overSub').textContent=mode==='endless'?t('endless'):t('level')+' '+LV.n+' · '+lvName(LV.n);overButtons();$('#hud').hidden=true;show('#over');Ads.maybeInterstitial();}
function winLevel(){if(state!=='play')return;ckLv=0;state='win';winT=0;fireHeld=false;Sfx.best();vib(40);for(let i=0;i<40;i++)part({x:rand(0,GW),y:camY+rand(0,GH*.6),vx:rand(-2,2),vy:rand(-1,3),g:.08,life:rand(50,90),size:rand(4,7),color:[TH.C.blue,TH.C.green,TH.C.yellow,TH.C.red][i%4],sq:true,drag:.99});}
let oldSky=null,skyFade=0;
function carryOn(nx){ // next level without a cut: same run keeps going up, the sky fades over
  const c=document.createElement('canvas');c.width=TH.sky.width;c.height=TH.sky.height;c.getContext('2d').drawImage(TH.sky,0,0);oldSky=c;skyFade=70;
  const off=-(PL.y+PL.r);
  for(const p of plats){p.y+=off;if(p.by!=null)p.by+=off;}for(const a of [coins,tuys,ens,shots,orbs,parts,popups])for(const o of a)o.y+=off;
  PL.y+=off;camY+=off;boss=null;orbs=[];
  mode='level';LV=LEVELS[nx-1];TH.setLevel(LV,GW,GH);
  altBase=0;ckLv=0;alt=0;bonus=0;runCoins=0;runTuy=0;winT=0;genDone=false;goalY=null;passedBest=false;revived=false;doubled=false;windT=0;lastEnemyY=0;quipN=0;
  topGenY=camY-30;lavaY=camY+GH+320;PL.wing=34;PL.inv=120;
  begin();introBanner(t(LV.boss?'bossLv':'level')+' '+nx,lvName(nx));Sfx.zone();
}
function finishWin(){const nx=LV.n+1,n0=LV.n;settle(true);
  if(nx<=20){const cost=levelCost(nx);if(save.open<nx&&save.tuy>=cost){save.tuy-=cost;save.open=nx;persist();}
    if(save.open>=nx){popup(PL.x,PL.y-70,t('done'),'#ffc20e',24);note('+'+lastGain.c+' '+t('coinsWon')+' · +'+lastGain.t+' '+t('tuy'));return carryOn(nx);}}
  irisDo(PL,()=>{state='over';$('#overT').textContent=t('done');$('#overSub').textContent=t('level')+' '+LV.n+' · '+lvName(LV.n);overButtons();$('#hud').hidden=true;show('#over');Ads.maybeInterstitial();});}
function revive(){revived=true;const p=plats.filter(q=>q.type!=='glass'&&!q.broken&&q.y>camY+GH*.3&&q.y<camY+GH*.9)[0];
  PL.dead=false;PL.rot=0;PL.x=p?p.x+p.w/2:GW/2;PL.y=(p?p.y:camY+GH*.6)-80;PL.vy=JUMP;PL.wing=70;PL.shield=1;PL.inv=90;camY=Math.min(camY,PL.y-GH*.5);lavaY=Math.max(lavaY,camY+GH+260);
  save.coins-=lastGain.c;save.tuy-=lastGain.t;persist();state='play';show(null);$('#hud').hidden=false;}
// ---------- render
function blit(s,x,y,o){
  if(!s)return;const sy0=y-camY;
  if(TH.pix&&!o){cx.drawImage(s.c,Math.round((x-s.ox)*k),Math.round((sy0-s.oy)*k));return;}
  cx.save();cx.translate(TH.pix?Math.round(x*k):x*k,TH.pix?Math.round(sy0*k):sy0*k);
  if(o){if(o.rot)cx.rotate(o.rot);if(o.flip)cx.scale(-1,1);if(o.sx)cx.scale(o.sx,o.sy);if(o.a!=null)cx.globalAlpha=o.a;}
  cx.drawImage(s.c,-s.ox*k,-s.oy*k,s.w*k,s.h*k);cx.restore();
}
function draw(){
  cx.setTransform(1,0,0,1,0,0);cx.imageSmoothingEnabled=!TH.pix;
  const shx=shake?rand(-shake,shake)*k:0,shy=shake?rand(-shake,shake)*k:0,C=TH.C;
  cx.drawImage(TH.sky,0,0,cv.width,cv.height);
  if(skyFade>0&&oldSky){cx.globalAlpha=skyFade/70;cx.drawImage(oldSky,0,0,cv.width,cv.height);cx.globalAlpha=1;}
  cx.translate(shx,shy);
  if(TH.city&&mode!=='endless'||TH.city&&alt<900){const cb=GH+(-camY-GH*.76)*.35;if(cb-TH.cityH<GH)cx.drawImage(TH.city,0,Math.round((cb-TH.cityH)*k),cv.width,TH.cityH*k);}
  for(const pl of plats){if(pl.y-camY>GH+30||pl.y-camY<-60)continue;
    if(pl.type==='ground'){blit(TH.spr.ground,0,pl.y);continue;}
    if(pl.type==='goal'){blit(TH.spr.goalplat,0,pl.y);blit(TH.spr.goal,GW/2,pl.y-4+Math.sin(tick*.08)*3);continue;}
    const s=TH.getPlat(pl.mv&&pl.type==='n'?'move':pl.type,pl.w);const yb=pl.y+pl.bounce*3;
    if(pl.broken)blit(s,pl.x,yb,{rot:pl.rot*.3,a:Math.max(0,1-pl.fall/14)});
    else if(pl.gone>0)blit(s,pl.x,yb,{a:1-pl.gone});
    else if(pl.blink){const ph=(tick+pl.ph)%170;blit(s,pl.x,yb,{a:pl.off?.16:ph>90?(Math.floor(ph/4)%2?.5:1):1});}
    else blit(s,pl.x,yb);}
  for(const it of items){const ix=it.plat.x+it.ox,iy=it.plat.y;
    if(it.kind==='spring')blit(TH.spr.spring,ix,iy+1,it.comp?{sx:1,sy:1-it.comp*.3}:null);
    else blit(it.kind==='wing'?TH.spr.wing:TH.spr.shield,ix,iy-30+Math.sin(it.t*.06)*4);}
  for(const c of coins)blit(TH.spr.coin,c.x,c.y+Math.sin(c.t)*2,{sx:Math.max(.25,Math.abs(Math.cos(c.t*.8))),sy:1});
  for(const q of tuys)blit(TH.spr.tuy,q.x,q.y+Math.sin(q.t*.08)*4);
  for(const e of ens){if(e.y-camY>GH+80||e.y-camY<-80)continue;
    if(e.k==='drone'&&(e.warn||e.fire)){const yy=Math.round((e.y+2-camY)*k);cx.save();cx.globalAlpha=e.fire?.9:.35+.3*Math.sin(tick*.6);cx.fillStyle=TH.id==='onebit'?C.ink:C.pink;const hh=(e.fire?8:2)*k;cx.fillRect(0,yy-hh/2,cv.width,hh);if(e.fire){cx.fillStyle=C.white;cx.fillRect(0,yy-k,cv.width,2*k);}cx.restore();}
    const o=e.dead?{rot:e.rot}:e.k==='zombie'?(Math.sin(e.t*.05)>0?{flip:true}:null):e.k==='snake'?(e.dir<0?{flip:true}:null):e.k==='ghost'?(PL.x<e.x?{flip:true}:null):null;
    blit(TH.spr[e.k],e.x,e.y+(e.k==='bat'&&!e.dead?Math.sin(tick*.2+e.t)*2:e.k==='mine'?Math.sin(tick*.05+e.bx)*3:0),o);}
  if(boss){const B=BOSS[boss.kind];blit(TH.spr[B.spr],boss.x,boss.y,boss.dead?{rot:boss.rot}:{a:(boss.flash&&boss.flash%2?.45:1)*boss.a});}
  for(const o of orbs)blit(TH.spr[o.spr],o.x,o.y,o.spr==='rock'?{rot:tick*.1}:null);
  for(const s of shots)blit(TH.spr.toy,s.x,s.y,{rot:s.rot,sx:s.big?1.3:1,sy:s.big?1.3:1});
  if(PL){const pose=PL.dead||PL.vy>2?'fall':'up';const hs=heroSprite(TH,save.skin,pose);
    if(PL.shield){cx.save();cx.globalAlpha=.3+.1*Math.sin(tick*.2);cx.fillStyle=C.cyan;cx.beginPath();cx.arc(PL.x*k,(PL.y-camY-6)*k,46*k,0,TAU);cx.fill();cx.restore();}
    blit(hs,PL.x,PL.y-6,{flip:PL.face<0,rot:PL.rot,sx:PL.sx,sy:PL.sy,a:PL.inv>0&&tick%6<3?.5:1});
    if(PL.throwT>0)blit(TH.spr.toy,PL.x+PL.face*24,PL.y-44,{rot:PL.face*.4});}
  // lava
  if(F().lava&&state!=='menu'){const ly=(lavaY-camY)*k;if(ly<cv.height){cx.fillStyle=TH.S.quant==='lum'?C.ink:C.red2;cx.beginPath();cx.moveTo(0,cv.height);for(let x=0;x<=GW;x+=13)cx.lineTo(x*k,ly+Math.sin(x*.05+tick*.08)*5*k);cx.lineTo(cv.width,cv.height);cx.fill();
      cx.fillStyle=TH.S.quant==='lum'?C.white:C.yellow;cx.globalAlpha=.8;cx.beginPath();for(let x=0;x<=GW;x+=13){const yy=ly+Math.sin(x*.05+tick*.08)*5*k;x?cx.lineTo(x*k,yy):cx.moveTo(0,yy);}for(let x=GW;x>=0;x-=13)cx.lineTo(x*k,ly+(Math.sin(x*.05+tick*.08)*5+5)*k);cx.fill();cx.globalAlpha=1;}}
  for(const p of parts){const a=p.life/p.max;
    if(p.burst){blit(TH.spr.burst,p.x,p.y,{sx:.6+(1-a)*.6,sy:.6+(1-a)*.6,a});continue;}
    cx.globalAlpha=a;cx.fillStyle=p.color;const px=p.x*k,py=(p.y-camY)*k,ps=p.size*k;
    if(p.wide)cx.fillRect(px,py,ps*9,Math.max(1,ps*.5));
    else if(TH.pix||p.sq)cx.fillRect(Math.round(px-ps/2),Math.round(py-ps/2),Math.max(1,Math.round(ps)),Math.max(1,Math.round(ps)));else{cx.beginPath();cx.arc(px,py,ps/2,0,TAU);cx.fill();}}
  cx.globalAlpha=1;
  // fog
  if(F().fog&&state!=='menu'&&PL){const gx=PL.x*k,gy=(PL.y-camY)*k;const g=cx.createRadialGradient(gx,gy,90*k,gx,gy,250*k);const fc=TH.id==='onebit'?'239,230,210':'8,24,18';g.addColorStop(0,`rgba(${fc},0)`);g.addColorStop(1,`rgba(${fc},.93)`);cx.fillStyle=g;cx.fillRect(-20*k,-20*k,cv.width+40*k,cv.height+40*k);}
  const fam=TH.font==='PS'?'PS':TH.font==='Cinzel'?'Cinzel':'Lucky';
  for(const u of popups){const a=1-u.t/50;cx.globalAlpha=Math.min(1,a*2);const fs=(TH.font==='PS'?Math.max(8,u.size*.6):u.size)*k;
    cx.font=`${fs}px ${fam},'PingFang SC',sans-serif`;cx.textAlign='center';cx.lineJoin='round';cx.lineWidth=fs*.24;cx.strokeStyle=TH.id==='onebit'?'#efe6d2':'#0b2a5c';
    const yy=(u.y-camY-u.t*.8)*k;cx.strokeText(u.text,u.x*k,yy);cx.fillStyle=TH.id==='onebit'?'#141018':TH.id==='gameboy'?'#0f380f':u.col;cx.fillText(u.text,u.x*k,yy);}
  cx.globalAlpha=1;cx.setTransform(1,0,0,1,0,0);
  if(TH.over)cx.drawImage(TH.over,0,0,cv.width,cv.height);
}
let hudCache={};
function setT(id,v){if(hudCache[id]!==v){hudCache[id]=v;document.getElementById(id).textContent=v;}}
function updHUD(){setT('score',String(score()));setT('hCoin',String(runCoins));setT('hTuy',String(runTuy));
  if(mode==='level'){const pv=Math.round(Math.min(1,alt/LV.alt)*100)+'%';if(hudCache.pr!==pv){hudCache.pr=pv;$('#progF').style.height=pv;}}}
let last=performance.now(),acc=0;
function frame(now){acc+=Math.min(100,now-last);last=now;while(acc>=1000/60){update();acc-=1000/60;}draw();requestAnimationFrame(frame);}
// ---------- transitions
function irisDo(focus,mid,quick){ // closes a circle on the hero, runs mid(), opens again
  const el=$('#iris');el.hidden=false;const r=cv.getBoundingClientRect();
  const fx=focus?clamp(focus.x/GW,0.1,.9)*r.width:r.width/2,fy=focus?clamp((focus.y-camY)/GH,.15,.85)*r.height:r.height/2;
  const R=Math.hypot(r.width,r.height),D=quick?260:420;let t0=performance.now(),ph=0;
  const paint=v=>{el.style.background=`radial-gradient(circle at ${fx}px ${fy}px, transparent ${v}px, #0b2a5c ${v+1.5}px)`;};
  const step=now=>{let u=clamp((now-t0)/D,0,1);const e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
    if(ph===0){paint(R*(1-e));if(u>=1){ph=1;paint(0);try{mid&&mid();}catch(er){console.error(er);}t0=performance.now()+ (quick?40:140);}}
    else{u=clamp((now-t0)/D,0,1);const e2=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;paint(R*e2);if(u>=1){el.hidden=true;return;}}
    requestAnimationFrame(step);};
  requestAnimationFrame(step);
}
function introBanner(a,b){const el=$('#intro');$('#introA').textContent=a;$('#introB').textContent=b;clearTimeout(introBanner.t);introBanner.t=setTimeout(()=>el.classList.remove('go'),2300);el.classList.remove('go');void el.offsetWidth;el.classList.add('go');}
// ---------- screens
const SCR=['#menu','#pause','#over','#shop','#settings','#lvls','#how'];
function show(id){SCR.forEach(s=>$(s).hidden=s!==id);if(window.FlixAds)FlixAds.setScreen(id==='#menu'?'menu':'other');}
function wallet(){$$('.wCoin').forEach(e=>e.textContent=save.coins);$$('.wTuy').forEach(e=>e.textContent=save.tuy);}
function curLevel(){return clamp(Math.min(save.open,save.done+1),1,20);}
function enName(id){const li=Math.max(0,LANGS.indexOf(save.lang));return STR.ensk[id][li];}
function refreshMenu(){wallet();const n=curLevel();$('#playSub').textContent=t('level')+' '+n+' · '+lvName(n);
  const eb=$('#endB'),open=save.done>=5;$('#endT').textContent=t('endless');$('#playT').textContent=t('play');eb.disabled=false;eb.classList.toggle('locked',!open);eb.title=open?'':t('endlessLock');}
function begin(){Sfx.init();hudCache={};$('#bossBar').hidden=true;$('#prog').hidden=mode!=='level';
  $('#best').textContent=t('best')+' '+(mode==='endless'?save.bestEndless:save.best);
  const pi=$('#progIc');pi.getContext('2d').clearRect(0,0,52,52);if(mode==='level'){if(LV.boss)sprInto(pi,TH.spr[BOSS[LV.boss].spr],.28,26,30);else sprInto(pi,TH.spr.goal,.36,26,44);}
  $('#progF').style.height='0%';show(null);$('#hud').hidden=false;updSuper();state='play';updHUD();}
function startLevel(n){mode='level';LV=LEVELS[n-1];TH.setLevel(LV,GW,GH);resetWorld(ckLv===n?ckBase(LV):0);begin();}
function goLevel(n){if(save.ctl==='tilt')enableTilt();
  if(state==='menu'&&mode==='menu'&&LV&&LV.n===n&&ckLv!==n){mode='level';quipN=0;begin();introBanner(t(LV.boss?'bossLv':'level')+' '+n,lvName(n));return;}
  irisDo(state==='menu'?PL:null,()=>{startLevel(n);
    introBanner(t(LV.boss?'bossLv':'level')+' '+n,lvName(n));});}
function goEndless(){if(save.ctl==='tilt')enableTilt();irisDo(PL,()=>{mode='endless';segN=0;const L=LEVELS[0];LV=Object.assign({},L,{boss:null,alt:1e9,en:{zombie:.5,bat:.4}});TH.setLevel(LV,GW,GH);resetWorld();begin();introBanner(t('endless'),'');});}
function toMenu(){irisDo(null,()=>{state='menu';mode='menu';LV=LEVELS[curLevel()-1];TH.setLevel(LV,GW,GH);resetWorld();$('#hud').hidden=true;refreshMenu();show('#menu');},true);}
function pauseGame(){if(state!=='play')return;state='paused';fireHeld=false;show('#pause');}
function playNow(){if(!save.how){save.how=true;persist();return openHow(()=>goLevel(curLevel()));}goLevel(curLevel());}
$('#playB').onclick=playNow;
$('#againB').onclick=()=>mode==='endless'?goEndless():goLevel(LV.n);$('#rstB').onclick=()=>mode==='endless'?goEndless():goLevel(LV.n);
$('#resB').onclick=()=>{state='play';show(null);};
$('#pauseB').onclick=pauseGame;$('#pMenuB').onclick=toMenu;$('#oMenuB').onclick=toMenu;
$('#endB').onclick=()=>{if(save.done>=5)return goEndless();Sfx.deny&&Sfx.deny();const d=Math.min(save.done,5),nx=Math.min(5,save.done+1);
  confirmBox(t('endless'),`<div class="elk"><b>${t('endlessLock')}</b><div class="bar"><i style="width:${d/5*100}%"></i></div><small>${t('endlessProg',{a:d})}</small>${t('endlessHow',{n:nx})}</div>`,()=>goLevel(curLevel()));$('#mOk').textContent=t('play');};
$('#shopB').onclick=()=>openShop();$('#shopBack').onclick=()=>{refreshMenu();show('#menu');};
let setFrom='#menu';function openSet(from){setFrom=from;updSet();tiltNote();show('#settings');}
$('#setB2').onclick=()=>openSet('#menu');$('#pSetB').onclick=()=>openSet('#pause');$('#setBack').onclick=()=>show(setFrom);$('#restoreB2').onclick=restorePurchases;
function tiltNote(){const n=$('#tiltNote');if(save.ctl!=='tilt'){n.hidden=true;return;}n.hidden=false;n.textContent=t('tiltChk');setTimeout(()=>{n.textContent=t(tiltSeen?'tiltOk':'tiltNo');},900);}
$('#lvB').onclick=()=>{renderLevels();show('#lvls');};$('#lvBack').onclick=()=>{refreshMenu();show('#menu');};
function seg(id,cur,fn){$$(id+' button').forEach(b=>{b.classList.toggle('on',b.dataset.v===String(cur));b.onclick=()=>{fn(b.dataset.v);persist();updSet();};});}
function updSet(){seg('#segSnd',save.muted?1:0,v=>{save.muted=v==='1';if(!ENSKINS[save.enSkin])save.enSkin='none';ENSKIN=save.enSkin;Sfx.setMuted(save.muted);});
  seg('#segCtl',save.ctl,v=>{save.ctl=v;tiltWarned=false;if(v==='tilt')enableTilt();tiltNote();$('#h1t').textContent=t(v==='tilt'?'h1':'h1d');});
  seg('#segLang',save.lang,v=>{save.lang=v;applyLang();});}
// how to play
let howCb=null;
function openHow(cb){howCb=cb||null;show('#how');const dr=(id,fn)=>{const c=$(id),x=c.getContext('2d');x.clearRect(0,0,184,184);fn(c,x);};
  dr('#how1',(c,x)=>{sprInto(c,heroSprite(TH,save.skin,'up'),1.5,92,84);sprInto(c,TH.getPlat('n',64),1.3,50,150);x.strokeStyle='#ffc20e';x.lineWidth=7;x.lineCap='round';x.lineJoin='round';
    [[30,1],[154,-1]].forEach(([ax,d])=>{x.beginPath();x.moveTo(ax+d*14,36);x.lineTo(ax,50);x.lineTo(ax+d*14,64);x.stroke();});});
  dr('#how2',(c,x)=>{sprInto(c,TH.spr.bat,1.2,96,44);sprInto(c,TH.spr.burst,.9,96,58);sprInto(c,TH.spr.toy,1.5,92,112);sprInto(c,heroSprite(TH,save.skin,'up'),.9,70,150);});
  dr('#how3',(c,x)=>{sprInto(c,TH.spr.tuy,2.2,62,104);sprInto(c,TH.spr.coin,2.2,128,66);sprInto(c,TH.spr.coin,2.2,138,126);});}
$('#howB').onclick=()=>openHow(null);
$('#howOk').onclick=()=>{const cb=howCb;howCb=null;if(cb)cb();else show('#menu');};
// levels
function tryUnlock(n,then){const cost=levelCost(n);
  if(save.tuy<cost){Sfx.deny();return confirmBox(t('level')+' '+n,t('need',{a:cost,c:t('tuy'),h:save.tuy})+'<br><small>'+t('tuyNote')+'</small>',null);}
  confirmBox(t('level')+' '+n+' · '+lvName(n),t('spendQ',{a:cost,c:t('tuy')}),()=>{save.tuy-=cost;save.open=Math.max(save.open,n);persist();Sfx.unlock();wallet();then&&then();});}
function renderLevels(){wallet();const g=$('#lvGrid');g.innerHTML='';
  for(const L of LEVELS){const n=L.n;
    if((n-1)%5===0){const w=document.createElement('div');w.className='world';w.textContent=(1+(n-1)/5)+' · '+n+'-'+(n+4);g.appendChild(w);}
    const done=save.done>=n,open=save.open>=n,can=!open&&save.done>=n-1;
    const b=document.createElement('button');b.className='lv'+(L.boss?' boss':'')+(open?'':' locked')+(n===curLevel()?' cur':'');
    b.innerHTML=`<div class="no">${n}</div><div class="tx"><b>${lvName(n)}</b><span>${L.boss?t('bossLv')+' · '+t('b_'+L.boss):''}</span></div><div class="st">${done?'<svg viewBox="0 0 24 24"><path d="M9.5 17.6 4.4 12.5l1.9-1.9 3.2 3.2 8.200-8.200 1.900 1.900z"/></svg>':open?'':`${levelCost(n)} <canvas class="ic ic-tuy" width="44" height="44"></canvas>`}</div>`;
    b.onclick=()=>{if(open)return goLevel(n);if(can)return tryUnlock(n,()=>{renderLevels();});Sfx.deny();};
    g.appendChild(b);}
  drawIcons();const c=g.querySelector('.cur');if(c)c.scrollIntoView({block:'center'});}
// ---------- ads
const Ads={
  // v1.3.3 (Kaan: "Jump'ta reklamlar çalışmıyor"): interstitial came only every 3rd run after 90 s, so a tester almost never saw one,
  // and a rewarded ad with no fill did nothing. Now: interstitial every 2nd finished run, at most once per 60 s (never in the
  // first 45 s or within 60 s of a rewarded ad); a rewarded button with no AdMob ad ready shows the FLIX toy ad and still rewards.
  lastI:Date.now()-15000,lastR:0,
  house(res){const a=$('#ad');a.hidden=false;let n=3;$('#adN').textContent=n;const iv=setInterval(()=>{n--;$('#adN').textContent=n;if(n<=0){clearInterval(iv);a.hidden=true;res(true);}},700);},
  rewarded(){return new Promise(res=>{
    if(window.FlixAds){FlixAds.showRewarded(6000).then(r=>{Ads.lastR=Date.now();if(r==='unavailable')Ads.house(res);else res(r==='rewarded');});return;}
    Ads.house(res);});},
  maybeInterstitial(){if(save.noads||!window.FlixAds)return;const now=Date.now();if(save.runs%2!==0||now-Ads.lastI<60000||now-Ads.lastR<60000)return;Ads.lastI=now;FlixAds.showInterstitial();},
};
// ---------- shop
let shopTab='skin';
function openShop(){wallet();show('#shop');renderShop();}
$$('.tabs button').forEach(b=>b.onclick=()=>{shopTab=b.dataset.tab;$$('.tabs button').forEach(x=>x.classList.toggle('on',x===b));renderShop();});
const PACKS=[
  {id:'jump_tuy_100',ic:'tuy',n:1,name:'p_t100',iap:'19,99 ₺',give:{tuy:100}},
  {id:'jump_tuy_300',ic:'tuy',n:2,name:'p_t300',iap:'49,99 ₺',give:{tuy:300}},
  {id:'jump_tuy_800',ic:'tuy',n:3,name:'p_t800',iap:'99,99 ₺',give:{tuy:800},best:1},
  {id:'jump_tuy_2000',ic:'tuy',n:5,name:'p_t2000',iap:'199,99 ₺',give:{tuy:2000}},
  {id:'jump_coin_5000',ic:'coin',n:3,name:'p_c5000',iap:'29,99 ₺',give:{coins:5000}},
  {id:'jump_themes_all',ic:'all',name:'p_all',iap:'349,99 ₺',give:{themes:'all'}},
  {id:'jump_noads',ic:'noads',name:'p_noads',iap:'79,99 ₺',give:{noads:true}},
];
function confirmBox(title,body,ok){$('#mT').textContent=title;$('#mOk').textContent=t('ok');$('#mB').innerHTML=body;drawIcons();$('#modal').hidden=false;$('#mOk').hidden=!ok;
  $('#mOk').onclick=()=>{$('#modal').hidden=true;ok&&ok();};$('#mNo').onclick=()=>{$('#modal').hidden=true;};}
// What every App Store product gives, known from launch. (IAP fix, Nov 2026: this used to be filled in only while a shop tab
// was drawn, so a purchase that arrived at launch, after Ask to Buy or from Restore before that tab was opened was finished
// by the store without being given.) sel: a fresh purchase also puts the bought skin / theme on; a restore only adds it.
function grantFor(id,sel){
  const p=PACKS.find(q=>q.id===id);
  if(p)return()=>{if(p.give.tuy)save.tuy+=p.give.tuy;if(p.give.coins)save.coins+=p.give.coins;if(p.give.noads){save.noads=true;if(window.FlixAds)FlixAds.setAdsRemoved(true);}if(p.give.themes)save.themes=THEME_ORDER.slice();};
  const sk=Object.keys(SKINS).find(k=>SKINS[k].iapId===id);
  if(sk)return()=>{if(!save.skins.includes(sk))save.skins.push(sk);if(sel)save.skin=sk;};
  const th=id.indexOf('jump_theme_')===0?id.slice(11):'';
  if(th&&THEMES[th]&&THEMES[th].iap)return()=>{if(!save.themes.includes(th))save.themes.push(th);if(sel){save.theme=th;if(TH)setTheme(th);}};
  return null;
}
function grantIAP(id,sel){const g=grantFor(id,sel!==false);if(!g)return false;g();persist();wallet();if(!$('#shop').hidden)renderShop();Sfx.unlock();return true;}
// Called by native-bridge.js once per App Store transaction (tx) before it is finished; tx null = non-consumable already owned (restore / reinstall)
window.__flixGrant=(id,tx)=>{if(tx&&save.tx.includes(tx))return true;if(!grantFor(id,false))return false;if(tx){save.tx.push(tx);if(save.tx.length>80)save.tx.shift();}grantIAP(id,!!tx);return true;};
// App Store price in the player's own currency; in the app "…" until the store has loaded (never a hard-coded TL price), the TL label only in the web demo
function iapPrice(id,fallback){const p=window.FlixNative&&FlixNative.price&&FlixNative.price(id);return p||(window.FlixNative?'…':fallback);}
window.addEventListener('flixprices',()=>{if(!$('#shop').hidden)renderShop();});
function buyIAP(id,label,price){
  if(window.FlixNative&&FlixNative.buy){FlixNative.buy(id).then(r=>{if(r==='pending')confirmBox(label,t('buyPending'),null);});return;}
  confirmBox(label,`<div class="mprice iap">${price}</div><small>${t('testBuy')}</small>`,()=>grantIAP(id));
}
function spend(cur,amt,label,ok){const have=cur==='tuy'?save.tuy:save.coins,cn=t(cur==='tuy'?'tuy':'coin');
  if(have<amt){Sfx.deny();return confirmBox(label,t('need',{a:amt,c:cn,h:have}),null);}
  confirmBox(label,`<div class="mprice">${amt} <canvas class="ic ic-${cur==='tuy'?'tuy':'coin'}" width="44" height="44"></canvas></div>`+t('spendQ',{a:amt,c:cn}),()=>{if(cur==='tuy')save.tuy-=amt;else save.coins-=amt;ok();persist();wallet();renderShop();Sfx.unlock();});}
function previewInto(c,themeId,skin){
  const T=buildTheme(themeId);T.setLevel(LV,GW,GH);const x=c.getContext('2d'),w=c.width,h=c.height,kk=w/GW*1.6;x.imageSmoothingEnabled=!T.pix;
  x.drawImage(T.sky,0,0,w,h);if(T.city)x.drawImage(T.city,0,h-T.cityH*w/GW*1.2,w,T.cityH*w/GW*1.2);
  const bl=(s,px,py,sc)=>{x.drawImage(s.c,px-s.ox*sc,py-s.oy*sc,s.w*sc,s.h*sc);};
  bl(T.getPlat('n',88),w*.18,h*.8,kk*.9);bl(heroSprite(T,skin,'up'),w*.5,h*.62,kk*1.1);
  if(T!==TH)TH.setLevel(LV,GW,GH);
}
function enPreview(c,id){const T=TH,x=c.getContext('2d'),w=c.width,h=c.height;x.imageSmoothingEnabled=!T.pix;x.drawImage(T.sky,0,0,w,h);
  const bl=(s,px,py,sc)=>{x.drawImage(s.c,px-s.ox*sc,py-s.oy*sc,s.w*sc,s.h*sc);};
  bl(T.enSpr('bat',id),w*.5,h*.26,.95);bl(T.getPlat('n',88),w*.14,h*.86,.95);bl(T.enSpr('zombie',id),w*.34,h*.86,1.05);bl(T.enSpr('ghost',id),w*.72,h*.66,1.05);}
function priceBtn(cls,amt,cur){const b=document.createElement('button');b.className=cls;b.innerHTML=`${amt} <canvas class="ic ic-${cur==='tuy'?'tuy':'coin'}" width="44" height="44"></canvas>`;return b;}
// "Restore purchases" (App Store requirement for non-consumables): Packs tab and Settings
function restorePurchases(){
  if(!(window.FlixNative&&FlixNative.restore)){confirmBox(t('restore'),t('restoreNone'),null);return;}
  $$('#restoreB,#restoreB2').forEach(b=>b.disabled=true);
  FlixNative.restore().then(ids=>{(ids||[]).forEach(id=>grantIAP(id,false));confirmBox(t('restore'),t(ids&&ids.length?'restoreOk':'restoreNone'),null);},()=>confirmBox(t('restore'),t('restoreFail'),null))
    .finally(()=>{$$('#restoreB,#restoreB2').forEach(b=>b.disabled=false);if(!$('#shop').hidden)renderShop();});
}
function renderShop(){
  const g=$('#shopGrid');g.innerHTML='';g.classList.toggle('one',shopTab==='pack');
  if(shopTab==='skin'||shopTab==='vil'){
    if(shopTab==='vil'){const hd=document.createElement('div');hd.className='world';hd.style.gridColumn='1/-1';hd.textContent=t('playT');g.appendChild(hd);}
    for(const id of (shopTab==='skin'?SKIN_ORDER:VILLAIN_ORDER)){const s=SKINS[id],own=save.skins.includes(id),sel=save.skin===id,locked=s.needLv&&save.done<s.needLv;
      const d=document.createElement('div');d.className='it'+(sel?' sel':'')+(locked?' lock':'');
      d.innerHTML=`<canvas class="pv" width="180" height="240"></canvas><div class="nm">${skinName(id)}</div><div class="tag">${locked?t('lockLv',{n:s.needLv}):own?t('owned'):''}</div>`;
      let bt;
      if(sel){bt=document.createElement('button');bt.textContent=t('selected');bt.className='b-on';bt.disabled=true;}
      else if(own){bt=document.createElement('button');bt.textContent=t('use');bt.className='b-use';bt.onclick=()=>{save.skin=id;persist();renderShop();};}
      else{bt=priceBtn('b-buy',s.price,s.cur);bt.disabled=!!locked;bt.onclick=()=>spend(s.cur,s.price,skinName(id),()=>{save.skins.push(id);save.skin=id;});}
      d.appendChild(bt);
      if(!own&&s.iap&&!locked){const b2=document.createElement('button');b2.className='b-iap';b2.textContent=iapPrice(s.iapId,s.iap);b2.onclick=()=>buyIAP(s.iapId,skinName(id),iapPrice(s.iapId,s.iap));d.appendChild(b2);}
      g.appendChild(d);const c=d.querySelector('canvas.pv');setTimeout(()=>previewInto(c,save.theme,id),0);}
    if(shopTab==='vil'){
      const hd=document.createElement('div');hd.className='world';hd.style.gridColumn='1/-1';hd.innerHTML=t('enTitle')+'<small>'+t('enNote')+'</small>';g.appendChild(hd);
      for(const id of ENSKIN_ORDER){const s=ENSKINS[id],own=save.enSkins.includes(id),sel=save.enSkin===id;
        const d=document.createElement('div');d.className='it'+(sel?' sel':'');
        d.innerHTML=`<canvas class="pv" width="180" height="240"></canvas><div class="nm">${enName(id)}</div><div class="tag">${own&&id!=='none'?t('owned'):''}</div>`;
        let bt;const put=()=>{save.enSkin=id;ENSKIN=id;};
        if(sel){bt=document.createElement('button');bt.textContent=t('selected');bt.className='b-on';bt.disabled=true;}
        else if(own){bt=document.createElement('button');bt.textContent=t('use');bt.className='b-use';bt.onclick=()=>{put();persist();renderShop();};}
        else{bt=priceBtn('b-buy',s.price,'coin');bt.onclick=()=>spend('coin',s.price,enName(id),()=>{save.enSkins.push(id);put();});}
        d.appendChild(bt);g.appendChild(d);const c=d.querySelector('canvas.pv');setTimeout(()=>enPreview(c,id),0);}
    }
  }else if(shopTab==='theme'){
    const q=[];
    for(const id of THEME_ORDER){const th=THEMES[id],own=save.themes.includes(id),sel=save.theme===id;
      const d=document.createElement('div');d.className='it'+(sel?' sel':'');
      d.innerHTML=`<canvas class="pv" width="180" height="240"></canvas><div class="nm">${themeName(id)}</div><div class="tag">${own?t('owned'):''}</div>`;
      let bt;
      if(sel){bt=document.createElement('button');bt.textContent=t('selected');bt.className='b-on';bt.disabled=true;}
      else if(own){bt=document.createElement('button');bt.textContent=t('use');bt.className='b-use';bt.onclick=()=>{save.theme=id;persist();setTheme(id);renderShop();};}
      else{bt=priceBtn('b-buy',th.price,'tuy');bt.onclick=()=>spend('tuy',th.price,themeName(id),()=>{save.themes.push(id);save.theme=id;setTheme(id);});}
      d.appendChild(bt);
      if(!own&&th.iap){const pid='jump_theme_'+id;const b2=document.createElement('button');b2.className='b-iap';b2.textContent=iapPrice(pid,th.iap);b2.onclick=()=>buyIAP(pid,themeName(id),iapPrice(pid,th.iap));d.appendChild(b2);}
      g.appendChild(d);q.push([d.querySelector('canvas.pv'),id]);}
    const next=()=>{const it=q.shift();if(!it||$('#shop').hidden||shopTab!=='theme')return;previewInto(it[0],it[1],save.skin);setTimeout(next,10);};setTimeout(next,30);
  }else{
    for(const p of PACKS){const d=document.createElement('div');d.className='it pk';
      const own=(p.give.noads&&save.noads)||(p.give.themes&&save.themes.length>=9);
      d.innerHTML=`<canvas class="pi" width="96" height="96"></canvas><div class="pt"><div class="nm">${t(p.name)}${p.best?`<span class="badge">${t('bestSeller')}</span>`:''}</div></div>`;
      const bt=document.createElement('button');bt.className=own?'b-on':'b-iap';bt.textContent=own?t('bought'):iapPrice(p.id,p.iap);bt.disabled=own;bt.onclick=()=>buyIAP(p.id,t(p.name),iapPrice(p.id,p.iap));
      d.appendChild(bt);g.appendChild(d);
      const pc=d.querySelector('.pi'),x=pc.getContext('2d');
      if(p.ic==='tuy'){for(let i=0;i<p.n;i++)sprInto(pc,TH.spr.tuy,1.5-p.n*.08,48+(i-(p.n-1)/2)*13,74-(i%2)*8);}
      else if(p.ic==='coin'){for(let i=0;i<4;i++)sprInto(pc,TH.spr.coin,2,34+i%2*26,62-i*10);}
      else if(p.ic==='all'){['clay','cel','dark'].forEach((id,i)=>{x.save();x.translate(18+i*22,14+i*6);x.rotate(-.12+i*.12);x.fillStyle=['#ff8a5a','#46208a','#120c22'][i];x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.roundRect(0,0,36,52,6);x.fill();x.stroke();x.restore();});sprInto(pc,heroSprite(TH,save.skin,'up'),.7,60,60);}
      else{sprInto(pc,TH.spr.bat,.8,48,50);x.strokeStyle='#e22511';x.lineWidth=8;x.lineCap='round';x.beginPath();x.arc(48,48,36,0,TAU);x.moveTo(23,23);x.lineTo(73,73);x.stroke();}}
    const n=document.createElement('div');n.className='tag';n.style.cssText='text-align:center;padding:4px 10px';n.textContent=t('tuyNote');g.appendChild(n);
    const rb=document.createElement('button');rb.className='big ghost';rb.id='restoreB';rb.style.cssText='grid-column:1/-1;width:100%;margin-top:4px';rb.textContent=t('restore');rb.onclick=restorePurchases;g.appendChild(rb);
  }
  drawIcons();
}
// ---------- boot
FlixLegal.init({game:'ziplama',name:'Flix Jump',version:VERSION,oss:['Nova Hop (ISC, Nikhil Rana)','Baloo 2, Luckiest Guy, Press Start 2P, Cinzel Decorative (SIL OFL)'],
  beforeOpen:()=>{if(state==='play')pauseGame();}});
$$('#hudLogo,#menuLogo,#adLogo').forEach(i=>i.src=LOGO);
Sfx.setMuted(save.muted);if(save.noads&&window.FlixAds)FlixAds.setAdsRemoved(true);
if(window.FlixNative&&FlixNative.flush)try{FlixNative.flush();}catch(e){}
if(!THEMES[save.theme]||!save.themes.includes(save.theme))save.theme='water';
if(!SKINS[save.skin])save.skin='kraliyet';
Promise.all(['Baloo','Lucky','PS','Cinzel'].map(f=>document.fonts.load(`20px ${f}`,'AaĞğŞşİıÇçÖöÜü').catch(()=>{}))).then(()=>document.fonts.ready).then(()=>{mode='menu';LV=LEVELS[curLevel()-1];setTheme(save.theme);resetWorld();applyLang();show('#menu');requestAnimationFrame(frame);});
