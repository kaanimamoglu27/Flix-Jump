let BG_NOCITY=false;
let HERO_POSE='up';

const TAU=Math.PI*2;let W=390,H=844;
// ---------- color utils
function rgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function hex(c){return '#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function mix(a,b,t){a=rgb(a);b=rgb(b);return hex(a.map((v,i)=>v+(b[i]-v)*t));}
function shade(c,t){return t<0?mix(c,'#000000',-t):mix(c,'#ffffff',t);}
function rnd(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646;};}

// ---------- palettes
const BASE={
 sky:['#170f3a','#3b1a63','#7a2a6e','#e2552a'], star:'#ffffff', moon:'#fff2c0',
 city1:'#3a2470', city2:'#1a1238', win:'#ffc94a', win2:'#ff5e8a',
 red:'#e22511', red2:'#ff4a2a', navy:'#0b2a5c', yellow:'#ffc20e', blue:'#1f6fd1', green:'#2fa84f',
 white:'#fbf6ea', ink:'#1a1012', bone:'#f1ead6', purple:'#6a2fb0', gold:'#ffc20e', zomb:'#8fd14f',
 hood:'#4a5a7a', glass:'#1b1330', pink:'#ff2d9a', cyan:'#2fe8ff', frame:'#2a2140', skin:'#1a1012',
};
function P(o){return Object.assign({},BASE,o||{});}
const STYLES={
 onebit:{label:'1-BIT',pix:130,quant:'lum',pal:['#141018','#efe6d2'],dither:0.7,ol:4,mode:'flat',font:'PS',
   P:P({sky:['#f4efe2','#f4efe2','#f4efe2','#d8d0bc'],city1:'#a8a294',city2:'#141018',win:'#efe6d2',win2:'#efe6d2',moon:'#ffffff',star:'#141018',
     red:'#ffffff',red2:'#141018',navy:'#141018',yellow:'#ffffff',blue:'#141018',green:'#9a958c',white:'#ffffff',bone:'#ffffff',purple:'#141018',gold:'#ffffff',
     zomb:'#b8b2a4',hood:'#3c3740',glass:'#141018',pink:'#ffffff',cyan:'#ffffff',frame:'#2a2630',ink:'#141018'})},
 gameboy:{label:'GAME BOY',pix:156,quant:'lum',pal:['#0f380f','#306230','#8bac0f','#9bbc0f'],dither:0.55,ol:3.2,mode:'flat',font:'PS',
   P:P({sky:['#c8d890','#c8d890','#b8cc78','#98b058'],city1:'#708848',city2:'#304820',win:'#c8d890',win2:'#c8d890',moon:'#e8f0c0',star:'#304820',
     red:'#506838',red2:'#6a8448',navy:'#102810',yellow:'#c8d890',blue:'#3a5428',green:'#88a050',white:'#f0f8d0',bone:'#f0f8d0',purple:'#304820',gold:'#b0c870',
     zomb:'#a0b868',hood:'#304820',glass:'#102810',pink:'#e8f0c0',cyan:'#f0f8d0',frame:'#304820',ink:'#0a200a'})},
 nes:{label:'8-BIT',pix:130,quant:'pal',dither:0.35,ol:3.5,mode:'flat',font:'PS',
   pal:['#000000','#fcfcfc','#bcbcbc','#7c7c7c','#a80020','#f83800','#e45c10','#f8b800','#fca044','#f8d878','#0058f8','#3cbcfc','#00a800','#58d854','#6844fc','#940084','#d800cc','#f878f8','#503000','#0000bc','#004058','#881400','#2c1460','#b8f818'],
   P:P({sky:['#0c0c40','#2c1460','#6844fc','#f83800']})},
 b32:{label:'32-BIT PİKSEL',pix:195,quant:'poster',levels:6,dither:0.9,ol:2.6,mode:'soft',font:'PS',P:P()},
 orig:{label:'ORİJİNAL PİKSEL',pix:156,quant:'kmeans',k:18,dither:0,ol:3.4,mode:'cel',font:'PS',P:P()},
 cel:{label:'CEL-SHADED',ol:3.4,mode:'cel',font:'Lucky',post:'cel',P:P({sky:['#1d1150','#46208a','#b0307a','#ff7a2a']})},
 water:{label:'SULU BOYA',ol:1.3,mode:'water',font:'Baloo',post:'water',bgBlur:1.2,
   P:P({sky:['#6a90d8','#a890d8','#f0a8a0','#ffc878'],city1:'#a89cc8',city2:'#6d6a9a',win:'#ffe7a8',win2:'#ffb0c8',moon:'#fffbe8',star:'#ffffff',
     red:'#e8473a',red2:'#ff6a50',navy:'#2c4a86',yellow:'#ffcf4a',blue:'#4a8ad8',green:'#5cb86a',ink:'#4a3828',glass:'#3d3358',frame:'#5a4c78',purple:'#8a5cc8',hood:'#6a7898',zomb:'#a8d878'})},
 clay:{label:'CLAYMATION',ol:0,mode:'soft',font:'Baloo',post:'clay',bgBlur:2.4,shadow:true,
   P:P({sky:['#3a2a6a','#7a4a8a','#e07a5a','#ffb060'],city1:'#7a5aa0',city2:'#4a3470',win:'#ffd36a',win2:'#ff8aa8',
     red:'#e8331c',red2:'#ff5a36',navy:'#1c3a78',blue:'#2f7fe0',green:'#3cb85a',glass:'#2a1f48',frame:'#43386a',purple:'#7a44c0',hood:'#5a6c94'})},
 dark:{label:'DARK FANTASY',ol:1.6,mode:'soft',font:'Cinzel',post:'dark',gothic:true,
   P:P({sky:['#05040a','#140e28','#341838','#7a2418'],city1:'#1c1430',city2:'#0a0812',win:'#ff9a3a',win2:'#7dff9a',moon:'#d8e4d0',star:'#b8c0d8',
     red:'#c41e10',red2:'#e8341a',navy:'#0a1430',yellow:'#d8a020',blue:'#1a3a78',green:'#2a7040',white:'#e8e0cc',bone:'#e8dcc0',purple:'#3a1a5a',gold:'#d8a020',
     zomb:'#6a9a4a',hood:'#262c3a',glass:'#0a0812',pink:'#ff2a5a',cyan:'#7dffc8',frame:'#1a1424',ink:'#05040a'})},
};

