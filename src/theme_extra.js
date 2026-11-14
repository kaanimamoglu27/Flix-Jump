// ---------- Flix Jump: ek çizimler (yeni kötüler, patronlar, bölüm arka planları)
BASE.stone='#8d8779';BASE.glowg='#5dff7a';BASE.ice='#9fdcff';BASE.cloud='#ffffff';
for(const k in STYLES){const p=STYLES[k].P;
  if(k==='onebit'){p.stone='#a8a294';p.glowg='#ffffff';p.ice='#ffffff';p.cloud='#ffffff';}
  else if(k==='gameboy'){p.stone='#708848';p.glowg='#f0f8d0';p.ice='#e8f0c0';p.cloud='#f0f8d0';}
  else if(k==='dark'){p.stone='#5a564e';p.glowg='#5dff7a';p.ice='#5a9ac0';p.cloud='#b8c0d8';}
  else if(k==='water'){p.stone='#a8a094';p.glowg='#7af09a';p.ice='#b8e4ff';p.cloud='#ffffff';}
  else{p.stone=BASE.stone;p.glowg=BASE.glowg;p.ice=BASE.ice;p.cloud=BASE.cloud;}
}
function ghost(x,y){ // kulaklık hayaleti
  glow(x,y,34,C.cyan,.25);
  shape(()=>{ctx.beginPath();ctx.arc(x,y-6,16,Math.PI,0);ctx.lineTo(x+16,y+16);ctx.quadraticCurveTo(x+11,y+9,x+6,y+16);ctx.quadraticCurveTo(x,y+9,x-6,y+16);ctx.quadraticCurveTo(x-11,y+9,x-16,y+16);ctx.closePath();},C.bone,[x-16,y-22,32,38]);
  ctx.save();ctx.strokeStyle=C.ink;ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();ctx.arc(x,y-8,18,Math.PI*1.08,Math.PI*1.92);ctx.stroke();ctx.restore();
  shape(rr(x-22,y-12,7,13,3),C.pink,[x-22,y-12,7,13],.6);shape(rr(x+15,y-12,7,13,3),C.pink,[x+15,y-12,7,13],.6);
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.ellipse(x-6,y-6,3,4.4,0,0,TAU);ctx.ellipse(x+6,y-6,3,4.4,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.ellipse(x,y+3,3.2,4,0,0,TAU);ctx.fill();
}
function mine(x,y){ // dikenli bildirim
  shape(()=>{ctx.beginPath();for(let i=0;i<20;i++){const a=i/20*TAU,r=i%2?11:18;ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}ctx.closePath();},C.frame,[x-18,y-18,36,36]);
  shape(circ(x,y,9),C.glass,[x-9,y-9,18,18],.5);
  ctx.fillStyle=C.pink;ctx.beginPath();ctx.ellipse(x,y,5,3,0,0,TAU);ctx.fill();ctx.fillStyle=C.ink;ctx.fillRect(x-.8,y-3,1.6,6);
  shape(circ(x+10,y-11,6.5),S.quant==='lum'?C.white:'#ff3b30',[x+3,y-18,13,13],.6);
  ctx.fillStyle=S.quant==='lum'?C.ink:'#fff';ctx.fillRect(x+9.2,y-15,1.8,5);ctx.fillRect(x+9.2,y-8.6,1.8,1.8);
}
function snake(x,y){ // kablo yılanı, ayak hizası y
  const body=()=>{ctx.beginPath();ctx.moveTo(x-24,y-4);ctx.quadraticCurveTo(x-17,y-16,x-10,y-5);ctx.quadraticCurveTo(x-3,y+5,x+4,y-6);ctx.lineTo(x+10,y-10);};
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';if(S.ol){ctx.strokeStyle=C.ink;ctx.lineWidth=7+S.ol*1.4;body();ctx.stroke();}
  ctx.strokeStyle=C.hood;ctx.lineWidth=7;body();ctx.stroke();ctx.strokeStyle=shade(C.hood,.35);ctx.lineWidth=1.6;ctx.setLineDash([3,5]);body();ctx.stroke();ctx.restore();
  line([[x+22,y-17],[x+28,y-17]],C.gold,2.4);line([[x+22,y-10],[x+28,y-10]],C.gold,2.4);
  shape(rr(x+7,y-21,16,15,4),C.bone,[x+7,y-21,16,15],.7);
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(x+16,y-15,2.4,0,TAU);ctx.fill();line([[x+11,y-20],[x+18,y-18]],C.ink,1.6);
}
function drone(x,y){ // lazer kamera
  line([[x-12,y-6],[x-22,y-14]],C.ink,2.4);line([[x+12,y-6],[x+22,y-14]],C.ink,2.4);
  shape(ell(x-22,y-15,11,3),C.bone,[x-33,y-18,22,6],.5);shape(ell(x+22,y-15,11,3),C.bone,[x+11,y-18,22,6],.5);
  shape(rr(x-16,y-9,32,19,8),C.frame,[x-16,y-9,32,19]);
  glow(x,y+1,16,C.pink,.5);shape(circ(x,y+1,6.5),C.pink,[x-7,y-6,13,13],.5);ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(x,y+1,2.6,0,TAU);ctx.fill();
  ctx.fillStyle=C.yellow;ctx.fillRect(x-12,y-5,4,2.4);
}
function dragon(x,y){ // kemik ejderha
  glow(x,y,110,C.glowg,.22);
  const wing=d=>{shape(poly([[x+d*12,y-4],[x+d*84,y-46],[x+d*70,y-10],[x+d*88,y+18],[x+d*54,y+12],[x+d*36,y+32],[x+d*14,y+16]]),C.purple,[x+(d>0?12:-88),y-46,76,78],.8);
    line([[x+d*12,y-4],[x+d*84,y-46]],C.bone,3.4);line([[x+d*14,y],[x+d*70,y-10]],C.bone,2.4);line([[x+d*14,y+4],[x+d*54,y+12]],C.bone,2.4);};
  wing(-1);wing(1);
  line([[x,y+26],[x-6,y+50],[x+8,y+68],[x+2,y+84]],C.bone,5);
  shape(rr(x-15,y-6,30,36,10),C.bone,[x-15,y-6,30,36],.8);for(let i=0;i<4;i++)line([[x-10,y+2+i*7],[x+10,y+2+i*7]],C.ink,1.6);
  line([[x,y-8],[x,y-22]],C.bone,6);
  shape(poly([[x-20,y-52],[x-8,y-60],[x+8,y-60],[x+20,y-52],[x+16,y-30],[x+7,y-20],[x-7,y-20],[x-16,y-30]]),C.bone,[x-20,y-60,40,40]);
  shape(poly([[x-17,y-55],[x-30,y-74],[x-10,y-60]]),C.bone,[x-30,y-74,20,19],.7);shape(poly([[x+17,y-55],[x+30,y-74],[x+10,y-60]]),C.bone,[x+10,y-74,20,19],.7);
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.ellipse(x-8,y-43,5,6,.3,0,TAU);ctx.ellipse(x+8,y-43,5,6,-.3,0,TAU);ctx.fill();
  ctx.fillStyle=C.glowg;ctx.beginPath();ctx.arc(x-8,y-43,2.2,0,TAU);ctx.arc(x+8,y-43,2.2,0,TAU);ctx.fill();
  for(let i=-2;i<=2;i++){ctx.fillStyle=C.ink;ctx.beginPath();ctx.moveTo(x+i*3-1.4,y-27);ctx.lineTo(x+i*3,y-21);ctx.lineTo(x+i*3+1.4,y-27);ctx.fill();}
}
function golem(x,y){ // dev zombi
  glow(x,y,100,C.glowg,.18);
  shape(rr(x-68,y-8,26,62,11),C.stone,[x-68,y-8,26,62]);shape(rr(x+42,y-8,26,62,11),C.stone,[x+42,y-8,26,62]);
  shape(rr(x-42,y-12,84,74,16),C.stone,[x-42,y-12,84,74]);
  shape(rr(x-25,y-60,50,50,13),C.stone,[x-25,y-60,50,50]);
  ctx.fillStyle=C.glowg;ctx.fillRect(x-15,y-42,10,6);ctx.fillRect(x+5,y-42,10,6);line([[x-9,y-26],[x+9,y-26]],C.ink,2.4);
  line([[x-12,y],[x-2,y+16],[x-12,y+30],[x-4,y+46]],C.glowg,3);line([[x+16,y+4],[x+8,y+22],[x+18,y+38]],C.glowg,2.4);
  ctx.save();ctx.globalAlpha=.35;ctx.fillStyle=C.ink;[[x-30,y+40,5],[x+28,y-2,4],[x-10,y-52,3],[x+50,y+30,4]].forEach(a=>{ctx.beginPath();ctx.arc(a[0],a[1],a[2],0,TAU);ctx.fill();});ctx.restore();
}
function vorteks(x,y){ // son patron
  glow(x,y,110,C.pink,.22);
  shape(poly([[x-20,y-24],[x+20,y-24],[x+46,y+64],[x+14,y+54],[x,y+66],[x-14,y+54],[x-46,y+64]]),C.glass,[x-46,y-24,92,90]);
  shape(poly([[x-20,y-26],[x-44,y-36],[x-36,y-20],[x-46,y-10],[x-22,y-10]]),C.frame,[x-46,y-36,26,26],.7);
  shape(poly([[x+20,y-26],[x+44,y-36],[x+36,y-20],[x+46,y-10],[x+22,y-10]]),C.frame,[x+20,y-36,26,26],.7);
  shape(rr(x-18,y-24,36,50,7),C.frame,[x-18,y-24,36,50]);
  line([[x-11,y-16],[x,y-2],[x+11,y-16]],C.pink,3);shape(poly([[x,y-6],[x+5,y+2],[x,y+10],[x-5,y+2]]),C.pink,[x-5,y-6,10,16],.5);
  ctx.fillStyle=C.purple;ctx.fillRect(x-12,y+16,24,5);
  shape(poly([[x-14,y-54],[x-22,y-76],[x-6,y-60]]),C.purple,[x-22,y-76,16,22],.6);shape(poly([[x+14,y-54],[x+22,y-76],[x+6,y-60]]),C.purple,[x+6,y-76,16,22],.6);
  shape(poly([[x-15,y-58],[x,y-66],[x+15,y-58],[x+13,y-30],[x,y-24],[x-13,y-30]]),C.frame,[x-15,y-66,30,42]);
  shape(poly([[x-11,y-48],[x+11,y-48],[x+7,y-41],[x-7,y-41]]),C.pink,[x-11,y-48,22,7],.4);
  line([[x+20,y-12],[x+34,y+2]],C.frame,6);shape(rr(x+26,y-2,22,30,4),C.glass,[x+26,y-2,22,30],.8);
  shape(ell(x+37,y+13,7,4.5),C.pink,[x+30,y+8,14,9],.4);ctx.fillStyle=C.ink;ctx.fillRect(x+36.2,y+9,1.6,8);
  line([[x-20,y-12],[x-36,y-22]],C.frame,6);glow(x-40,y-28,22,C.pink,.8);shape(circ(x-40,y-28,6),C.pink,[x-46,y-34,12,12],.5);
}
function goalFlag(x,y){ // bölüm sonu: dev Flix
  glow(x,y-40,70,C.yellow,.5);flixToy(x,y-4,0,2.1);
}
function cloudPlat(x,y,w){const n=Math.max(3,Math.round(w/20)),rr0=w/n*.75;
  const path=()=>{ctx.beginPath();for(let i=0;i<n;i++){const cx0=x+w*(i+.5)/n;ctx.moveTo(cx0+rr0,y+8);ctx.arc(cx0,y+8+(i%2?1.5:-1.5),rr0,0,TAU);}};
  outline(path,1.4);shapeFill(path,C.cloud,[x,y-4,w,24]);
  ctx.save();ctx.globalAlpha=.22;ctx.fillStyle=C.blue;rr(x+8,y+12,w-16,3,2)();ctx.fill();ctx.restore();}
function icePlat(x,y,w){shape(rr(x,y,w,14,5),C.ice,[x,y,w,14]);ctx.save();ctx.globalAlpha=.8;ctx.fillStyle=C.white;rr(x+6,y+3,w*.35,2.4,1)();ctx.fill();ctx.restore();
  for(let i=0;i<3;i++){const ix=x+w*(.2+i*.3);shape(poly([[ix-4,y+13],[ix+4,y+13],[ix,y+21+i%2*4]]),C.ice,[ix-4,y+13,8,10],.5);}}
// --- sky + backdrop per level
function drawSkyLv(L){
  const g=ctx.createLinearGradient(0,0,0,H);L.sky.forEach((c,i)=>g.addColorStop(i/(L.sky.length-1),c));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(L.stars){const r=rnd(7+L.n);ctx.fillStyle=C.star;const n=L.stars>1?150:70;for(let i=0;i<n;i++){const x=r()*W,y=r()*H*(L.stars>1?1:.6),s=r()<.15?2:1;ctx.globalAlpha=.4+r()*.6;ctx.fillRect(x,y,s,s);}ctx.globalAlpha=1;}
  if(S.post==='cel'){ctx.save();ctx.globalAlpha=.14;ctx.fillStyle='#ffffff';for(let y=0;y<H*.75;y+=9)for(let x=(y/9%2)*4.5;x<W;x+=9){const r2=1.8*(1-y/(H*.75));if(r2>.2){ctx.beginPath();ctx.arc(x,y,r2,0,TAU);ctx.fill();}}ctx.restore();}
  const d=L.deco||'';
  if(d.includes('moon')){glow(322,128,90,C.moon,.25);shape(circ(322,128,30),C.moon,[292,98,60,60],.6);ctx.save();ctx.globalAlpha=.25;ctx.fillStyle=shade(C.moon,-.3);[[312,120,6],[333,138,5],[328,114,3]].forEach(a=>{ctx.beginPath();ctx.arc(a[0],a[1],a[2],0,TAU);ctx.fill();});ctx.restore();}
  if(d.includes('sun')){glow(318,150,130,C.yellow,.45);shape(circ(318,150,34),shade(C.yellow,.35),[284,116,68,68],.6);}
  if(d.includes('planet')){shape(circ(90,230,46),C.purple,[44,184,92,92],.7);ctx.save();ctx.strokeStyle=C.pink;ctx.lineWidth=5;ctx.globalAlpha=.8;ctx.beginPath();ctx.ellipse(90,230,74,16,-.3,0,TAU);ctx.stroke();ctx.restore();shape(circ(310,420,18),C.cyan,[292,402,36,36],.6);shape(circ(250,120,9),C.yellow,[241,111,18,18],.5);}
  if(d.includes('tablet')){ctx.save();ctx.translate(92,250);ctx.rotate(-.1);const sc=d.includes('TABLET')?1.05:.66;ctx.scale(sc,sc);ctx.globalAlpha=.8;
    glow(0,0,170,C.pink,.22);shape(rr(-78,-108,156,216,22),C.frame,[-78,-108,156,216],.9);
    ctx.fillStyle=C.glass;rr(-66,-94,132,188,12)();ctx.fill();glow(0,-4,70,C.pink,.55);shape(ell(0,-4,40,22),C.pink,[-40,-26,80,44],.7);
    ctx.fillStyle=C.ink;ctx.beginPath();ctx.ellipse(0,-4,5,19,0,0,TAU);ctx.fill();ctx.restore();}
}
function backdrop(L,CH){ // strip of height CH, bottom aligned at y=CH
  const r=rnd(40+L.n),c1=L.c1,c2=L.c2,t=L.bd;
  const hillFn=(col,base,amp,f,ph)=>{ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,CH);for(let x=0;x<=W;x+=6)ctx.lineTo(x,base+Math.sin(x*f+ph)*amp+Math.sin(x*f*2.3+ph*2)*amp*.35);ctx.lineTo(W,CH);ctx.fill();};
  if(t==='city'||t==='castle'){ctx.save();ctx.translate(0,CH-844);const oh=H,og=S.gothic,o1=C.city1,o2=C.city2,ow=C.win,ow2=C.win2;H=844;C.city1=c1;C.city2=c2;if(L.win)C.win=L.win;if(L.win2)C.win2=L.win2;
    if(t==='castle')S.gothic=true;city(1,c1,560,190,20+L.n);city(2,c2,680,120,31+L.n);S.gothic=og;C.city1=o1;C.city2=o2;C.win=ow;C.win2=ow2;H=oh;ctx.restore();}
  else if(t==='hills'){hillFn(c1,CH-150,34,.018,L.n);for(let i=0;i<9;i++){const x=r()*W,y=CH-150+Math.sin(x*.018+L.n)*34-4;ctx.fillStyle=shade(c1,-.15);ctx.beginPath();ctx.moveTo(x-9,y+10);ctx.lineTo(x,y-22-r()*14);ctx.lineTo(x+9,y+10);ctx.fill();}
    hillFn(c2,CH-80,26,.024,L.n*2);for(let i=0;i<7;i++){const x=r()*W,y=CH-80+Math.sin(x*.024+L.n*2)*26;ctx.fillStyle=shade(c2,-.2);ctx.fillRect(x-2,y-14,4,18);ctx.beginPath();ctx.arc(x,y-22,12+r()*5,0,TAU);ctx.fill();}}
  else if(t==='peaks'||t==='lava'){const pk=(col,base,hh,n,snow)=>{for(let i=0;i<n;i++){const x=(i+.5)/n*W+(r()-.5)*40,w=70+r()*60,h=hh*(.6+r()*.6);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-w,CH);ctx.lineTo(x,base-h);ctx.lineTo(x+w,CH);ctx.fill();
      if(snow){ctx.fillStyle=snow;ctx.beginPath();ctx.moveTo(x-w*.22,base-h+ (CH-base+h)*.22);ctx.lineTo(x,base-h);ctx.lineTo(x+w*.22,base-h+(CH-base+h)*.22);ctx.lineTo(x+w*.08,base-h+(CH-base+h)*.17);ctx.lineTo(x-w*.06,base-h+(CH-base+h)*.25);ctx.fill();}}};
    pk(c1,CH-110,130,4,t==='peaks'?C.white:null);pk(c2,CH-40,90,5,null);
    if(t==='lava'){const g=ctx.createLinearGradient(0,CH-50,0,CH);g.addColorStop(0,'rgba(255,120,20,0)');g.addColorStop(1,'rgba(255,140,30,.9)');ctx.fillStyle=g;ctx.fillRect(0,CH-50,W,50);}}
  else if(t==='factory'){const blk=(col,base,seed)=>{const q=rnd(seed);let x=-10;while(x<W+10){const w=50+q()*50,h=60+q()*70;ctx.fillStyle=col;ctx.fillRect(x,base-h,w,CH);
        if(q()<.6){ctx.fillRect(x+w*.2,base-h-40-q()*30,10,60);ctx.save();ctx.globalAlpha=.35;ctx.fillStyle=C.white;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x+w*.2+5+i*7,base-h-52-i*14-q()*20,7+i*3,0,TAU);ctx.fill();}ctx.restore();ctx.fillStyle=col;}
        else{ctx.beginPath();for(let i=0;i<3;i++){ctx.moveTo(x+i*w/3,base-h);ctx.lineTo(x+i*w/3,base-h-14);ctx.lineTo(x+(i+1)*w/3,base-h);}ctx.fill();}
        for(let wy=base-h+10;wy<CH-8;wy+=16)for(let wx=x+6;wx<x+w-8;wx+=12)if(q()<.3){ctx.fillStyle=C.win;ctx.globalAlpha=.8;ctx.fillRect(wx,wy,6,6);ctx.globalAlpha=1;ctx.fillStyle=col;}
        x+=w+4;}};blk(c1,CH-90,60+L.n);blk(c2,CH-10,70+L.n);}
  else if(t==='clouds'){for(let j=0;j<2;j++){ctx.fillStyle=j?c1:c2;ctx.globalAlpha=j?.95:.7;for(let i=0;i<10;i++){const x=r()*W,y=CH-30-(1-j)*70+r()*30;ctx.beginPath();ctx.arc(x,y,36+r()*30,0,TAU);ctx.arc(x+40,y+10,28+r()*20,0,TAU);ctx.fill();}ctx.fillRect(0,CH-20-(1-j)*50,W,80);}ctx.globalAlpha=1;}
}
