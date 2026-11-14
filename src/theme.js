// ---------- FLIX Zıpla: tema motoru (9 görsel stil, sprite önbelleği)
const SKINS={
  kraliyet:{name:'Kraliyet FLIX',hb:'#e22511',hs:'#ff4a2a',hc:'#0b2a5c',hci:'#e22511',he:'#ffc20e',price:0,cur:'coin'},
  buzul:{name:'Buzul FLIX',hb:'#4fb8f0',hs:'#bff0ff',hc:'#1a4f8a',hci:'#9fe8ff',he:'#ffffff',price:800,cur:'coin'},
  ejder:{name:'Ejder FLIX',hb:'#2fa84f',hs:'#ffb81a',hc:'#4a1a0a',hci:'#ff8a1a',he:'#ffe06a',price:2000,cur:'coin'},
  altin:{name:'Altın FLIX',hb:'#ffc20e',hs:'#fff2b0',hc:'#9a0f14',hci:'#ffd86a',he:'#e22511',price:4500,cur:'coin'},
  neon:{name:'Neon FLIX',hb:'#ff2d9a',hs:'#2fe8ff',hc:'#1b1330',hci:'#ff6af0',he:'#2fe8ff',price:8000,cur:'coin'},
  golge:{name:'Gölge FLIX',hb:'#3a2f5a',hs:'#ff2d9a',hc:'#0a0812',hci:'#6a2fb0',he:'#ff2d9a',price:600,cur:'tuy',iap:'59,99 ₺',iapId:'skin_golge'},
};
Object.assign(SKINS,{
  v_zombi:{name:'Telefon Zombisi',villain:'zombie',needLv:3,price:1500,cur:'coin'},
  v_kral:{name:'İskelet Kral',villain:'king',needLv:5,price:3000,cur:'coin'},
  v_ejder:{name:'Kemik Ejderha',villain:'dragon',needLv:10,price:6000,cur:'coin'},
  v_dev:{name:'Dev Zombi',villain:'golem',needLv:15,price:9000,cur:'coin'},
  v_vorteks:{name:'Vorteks',villain:'vorteks',needLv:20,price:15000,cur:'coin'},
});
Object.assign(SKINS,{
  parti:{hb:'#ff5fa8',hs:'#ffd23a',hc:'#5a2fb0',hci:'#ff9ad0',he:'#2fe8ff',acc:'party',price:1000,cur:'coin'},
  korsan:{hb:'#b3261c',hs:'#2a2a35',hc:'#15151d',hci:'#8a1a14',he:'#ffc20e',acc:'pirate',price:1500,cur:'coin'},
  karpuz:{hb:'#ff4f6a',hs:'#2fa84f',hc:'#1f7a3a',hci:'#9be37a',he:'#1a1012',price:1800,cur:'coin'},
  dj:{hb:'#7a3ff0',hs:'#2fe8ff',hc:'#1b1330',hci:'#ff2d9a',he:'#ffffff',acc:'shades',price:2500,cur:'coin'},
  noel:{hb:'#d81f2a',hs:'#ffffff',hc:'#1f7a3a',hci:'#ffffff',he:'#ffd23a',acc:'santa',price:3000,cur:'coin'},
  astronot:{hb:'#f2f4fa',hs:'#ff8a1a',hc:'#2a5ac0',hci:'#bcd0ff',he:'#e22511',acc:'bubble',price:4000,cur:'coin'},
  ninja:{hb:'#23232e',hs:'#e22511',hc:'#0a0a12',hci:'#e22511',he:'#c8c8d8',acc:'band',price:5500,cur:'coin'},
  kral:{hb:'#8a3fd0',hs:'#ffc20e',hc:'#5a0f14',hci:'#ffd86a',he:'#ffc20e',acc:'crown',price:7000,cur:'coin'},
});
const SKIN_ORDER=['kraliyet','buzul','parti','korsan','karpuz','ejder','dj','noel','astronot','altin','ninja','kral','neon','golge'];
// costumes for the villains you meet in the levels (hats drawn onto their sprites)
const ENSKINS={none:{price:0},party:{price:1200},band:{price:1600},pirate:{price:2000},santa:{price:2800},crown:{price:4000}};
const ENSKIN_ORDER=['none','party','band','pirate','santa','crown'];
let ENSKIN='none';
// hats: origin = top of a head of radius 14
function accDraw(kind){
  if(kind==='party'){shape(poly([[-9,3],[9,3],[0,-24]]),C.yellow,[-9,-24,18,27]);shape(poly([[-6,-5],[6,-5],[4.4,-10],[-4.4,-10]]),C.red,[-6,-10,12,5]);shape(circ(0,-25,3.6),C.pink,[-4,-29,8,8]);}
  else if(kind==='santa'){shape(poly([[-10,2],[10,2],[7,-10],[15,-17],[3,-20],[-6,-10]]),C.red,[-10,-20,25,22]);shape(poly([[-12,4],[12,4],[12,-2],[-12,-2]]),C.white,[-12,-2,24,6]);shape(circ(15,-17,4),C.white,[11,-21,8,8]);}
  else if(kind==='crown'){shape(poly([[-10,3],[-11,-10],[-5,-4],[0,-14],[5,-4],[11,-10],[10,3]]),C.yellow,[-11,-14,22,17]);shape(circ(0,-3,2.2),C.red,[-2,-5,4,4]);}
  else if(kind==='pirate'){shape(poly([[-14,5],[14,5],[12,-4],[0,-8],[-12,-4]]),C.red,[-14,-8,28,13]);shape(poly([[12,0],[21,-4],[20,5]]),C.red,[12,-4,9,9]);ctx.fillStyle=C.white;for(const px of[-6,0,6]){ctx.beginPath();ctx.arc(px,0,1.4,0,TAU);ctx.fill();}}
  else if(kind==='band'){shape(poly([[-14,6],[14,6],[14,1],[-14,1]]),C.red,[-14,1,28,5]);shape(poly([[13,3],[24,-2],[22,7]]),C.red,[13,-2,11,9]);}
}
function heroAcc(kind){ // hero units: head centre (0,-6) r 31, eyes at (-12,-8) and (10,-8)
  if(kind==='shades'){shape(poly([[-23,-16],[-3,-16],[-4,-3],[-20,-3]]),C.navy,[-23,-16,20,13]);shape(poly([[1,-16],[21,-16],[18,-3],[2,-3]]),C.navy,[1,-16,20,13]);ctx.strokeStyle=C.navy;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-4,-12);ctx.lineTo(2,-12);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(-19,-13,6,2.5);ctx.fillRect(5,-13,6,2.5);return;}
  if(kind==='bubble'){ctx.save();ctx.fillStyle='rgba(200,235,255,.22)';ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-12,50,0,TAU);ctx.fill();ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,-12,41,-2.6,-1.9);ctx.stroke();ctx.restore();return;}
  ctx.save();ctx.translate(0,kind==='band'?-33:-37);ctx.scale(2.1,2.1);accDraw(kind);ctx.restore();
}
const EDEF={zombie:[74,126,35,122,1.15,()=>phoneZombie(0,0),[1,-70,1]],bat:[110,92,55,55,1.08,()=>tabletBat(0,0),[0,-17,.9]],ghost:[64,94,32,64,1.15,()=>ghost(0,0),[0,-27,1.1]],
  mine:[50,72,25,47,1.1,()=>mine(0,0),[0,-13,.8]],snake:[70,58,34,52,1.1,()=>snake(0,0),[14,-20,.6]],drone:[84,72,42,50,1.1,()=>drone(0,0),[0,-9,.8]]};