// ---------- drawing state
let ctx,S,C,K;
function shapeFill(path,col,bb){
  const m=S.mode;
  if(m==='flat'){ctx.fillStyle=col;path();ctx.fill();}
  else if(m==='cel'){
    ctx.fillStyle=shade(col,-0.3);path();ctx.fill();
    ctx.save();path();ctx.clip();ctx.translate(-bb[2]*0.14,-bb[3]*0.12);ctx.fillStyle=col;path();ctx.fill();ctx.restore();
    ctx.save();path();ctx.clip();ctx.globalAlpha=.55;ctx.fillStyle=shade(col,.45);
    ctx.beginPath();ctx.ellipse(bb[0]+bb[2]*.3,bb[1]+bb[3]*.24,bb[2]*.16,bb[3]*.09,-.5,0,TAU);ctx.fill();ctx.restore();
  } else if(m==='soft'){
    const r=Math.max(bb[2],bb[3])*0.85;
    const g=ctx.createRadialGradient(bb[0]+bb[2]*.34,bb[1]+bb[3]*.28,1,bb[0]+bb[2]*.45,bb[1]+bb[3]*.45,r);
    g.addColorStop(0,shade(col,S.post==='dark'?.18:.38));g.addColorStop(.45,col);g.addColorStop(1,shade(col,S.post==='dark'?-.6:-.4));
    ctx.fillStyle=g;path();ctx.fill();
    if(S.post==='clay'){ctx.save();path();ctx.clip();ctx.globalAlpha=.7;ctx.fillStyle='#fff';
      ctx.beginPath();ctx.ellipse(bb[0]+bb[2]*.3,bb[1]+bb[3]*.22,bb[2]*.13,bb[3]*.08,-.6,0,TAU);ctx.fill();ctx.restore();}
    if(S.post==='dark'){ctx.save();path();ctx.clip();ctx.globalAlpha=.55;ctx.strokeStyle='#7dffc8';ctx.lineWidth=2.2;
      ctx.translate(-2,-1.5);path();ctx.stroke();ctx.restore();}
  } else if(m==='water'){
    ctx.save();ctx.globalAlpha=.9;ctx.fillStyle=shade(col,.08);path();ctx.fill();
    ctx.globalAlpha=.35;ctx.translate(1.5,1);ctx.fillStyle=col;path();ctx.fill();ctx.restore();
    ctx.save();path();ctx.clip();ctx.globalAlpha=.32;ctx.fillStyle=shade(col,-.25);
    ctx.translate(bb[2]*.1,bb[3]*.14);path();ctx.fill();ctx.restore();
    ctx.save();ctx.globalAlpha=.45;ctx.strokeStyle=shade(col,-.3);ctx.lineWidth=2.5;path();ctx.stroke();ctx.restore();
  }
}
function outline(path,w){ if(!S.ol)return; ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=C.ink;ctx.lineWidth=(w||1)*S.ol;
  if(S.mode==='water'){ctx.globalAlpha=.7;path();ctx.stroke();ctx.translate(.8,-.6);ctx.globalAlpha=.35;path();ctx.stroke();}
  else{path();ctx.stroke();} ctx.restore();}
