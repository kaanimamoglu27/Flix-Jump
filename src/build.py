import base64,os,sys
D=os.path.dirname(os.path.abspath(__file__))
R=lambda p:open(os.path.join(D,p),encoding='utf-8').read()
b64=lambda p:base64.b64encode(open(p,'rb').read()).decode()
F='/tmp/claude-0/zip/'
fonts=''.join(f"@font-face{{font-family:{n};src:url(data:font/woff2;base64,{b64(os.path.join(D,'fonts',f))}) format('woff2');font-weight:100 900;font-display:block}}\n" for n,f in [('Baloo','baloo.woff2'),('Lucky','lucky.woff2'),('PS','ps2p.woff2'),('Cinzel','cinzel.woff2')])
# Turkish letters (ğ Ğ ş Ş İ) are not in the Latin files above: the latin-ext files (same fonts, from Fontsource) cover them.
# Declared after the base faces, so for characters in this range the browser tries the ext file first.
EXT='U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'
fonts+=''.join(f"@font-face{{font-family:{n};src:url(data:font/woff2;base64,{b64(os.path.join(D,'fonts',f))}) format('woff2');font-weight:100 900;font-display:block;unicode-range:{EXT}}}\n" for n,f in [('Baloo','baloo_ext.woff2'),('Lucky','lucky_ext.woff2'),('PS','ps2p_ext.woff2'),('Cinzel','cinzel_ext.woff2')])
s=R('index.src.html')
s=s.replace('/*FONTS*/',fonts)
s=s.replace('<script>/*LOGO*/</script>','<script>const LOGO="data:image/png;base64,'+b64(os.path.join(D,'logo.png'))+'";</script>')
s=s.replace('/*AUDIO*/',R('audio_novahop.js')).replace('/*LEGAL*/',R('flix-legal.js')).replace('/*THEME_BASE*/',R('theme_base.js')+'\n'+R('theme_extra.js')).replace('/*LEVELS*/',R('levels.js')).replace('/*THEME*/',R('theme.js')).replace('/*GAME*/',R('game.js'))
out=os.path.join(D,'..','index.html');open(out,'w',encoding='utf-8').write(s);print(out,len(s))