const VILLAIN_ORDER=['v_zombi','v_kral','v_ejder','v_dev','v_vorteks'];
const VDRAW={zombie:[()=>phoneZombie(0,0),1.0,40],king:[()=>skeletonKing(0,0),.62,2],dragon:[()=>dragon(0,0),.44,4],golem:[()=>golem(0,0),.5,8],vorteks:[()=>vorteks(0,0),.58,2]};
const THEMES={
  water:{style:'water',name:'Sulu Boya',price:0,iap:null},
  clay:{style:'clay',name:'Claymation',price:900,iap:'49,99 ₺'},
  cel:{style:'cel',name:'Cel-Shaded',price:900,iap:'49,99 ₺'},
  b32:{style:'b32',name:'32-bit Piksel',price:1200,iap:'59,99 ₺'},
  orig:{style:'orig',name:'Orijinal Piksel',price:1200,iap:'59,99 ₺'},
  nes:{style:'nes',name:'8-bit',price:1500,iap:'69,99 ₺'},
  gameboy:{style:'gameboy',name:'Game Boy',price:1500,iap:'69,99 ₺'},
  onebit:{style:'onebit',name:'1-bit',price:1800,iap:'79,99 ₺'},
  dark:{style:'dark',name:'Dark Fantasy',price:2500,iap:'99,99 ₺'},
};
const THEME_ORDER=['water','clay','cel','b32','orig','nes','gameboy','onebit','dark'];
const HS=0.74; // hero scale in game
const TCACHE={};