function shape(path,col,bb,ow){shapeFill(path,col,bb);outline(path,ow);}
function line(pts,col,w){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();}
const circ=(x,y,r)=>()=>{ctx.beginPath();ctx.arc(x,y,r,0,TAU);};
const ell=(x,y,rx,ry,a)=>()=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,a||0,0,TAU);};
const rr=(x,y,w,h,r)=>()=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);};
const poly=(pts)=>()=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();};
function glow(x,y,r,col,a){ctx.save();const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.globalAlpha=a;ctx.globalCompositeOperation=S.quant==='lum'?'source-over':'lighter';ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

// ---------- background
function drawBG(){
  const g=ctx.createLinearGradient(0,0,0,H);C.sky.forEach((c,i)=>g.addColorStop(i/(C.sky.length-1),c));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const r=rnd(7);ctx.fillStyle=C.star;
  for(let i=0;i<70;i++){const x=r()*W,y=r()*H*.55,s=r()<.15?2:1;ctx.globalAlpha=.4+r()*.6;ctx.fillRect(x,y,s,s);}ctx.globalAlpha=1;
  if(S.post==='cel'){ // halftone
    ctx.save();ctx.globalAlpha=.16;ctx.fillStyle='#ffffff';
    for(let y=0;y<H*.75;y+=9)for(let x=(y/9%2)*4.5;x<W;x+=9){const rr2=1.8*(1-y/(H*.75));if(rr2>.2){ctx.beginPath();ctx.arc(x,y,rr2,0,TAU);ctx.fill();}}ctx.restore();
  }
  // moon
  glow(322,98,90,C.moon,.25);
  shape(circ(322,98,30),C.moon,[292,68,60,60],.6);
  ctx.save();ctx.globalAlpha=.25;ctx.fillStyle=shade(C.moon,-.3);[[312,90,6],[333,108,5],[328,84,3]].forEach(a=>{ctx.beginPath();ctx.arc(a[0],a[1],a[2],0,TAU);ctx.fill();});ctx.restore();
  // giant evil tablet in sky (Vorteks' screen)
  ctx.save();ctx.translate(92,220);ctx.rotate(-.1);ctx.scale(.66,.66);ctx.globalAlpha=.8;
  glow(0,0,170,C.pink,.22);
  shape(rr(-78,-108,156,216,22),C.frame,[-78,-108,156,216],.9);
  const gg=ctx.createLinearGradient(0,-96,0,96);gg.addColorStop(0,shade(C.glass,.12));gg.addColorStop(1,C.glass);
  ctx.fillStyle=gg;rr(-66,-94,132,188,12)();ctx.fill();
  glow(0,-4,70,C.pink,.55);
  shape(ell(0,-4,40,22),C.pink,[-40,-26,80,44],.7);
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.ellipse(0,-4,5,19,0,0,TAU);ctx.fill();
  ctx.globalAlpha=.25;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(-60,30+i*9);ctx.lineTo(60,30+i*9);ctx.stroke();}
  ctx.restore();
  // city
  if(!BG_NOCITY){city(1,C.city1,560,190,20);city(2,C.city2,680,120,31);}
  // ground fog
  if(S.post==='dark'&&!BG_NOCITY){for(let i=0;i<5;i++)glow(40+i*80,760-i*30,140,'#3a6a4a',.22);}
}
function city(layer,col,top,var_,seed){
  const r=rnd(seed);let x=-10;
  while(x<W+10){const w=26+r()*44,h=(H-top)+r()*var_-var_*.3,y=H-h;
    ctx.fillStyle=col;ctx.fillRect(x,y,w,h+2);
    if(S.gothic){ctx.beginPath();ctx.moveTo(x-2,y);ctx.lineTo(x+w/2,y-28-r()*40);ctx.lineTo(x+w+2,y);ctx.fill();}
    else if(r()<.3){ctx.fillRect(x+w/2-1,y-14,2,14);}
    if(S.ol&&layer===2&&S.mode==='cel'){ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.strokeRect(x,y,w,h+4);}
    // windows
    for(let wy=y+8;wy<H-6;wy+=12)for(let wx=x+5;wx<x+w-6;wx+=9){const q=r();if(q<.32){ctx.fillStyle=q<.06?C.win2:C.win;ctx.globalAlpha=layer===1?.55:.9;ctx.fillRect(wx,wy,4,5);ctx.globalAlpha=1;}}
    x+=w+(r()<.3?4:0);}
}

