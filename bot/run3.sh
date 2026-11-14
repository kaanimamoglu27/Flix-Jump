#!/bin/bash
cd "$(dirname "$0")"
for b in strong normal weak; do timeout 1500 node bot.js $b > $b.json; done
for f in strong normal weak; do python3 - $f <<'PY'
import json,sys
d=json.load(open(sys.argv[1]+'.json'));r=d['res']
print(d['bot'],'min',r.get('min'),'deaths',r['deaths'],'replays',r['replays'],'coins',r.get('coins'),'tuy',r.get('tuy'),'done',r.get('done'))
print(' ',[(x['n'],x.get('attempts'),x.get('sec'),x.get('fail')) for x in r['levels']])
print(' endless',r.get('endless'),d['errs'])
PY
done