function useStyle(T){S=T.S;C=T.C;}
function heroColors(T,skin){
  const k=SKINS[skin]||SKINS.kraliyet,base=T.S.P;
  if(T.id==='onebit')return {red:base.red,red2:base.red2,navy:base.navy,yellow:base.yellow};
  let o={red:k.hb,red2:k.hs,navy:k.hc,yellow:k.he,capeIn:k.hci};
  if(T.id==='dark')for(const q in o)o[q]=shade(o[q],-.22);
  if(T.id==='water')for(const q in o)o[q]=shade(o[q],.06);
  return o;
}
function quantizeT(c,T){
  const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height),a=d.data,w=c.width,St=T.S,pal=T.pal;
  const pl=St.quant==='lum'?pal.map(p=>lum(...p)):null;
  for(let i=0;i<a.length;i+=4){
    if(a[i+3]<100){a[i+3]=0;continue;}
    if(a[i+3]<255){const al=a[i+3]/255;a[i]/=al;a[i+1]/=al;a[i+2]/=al;}
    const px=(i/4)%w,py=Math.floor(i/4/w),b=BAYER[py%4][px%4]*St.dither;
    if(St.quant==='lum'){let l=lum(a[i],a[i+1],a[i+2]);const n=pal.length;l=Math.min(1,Math.max(0,(l-pl[0])/(pl[n-1]-pl[0])+b/(n-1)));
      const p=pal[Math.round(l*(n-1))];a[i]=p[0];a[i+1]=p[1];a[i+2]=p[2];}
    else if(St.quant==='poster'){const L=St.levels-1;for(let k=0;k<3;k++)a[i+k]=Math.round(Math.min(L,Math.max(0,a[i+k]/255*L+b)))*255/L;}
    else{const r=a[i]+b*48,g=a[i+1]+b*48,bb=a[i+2]+b*48;let best=0,bd=1e9;
      for(let j=0;j<pal.length;j++){const p=pal[j],dr=r-p[0],dg=g-p[1],db=bb-p[2],dd=dr*dr*.3+dg*dg*.59+db*db*.11;if(dd<bd){bd=dd;best=j;}}
      const p=pal[best];a[i]=p[0];a[i+1]=p[1];a[i+2]=p[2];}
    a[i+3]=255;}
  x.putImageData(d,0,0);
}
function downTo(src,w,h){let s=src;while(s.width/2>w*1.4){const t=document.createElement('canvas');t.width=Math.ceil(s.width/2);t.height=Math.ceil(s.height/2);const tx=t.getContext('2d');tx.imageSmoothingQuality='high';tx.drawImage(s,0,0,t.width,t.height);s=t;}
  const o=document.createElement('canvas');o.width=w;o.height=h;const ox=o.getContext('2d');ox.imageSmoothingQuality='high';ox.drawImage(s,0,0,w,h);return o;}
