const E=require('../src/engine.js'),AI=require('../src/ai.js');
const G=E.newGame({seed:+(process.argv[2]||1)});E.startTurn(G);
const show=()=>{const rows=[];for(let r=0;r<E.ROWS;r++){let s='';for(let c=0;c<E.COLS;c++){const u=E.unitAt(G,c,r);const t=E.hex(G,c,r).t;s+=u?(u.side==='A'?(u.status==='rout'?'a':(E.TYPES[u.type].mg?'M':'A')):(u.status==='rout'?'d':(E.TYPES[u.type].mg?'S':'D'))):({open:'.',mud:'~',crater:'o',trench:'=',wire:'x',village:'#',forest:'T',canal:'|',bridge:'+'}[t]);}rows.push(s);}console.log(rows.join('\n'));};
let last=0;const counts={};
while(!G.over){const a=AI.next(G);if(!a){if(G.side==='D'&&(G.turn%3===0||G.turn===1)){console.log('--- Ende Runde',G.turn,'Verluste A',E.losses(G,'A').toFixed(2),'D',E.losses(G,'D').toFixed(2));show();}E.endTurn(G);continue;}for(const s of a.steps){const ev=AI.exec(G,a.u,s);for(const e of ev)counts[e.t]=(counts[e.t]||0)+1;}}
console.log(G.over,counts);show();
