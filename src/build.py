import base64,os,sys
D=os.path.dirname(os.path.abspath(__file__))
R=lambda p:open(os.path.join(D,p),encoding='utf-8').read()
b64=lambda p:base64.b64encode(open(p,'rb').read()).decode()
F='/tmp/claude-0/zip/'
fonts=''.join(f"@font-face{{font-family:{n};src:url(data:font/woff2;base64,{b64(os.path.join(D,'fonts',f))}) format('woff2');font-weight:100 900;font-display:block}}\n" for n,f in [('Baloo','baloo.woff2'),('Lucky','lucky.woff2'),('PS','ps2p.woff2'),('Cinzel','cinzel.woff2')])
s=R('index.src.html')
s=s.replace('/*FONTS*/',fonts)
s=s.replace('<script>/*LOGO*/</script>','<script>const LOGO="data:image/png;base64,'+b64(os.path.join(D,'logo.png'))+'";</script>')
s=s.replace('/*AUDIO*/',R('audio_novahop.js')).replace('/*LEGAL*/',R('flix-legal.js')).replace('/*THEME_BASE*/',R('theme_base.js')+'\n'+R('theme_extra.js')).replace('/*LEVELS*/',R('levels.js')).replace('/*THEME*/',R('theme.js')).replace('/*GAME*/',R('game.js'))
out=os.path.join(D,'..','index.html');open(out,'w',encoding='utf-8').write(s);print(out,len(s))