// ---------- foreground pieces
function platform(x,y,w,type){
  const h=15;
  if(type==='glass'){ // cracked tablet shard - breaks
    glow(x+w/2,y+7,w*.6,C.pink,.25);
    shape(poly([[x,y+2],[x+w*.35,y],[x+w*.42,y+4],[x+w,y+1],[x+w-3,y+h],[x+w*.55,y+h-2],[x+w*.48,y+h+1],[x+3,y+h]]),C.glass,[x,y,w,h]);
    line([[x+w*.38,y+2],[x+w*.45,y+8],[x+w*.4,y+13]],C.pink,1.6);line([[x+w*.45,y+8],[x+w*.6,y+6]],C.pink,1.2);
    ctx.fillStyle=C.pink;ctx.globalAlpha=.8;ctx.fillRect(x+6,y+4,w*.22,2);ctx.globalAlpha=1;
    // falling bits
    shape(poly([[x+w*.2,y+h+8],[x+w*.28,y+h+6],[x+w*.25,y+h+13]]),C.glass,[x,y,8,8],.6);
    shape(poly([[x+w*.7,y+h+14],[x+w*.78,y+h+12],[x+w*.74,y+h+19]]),C.glass,[x,y,8,8],.6);
    return;}
  const top=type==='move'?C.blue:C.red, bot=C.navy;
  shape(rr(x,y+5,w,h-3,7),bot,[x,y+5,w,h-3]);
  shape(rr(x,y,w,9,5),top,[x,y,w,9]);
  ctx.fillStyle=C.yellow;rr(x+6,y+11,w-12,3,2)();ctx.fill();
  if(type==='move'){ctx.fillStyle=C.yellow;[[x-10,1],[x+w+10,-1]].forEach(([ax,d])=>{ctx.beginPath();ctx.moveTo(ax,y+7);ctx.lineTo(ax+8*d,y+1);ctx.lineTo(ax+8*d,y+13);ctx.closePath();ctx.fill();if(S.ol){ctx.strokeStyle=C.ink;ctx.lineWidth=S.ol*.5;ctx.stroke();}});}
}
function spring(x,y){ // a FLIX base used as trampoline on a platform
  for(let i=0;i<3;i++)line([[x-9,y-4-i*5],[x+9,y-6-i*5]],C.bone,3);
  outline(()=>{ctx.beginPath();ctx.moveTo(x-9,y-2);ctx.lineTo(x-9,y-17);ctx.moveTo(x+9,y-2);ctx.lineTo(x+9,y-17);},.4);
  shape(poly([[x-16,y-22],[x+16,y-22],[x+11,y-14],[x-11,y-14]]),C.red,[x-16,y-22,32,8]);
  ctx.fillStyle=C.white;ctx.fillRect(x-12,y-20,24,2);
}
function flixToy(x,y,a,s){ // shuttle-like FLIX toy: red base + blue/green/yellow feathers
  ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(s,s);
  [[-0.55,C.blue],[0,C.green],[0.55,C.yellow]].forEach(([ang,col])=>{
    ctx.save();ctx.rotate(ang);shape(()=>{ctx.beginPath();ctx.moveTo(0,-4);ctx.quadraticCurveTo(-11,-18,0,-34);ctx.quadraticCurveTo(11,-18,0,-4);ctx.closePath();},col,[-11,-34,22,30],.55);
    line([[0,-6],[0,-28]],shade(col,-.4),1.2);ctx.restore();});
  shape(()=>{ctx.beginPath();ctx.moveTo(-9,-4);ctx.lineTo(9,-4);ctx.lineTo(7,8);ctx.quadraticCurveTo(0,13,-7,8);ctx.closePath();},C.red,[-9,-4,18,16],.6);
  ctx.fillStyle=C.white;ctx.fillRect(-8,0,16,2.4);
  ctx.restore();
}
function hero(x,y){
  if(HERO_POSE==='lines'&&(S.post==='cel'||S.mode==='flat')){ctx.save();ctx.globalAlpha=.5;for(let i=0;i<5;i++)line([[x-24+i*12,y+64+(i%2)*10],[x-24+i*12,y+100+(i%2)*14]],S.mode==='flat'?C.ink:'#ffffff',2);ctx.restore();}
  // cape
  shape(()=>{ctx.beginPath();ctx.moveTo(x-16,y-14);ctx.quadraticCurveTo(x-52,y+18,x-44,y+58);ctx.quadraticCurveTo(x-20,y+44,x-4,y+60);ctx.quadraticCurveTo(x+14,y+40,x+20,y-10);ctx.closePath();},C.navy,[x-52,y-14,72,74]);
  shape(()=>{ctx.beginPath();ctx.moveTo(x-12,y-6);ctx.quadraticCurveTo(x-38,y+20,x-34,y+48);ctx.quadraticCurveTo(x-18,y+38,x-6,y+48);ctx.quadraticCurveTo(x+6,y+30,x+10,y-4);ctx.closePath();},C.red,[x-38,y-6,48,54],.5);
  // legs (tucked, jumping)
  line([[x-9,y+22],[x-20,y+36],[x-12,y+50]],C.skin,5);line([[x+10,y+22],[x+18,y+38],[x+12,y+52]],C.skin,5);
  shape(ell(x-13,y+53,9,5,-.2),C.red,[x-22,y+48,18,10]);shape(ell(x+13,y+55,9,5,.2),C.red,[x+4,y+50,18,10]);
  // crown spikes
  const sp=[[x-28,y-10],[x-30,y-44],[x-17,y-22],[x-9,y-62],[x,y-26],[x+10,y-64],[x+16,y-24],[x+30,y-46],[x+28,y-10]];
  shape(poly(sp),C.red2,[x-30,y-64,60,54]);
  // body
  shape(circ(x,y,29),C.red,[x-29,y-29,58,58]);
  // yellow/blue goggles band like ARKANA ears
  shape(ell(x-27,y-4,6,9,.2),C.yellow,[x-33,y-13,12,18],.5);shape(ell(x+27,y-4,6,9,-.2),C.yellow,[x+21,y-13,12,18],.5);
  // face
  [[x-9,y-6],[x+10,y-6]].forEach(([ex,ey])=>{shape(ell(ex,ey,7.5,9.5),C.white,[ex-7,ey-9,15,19],.45);
    ctx.fillStyle=C.ink;ctx.beginPath();ctx.ellipse(ex+2.5,ey-3,3.6,4.6,0,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(ex+3,ey-6,1.6,1.6);});
  line([[x-16,y-19],[x-4,y-15]],C.ink,2.6);line([[x+4,y-15],[x+17,y-19]],C.ink,2.6);
  shape(ell(x+1,y+12,6,5),'#4a0d12',[x-5,y+7,12,10],.45);
  // arms: left up holding nothing, right throwing
  if(HERO_POSE==='fall'){line([[x-24,y+2],[x-42,y+4],[x-50,y-10]],C.skin,4.5);shape(circ(x-51,y-12,5.5),C.white,[x-56,y-17,11,11],.4);
    line([[x+24,y+2],[x+42,y+4],[x+50,y-10]],C.skin,4.5);shape(circ(x+51,y-12,5.5),C.white,[x+46,y-17,11,11],.4);}
  else{line([[x-24,y+2],[x-40,y-14],[x-46,y-34]],C.skin,4.5);shape(circ(x-46,y-36,5.5),C.white,[x-51,y-41,11,11],.4);
  line([[x+24,y+2],[x+40,y-10],[x+50,y-30]],C.skin,4.5);shape(circ(x+50,y-32,5.5),C.white,[x+45,y-37,11,11],.4);}
}
function trail(pts){ctx.save();ctx.setLineDash([3,7]);ctx.globalAlpha=.7;line(pts,S.quant==='lum'?C.ink:C.yellow,2.4);ctx.restore();}
function skeletonKing(x,y){
  glow(x,y,90,C.purple,.35);
  shape(poly([[x-14,y+2],[x+14,y+2],[x+34,y+62],[x,y+52],[x-34,y+62]]),C.purple,[x-34,y,68,62]);
  // ribs
  shape(rr(x-11,y+8,22,30,6),C.bone,[x-11,y+8,22,30],.7);
  for(let i=0;i<4;i++)line([[x-8,y+14+i*6],[x+8,y+14+i*6]],C.ink,1.5);
  // arms bones
  line([[x-10,y+12],[x-26,y+24],[x-30,y+10]],C.bone,3.5);line([[x+10,y+12],[x+24,y+2],[x+30,y-14]],C.bone,3.5);
  // staff
  line([[x+32,y-30],[x+28,y+40]],C.gold,3.4);glow(x+33,y-34,26,C.cyan,.7);shape(circ(x+33,y-34,7),C.cyan,[x+26,y-41,14,14],.6);
  // skull
  shape(()=>{ctx.beginPath();ctx.arc(x,y-14,15,Math.PI*.85,Math.PI*2.15);ctx.lineTo(x+9,y+2);ctx.lineTo(x-9,y+2);ctx.closePath();},C.bone,[x-15,y-29,30,31]);
  ctx.fillStyle=C.ink;[[x-6,y-14],[x+6,y-14]].forEach(([a,b])=>{ctx.beginPath();ctx.ellipse(a,b,4.2,5,0,0,TAU);ctx.fill();});
  ctx.fillStyle=S.quant==='lum'?C.white:'#ff2a2a';[[x-6,y-14],[x+6,y-14]].forEach(([a,b])=>{ctx.beginPath();ctx.arc(a,b,1.8,0,TAU);ctx.fill();});
  for(let i=-2;i<=2;i++)line([[x+i*3,y-3],[x+i*3,y+1]],C.ink,1.2);
  // crown
  shape(poly([[x-13,y-24],[x-15,y-40],[x-7,y-31],[x,y-44],[x+7,y-31],[x+15,y-40],[x+13,y-24]]),C.gold,[x-15,y-44,30,20]);
  ctx.fillStyle=C.red;ctx.beginPath();ctx.arc(x,y-30,2.4,0,TAU);ctx.fill();
}
function phoneZombie(x,y){ // feet at y
  line([[x-5,y-18],[x-7,y]],C.skin,4.5);line([[x+5,y-18],[x+7,y]],C.skin,4.5);
  shape(rr(x-14,y-46,28,32,9),C.hood,[x-14,y-46,28,32]);
  line([[x+12,y-38],[x+22,y-30],[x+18,y-24]],C.hood,6);
  glow(x+16,y-26,34,C.cyan,.6);
  shape(rr(x+12,y-34,9,14,2),C.glass,[x+12,y-34,9,14],.5);ctx.fillStyle=C.cyan;ctx.fillRect(x+13.5,y-32,6,10);
  shape(circ(x+1,y-56,13),C.zomb,[x-12,y-69,26,26]);
  ctx.save();ctx.strokeStyle=C.ink;ctx.lineWidth=2;[[x+1,y-58],[x+10,y-58]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(a-3,b-3);ctx.lineTo(a+3,b+3);ctx.moveTo(a+3,b-3);ctx.lineTo(a-3,b+3);ctx.stroke();});ctx.restore();
  line([[x-1,y-49],[x+9,y-50]],C.ink,1.8);
}
function tabletBat(x,y){
  glow(x,y,46,C.pink,.4);
  shape(poly([[x-11,y-4],[x-38,y-20],[x-32,y-6],[x-42,y+2],[x-26,y+4],[x-12,y+8]]),C.purple,[x-42,y-20,30,28],.7);
  shape(poly([[x+11,y-4],[x+38,y-20],[x+32,y-6],[x+42,y+2],[x+26,y+4],[x+12,y+8]]),C.purple,[x+12,y-20,30,28],.7);
  shape(rr(x-13,y-17,26,34,5),C.frame,[x-13,y-17,26,34],.8);
  ctx.fillStyle=C.glass;rr(x-10,y-14,20,28,3)();ctx.fill();
  shape(ell(x,y-1,7,4.5),C.pink,[x-7,y-5,14,9],.4);ctx.fillStyle=C.ink;ctx.fillRect(x-1,y-5,2,8);
}
function coin(x,y){shape(circ(x,y,7),C.gold,[x-7,y-7,14,14],.6);ctx.fillStyle=shade(C.gold,-.35);ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('F',x,y+.5);}
function gem(x,y){glow(x,y,22,C.cyan,.5);shape(poly([[x,y-10],[x+8,y-2],[x,y+10],[x-8,y-2]]),C.cyan,[x-8,y-10,16,20],.6);}
function burst(x,y,r){shape(()=>{ctx.beginPath();for(let i=0;i<16;i++){const a=i/16*TAU,rr2=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2);}ctx.closePath();},C.yellow,[x-r,y-r,2*r,2*r],.7);}