function paperSprite(c){const x=c.getContext('2d'),w=c.width,h=c.height;
  const t=document.createElement('canvas');t.width=w;t.height=h;const tx=t.getContext('2d');tx.filter='blur(2px)';tx.drawImage(c,0,0);
  x.save();x.globalCompositeOperation='source-atop';x.globalAlpha=.18;x.drawImage(t,1,2);x.restore();
  const n=noiseCanvas(Math.max(8,w),Math.max(8,h),(w*7+h)|0,1.5);x.save();x.globalCompositeOperation='source-atop';x.globalAlpha=.10;x.drawImage(n,0,0,w,h);x.restore();}

// sprite: logical box w×h, drawing origin at (ox,oy) inside the box
function makeSprite(T,w,h,ox,oy,fn){
  useStyle(T);
  const k=T.k,hi=T.pix?k*4:k;
  const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w*hi));c.height=Math.max(1,Math.ceil(h*hi));
  ctx=c.getContext('2d');ctx.scale(hi,hi);ctx.translate(ox,oy);
  if(S.shadow){ctx.shadowColor='rgba(40,12,30,.38)';ctx.shadowBlur=7;ctx.shadowOffsetX=3;ctx.shadowOffsetY=5;}
  fn();
  let out=c;
  if(T.pix){out=downTo(c,Math.max(1,Math.round(w*k)),Math.max(1,Math.round(h*k)));quantizeT(out,T);}
  else if(S.post==='water')paperSprite(out);
  return {c:out,w,h,ox,oy};
}
function scaled(s,fn){return ()=>{ctx.save();ctx.scale(s,s);fn();ctx.restore();};}

