const o=({url:n})=>{const e=n.searchParams,t=function(g){const r=g.split("E");let s=parseInt(r[0],36),l=0;return r[1]&&(l=parseInt(r[1],36)),s*=10**l,l<0&&(s=parseFloat(s.toFixed(-l))),s},a=e.has("ms")?parseInt(e.get("ms"),2):0;return{weaponDamage:e.has("wd")?t(e.get("wd")):0,specialDamage:e.has("sd")?t(e.get("sd")):0,parkGain:e.has("pg")?t(e.get("pg")):0,jobGain:e.has("jg")?t(e.get("jg")):0,equipGain:e.has("eg")?t(e.get("eg")):0,numLegendStone:e.has("ns")?parseInt(e.get("ns")).toString():"0",skill:e.has("sk")?e.get("sk"):"general_attack",strLevel:e.has("str")?parseInt(e.get("str"),36):0,magicStone:{level_1:(a>>5&1)==1,level_2:(a>>4&1)==1,level_3:(a>>3&1)==1,level_4:(a>>2&1)==1,"level_4.5":(a>>1&1)==1,level_5:(a>>0&1)==1},darkMode:localStorage.getItem("dark_mode")=="true"}},p=Object.freeze(Object.defineProperty({__proto__:null,load:o},Symbol.toStringTag,{value:"Module"}));export{p as _,o as l};
