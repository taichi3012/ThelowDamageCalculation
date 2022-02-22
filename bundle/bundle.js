var app=function(e){"use strict";function t(){}const n=e=>e;function o(e,t){for(const n in t)e[n]=t[n];return e}function l(e){return e()}function a(){return Object.create(null)}function s(e){e.forEach(l)}function i(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function c(e,n,o){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const o=e.subscribe(...n);return o.unsubscribe?()=>o.unsubscribe():o}(n,o))}const u="undefined"!=typeof window;let d=u?()=>window.performance.now():()=>Date.now(),p=u?e=>requestAnimationFrame(e):t;const f=new Set;function m(e){f.forEach((t=>{t.c(e)||(f.delete(t),t.f())})),0!==f.size&&p(m)}function g(e){let t;return 0===f.size&&p(m),{promise:new Promise((n=>{f.add(t={c:e,f:n})})),abort(){f.delete(t)}}}function h(e,t){e.appendChild(t)}function v(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function _(e){const t=$("style");return function(e,t){h(e.head||e,t)}(v(e),t),t.sheet}function b(e,t,n){e.insertBefore(t,n||null)}function y(e){e.parentNode.removeChild(e)}function k(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function $(e){return document.createElement(e)}function x(e){return document.createTextNode(e)}function w(){return x(" ")}function S(e,t,n,o){return e.addEventListener(t,n,o),()=>e.removeEventListener(t,n,o)}function C(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function L(e){return""===e?null:+e}function j(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function E(e,t){e.value=null==t?"":t}function M(e,t){for(let n=0;n<e.options.length;n+=1){const o=e.options[n];if(o.__value===t)return void(o.selected=!0)}e.selectedIndex=-1}function G(e){const t=e.querySelector(":checked")||e.options[0];return t&&t.__value}function D(e,t,n){e.classList[n?"add":"remove"](t)}const O=new Map;let I,A=0;function R(e,t,n,o,l,a,s,i=0){const r=16.666/o;let c="{\n";for(let e=0;e<=1;e+=r){const o=t+(n-t)*a(e);c+=100*e+`%{${s(o,1-o)}}\n`}const u=c+`100% {${s(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${i}`,p=v(e),{stylesheet:f,rules:m}=O.get(p)||function(e,t){const n={stylesheet:_(t),rules:{}};return O.set(e,n),n}(p,e);m[d]||(m[d]=!0,f.insertRule(`@keyframes ${d} ${u}`,f.cssRules.length));const g=e.style.animation||"";return e.style.animation=`${g?`${g}, `:""}${d} ${o}ms linear ${l}ms 1 both`,A+=1,d}function N(e,t){const n=(e.style.animation||"").split(", "),o=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),l=n.length-o.length;l&&(e.style.animation=o.join(", "),A-=l,A||p((()=>{A||(O.forEach((e=>{const{stylesheet:t}=e;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.rules={}})),O.clear())})))}function q(e){I=e}const F=[],P=[],T=[],z=[],U=Promise.resolve();let B=!1;function H(e){T.push(e)}const V=new Set;let J,K=0;function Q(){const e=I;do{for(;K<F.length;){const e=F[K];K++,q(e),W(e.$$)}for(q(null),F.length=0,K=0;P.length;)P.pop()();for(let e=0;e<T.length;e+=1){const t=T[e];V.has(t)||(V.add(t),t())}T.length=0}while(F.length);for(;z.length;)z.pop()();B=!1,V.clear(),q(e)}function W(e){if(null!==e.fragment){e.update(),s(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(H)}}function X(e,t,n){e.dispatchEvent(function(e,t,n=!1){const o=document.createEvent("CustomEvent");return o.initCustomEvent(e,n,!1,t),o}(`${t?"intro":"outro"}${n}`))}const Y=new Set;let Z;function ee(e,t){e&&e.i&&(Y.delete(e),e.i(t))}function te(e,t,n,o){if(e&&e.o){if(Y.has(e))return;Y.add(e),Z.c.push((()=>{Y.delete(e),o&&(n&&e.d(1),o())})),e.o(t)}}const ne={duration:0};function oe(e,o,l,a){let r=o(e,l),c=a?0:1,u=null,p=null,f=null;function m(){f&&N(e,f)}function h(e,t){const n=e.b-c;return t*=Math.abs(n),{a:c,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function v(o){const{delay:l=0,duration:a=300,easing:i=n,tick:v=t,css:_}=r||ne,b={start:d()+l,b:o};o||(b.group=Z,Z.r+=1),u||p?p=b:(_&&(m(),f=R(e,c,o,a,l,i,_)),o&&v(0,1),u=h(b,a),H((()=>X(e,o,"start"))),g((t=>{if(p&&t>p.start&&(u=h(p,a),p=null,X(e,u.b,"start"),_&&(m(),f=R(e,c,u.b,u.duration,0,i,r.css))),u)if(t>=u.end)v(c=u.b,1-c),X(e,u.b,"end"),p||(u.b?m():--u.group.r||s(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;c=u.a+u.d*i(e/u.duration),v(c,1-c)}return!(!u&&!p)})))}return{run(e){i(r)?(J||(J=Promise.resolve(),J.then((()=>{J=null}))),J).then((()=>{r=r(),v(e)})):v(e)},end(){m(),u=p=null}}}function le(e){e&&e.c()}function ae(e,t,n,o){const{fragment:a,on_mount:r,on_destroy:c,after_update:u}=e.$$;a&&a.m(t,n),o||H((()=>{const t=r.map(l).filter(i);c?c.push(...t):s(t),e.$$.on_mount=[]})),u.forEach(H)}function se(e,t){const n=e.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ie(e,t){-1===e.$$.dirty[0]&&(F.push(e),B||(B=!0,U.then(Q)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function re(e,n,o,l,i,r,c,u=[-1]){const d=I;q(e);const p=e.$$={fragment:null,ctx:null,props:r,update:t,not_equal:i,bound:a(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(d?d.$$.context:[])),callbacks:a(),dirty:u,skip_bound:!1,root:n.target||d.$$.root};c&&c(p.root);let f=!1;if(p.ctx=o?o(e,n.props||{},((t,n,...o)=>{const l=o.length?o[0]:n;return p.ctx&&i(p.ctx[t],p.ctx[t]=l)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](l),f&&ie(e,t)),n})):[],p.update(),f=!0,s(p.before_update),p.fragment=!!l&&l(p.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);p.fragment&&p.fragment.l(e),e.forEach(y)}else p.fragment&&p.fragment.c();n.intro&&ee(e.$$.fragment),ae(e,n.target,n.anchor,n.customElement),Q()}q(d)}class ce{$destroy(){se(this,1),this.$destroy=t}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const ue=[];function de(e){return e<.5?4*e*e*e:.5*Math.pow(2*e-2,3)+1}function pe(e){const t=e-1;return t*t*t+1}function fe(e){return Math.pow(e-1,3)*(1-e)+1}function me(e){return"[object Date]"===Object.prototype.toString.call(e)}function ge(e,t){if(e===t||e!=e)return()=>e;const n=typeof e;if(n!==typeof t||Array.isArray(e)!==Array.isArray(t))throw new Error("Cannot interpolate values of different type");if(Array.isArray(e)){const n=t.map(((t,n)=>ge(e[n],t)));return e=>n.map((t=>t(e)))}if("object"===n){if(!e||!t)throw new Error("Object cannot be null");if(me(e)&&me(t)){e=e.getTime();const n=(t=t.getTime())-e;return t=>new Date(e+t*n)}const n=Object.keys(t),o={};return n.forEach((n=>{o[n]=ge(e[n],t[n])})),e=>{const t={};return n.forEach((n=>{t[n]=o[n](e)})),t}}if("number"===n){const n=t-e;return t=>e+t*n}throw new Error(`Cannot interpolate ${n} values`)}function he(e,l={}){const a=function(e,n=t){let o;const l=new Set;function a(t){if(r(e,t)&&(e=t,o)){const t=!ue.length;for(const t of l)t[1](),ue.push(t,e);if(t){for(let e=0;e<ue.length;e+=2)ue[e][0](ue[e+1]);ue.length=0}}}return{set:a,update:function(t){a(t(e))},subscribe:function(s,i=t){const r=[s,i];return l.add(r),1===l.size&&(o=n(a)||t),s(e),()=>{l.delete(r),0===l.size&&(o(),o=null)}}}}(e);let s,i=e;function c(t,r){if(null==e)return a.set(e=t),Promise.resolve();i=t;let c=s,u=!1,{delay:p=0,duration:f=400,easing:m=n,interpolate:h=ge}=o(o({},l),r);if(0===f)return c&&(c.abort(),c=null),a.set(e=i),Promise.resolve();const v=d()+p;let _;return s=g((n=>{if(n<v)return!0;u||(_=h(e,t),"function"==typeof f&&(f=f(e,t)),u=!0),c&&(c.abort(),c=null);const o=n-v;return o>f?(a.set(e=t),!1):(a.set(e=_(m(o/f))),!0)})),s.promise}return{set:c,update:(t,n)=>c(t(i,e),n),subscribe:a.subscribe}}function ve(e){let n,o,l,a,s,i=e[0]?"dark_mode":"light_mode";return{c(){n=$("div"),o=$("span"),l=x(i),C(o,"class","material-icons svelte-1161gb5"),D(o,"dark",e[0]),D(o,"light",!e[0]),C(n,"class","svelte-1161gb5")},m(t,i){b(t,n,i),h(n,o),h(o,l),a||(s=S(n,"click",e[1]),a=!0)},p(e,[t]){1&t&&i!==(i=e[0]?"dark_mode":"light_mode")&&j(l,i),1&t&&D(o,"dark",e[0]),1&t&&D(o,"light",!e[0])},i:t,o:t,d(e){e&&y(n),a=!1,s()}}}function _e(e,t,n){let{darkMode:o}=t;return e.$$set=e=>{"darkMode"in e&&n(0,o=e.darkMode)},[o,function(){n(0,o=!o),localStorage.setItem("dark_mode",o),Oe()}]}class be extends ce{constructor(e){super(),re(this,e,_e,ve,r,{darkMode:0})}}function ye(e,{delay:t=0,duration:n=400,easing:o=de,amount:l=5,opacity:a=0}={}){const s=getComputedStyle(e),i=+s.opacity,r="none"===s.filter?"":s.filter,c=i*(1-a);return{delay:t,duration:n,easing:o,css:(e,t)=>`opacity: ${i-c*t}; filter: ${r} blur(${t*l}px);`}}function ke(e,{delay:t=0,duration:n=400,easing:o=pe,start:l=0,opacity:a=0}={}){const s=getComputedStyle(e),i=+s.opacity,r="none"===s.transform?"":s.transform,c=1-l,u=i*(1-a);return{delay:t,duration:n,easing:o,css:(e,t)=>`\n\t\t\ttransform: ${r} scale(${1-c*t});\n\t\t\topacity: ${i-u*t}\n\t\t`}}function $e(e){let t,n,o,l,a,s,i,r,c,u,d,p;return{c(){t=$("div"),n=$("div"),o=$("span"),l=x(e[1]),s=w(),i=$("p"),r=x(e[2]),C(o,"class","icon material-icons svelte-7pffwv"),C(n,"class","fg svelte-7pffwv"),C(t,"class","bg svelte-7pffwv")},m(a,c){b(a,t,c),h(t,n),h(n,o),h(o,l),h(n,s),h(n,i),h(i,r),u=!0,d||(p=S(t,"click",e[3]),d=!0)},p(e,t){(!u||2&t)&&j(l,e[1]),(!u||4&t)&&j(r,e[2])},i(e){u||(H((()=>{a||(a=oe(o,ke,{delay:250},!0)),a.run(1)})),H((()=>{c||(c=oe(t,ye,{},!0)),c.run(1)})),u=!0)},o(e){a||(a=oe(o,ke,{delay:250},!1)),a.run(0),c||(c=oe(t,ye,{},!1)),c.run(0),u=!1},d(e){e&&y(t),e&&a&&a.end(),e&&c&&c.end(),d=!1,p()}}}function xe(e){let t,n,o=e[0]&&$e(e);return{c(){o&&o.c(),t=x("")},m(e,l){o&&o.m(e,l),b(e,t,l),n=!0},p(e,[n]){e[0]?o?(o.p(e,n),1&n&&ee(o,1)):(o=$e(e),o.c(),ee(o,1),o.m(t.parentNode,t)):o&&(Z={r:0,c:[],p:Z},te(o,1,1,(()=>{o=null})),Z.r||s(Z.c),Z=Z.p)},i(e){n||(ee(o),n=!0)},o(e){te(o),n=!1},d(e){o&&o.d(e),e&&y(t)}}}function we(e,t,n){let{show:o=!1}=t,{icon:l="checked"}=t,{message:a=""}=t;return e.$$set=e=>{"show"in e&&n(0,o=e.show),"icon"in e&&n(1,l=e.icon),"message"in e&&n(2,a=e.message)},[o,l,a,function(){n(0,o=!1)}]}class Se extends ce{constructor(e){super(),re(this,e,we,xe,r,{show:0,icon:1,message:2})}}function Ce(e,t,n){const o=e.slice();return o[40]=t[n],o}function Le(e,t,n){const o=e.slice();return o[43]=t[n],o[45]=n,o}function je(e){let n,o,l;return{c(){n=$("option"),o=x(e[45]),n.__value=l=`${e[45]}`,n.value=n.__value},m(e,t){b(e,n,t),h(n,o)},p:t,d(e){e&&y(n)}}}function Ee(e){let t,n,o,l=e[10][e[40]].name+"";return{c(){t=$("option"),n=x(l),t.__value=o=e[40],t.value=t.__value},m(e,o){b(e,t,o),h(t,n)},p(e,a){1024&a[0]&&l!==(l=e[10][e[40]].name+"")&&j(n,l),1024&a[0]&&o!==(o=e[40])&&(t.__value=o,t.value=t.__value)},d(e){e&&y(t)}}}function Me(e){let t,n,o,l,a,r,c,u,d,p,f,m,g,v,_,G,D,O,I,A,R,N,q,F,T,U,B,V,J,K,Q,W,X,Y,Z,ne,oe,ie,re,ce,ue,de,pe,fe,me,ge,he,ve,_e,ye,ke,$e,xe,we,Me,Ge,De,Ie,Ae,Re,Ne,qe,Fe,Pe,Te,ze,Ue,Be,He,Ve,Je,Ke,Qe,We,Xe,Ye,Ze,et,tt,nt,ot,lt,at,st,it,rt,ct,ut,dt,pt,ft,mt,gt,ht,vt,_t,bt,yt,kt,$t,xt,wt,St,Ct,Lt,jt,Et,Mt,Gt,Dt,Ot,It,At,Rt,Nt,qt,Ft,Pt,Tt,zt=e[15].toFixed(2)+"",Ut=e[16].toFixed(2)+"",Bt=e[11],Ht=[];for(let t=0;t<Bt.length;t+=1)Ht[t]=je(Le(e,Bt,t));let Vt=Object.keys(e[10]),Jt=[];for(let t=0;t<Vt.length;t+=1)Jt[t]=Ee(Ce(e,Vt,t));function Kt(t){e[36](t)}let Qt={};void 0!==e[9]&&(Qt.darkMode=e[9]),At=new be({props:Qt}),P.push((()=>function(e,t,n){const o=e.$$.props[t];void 0!==o&&(e.$$.bound[o]=n,n(e.$$.ctx[o]))}(At,"darkMode",Kt)));return qt=new Se({props:{}}),e[37](qt),{c(){t=$("main"),n=$("div"),o=$("h1"),o.innerHTML='Thelowダメージ計算\n\t\t\t<span class="material-icons">share</span>',l=w(),a=$("div"),r=$("div"),c=$("small"),c.textContent="通常",u=w(),d=$("span"),p=x(zt),f=w(),m=$("div"),g=$("small"),g.textContent="クリティカル",v=w(),_=$("span"),G=x(Ut),D=w(),O=$("div"),I=$("div"),A=$("h2"),A.textContent="基本ダメージ",R=w(),N=$("section"),q=$("label"),q.textContent="武器の素ダメージ",F=w(),T=$("input"),U=w(),B=$("section"),V=$("label"),V.textContent="特攻値",J=w(),K=$("input"),Q=w(),W=$("section"),X=$("label"),X.textContent="職業補正(%)",Y=w(),Z=$("input"),ne=w(),oe=$("section"),ie=$("label"),ie.textContent="装備補正(%)",re=w(),ce=$("input"),ue=w(),de=$("section"),pe=$("label"),pe.textContent="パーク(%)",fe=w(),me=$("input"),ge=w(),he=$("section"),ve=$("span"),ve.textContent="オーバーストレンジ",_e=w(),ye=$("div"),ke=$("select");for(let e=0;e<Ht.length;e+=1)Ht[e].c();$e=w(),xe=$("input"),we=w(),Me=$("div"),Ge=$("div"),De=$("h2"),De.textContent="魔法石",Ie=w(),Ae=$("section"),Re=$("label"),Re.textContent="レジェンド魔法石個数",Ne=w(),qe=$("select"),Fe=$("option"),Fe.textContent="0個",Pe=$("option"),Pe.textContent="1個",Te=$("option"),Te.textContent="2個",ze=$("option"),ze.textContent="3個",Ue=w(),Be=$("section"),He=$("input"),Ve=w(),Je=$("label"),Je.textContent="特攻魔法石Level1",Ke=w(),Qe=$("section"),We=$("input"),Xe=w(),Ye=$("label"),Ye.textContent="特攻魔法石Level2",Ze=w(),et=$("section"),tt=$("input"),nt=w(),ot=$("label"),ot.textContent="特攻魔法石Level3",lt=w(),at=$("section"),st=$("input"),it=w(),rt=$("label"),rt.textContent="特攻魔法石Level4",ct=w(),ut=$("section"),dt=$("input"),pt=w(),ft=$("label"),ft.textContent="特攻魔法石Level4.5",mt=w(),gt=$("section"),ht=$("input"),vt=w(),_t=$("label"),_t.textContent="特攻魔法石Level5 or Legend",bt=w(),yt=$("div"),kt=$("h2"),kt.textContent="その他",$t=w(),xt=$("section"),wt=$("label"),wt.textContent="スキル",St=w(),Ct=$("select");for(let e=0;e<Jt.length;e+=1)Jt[e].c();Lt=w(),jt=$("section"),Et=$("label"),Et.textContent="攻撃力上昇エフェクトLv",Mt=w(),Gt=$("input"),Dt=w(),Ot=$("p"),Ot.textContent="※特攻値の乗らないスキル(ショックストーンなど)は、特攻値を除いて計算しています。",It=w(),le(At.$$.fragment),Nt=w(),le(qt.$$.fragment),C(o,"class","pointer"),C(o,"title","クリックでリンクをコピーできます"),C(d,"class","text-big"),C(r,"class","vbox"),C(_,"class","text-big"),C(m,"class","vbox"),C(a,"class","result padding svelte-13yd3sg"),C(q,"for","weaponDamageInput"),C(T,"type","number"),C(T,"placeholder","例:300"),C(N,"class","svelte-13yd3sg"),C(V,"for","specialDamageInput"),C(K,"type","number"),C(K,"placeholder","例:50"),C(B,"class","svelte-13yd3sg"),C(X,"for","jobGainInput"),C(Z,"type","number"),C(Z,"placeholder","例:10"),C(W,"class","svelte-13yd3sg"),C(ie,"for","equipGainInput"),C(ce,"type","number"),C(ce,"placeholder","例:10"),C(oe,"class","svelte-13yd3sg"),C(pe,"for","parkGainInput"),C(me,"type","number"),C(me,"placeholder","例:140"),C(de,"class","svelte-13yd3sg"),C(ke,"class","flex-grow-3"),void 0===e[12]&&H((()=>e[26].call(ke))),C(xe,"class","flex-grow-1"),C(xe,"type","button"),xe.value="OS値適用",C(ye,"class","hbox"),C(he,"class","svelte-13yd3sg"),C(I,"class","basicdamage panel padding svelte-13yd3sg"),C(Re,"for","legendValueSelector"),Fe.__value="0",Fe.value=Fe.__value,Pe.__value="1",Pe.value=Pe.__value,Te.__value="2",Te.value=Te.__value,ze.__value="3",ze.value=ze.__value,void 0===e[5]&&H((()=>e[27].call(qe))),C(Ae,"class","vbox margin-1/2em"),C(He,"id","ms1"),C(He,"type","checkbox"),C(Je,"for","ms1"),C(We,"id","ms2"),C(We,"type","checkbox"),C(Ye,"for","ms2"),C(tt,"id","ms3"),C(tt,"type","checkbox"),C(ot,"for","ms3"),C(st,"id","ms4"),C(st,"type","checkbox"),C(rt,"for","ms4"),C(dt,"id","ms4.5"),C(dt,"type","checkbox"),C(ft,"for","ms4.5"),C(ht,"id","ms5"),C(ht,"type","checkbox"),C(_t,"for","ms5"),C(Ge,"class","magicstone padding vbox"),C(wt,"for","skillSelector"),void 0===e[7]&&H((()=>e[34].call(Ct))),C(xt,"class","svelte-13yd3sg"),C(Et,"for","strengthEffectInput"),C(Gt,"type","number"),C(Gt,"placeholder","例:5"),C(jt,"class","svelte-13yd3sg"),C(yt,"class","othereffect svelte-13yd3sg"),C(Me,"class","vbox panel svelte-13yd3sg"),C(O,"class","params space-around svelte-13yd3sg"),C(Ot,"class","text-center"),C(n,"class","container vbox svelte-13yd3sg")},m(s,y){b(s,t,y),h(t,n),h(n,o),h(n,l),h(n,a),h(a,r),h(r,c),h(r,u),h(r,d),h(d,p),h(a,f),h(a,m),h(m,g),h(m,v),h(m,_),h(_,G),h(n,D),h(n,O),h(O,I),h(I,A),h(I,R),h(I,N),h(N,q),h(N,F),h(N,T),E(T,e[0]),h(I,U),h(I,B),h(B,V),h(B,J),h(B,K),E(K,e[1]),h(I,Q),h(I,W),h(W,X),h(W,Y),h(W,Z),E(Z,e[3]),h(I,ne),h(I,oe),h(oe,ie),h(oe,re),h(oe,ce),E(ce,e[4]),h(I,ue),h(I,de),h(de,pe),h(de,fe),h(de,me),E(me,e[2]),h(I,ge),h(I,he),h(he,ve),h(he,_e),h(he,ye),h(ye,ke);for(let e=0;e<Ht.length;e+=1)Ht[e].m(ke,null);M(ke,e[12]),h(ye,$e),h(ye,xe),h(O,we),h(O,Me),h(Me,Ge),h(Ge,De),h(Ge,Ie),h(Ge,Ae),h(Ae,Re),h(Ae,Ne),h(Ae,qe),h(qe,Fe),h(qe,Pe),h(qe,Te),h(qe,ze),M(qe,e[5]),h(Ge,Ue),h(Ge,Be),h(Be,He),He.checked=e[6].level_1,h(Be,Ve),h(Be,Je),h(Ge,Ke),h(Ge,Qe),h(Qe,We),We.checked=e[6].level_2,h(Qe,Xe),h(Qe,Ye),h(Ge,Ze),h(Ge,et),h(et,tt),tt.checked=e[6].level_3,h(et,nt),h(et,ot),h(Ge,lt),h(Ge,at),h(at,st),st.checked=e[6].level_4,h(at,it),h(at,rt),h(Ge,ct),h(Ge,ut),h(ut,dt),dt.checked=e[6]["level_4.5"],h(ut,pt),h(ut,ft),h(Ge,mt),h(Ge,gt),h(gt,ht),ht.checked=e[6].level_5,h(gt,vt),h(gt,_t),h(Me,bt),h(Me,yt),h(yt,kt),h(yt,$t),h(yt,xt),h(xt,wt),h(xt,St),h(xt,Ct);for(let e=0;e<Jt.length;e+=1)Jt[e].m(Ct,null);M(Ct,e[7]),h(yt,Lt),h(yt,jt),h(jt,Et),h(jt,Mt),h(jt,Gt),E(Gt,e[8]),h(n,Dt),h(n,Ot),h(n,It),ae(At,n,null),h(n,Nt),ae(qt,n,null),Ft=!0,Pt||(Tt=[S(o,"click",(function(){i(e[20](e[13]))&&e[20](e[13]).apply(this,arguments)})),S(T,"input",e[21]),S(K,"input",e[22]),S(Z,"input",e[23]),S(ce,"input",e[24]),S(me,"input",e[25]),S(ke,"change",e[26]),S(xe,"click",e[19]),S(qe,"change",e[27]),S(He,"change",e[28]),S(We,"change",e[29]),S(tt,"change",e[30]),S(st,"change",e[31]),S(dt,"change",e[32]),S(ht,"change",e[33]),S(Ct,"change",e[34]),S(Gt,"input",e[35]),S(t,"load",Oe())],Pt=!0)},p(t,n){if(e=t,(!Ft||32768&n[0])&&zt!==(zt=e[15].toFixed(2)+"")&&j(p,zt),(!Ft||65536&n[0])&&Ut!==(Ut=e[16].toFixed(2)+"")&&j(G,Ut),1&n[0]&&L(T.value)!==e[0]&&E(T,e[0]),2&n[0]&&L(K.value)!==e[1]&&E(K,e[1]),8&n[0]&&L(Z.value)!==e[3]&&E(Z,e[3]),16&n[0]&&L(ce.value)!==e[4]&&E(ce,e[4]),4&n[0]&&L(me.value)!==e[2]&&E(me,e[2]),2048&n[0]){let t;for(Bt=e[11],t=0;t<Bt.length;t+=1){const o=Le(e,Bt,t);Ht[t]?Ht[t].p(o,n):(Ht[t]=je(o),Ht[t].c(),Ht[t].m(ke,null))}for(;t<Ht.length;t+=1)Ht[t].d(1);Ht.length=Bt.length}if(4096&n[0]&&M(ke,e[12]),32&n[0]&&M(qe,e[5]),64&n[0]&&(He.checked=e[6].level_1),64&n[0]&&(We.checked=e[6].level_2),64&n[0]&&(tt.checked=e[6].level_3),64&n[0]&&(st.checked=e[6].level_4),64&n[0]&&(dt.checked=e[6]["level_4.5"]),64&n[0]&&(ht.checked=e[6].level_5),1024&n[0]){let t;for(Vt=Object.keys(e[10]),t=0;t<Vt.length;t+=1){const o=Ce(e,Vt,t);Jt[t]?Jt[t].p(o,n):(Jt[t]=Ee(o),Jt[t].c(),Jt[t].m(Ct,null))}for(;t<Jt.length;t+=1)Jt[t].d(1);Jt.length=Vt.length}1152&n[0]&&M(Ct,e[7]),256&n[0]&&L(Gt.value)!==e[8]&&E(Gt,e[8]);const o={};var l;!Rt&&512&n[0]&&(Rt=!0,o.darkMode=e[9],l=()=>Rt=!1,z.push(l)),At.$set(o);qt.$set({})},i(e){Ft||(ee(At.$$.fragment,e),ee(qt.$$.fragment,e),Ft=!0)},o(e){te(At.$$.fragment,e),te(qt.$$.fragment,e),Ft=!1},d(n){n&&y(t),k(Ht,n),k(Jt,n),se(At),e[37](null),se(qt),Pt=!1,s(Tt)}}}function Ge(e,t,n){let o,l,{skill_data:a}=t,{over_strength_values:s}=t,{darkMode:i}=t,{weaponDamage:r=""}=t,{specialDamage:u=""}=t,{parkGain:d=""}=t,{jobGain:p=""}=t,{equipGain:f=""}=t,m="0",{numLegendStone:g="0"}=t,{magicStone:h={level_1:!1,level_2:!1,level_3:!1,level_4:!1,"level_4.5":!1,level_5:!1}}=t,{skill:v="general_attack"}=t,{strLevel:_=0}=t,b="",y=null;const k=he(0,{delay:200,duration:1e3,easing:fe});c(e,k,(e=>n(15,o=e)));const $=he(0,{delay:200,duration:1e3,easing:fe});c(e,$,(e=>n(16,l=e)));let x={level_1:1.1,level_2:1.15,level_3:1.23,level_4:1.35,"level_4.5":1.4,level_5:1.55};return e.$$set=e=>{"skill_data"in e&&n(10,a=e.skill_data),"over_strength_values"in e&&n(11,s=e.over_strength_values),"darkMode"in e&&n(9,i=e.darkMode),"weaponDamage"in e&&n(0,r=e.weaponDamage),"specialDamage"in e&&n(1,u=e.specialDamage),"parkGain"in e&&n(2,d=e.parkGain),"jobGain"in e&&n(3,p=e.jobGain),"equipGain"in e&&n(4,f=e.equipGain),"numLegendStone"in e&&n(5,g=e.numLegendStone),"magicStone"in e&&n(6,h=e.magicStone),"skill"in e&&n(7,v=e.skill),"strLevel"in e&&n(8,_=e.strLevel)},e.$$.update=()=>{if(1535&e.$$.dirty[0]){let e=Number(r);a[v].availabilSpecial&&(e+=u);let t=(100+d+p+f)/100;for(const e of Object.keys(h))h[e]&&(t*=x[e]);t*=a[v].multiply,t*=_?1+.2*Number(_):1,t*=1.06**Number(g),k.set(e*t),$.set(e*t*1.15),function(){const e=new URL(window.location),t=new URLSearchParams,o=function(e){let t=parseFloat(e);if(t!==+t.toFixed()){const n=String(e).split(".")[1].length;return t=Math.round(t*10**n),t.toString(36)+"E"+-n.toString(36)}return t.toString(36)};r&&t.set("wd",o(r)),u&&t.set("sd",o(u)),d&&t.set("pg",o(d)),p&&t.set("jg",o(p)),f&&t.set("eg",o(f)),"0"!==g&&t.set("ns",g.toString(36)),"general_attack"!==v&&t.set("sk",v);const l=Object.keys(h).reduce(((e,t)=>e+(h[t]?1:0)),"");"000000"!==l&&t.set("ms",l),_&&t.set("str",_.toString(36)),e.search=t.toString(),window.history.replaceState({},"",e),n(13,b=e)}()}},[r,u,d,p,f,g,h,v,_,i,a,s,m,b,y,o,l,k,$,function(){n(2,d=s[Number(m)])},function(){Ae(b),y.$set({show:!0,icon:"checked",message:"URLをコピーしました!"}),setTimeout((()=>{y.$set({show:!1})}),1500)},function(){r=L(this.value),n(0,r)},function(){u=L(this.value),n(1,u)},function(){p=L(this.value),n(3,p)},function(){f=L(this.value),n(4,f)},function(){d=L(this.value),n(2,d)},function(){m=G(this),n(12,m)},function(){g=G(this),n(5,g)},function(){h.level_1=this.checked,n(6,h)},function(){h.level_2=this.checked,n(6,h)},function(){h.level_3=this.checked,n(6,h)},function(){h.level_4=this.checked,n(6,h)},function(){h["level_4.5"]=this.checked,n(6,h)},function(){h.level_5=this.checked,n(6,h)},function(){v=G(this),n(7,v),n(10,a)},function(){_=L(this.value),n(8,_)},function(e){i=e,n(9,i)},function(e){P[e?"unshift":"push"]((()=>{y=e,n(14,y)}))}]}const De=new class extends ce{constructor(e){super(),re(this,e,Ge,Me,r,{skill_data:10,over_strength_values:11,darkMode:9,weaponDamage:0,specialDamage:1,parkGain:2,jobGain:3,equipGain:4,numLegendStone:5,magicStone:6,skill:7,strLevel:8},null,[-1,-1])}}({target:document.body,props:{skill_data:{general_attack:{name:"スキルなし(通常攻撃)",multiply:1,availabilSpecial:!0},gekokujo_boss:{name:"下剋上(BOSS)",multiply:1.07,availabilSpecial:!0},gekokujo_boss_plus_30:{name:"下剋上(BOSS)+30%",multiply:1.3,availabilSpecial:!0},gekokujo_mob:{name:"下剋上(MOB)",multiply:.7,availabilSpecial:!0},volcano:{name:"ボルケーノ",multiply:22,availabilSpecial:!1},magic_ball_chant:{name:"マジックボール(詠唱あり)",multiply:8,availabilSpecial:!1},magic_ball_normal:{name:"マジックボール(詠唱なし)",multiply:4,availabilSpecial:!1},shock_stone:{name:"ショックストーン",multiply:7,availabilSpecial:!1},chaos_blizzard:{name:"カオスブリザード(全弾Hit)",multiply:1.1*7,availabilSpecial:!1},snow_pillar:{name:"雪柱",multiply:4,availabilSpecial:!1},over_shoot_shadow_power:{name:"オーバーシュート(スキルあり)",multiply:18.75,availabilSpecial:!1},over_shoot_normal:{name:"オーバーシュート(スキルなし)",multiply:12.5,availabilSpecial:!1},awakening:{name:"覚醒",multiply:2,availabilSpecial:!0},blood_slash:{name:"血の斬撃",multiply:2.5,availabilSpecial:!0},heiron_metu:{name:"ヘイロン滅",multiply:8,availabilSpecial:!1}},over_strength_values:[0,9,18,27,36,45,54,63,72,81,102.659,115.072,122.172,126.701,129.829,132.114,133.856,135.227,136.334,137.246,138.011,138.661,139.221,139.707,140.135,140.513,140.849,141.151,141.424,141.67,141.895,142.1,142.289,142.462,142.623,142.772,142.91,143.039,143.159,143.272,143.377,143.476,143.57,143.658,143.742,143.821,143.895,143.966,144.034,144.098,144.159,144.217,144.273,144.326,144.377,144.426,144.473,144.518,144.561,144.602,144.642,144.68,144.717,144.753,144.787,144.82,144.852,144.883,144.913,144.942,144.97,144.997,145.024,145.049,145.074],darkMode:"true"==localStorage.getItem("dark_mode"),...Ie()}});function Oe(){"true"==localStorage.getItem("dark_mode")?document.documentElement.setAttribute("theme","dark"):document.documentElement.removeAttribute("theme")}function Ie(){const e=new URLSearchParams(location.search),t=function(e){const t=String(e).split("E");let n=parseInt(t[0],36),o=0;return t[1]&&(o=parseInt(t[1],36)),n*=10**o,o<0&&(n=parseFloat(n.toFixed(-o))),n},n={weaponDamage:e.has("wd")?t(e.get("wd")):0,specialDamage:e.has("sd")?t(e.get("sd")):0,parkGain:e.has("pg")?t(e.get("pg")):0,jobGain:e.has("jg")?t(e.get("jg")):0,equipGain:e.has("eg")?t(e.get("eg")):0,numLegendStone:e.has("ns")?parseInt(e.get("ns")):"0",skill:e.has("sk")?e.get("sk"):"general_attack",strLevel:e.has("str")?parseInt(e.get("str"),36):0};if(e.has("ms")){const t=parseInt(e.get("ms"),2);n.magicStone={level_1:1==(t>>5&1),level_2:1==(t>>4&1),level_3:1==(t>>3&1),level_4:1==(t>>2&1),"level_4.5":1==(t>>1&1),level_5:1==(t>>0&1)}}return n}function Ae(e){const t=document.createElement("textarea");document.body.append(t),t.value=e,t.select(),document.execCommand("copy"),t.remove(t)}return e.applyTheme=Oe,e.copyToClipboard=Ae,e.default=De,e.parseURLParams=Ie,Object.defineProperty(e,"__esModule",{value:!0}),e}({});
//# sourceMappingURL=bundle.js.map
