// Headless skill bots for Flix Jump. Usage: node bot.js <weak|normal|strong> [seedTag]
const {chromium}=require('playwright');
const SK={weak:{err:30,every:18,shoot:.03,dodge:0,sup:0},normal:{err:14,every:8,shoot:.12,dodge:.5,sup:1},strong:{err:5,every:2,shoot:.4,dodge:1,sup:1}};
(async()=>{const name=process.argv[2]||'normal';const b=await chromium.launch();const p=await b.newPage({viewport:{width:430,height:932}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));await p.waitForTimeout(1200);
const res=await p.evaluate(async(S)=>{
  save.how=true;save.ctl='drag';save.lang='tr';
  const R={levels:[],ticks:0,deaths:0,replays:0};let tgt=null,terr=0,since=99;
  
  const wrapDx=(a,b)=>{let d=a-b;if(d>GW/2)d-=GW;if(d<-GW/2)d+=GW;return d;};
  let stuckAlt=0,stuckT=0;
  function think(){stuckT++;if(alt<stuckAlt)stuckAlt=alt;
    if(++since>=S.every||!tgt||tgt.dead||tgt.broken||tgt.gone>0){since=0;
      const feet=PL.y+PL.r,g=GRAV*((LV.f||{}).lowg?.55:1);
      const bad=new Set(ens.filter(e=>e.plat&&!e.dead).map(e=>e.plat));
      let best=null,bs=-1e9;
      for(const q of plats){if(q.broken||q.gone>0||q.type==='glass')continue;
        const cx_=q.x+q.w/2,dx=Math.abs(wrapDx(cx_,PL.x));let ok=false,sc=0;
        if(PL.vy<0){const apex=feet-PL.vy*PL.vy/(2*g);if(q.y>apex+14&&q.y<feet+40){const tt=(-PL.vy/g)+Math.sqrt(2*Math.max(1,q.y-apex)/g);ok=dx<6*tt+q.w/2-10;sc=-q.y;}}
        else{if(q.y>=feet-4&&q.y<camY+GH-10){const tt=Math.sqrt(2*(q.y-feet+1)/g);ok=dx<6*tt+q.w/2-10;sc=-q.y;}}
        if(!ok)continue;if(bad.has(q))sc-=260;if(q.off)sc-=200;if(q.type==='ground'||q.type==='goal')sc+=0;
        if(sc>bs){bs=sc;best=q;}}
      if(alt>stuckAlt+5){stuckAlt=alt;stuckT=0;}
      if(stuckT>420){const feet2=PL.y+PL.r;const ab=plats.filter(q=>!q.broken&&q.gone<=0&&q.type!=='glass'&&q.y<feet2-30&&q.y>feet2-150);if(ab.length)best=ab[(Math.random()*ab.length)|0];if(stuckT>900)stuckT=300;}
      if(best!==tgt){tgt=best;terr=(Math.random()*2-1)*S.err;}
    }
    keys.l=keys.r=false;
    let want=tgt?wrapDx(tgt.x+tgt.w/2+terr,PL.x):0;
    if(S.dodge&&Math.random()<S.dodge){for(const o of orbs){if(o.y<PL.y&&o.y>PL.y-170&&Math.abs(o.x-PL.x)<46){want=(PL.x>o.x?1:-1)*60;break;}}
      for(const e of ens){if(e.dead||e.plat)continue;if(e.y<PL.y&&e.y>PL.y-120&&Math.abs(e.x-PL.x)<44&&PL.vy<0){want=(PL.x>e.x?1:-1)*60;break;}}}
    if(want>7)keys.r=true;else if(want<-7)keys.l=true;
    const threat=(boss&&!boss.dead)||ens.some(e=>!e.dead&&e.y<PL.y-10&&e.y>camY-10);
    if(threat&&fireCd<=0&&Math.random()<S.shoot)shoot();
    if(S.sup&&superCh>=1&&threat)doSuper();
  }
  async function playLevel(n,first){let attempts=0,t0=R.ticks;
    if(first)startLevel(n);
    for(;;){let guard=0;
      while(state==='play'||state==='dying'||(state==='win'&&winT<70)){if(state==='play')think();update();R.ticks++;if(++guard>60*60*12)return {n,fail:'timeout'};
        if(state==='play'&&LV.n!==n)return {n,attempts,sec:Math.round((R.ticks-t0)/60),carried:true};}
      if(state==='win'){await new Promise(r=>setTimeout(r,1100));}
      if(state==='over'&&lastWon)return {n,attempts,sec:Math.round((R.ticks-t0)/60),carried:false};
      attempts++;R.deaths++;if(attempts>=250)return {n,attempts,fail:'stuck'};
      startLevel(n);}
  }
  let first=true;
  for(let n=1;n<=20;n++){
    let r=await playLevel(n,first);R.levels.push(r);if(r.fail)break;first=!r.carried;
    if(!r.carried&&n<20){ // not enough feathers: replay this level until the next one can be opened
      let guard=0;while(save.tuy<levelCost(n+1)&&guard++<30){R.replays++;const rr=await playLevel(n,true);if(rr.carried){first=false;break;}}
      if(first){save.tuy-=levelCost(n+1);save.open=n+1;}
    }
  }
  R.min=+(R.ticks/3600).toFixed(1);R.coins=save.coins;R.tuy=save.tuy;R.done=save.done;
  // endless: 5 runs
  R.endless=[];for(let i=0;i<5;i++){mode='endless';segN=0;LV=Object.assign({},LEVELS[0],{boss:null,alt:1e9,en:{zombie:.5,bat:.4}});TH.setLevel(LV,GW,GH);resetWorld();begin();let tk=0;
    while((state==='play'||state==='dying')&&tk<60*60*30){if(state==='play')think();update();tk++;}
    R.endless.push({score:score(),alt:Math.round(alt),sec:Math.round(tk/60)});}
  return R;
},SK[name]);
console.log(JSON.stringify({bot:name,res,errs:errs.slice(0,3)}));await b.close();})();