function levelFor(T,L){
  const o={...L};const id=T.id,P0=T.S.P;
  if(id==='onebit'||id==='gameboy'){o.sky=P0.sky;o.c1=P0.city1;o.c2=P0.city2;o.win=P0.win;o.win2=P0.win2;}
  else if(id==='water'){o.sky=L.sky.map(c=>mix(c,'#ffffff',.24));o.c1=mix(L.c1,'#ffffff',.26);o.c2=mix(L.c2,'#ffffff',.22);}
  else if(id==='dark'){o.sky=L.sky.map(c=>mix(c,'#000000',.55));o.c1=mix(L.c1,'#000000',.5);o.c2=mix(L.c2,'#000000',.6);}
  return o;
}
const PLAT_W=[48,56,64,72,80,88,96];
function buildTheme(id){
  if(TCACHE[id])return TCACHE[id];
  const meta=THEMES[id],St=STYLES[meta.style];
  const T={id,S:St,C:St.P,pix:St.pix||0,k:St.pix?St.pix/390:Math.min(2,Math.max(1.5,window.devicePixelRatio||2)),spr:{},plat:{},hero:{},font:St.font};
  if(St.quant==='kmeans'){T.pal=null;}else T.pal=(St.pal||[]).map(rgb);
  TCACHE[id]=T;
  if(St.quant==='kmeans'){
    useStyle(T);const c=document.createElement('canvas');c.width=195;c.height=422;ctx=c.getContext('2d');ctx.scale(.5,.5);W=390;H=844;BG_NOCITY=false;drawBG();
    const d=ctx.getImageData(0,0,195,422).data;const extra=[];for(const L of (window.LEVELS||[]))extra.push(...L.sky,L.c1,L.c2);
    T.pal=kmeans(d,8).concat(Object.values(BASE).filter(v=>typeof v==='string').map(rgb)).concat(Object.values(SKINS).filter(s=>s.hb).flatMap(s=>[s.hb,s.hs,s.hc,s.hci,s.he]).map(rgb)).concat(extra.map(rgb));
    T.S={...St,quant:'pal'};
  }
  const sp=T.spr;
  // platforms are built lazily (many widths × types)
  T.getPlat=(type,w)=>{const key=type+w;if(!T.plat[key])T.plat[key]=makeSprite(T,w+30,44,15,8,()=>{if(type==='cloud')cloudPlat(0,0,w);else if(type==='ice')icePlat(0,0,w);else platform(0,0,w,type);});return T.plat[key];};
  const lazy=(name,w,h,ox,oy,fn)=>Object.defineProperty(sp,name,{configurable:true,get(){const v=makeSprite(T,w,h,ox,oy,fn);Object.defineProperty(sp,name,{value:v});return v;}});
  lazy('spring',44,34,22,30,scaled(1.1,()=>spring(0,0)));
  lazy('coin',24,24,12,12,scaled(1.3,()=>coin(0,0)));
  lazy('tuy',40,44,20,30,scaled(.95,()=>{glow(0,-12,26,C.yellow,.45);flixToy(0,0,0,.95);}));
  lazy('toy',36,40,18,26,()=>flixToy(0,0,0,.72));
  T.enc={};T.enSpr=(name,sk)=>{const key=name+'|'+sk;if(!T.enc[key]){const d=EDEF[name];T.enc[key]=makeSprite(T,d[0],d[1],d[2],d[3],scaled(d[4],()=>{d[5]();if(sk&&sk!=='none'){ctx.save();ctx.translate(d[6][0],d[6][1]);ctx.scale(d[6][2],d[6][2]);accDraw(sk);ctx.restore();}}));}return T.enc[key];};
  for(const n in EDEF)Object.defineProperty(sp,n,{configurable:true,get(){return T.enSpr(n,ENSKIN);}});
  lazy('king',150,170,70,100,scaled(1.45,()=>skeletonKing(0,0)));
  lazy('dragon',220,200,110,95,scaled(1.15,()=>dragon(0,0)));
  lazy('golem',180,170,90,80,scaled(1.15,()=>golem(0,0)));
  lazy('vorteks',150,200,75,105,scaled(1.3,()=>vorteks(0,0)));
  lazy('goal',120,130,60,110,()=>goalFlag(0,0));
  lazy('orb',40,40,20,20,()=>{glow(0,0,18,C.pink,.8);shape(circ(0,0,8),C.purple,[-8,-8,16,16],.6);ctx.fillStyle=C.pink;ctx.beginPath();ctx.arc(-2,-2,3,0,TAU);ctx.fill();});
  lazy('fire',40,40,20,20,()=>{glow(0,0,18,C.glowg,.8);shape(poly([[0,-12],[8,2],[4,10],[-4,10],[-8,2]]),C.glowg,[-8,-12,16,22],.6);});
  lazy('rock',44,44,22,22,()=>{shape(poly([[-12,-8],[-2,-14],[10,-9],[14,3],[6,13],[-8,12],[-14,2]]),C.stone,[-14,-14,28,27]);});
  lazy('burst',60,60,30,30,()=>burst(0,0,26));
  lazy('shield',44,44,22,22,()=>{glow(0,0,20,C.cyan,.5);shape(circ(0,0,15),C.cyan,[-15,-15,30,30],.6);ctx.fillStyle=C.white;ctx.globalAlpha=.8;ctx.beginPath();ctx.ellipse(-5,-6,4,6,-.5,0,TAU);ctx.fill();ctx.globalAlpha=1;});
  lazy('wing',48,52,24,32,()=>{glow(0,-10,26,C.yellow,.5);shape(circ(0,-8,19),C.navy,[-19,-27,38,38],.6);flixToy(0,4,0,.62);});
  lazy('ground',420,44,15,8,()=>platform(0,0,390,'n'));
  lazy('goalplat',420,44,15,8,()=>platform(0,0,390,'move'));
  T.bg={};
  T.setLevel=(L,w,h)=>{
    const key=L.n+'|'+w+'|'+h;if(T.bgKey===key)return;
    if(T.bg[key]){Object.assign(T,T.bg[key]);T.bgKey=key;return;}
    useStyle(T);W=w;H=h;const LL=levelFor(T,L);
    const mk=(lw,lh,fn,postFx)=>{const hi=T.pix?T.k*3:T.k;const c=document.createElement('canvas');c.width=Math.ceil(lw*hi);c.height=Math.ceil(lh*hi);ctx=c.getContext('2d');ctx.scale(hi,hi);fn();
      let out=c;if(postFx&&!T.pix)post(out);if(T.pix){out=downTo(c,Math.round(lw*T.k),Math.round(lh*T.k));quantizeT(out,T);}
      return out;};
    const blur=cv0=>{if(!St.bgBlur||T.pix)return cv0;const b=document.createElement('canvas');b.width=cv0.width;b.height=cv0.height;const bx=b.getContext('2d');bx.filter=`blur(${St.bgBlur*T.k}px)`;bx.drawImage(cv0,0,0);return b;};
    const sky=blur(mk(w,h,()=>drawSkyLv(LL),true));
    const CH=300;let city=null;
    if(L.bd&&L.bd!=='space'){city=blur(mk(w,CH,()=>backdrop(LL,CH),false));
      if(!T.pix&&St.post==='water'){const x=city.getContext('2d');const n=noiseCanvas(city.width,city.height,5,1.5);x.save();x.globalCompositeOperation='source-atop';x.globalAlpha=.12;x.drawImage(n,0,0);x.restore();}}
    const keys=Object.keys(T.bg);if(keys.length>3)delete T.bg[keys[0]];
    T.bg[key]={sky,city,cityH:CH};Object.assign(T,T.bg[key]);T.bgKey=key;
    if(T.ow!==w||T.oh!==h){T.ow=w;T.oh=h;T.over=null;
      if(!T.pix&&St.post){const c=document.createElement('canvas');c.width=Math.ceil(w*T.k);c.height=Math.ceil(h*T.k);const x=c.getContext('2d');
        if(St.post==='water'){const n=noiseCanvas(c.width,c.height,9,1.5);x.globalAlpha=.07;x.drawImage(n,0,0,c.width,c.height);x.globalAlpha=1;
          const r=rnd(5);for(let i=0;i<40;i++){const bx=r()*c.width,by=r()*c.height,br=(40+r()*140)*T.k;const g=x.createRadialGradient(bx,by,0,bx,by,br);g.addColorStop(0,'rgba(120,90,70,.05)');g.addColorStop(1,'rgba(120,90,70,0)');x.fillStyle=g;x.fillRect(bx-br,by-br,2*br,2*br);}
          vignette(x,c.width,c.height,.18,'#6a4a5a');}
        if(St.post==='clay')vignette(x,c.width,c.height,.3,'#2a1420');
        if(St.post==='cel')vignette(x,c.width,c.height,.18,'#120830');
        if(St.post==='dark'){for(let i=0;i<4;i++){const g=x.createLinearGradient(0,c.height*(.15+i*.22),0,c.height*(.32+i*.22));g.addColorStop(0,'rgba(90,160,120,0)');g.addColorStop(.5,'rgba(90,160,120,.10)');g.addColorStop(1,'rgba(90,160,120,0)');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);}vignette(x,c.width,c.height,.55,'#000');}
        T.over=c;}}
  };
  return T;
}
function heroSprite(T,skin,pose){
  const sk=SKINS[skin]||SKINS.kraliyet;
  if(sk.villain){const key=skin;if(T.hero[key])return T.hero[key];const v=VDRAW[sk.villain];
    return T.hero[key]=makeSprite(T,130,130,65,70,()=>{ctx.translate(0,v[2]);ctx.scale(v[1],v[1]);v[0]();});}
  const key=skin+'|'+pose;if(T.hero[key])return T.hero[key];
  const hc=heroColors(T,skin);
  const s=makeSprite(T,140*HS+12,150*HS+40,70*HS+6,72*HS+34,()=>{const o={...C};Object.assign(C,{red:hc.red,red2:hc.red2,navy:hc.navy,yellow:hc.yellow});
    HERO_POSE=pose;ctx.save();ctx.scale(HS,HS);hero(0,0);Object.assign(C,o);if(sk.acc)heroAcc(sk.acc);ctx.restore();});
  T.hero[key]=s;return s;
}
