var app=function(e){"use strict";function t(){}const n=e=>e;function l(e,t){for(const n in t)e[n]=t[n];return e}function o(e){return e()}function a(){return Object.create(null)}function i(e){e.forEach(o)}function s(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function c(e,n,l){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const l=e.subscribe(...n);return l.unsubscribe?()=>l.unsubscribe():l}(n,l))}const u="undefined"!=typeof window;let d=u?()=>window.performance.now():()=>Date.now(),f=u?e=>requestAnimationFrame(e):t;const p=new Set;function m(e){p.forEach((t=>{t.c(e)||(p.delete(t),t.f())})),0!==p.size&&f(m)}function g(e){let t;return 0===p.size&&f(m),{promise:new Promise((n=>{p.add(t={c:e,f:n})})),abort(){p.delete(t)}}}function h(e,t){e.appendChild(t)}function v(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function _(e){const t=$("style");return function(e,t){h(e.head||e,t)}(v(e),t),t.sheet}function b(e,t,n){e.insertBefore(t,n||null)}function y(e){e.parentNode.removeChild(e)}function k(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function $(e){return document.createElement(e)}function x(e){return document.createTextNode(e)}function w(){return x(" ")}function S(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function C(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function j(e){return""===e?null:+e}function L(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function E(e,t){e.value=null==t?"":t}function M(e,t){for(let n=0;n<e.options.length;n+=1){const l=e.options[n];if(l.__value===t)return void(l.selected=!0)}e.selectedIndex=-1}function O(e){const t=e.querySelector(":checked")||e.options[0];return t&&t.__value}function G(e,t,n){e.classList[n?"add":"remove"](t)}const D=new Map;let I,A=0;function R(e,t,n,l,o,a,i,s=0){const r=16.666/l;let c="{\n";for(let e=0;e<=1;e+=r){const l=t+(n-t)*a(e);c+=100*e+`%{${i(l,1-l)}}\n`}const u=c+`100% {${i(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${s}`,f=v(e),{stylesheet:p,rules:m}=D.get(f)||function(e,t){const n={stylesheet:_(t),rules:{}};return D.set(e,n),n}(f,e);m[d]||(m[d]=!0,p.insertRule(`@keyframes ${d} ${u}`,p.cssRules.length));const g=e.style.animation||"";return e.style.animation=`${g?`${g}, `:""}${d} ${l}ms linear ${o}ms 1 both`,A+=1,d}function N(e,t){const n=(e.style.animation||"").split(", "),l=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),o=n.length-l.length;o&&(e.style.animation=l.join(", "),A-=o,A||f((()=>{A||(D.forEach((e=>{const{stylesheet:t}=e;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.rules={}})),D.clear())})))}function q(e){I=e}const F=[],P=[],T=[],z=[],B=Promise.resolve();let U=!1;function H(e){T.push(e)}const V=new Set;let J,K=0;function Q(){const e=I;do{for(;K<F.length;){const e=F[K];K++,q(e),W(e.$$)}for(q(null),F.length=0,K=0;P.length;)P.pop()();for(let e=0;e<T.length;e+=1){const t=T[e];V.has(t)||(V.add(t),t())}T.length=0}while(F.length);for(;z.length;)z.pop()();U=!1,V.clear(),q(e)}function W(e){if(null!==e.fragment){e.update(),i(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(H)}}function X(e,t,n){e.dispatchEvent(function(e,t,n=!1){const l=document.createEvent("CustomEvent");return l.initCustomEvent(e,n,!1,t),l}(`${t?"intro":"outro"}${n}`))}const Y=new Set;let Z;function ee(e,t){e&&e.i&&(Y.delete(e),e.i(t))}function te(e,t,n,l){if(e&&e.o){if(Y.has(e))return;Y.add(e),Z.c.push((()=>{Y.delete(e),l&&(n&&e.d(1),l())})),e.o(t)}}const ne={duration:0};function le(e,l,o,a){let r=l(e,o),c=a?0:1,u=null,f=null,p=null;function m(){p&&N(e,p)}function h(e,t){const n=e.b-c;return t*=Math.abs(n),{a:c,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function v(l){const{delay:o=0,duration:a=300,easing:s=n,tick:v=t,css:_}=r||ne,b={start:d()+o,b:l};l||(b.group=Z,Z.r+=1),u||f?f=b:(_&&(m(),p=R(e,c,l,a,o,s,_)),l&&v(0,1),u=h(b,a),H((()=>X(e,l,"start"))),g((t=>{if(f&&t>f.start&&(u=h(f,a),f=null,X(e,u.b,"start"),_&&(m(),p=R(e,c,u.b,u.duration,0,s,r.css))),u)if(t>=u.end)v(c=u.b,1-c),X(e,u.b,"end"),f||(u.b?m():--u.group.r||i(u.group.c)),u=null;else if(t>=u.start){const e=t-u.start;c=u.a+u.d*s(e/u.duration),v(c,1-c)}return!(!u&&!f)})))}return{run(e){s(r)?(J||(J=Promise.resolve(),J.then((()=>{J=null}))),J).then((()=>{r=r(),v(e)})):v(e)},end(){m(),u=f=null}}}function oe(e){e&&e.c()}function ae(e,t,n,l){const{fragment:a,on_mount:r,on_destroy:c,after_update:u}=e.$$;a&&a.m(t,n),l||H((()=>{const t=r.map(o).filter(s);c?c.push(...t):i(t),e.$$.on_mount=[]})),u.forEach(H)}function ie(e,t){const n=e.$$;null!==n.fragment&&(i(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function se(e,t){-1===e.$$.dirty[0]&&(F.push(e),U||(U=!0,B.then(Q)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function re(e,n,l,o,s,r,c,u=[-1]){const d=I;q(e);const f=e.$$={fragment:null,ctx:null,props:r,update:t,not_equal:s,bound:a(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(d?d.$$.context:[])),callbacks:a(),dirty:u,skip_bound:!1,root:n.target||d.$$.root};c&&c(f.root);let p=!1;if(f.ctx=l?l(e,n.props||{},((t,n,...l)=>{const o=l.length?l[0]:n;return f.ctx&&s(f.ctx[t],f.ctx[t]=o)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](o),p&&se(e,t)),n})):[],f.update(),p=!0,i(f.before_update),f.fragment=!!o&&o(f.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);f.fragment&&f.fragment.l(e),e.forEach(y)}else f.fragment&&f.fragment.c();n.intro&&ee(e.$$.fragment),ae(e,n.target,n.anchor,n.customElement),Q()}q(d)}class ce{$destroy(){ie(this,1),this.$destroy=t}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const ue=[];function de(e){return e<.5?4*e*e*e:.5*Math.pow(2*e-2,3)+1}function fe(e){const t=e-1;return t*t*t+1}function pe(e){return Math.pow(e-1,3)*(1-e)+1}function me(e){return"[object Date]"===Object.prototype.toString.call(e)}function ge(e,t){if(e===t||e!=e)return()=>e;const n=typeof e;if(n!==typeof t||Array.isArray(e)!==Array.isArray(t))throw new Error("Cannot interpolate values of different type");if(Array.isArray(e)){const n=t.map(((t,n)=>ge(e[n],t)));return e=>n.map((t=>t(e)))}if("object"===n){if(!e||!t)throw new Error("Object cannot be null");if(me(e)&&me(t)){e=e.getTime();const n=(t=t.getTime())-e;return t=>new Date(e+t*n)}const n=Object.keys(t),l={};return n.forEach((n=>{l[n]=ge(e[n],t[n])})),e=>{const t={};return n.forEach((n=>{t[n]=l[n](e)})),t}}if("number"===n){const n=t-e;return t=>e+t*n}throw new Error(`Cannot interpolate ${n} values`)}function he(e,o={}){const a=function(e,n=t){let l;const o=new Set;function a(t){if(r(e,t)&&(e=t,l)){const t=!ue.length;for(const t of o)t[1](),ue.push(t,e);if(t){for(let e=0;e<ue.length;e+=2)ue[e][0](ue[e+1]);ue.length=0}}}return{set:a,update:function(t){a(t(e))},subscribe:function(i,s=t){const r=[i,s];return o.add(r),1===o.size&&(l=n(a)||t),i(e),()=>{o.delete(r),0===o.size&&(l(),l=null)}}}}(e);let i,s=e;function c(t,r){if(null==e)return a.set(e=t),Promise.resolve();s=t;let c=i,u=!1,{delay:f=0,duration:p=400,easing:m=n,interpolate:h=ge}=l(l({},o),r);if(0===p)return c&&(c.abort(),c=null),a.set(e=s),Promise.resolve();const v=d()+f;let _;return i=g((n=>{if(n<v)return!0;u||(_=h(e,t),"function"==typeof p&&(p=p(e,t)),u=!0),c&&(c.abort(),c=null);const l=n-v;return l>p?(a.set(e=t),!1):(a.set(e=_(m(l/p))),!0)})),i.promise}return{set:c,update:(t,n)=>c(t(s,e),n),subscribe:a.subscribe}}function ve(e){let n,l,o,a,i,s=e[0]?"dark_mode":"light_mode";return{c(){n=$("div"),l=$("span"),o=x(s),C(l,"class","material-icons svelte-1161gb5"),G(l,"dark",e[0]),G(l,"light",!e[0]),C(n,"class","svelte-1161gb5")},m(t,s){b(t,n,s),h(n,l),h(l,o),a||(i=S(n,"click",e[1]),a=!0)},p(e,[t]){1&t&&s!==(s=e[0]?"dark_mode":"light_mode")&&L(o,s),1&t&&G(l,"dark",e[0]),1&t&&G(l,"light",!e[0])},i:t,o:t,d(e){e&&y(n),a=!1,i()}}}function _e(e,t,n){let{darkMode:l}=t;return e.$$set=e=>{"darkMode"in e&&n(0,l=e.darkMode)},[l,function(){n(0,l=!l),localStorage.setItem("dark_mode",l),De()}]}class be extends ce{constructor(e){super(),re(this,e,_e,ve,r,{darkMode:0})}}function ye(e,{delay:t=0,duration:n=400,easing:l=de,amount:o=5,opacity:a=0}={}){const i=getComputedStyle(e),s=+i.opacity,r="none"===i.filter?"":i.filter,c=s*(1-a);return{delay:t,duration:n,easing:l,css:(e,t)=>`opacity: ${s-c*t}; filter: ${r} blur(${t*o}px);`}}function ke(e,{delay:t=0,duration:n=400,easing:l=fe,start:o=0,opacity:a=0}={}){const i=getComputedStyle(e),s=+i.opacity,r="none"===i.transform?"":i.transform,c=1-o,u=s*(1-a);return{delay:t,duration:n,easing:l,css:(e,t)=>`\n\t\t\ttransform: ${r} scale(${1-c*t});\n\t\t\topacity: ${s-u*t}\n\t\t`}}function $e(e){let t,n,l,o,a,i,s,r,c,u,d,f;return{c(){t=$("div"),n=$("div"),l=$("span"),o=x(e[1]),i=w(),s=$("p"),r=x(e[2]),C(l,"class","icon material-icons svelte-7pffwv"),C(n,"class","fg svelte-7pffwv"),C(t,"class","bg svelte-7pffwv")},m(a,c){b(a,t,c),h(t,n),h(n,l),h(l,o),h(n,i),h(n,s),h(s,r),u=!0,d||(f=S(t,"click",e[3]),d=!0)},p(e,t){(!u||2&t)&&L(o,e[1]),(!u||4&t)&&L(r,e[2])},i(e){u||(H((()=>{a||(a=le(l,ke,{delay:250},!0)),a.run(1)})),H((()=>{c||(c=le(t,ye,{},!0)),c.run(1)})),u=!0)},o(e){a||(a=le(l,ke,{delay:250},!1)),a.run(0),c||(c=le(t,ye,{},!1)),c.run(0),u=!1},d(e){e&&y(t),e&&a&&a.end(),e&&c&&c.end(),d=!1,f()}}}function xe(e){let t,n,l=e[0]&&$e(e);return{c(){l&&l.c(),t=x("")},m(e,o){l&&l.m(e,o),b(e,t,o),n=!0},p(e,[n]){e[0]?l?(l.p(e,n),1&n&&ee(l,1)):(l=$e(e),l.c(),ee(l,1),l.m(t.parentNode,t)):l&&(Z={r:0,c:[],p:Z},te(l,1,1,(()=>{l=null})),Z.r||i(Z.c),Z=Z.p)},i(e){n||(ee(l),n=!0)},o(e){te(l),n=!1},d(e){l&&l.d(e),e&&y(t)}}}function we(e,t,n){let{show:l=!1}=t,{icon:o="checked"}=t,{message:a=""}=t;return e.$$set=e=>{"show"in e&&n(0,l=e.show),"icon"in e&&n(1,o=e.icon),"message"in e&&n(2,a=e.message)},[l,o,a,function(){n(0,l=!1)}]}class Se extends ce{constructor(e){super(),re(this,e,we,xe,r,{show:0,icon:1,message:2})}}function Ce(e,t,n){const l=e.slice();return l[40]=t[n],l}function je(e,t,n){const l=e.slice();return l[43]=t[n],l[45]=n,l}function Le(e){let n,l,o;return{c(){n=$("option"),l=x(e[45]),n.__value=o=`${e[45]}`,n.value=n.__value},m(e,t){b(e,n,t),h(n,l)},p:t,d(e){e&&y(n)}}}function Ee(e){let t,n,l,o=e[10][e[40]].name+"";return{c(){t=$("option"),n=x(o),t.__value=l=e[40],t.value=t.__value},m(e,l){b(e,t,l),h(t,n)},p(e,a){1024&a[0]&&o!==(o=e[10][e[40]].name+"")&&L(n,o),1024&a[0]&&l!==(l=e[40])&&(t.__value=l,t.value=t.__value)},d(e){e&&y(t)}}}function Me(e){let t,n,l,o,a,r,c,u,d,f,p,m,g,v,_,O,G,D,I,A,R,N,q,F,T,B,U,V,J,K,Q,W,X,Y,Z,ne,le,se,re,ce,ue,de,fe,pe,me,ge,he,ve,_e,ye,ke,$e,xe,we,Me,Oe,Ge,Ie,Ae,Re,Ne,qe,Fe,Pe,Te,ze,Be,Ue,He,Ve,Je,Ke,Qe,We,Xe,Ye,Ze,et,tt,nt,lt,ot,at,it,st,rt,ct,ut,dt,ft,pt,mt,gt,ht,vt,_t,bt,yt,kt,$t,xt,wt,St,Ct,jt,Lt,Et,Mt,Ot,Gt,Dt,It,At,Rt,Nt,qt,Ft,Pt,Tt,zt=e[15].toFixed(2)+"",Bt=e[16].toFixed(2)+"",Ut=e[11],Ht=[];for(let t=0;t<Ut.length;t+=1)Ht[t]=Le(je(e,Ut,t));let Vt=Object.keys(e[10]),Jt=[];for(let t=0;t<Vt.length;t+=1)Jt[t]=Ee(Ce(e,Vt,t));function Kt(t){e[36](t)}let Qt={};void 0!==e[9]&&(Qt.darkMode=e[9]),At=new be({props:Qt}),P.push((()=>function(e,t,n){const l=e.$$.props[t];void 0!==l&&(e.$$.bound[l]=n,n(e.$$.ctx[l]))}(At,"darkMode",Kt)));return qt=new Se({props:{}}),e[37](qt),{c(){t=$("main"),n=$("div"),l=$("h1"),l.innerHTML='Thelowダメージ計算\n\t\t\t<span class="material-icons">share</span>',o=w(),a=$("div"),r=$("div"),c=$("small"),c.textContent="通常",u=w(),d=$("span"),f=x(zt),p=w(),m=$("div"),g=$("small"),g.textContent="クリティカル",v=w(),_=$("span"),O=x(Bt),G=w(),D=$("div"),I=$("div"),A=$("h2"),A.textContent="基本ダメージ",R=w(),N=$("section"),q=$("label"),q.textContent="武器の素ダメージ",F=w(),T=$("input"),B=w(),U=$("section"),V=$("label"),V.textContent="特攻値",J=w(),K=$("input"),Q=w(),W=$("section"),X=$("label"),X.textContent="職業補正(%)",Y=w(),Z=$("input"),ne=w(),le=$("section"),se=$("label"),se.textContent="装備補正(%)",re=w(),ce=$("input"),ue=w(),de=$("section"),fe=$("label"),fe.textContent="パーク(%)",pe=w(),me=$("input"),ge=w(),he=$("section"),ve=$("span"),ve.textContent="オーバーストレンジ",_e=w(),ye=$("div"),ke=$("select");for(let e=0;e<Ht.length;e+=1)Ht[e].c();$e=w(),xe=$("input"),we=w(),Me=$("div"),Oe=$("div"),Ge=$("h2"),Ge.textContent="魔法石",Ie=w(),Ae=$("section"),Re=$("label"),Re.textContent="レジェンド魔法石個数",Ne=w(),qe=$("select"),Fe=$("option"),Fe.textContent="0個",Pe=$("option"),Pe.textContent="1個",Te=$("option"),Te.textContent="2個",ze=$("option"),ze.textContent="3個",Be=w(),Ue=$("section"),He=$("input"),Ve=w(),Je=$("label"),Je.textContent="特攻魔法石Level1",Ke=w(),Qe=$("section"),We=$("input"),Xe=w(),Ye=$("label"),Ye.textContent="特攻魔法石Level2",Ze=w(),et=$("section"),tt=$("input"),nt=w(),lt=$("label"),lt.textContent="特攻魔法石Level3",ot=w(),at=$("section"),it=$("input"),st=w(),rt=$("label"),rt.textContent="特攻魔法石Level4",ct=w(),ut=$("section"),dt=$("input"),ft=w(),pt=$("label"),pt.textContent="特攻魔法石Level4.5",mt=w(),gt=$("section"),ht=$("input"),vt=w(),_t=$("label"),_t.textContent="特攻魔法石Level5 or Legend",bt=w(),yt=$("div"),kt=$("h2"),kt.textContent="その他",$t=w(),xt=$("section"),wt=$("label"),wt.textContent="スキル",St=w(),Ct=$("select");for(let e=0;e<Jt.length;e+=1)Jt[e].c();jt=w(),Lt=$("section"),Et=$("label"),Et.textContent="攻撃力上昇エフェクトLv",Mt=w(),Ot=$("input"),Gt=w(),Dt=$("p"),Dt.textContent="※特攻値の乗らないスキル(ショックストーンなど)は、特攻値を除いて計算しています。",It=w(),oe(At.$$.fragment),Nt=w(),oe(qt.$$.fragment),C(l,"class","pointer"),C(l,"title","クリックでリンクをコピーできます"),C(d,"class","text-big"),C(r,"class","vbox"),C(_,"class","text-big"),C(m,"class","vbox"),C(a,"class","result padding svelte-mgw2fe"),C(q,"for","weaponDamageInput"),C(T,"type","number"),C(T,"placeholder","例:300"),C(N,"class","svelte-mgw2fe"),C(V,"for","specialDamageInput"),C(K,"type","number"),C(K,"placeholder","例:50"),C(U,"class","svelte-mgw2fe"),C(X,"for","jobGainInput"),C(Z,"type","number"),C(Z,"placeholder","例:10"),C(W,"class","svelte-mgw2fe"),C(se,"for","equipGainInput"),C(ce,"type","number"),C(ce,"placeholder","例:10"),C(le,"class","svelte-mgw2fe"),C(fe,"for","parkGainInput"),C(me,"type","number"),C(me,"placeholder","例:140"),C(de,"class","svelte-mgw2fe"),C(ke,"class","flex-grow-3"),void 0===e[12]&&H((()=>e[26].call(ke))),C(xe,"class","flex-grow-1"),C(xe,"type","button"),xe.value="OS値適用",C(ye,"class","hbox"),C(he,"class","svelte-mgw2fe"),C(I,"class","basicdamage panel padding svelte-mgw2fe"),C(Re,"for","legendValueSelector"),Fe.__value="0",Fe.value=Fe.__value,Pe.__value="1",Pe.value=Pe.__value,Te.__value="2",Te.value=Te.__value,ze.__value="3",ze.value=ze.__value,void 0===e[5]&&H((()=>e[27].call(qe))),C(Ae,"class","vbox margin-1/2em"),C(He,"id","ms1"),C(He,"type","checkbox"),C(Je,"for","ms1"),C(We,"id","ms2"),C(We,"type","checkbox"),C(Ye,"for","ms2"),C(tt,"id","ms3"),C(tt,"type","checkbox"),C(lt,"for","ms3"),C(it,"id","ms4"),C(it,"type","checkbox"),C(rt,"for","ms4"),C(dt,"id","ms4.5"),C(dt,"type","checkbox"),C(pt,"for","ms4.5"),C(ht,"id","ms5"),C(ht,"type","checkbox"),C(_t,"for","ms5"),C(Oe,"class","magicstone padding vbox"),C(wt,"for","skillSelector"),void 0===e[7]&&H((()=>e[34].call(Ct))),C(xt,"class","svelte-mgw2fe"),C(Et,"for","strengthEffectInput"),C(Ot,"type","number"),C(Ot,"placeholder","例:5"),C(Lt,"class","svelte-mgw2fe"),C(yt,"class","othereffect svelte-mgw2fe"),C(Me,"class","vbox panel svelte-mgw2fe"),C(D,"class","params space-around svelte-mgw2fe"),C(Dt,"class","text-center"),C(n,"class","container vbox svelte-mgw2fe")},m(i,y){b(i,t,y),h(t,n),h(n,l),h(n,o),h(n,a),h(a,r),h(r,c),h(r,u),h(r,d),h(d,f),h(a,p),h(a,m),h(m,g),h(m,v),h(m,_),h(_,O),h(n,G),h(n,D),h(D,I),h(I,A),h(I,R),h(I,N),h(N,q),h(N,F),h(N,T),E(T,e[0]),h(I,B),h(I,U),h(U,V),h(U,J),h(U,K),E(K,e[1]),h(I,Q),h(I,W),h(W,X),h(W,Y),h(W,Z),E(Z,e[3]),h(I,ne),h(I,le),h(le,se),h(le,re),h(le,ce),E(ce,e[4]),h(I,ue),h(I,de),h(de,fe),h(de,pe),h(de,me),E(me,e[2]),h(I,ge),h(I,he),h(he,ve),h(he,_e),h(he,ye),h(ye,ke);for(let e=0;e<Ht.length;e+=1)Ht[e].m(ke,null);M(ke,e[12]),h(ye,$e),h(ye,xe),h(D,we),h(D,Me),h(Me,Oe),h(Oe,Ge),h(Oe,Ie),h(Oe,Ae),h(Ae,Re),h(Ae,Ne),h(Ae,qe),h(qe,Fe),h(qe,Pe),h(qe,Te),h(qe,ze),M(qe,e[5]),h(Oe,Be),h(Oe,Ue),h(Ue,He),He.checked=e[6].level_1,h(Ue,Ve),h(Ue,Je),h(Oe,Ke),h(Oe,Qe),h(Qe,We),We.checked=e[6].level_2,h(Qe,Xe),h(Qe,Ye),h(Oe,Ze),h(Oe,et),h(et,tt),tt.checked=e[6].level_3,h(et,nt),h(et,lt),h(Oe,ot),h(Oe,at),h(at,it),it.checked=e[6].level_4,h(at,st),h(at,rt),h(Oe,ct),h(Oe,ut),h(ut,dt),dt.checked=e[6]["level_4.5"],h(ut,ft),h(ut,pt),h(Oe,mt),h(Oe,gt),h(gt,ht),ht.checked=e[6].level_5,h(gt,vt),h(gt,_t),h(Me,bt),h(Me,yt),h(yt,kt),h(yt,$t),h(yt,xt),h(xt,wt),h(xt,St),h(xt,Ct);for(let e=0;e<Jt.length;e+=1)Jt[e].m(Ct,null);M(Ct,e[7]),h(yt,jt),h(yt,Lt),h(Lt,Et),h(Lt,Mt),h(Lt,Ot),E(Ot,e[8]),h(n,Gt),h(n,Dt),h(n,It),ae(At,n,null),h(n,Nt),ae(qt,n,null),Ft=!0,Pt||(Tt=[S(l,"click",(function(){s(e[20](e[13]))&&e[20](e[13]).apply(this,arguments)})),S(T,"input",e[21]),S(K,"input",e[22]),S(Z,"input",e[23]),S(ce,"input",e[24]),S(me,"input",e[25]),S(ke,"change",e[26]),S(xe,"click",e[19]),S(qe,"change",e[27]),S(He,"change",e[28]),S(We,"change",e[29]),S(tt,"change",e[30]),S(it,"change",e[31]),S(dt,"change",e[32]),S(ht,"change",e[33]),S(Ct,"change",e[34]),S(Ot,"input",e[35]),S(t,"load",De())],Pt=!0)},p(t,n){if(e=t,(!Ft||32768&n[0])&&zt!==(zt=e[15].toFixed(2)+"")&&L(f,zt),(!Ft||65536&n[0])&&Bt!==(Bt=e[16].toFixed(2)+"")&&L(O,Bt),1&n[0]&&j(T.value)!==e[0]&&E(T,e[0]),2&n[0]&&j(K.value)!==e[1]&&E(K,e[1]),8&n[0]&&j(Z.value)!==e[3]&&E(Z,e[3]),16&n[0]&&j(ce.value)!==e[4]&&E(ce,e[4]),4&n[0]&&j(me.value)!==e[2]&&E(me,e[2]),2048&n[0]){let t;for(Ut=e[11],t=0;t<Ut.length;t+=1){const l=je(e,Ut,t);Ht[t]?Ht[t].p(l,n):(Ht[t]=Le(l),Ht[t].c(),Ht[t].m(ke,null))}for(;t<Ht.length;t+=1)Ht[t].d(1);Ht.length=Ut.length}if(4096&n[0]&&M(ke,e[12]),32&n[0]&&M(qe,e[5]),64&n[0]&&(He.checked=e[6].level_1),64&n[0]&&(We.checked=e[6].level_2),64&n[0]&&(tt.checked=e[6].level_3),64&n[0]&&(it.checked=e[6].level_4),64&n[0]&&(dt.checked=e[6]["level_4.5"]),64&n[0]&&(ht.checked=e[6].level_5),1024&n[0]){let t;for(Vt=Object.keys(e[10]),t=0;t<Vt.length;t+=1){const l=Ce(e,Vt,t);Jt[t]?Jt[t].p(l,n):(Jt[t]=Ee(l),Jt[t].c(),Jt[t].m(Ct,null))}for(;t<Jt.length;t+=1)Jt[t].d(1);Jt.length=Vt.length}1152&n[0]&&M(Ct,e[7]),256&n[0]&&j(Ot.value)!==e[8]&&E(Ot,e[8]);const l={};var o;!Rt&&512&n[0]&&(Rt=!0,l.darkMode=e[9],o=()=>Rt=!1,z.push(o)),At.$set(l);qt.$set({})},i(e){Ft||(ee(At.$$.fragment,e),ee(qt.$$.fragment,e),Ft=!0)},o(e){te(At.$$.fragment,e),te(qt.$$.fragment,e),Ft=!1},d(n){n&&y(t),k(Ht,n),k(Jt,n),ie(At),e[37](null),ie(qt),Pt=!1,i(Tt)}}}function Oe(e,t,n){let l,o,{skill_data:a}=t,{over_strength_values:i}=t,{darkMode:s}=t,{weaponDamage:r=""}=t,{specialDamage:u=""}=t,{parkGain:d=""}=t,{jobGain:f=""}=t,{equipGain:p=""}=t,m="0",{numLegendStone:g="0"}=t,{magicStone:h={level_1:!1,level_2:!1,level_3:!1,level_4:!1,"level_4.5":!1,level_5:!1}}=t,{skill:v="general_attack"}=t,{strLevel:_=0}=t,b="",y=null;const k=he(0,{delay:200,duration:1e3,easing:pe});c(e,k,(e=>n(15,l=e)));const $=he(0,{delay:200,duration:1e3,easing:pe});c(e,$,(e=>n(16,o=e)));let x={level_1:1.1,level_2:1.15,level_3:1.23,level_4:1.35,"level_4.5":1.4,level_5:1.55};return e.$$set=e=>{"skill_data"in e&&n(10,a=e.skill_data),"over_strength_values"in e&&n(11,i=e.over_strength_values),"darkMode"in e&&n(9,s=e.darkMode),"weaponDamage"in e&&n(0,r=e.weaponDamage),"specialDamage"in e&&n(1,u=e.specialDamage),"parkGain"in e&&n(2,d=e.parkGain),"jobGain"in e&&n(3,f=e.jobGain),"equipGain"in e&&n(4,p=e.equipGain),"numLegendStone"in e&&n(5,g=e.numLegendStone),"magicStone"in e&&n(6,h=e.magicStone),"skill"in e&&n(7,v=e.skill),"strLevel"in e&&n(8,_=e.strLevel)},e.$$.update=()=>{if(1535&e.$$.dirty[0]){let e=Number(r);a[v].availabilSpecial&&(e+=u);let t=(100+d+f+p)/100;for(const e of Object.keys(h))h[e]&&(t*=x[e]);t*=a[v].multiply,t*=_?1+.2*Number(_):1,t*=1.06**Number(g),k.set(e*t),$.set(e*t*1.15),function(){const e=new URL(window.location),t=new URLSearchParams,l=function(e){let t=parseFloat(e);if(t!==+t.toFixed()){const n=String(e).split(".")[1].length;return t=Math.round(t*10**n),t.toString(36)+"E"+-n.toString(36)}return t.toString(36)};r&&t.set("wd",l(r)),u&&t.set("sd",l(u)),d&&t.set("pg",l(d)),f&&t.set("jg",l(f)),p&&t.set("eg",l(p)),"0"!==g&&t.set("ns",g.toString(36)),"general_attack"!==v&&t.set("sk",v);const o=Object.keys(h).reduce(((e,t)=>e+(h[t]?1:0)),"");"000000"!==o&&t.set("ms",o),_&&t.set("str",_.toString(36)),e.search=t.toString(),window.history.replaceState({},"",e),n(13,b=e)}()}},[r,u,d,f,p,g,h,v,_,s,a,i,m,b,y,l,o,k,$,function(){n(2,d=i[Number(m)])},function(){Ae(b),y.$set({show:!0,icon:"checked",message:"URLをコピーしました!"}),setTimeout((()=>{y.$set({show:!1})}),1500)},function(){r=j(this.value),n(0,r)},function(){u=j(this.value),n(1,u)},function(){f=j(this.value),n(3,f)},function(){p=j(this.value),n(4,p)},function(){d=j(this.value),n(2,d)},function(){m=O(this),n(12,m)},function(){g=O(this),n(5,g)},function(){h.level_1=this.checked,n(6,h)},function(){h.level_2=this.checked,n(6,h)},function(){h.level_3=this.checked,n(6,h)},function(){h.level_4=this.checked,n(6,h)},function(){h["level_4.5"]=this.checked,n(6,h)},function(){h.level_5=this.checked,n(6,h)},function(){v=O(this),n(7,v),n(10,a)},function(){_=j(this.value),n(8,_)},function(e){s=e,n(9,s)},function(e){P[e?"unshift":"push"]((()=>{y=e,n(14,y)}))}]}const Ge=new class extends ce{constructor(e){super(),re(this,e,Oe,Me,r,{skill_data:10,over_strength_values:11,darkMode:9,weaponDamage:0,specialDamage:1,parkGain:2,jobGain:3,equipGain:4,numLegendStone:5,magicStone:6,skill:7,strLevel:8},null,[-1,-1])}}({target:document.body,props:{skill_data:{general_attack:{name:"スキルなし(通常攻撃)",multiply:1,availabilSpecial:!0},magical_mixture_hit:{name:"魔混(直撃)",multiply:1.7,availabilSpecial:!0},gekokujo_boss:{name:"下剋上(BOSS)",multiply:1.07,availabilSpecial:!0},gekokujo_boss_excl_job:{name:"下剋上(BOSS,専用職業)",multiply:1.3,availabilSpecial:!0},gekokujo_boss_coexis:{name:"下剋上(BOSS,専用職業,-10%)",multiply:1.3*.9,availabilSpecial:!1},gekokujo_mob:{name:"下剋上(MOB)",multiply:.7,availabilSpecial:!0},amrudad_boss_excl_job:{name:"アムル(BOSS,専用職業)",multiply:1.1,availabilSpecial:!0},volcano:{name:"ボルケーノ",multiply:22,availabilSpecial:!1},magic_ball_chant:{name:"マジックボール(詠唱あり)",multiply:8,availabilSpecial:!1},magic_ball_normal:{name:"マジックボール(詠唱なし)",multiply:4,availabilSpecial:!1},shock_stone:{name:"ショックストーン",multiply:7,availabilSpecial:!1},chaos_blizzard:{name:"カオスブリザード(全弾Hit)",multiply:1.1*7,availabilSpecial:!1},snow_pillar:{name:"雪柱",multiply:4,availabilSpecial:!1},stead_shock:{name:"ステッドショック",multiply:32,availabilSpecial:!1},over_shoot_shadow_power:{name:"オーバーシュート(スキルあり)",multiply:18.75,availabilSpecial:!1},over_shoot_normal:{name:"オーバーシュート(スキルなし)",multiply:12.5,availabilSpecial:!1},awakening:{name:"覚醒",multiply:2,availabilSpecial:!0},blood_slash:{name:"血の斬撃",multiply:2.5,availabilSpecial:!0},heiron_metu:{name:"ヘイロン滅",multiply:8,availabilSpecial:!1}},over_strength_values:[0,9,18,27,36,45,54,63,72,81,102.659,115.072,122.172,126.701,129.829,132.114,133.856,135.227,136.334,137.246,138.011,138.661,139.221,139.707,140.135,140.513,140.849,141.151,141.424,141.67,141.895,142.1,142.289,142.462,142.623,142.772,142.91,143.039,143.159,143.272,143.377,143.476,143.57,143.658,143.742,143.821,143.895,143.966,144.034,144.098,144.159,144.217,144.273,144.326,144.377,144.426,144.473,144.518,144.561,144.602,144.642,144.68,144.717,144.753,144.787,144.82,144.852,144.883,144.913,144.942,144.97,144.997,145.024,145.049,145.074],darkMode:"true"==localStorage.getItem("dark_mode"),...Ie()}});function De(){"true"==localStorage.getItem("dark_mode")?document.documentElement.setAttribute("theme","dark"):document.documentElement.removeAttribute("theme")}function Ie(){const e=new URLSearchParams(location.search),t=function(e){const t=String(e).split("E");let n=parseInt(t[0],36),l=0;return t[1]&&(l=parseInt(t[1],36)),n*=10**l,l<0&&(n=parseFloat(n.toFixed(-l))),n},n={weaponDamage:e.has("wd")?t(e.get("wd")):0,specialDamage:e.has("sd")?t(e.get("sd")):0,parkGain:e.has("pg")?t(e.get("pg")):0,jobGain:e.has("jg")?t(e.get("jg")):0,equipGain:e.has("eg")?t(e.get("eg")):0,numLegendStone:e.has("ns")?parseInt(e.get("ns")).toString():"0",skill:e.has("sk")?e.get("sk"):"general_attack",strLevel:e.has("str")?parseInt(e.get("str"),36):0};if(e.has("ms")){const t=parseInt(e.get("ms"),2);n.magicStone={level_1:1==(t>>5&1),level_2:1==(t>>4&1),level_3:1==(t>>3&1),level_4:1==(t>>2&1),"level_4.5":1==(t>>1&1),level_5:1==(t>>0&1)}}return n}function Ae(e){const t=document.createElement("textarea");document.body.append(t),t.value=e,t.select(),document.execCommand("copy"),t.remove(t)}return e.applyTheme=De,e.copyToClipboard=Ae,e.default=Ge,e.parseURLParams=Ie,Object.defineProperty(e,"__esModule",{value:!0}),e}({});
//# sourceMappingURL=bundle.js.map