// ---------- post processing
const BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(r=>r.map(v=>(v+.5)/16-.5));
function lum(r,g,b){return (.299*r+.587*g+.114*b)/255;}
function quantize(c){
  const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height),a=d.data,w=c.width;
  let pal=(S.pal||[]).map(rgb);
  if(S.quant==='kmeans'){pal=kmeans(a,S.k);}
  const pl=S.quant==='lum'?pal.map(p=>lum(...p)):null;
  for(let i=0;i<a.length;i+=4){const px=(i/4)%w,py=Math.floor(i/4/w),b=BAYER[py%4][px%4]*S.dither;
    if(S.quant==='lum'){let l=lum(a[i],a[i+1],a[i+2]);const n=pal.length;l=Math.min(1,Math.max(0,(l-pl[0])/(pl[n-1]-pl[0])+b/(n-1)));
      const idx=Math.round(l*(n-1));const p=pal[idx];a[i]=p[0];a[i+1]=p[1];a[i+2]=p[2];}
    else if(S.quant==='poster'){const L=S.levels-1;for(let k=0;k<3;k++){a[i+k]=Math.round(Math.min(L,Math.max(0,a[i+k]/255*L+b)))*255/L;}}
    else{const r=a[i]+b*48,g=a[i+1]+b*48,bb=a[i+2]+b*48;let best=0,bd=1e9;
      for(let j=0;j<pal.length;j++){const p=pal[j],dr=r-p[0],dg=g-p[1],db=bb-p[2],dd=dr*dr*.3+dg*dg*.59+db*db*.11;if(dd<bd){bd=dd;best=j;}}
      const p=pal[best];a[i]=p[0];a[i+1]=p[1];a[i+2]=p[2];}
    a[i+3]=255;}
  x.putImageData(d,0,0);
}
function kmeans(a,k){const pts=[];for(let i=0;i<a.length;i+=4*7)pts.push([a[i],a[i+1],a[i+2]]);
  const r=rnd(11);let c=[];for(let i=0;i<k;i++)c.push(pts[Math.floor(r()*pts.length)].slice());
  for(let it=0;it<10;it++){const s=c.map(()=>[0,0,0,0]);for(const p of pts){let b=0,bd=1e9;c.forEach((q,j)=>{const d=(p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2;if(d<bd){bd=d;b=j;}});s[b][0]+=p[0];s[b][1]+=p[1];s[b][2]+=p[2];s[b][3]++;}
    c=c.map((q,j)=>s[j][3]?[s[j][0]/s[j][3],s[j][1]/s[j][3],s[j][2]/s[j][3]]:q);}
  // add saturated brand colors so they survive
  return c.concat([rgb(BASE.zomb),rgb(BASE.cyan),rgb(BASE.pink),rgb(BASE.red),rgb(BASE.yellow),rgb(BASE.navy),rgb('#ffffff'),rgb(BASE.ink)]);}
function noiseCanvas(w,h,seed,scale){const c=document.createElement('canvas');c.width=w/scale|0;c.height=h/scale|0;const x=c.getContext('2d');const d=x.createImageData(c.width,c.height);const r=rnd(seed);
  for(let i=0;i<d.data.length;i+=4){const v=128+(r()-.5)*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}x.putImageData(d,0,0);return c;}
function post(c){
  const x=c.getContext('2d'),w=c.width,h=c.height;
  if(S.post==='water'){
    const t=document.createElement('canvas');t.width=w;t.height=h;const tx=t.getContext('2d');tx.filter='blur(5px)';tx.drawImage(c,0,0);
    x.save();x.globalAlpha=.16;x.globalCompositeOperation='multiply';x.drawImage(t,0,0);x.restore();
    // pigment blotches
    const r=rnd(5);x.save();x.globalCompositeOperation='multiply';for(let i=0;i<70;i++){const bx=r()*w,by=r()*h,br=40+r()*160;const g=x.createRadialGradient(bx,by,0,bx,by,br);g.addColorStop(0,'rgba(120,90,70,.06)');g.addColorStop(1,'rgba(120,90,70,0)');x.fillStyle=g;x.fillRect(bx-br,by-br,2*br,2*br);}x.restore();
    // paper
    const n=noiseCanvas(w,h,9,1.5);x.save();x.globalCompositeOperation='soft-light';x.globalAlpha=.28;x.filter='blur(.6px)';x.drawImage(n,0,0,w,h);x.restore();
    const n2=noiseCanvas(w,h,4,14);x.save();x.globalCompositeOperation='soft-light';x.globalAlpha=.2;x.filter='blur(6px)';x.drawImage(n2,0,0,w,h);x.restore();
    x.save();x.globalCompositeOperation='screen';x.fillStyle='rgba(255,246,230,.05)';x.fillRect(0,0,w,h);x.restore();
  }
  if(S.post==='clay'){
    const n=noiseCanvas(w,h,21,3);x.save();x.globalCompositeOperation='overlay';x.globalAlpha=.07;x.filter='blur(1.4px)';x.drawImage(n,0,0,w,h);x.restore();
    const n2=noiseCanvas(w,h,22,10);x.save();x.globalCompositeOperation='soft-light';x.globalAlpha=.16;x.filter='blur(5px)';x.drawImage(n2,0,0,w,h);x.restore();
    vignette(x,w,h,.35,'#2a1420');
  }
  if(S.post==='dark'){
    x.save();x.globalCompositeOperation='multiply';x.fillStyle='#b4b8cc';x.fillRect(0,0,w,h);x.restore();
    for(let i=0;i<4;i++){const g=x.createLinearGradient(0,h*(.2+i*.2),0,h*(.35+i*.2));g.addColorStop(0,'rgba(80,140,110,0)');g.addColorStop(.5,'rgba(90,160,120,.15)');g.addColorStop(1,'rgba(80,140,110,0)');x.fillStyle=g;x.fillRect(0,0,w,h);}
    const n=noiseCanvas(w,h,31,2);x.save();x.globalCompositeOperation='overlay';x.globalAlpha=.12;x.drawImage(n,0,0,w,h);x.restore();
    vignette(x,w,h,.6,'#000000');
  }
  if(S.post==='cel'){vignette(x,w,h,.2,'#120830');}
}
function vignette(x,w,h,a,col){const g=x.createRadialGradient(w/2,h*.46,w*.35,w/2,h/2,h*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,col);x.save();x.globalAlpha=a;x.fillStyle=g;x.fillRect(0,0,w,h);x.restore();}

