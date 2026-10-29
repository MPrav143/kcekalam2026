import{a as e,t}from"./rolldown-runtime-Cn8xt2Gj.js";import{A as n,B as r,F as i,G as a,I as o,Lt as s,P as c,it as l,n as u,r as d,wt as f}from"./vendor-lucide-DgQCPrkz.js";import{c as p,s as m}from"./vendor-react-BFfZIode.js";import{r as h}from"./vendor-motion-BgQuTHLy.js";import{a as g,i as _,l as v,n as y,o as b,r as x,s as S,u as C}from"./index-CKhA0T-u.js";var w=s(),T=h(),E=()=>{let e=y(),{config:t,categories:n=[]}=v(),r=m(),i=p(),[a,o]=(0,w.useState)(!1),[s,l]=(0,w.useState)(`home`),[u,h]=(0,w.useState)(!1);(0,w.useEffect)(()=>{let e=()=>{h(window.scrollY>15)};return e(),window.addEventListener(`scroll`,e,{passive:!0}),()=>window.removeEventListener(`scroll`,e)},[]);let _=[{name:`Home`,sectionId:`home`},{name:`About`,sectionId:`about`},...(Array.isArray(n)&&n.length>0?n:C).map(e=>{let t=Array.isArray(e.subcategories)?e.subcategories:[];if(t.length>4){let n=Math.ceil(t.length/2),r=Array.from({length:2},(r,i)=>({links:t.slice(i*n,(i+1)*n).map(t=>({name:t.name,code:t.code||t.name,categoryName:e.name}))})).filter(e=>e.links.length>0);return{name:e.name,categoryCode:e.code||e.name,sectionId:`events`,columns:r}}else if(t.length>0)return{name:e.name,categoryCode:e.code||e.name,sectionId:`events`,dropdown:t.map(t=>({name:t.name,code:t.code||t.name,categoryName:e.name}))};else return{name:e.name,categoryCode:e.code||e.name,sectionId:`events`}}),{name:`Passes`,sectionId:`passes`}],[b,x]=(0,w.useState)(null),S=e=>{x(b===e?null:e)},E=(e,t=`events`,n=null,a=null)=>{e&&e.preventDefault(),o(!1),(n||a)&&window.dispatchEvent(new CustomEvent(`select-category`,{detail:{category:n,subCategory:a}}));let s=t===`technical-events`||t===`cultural-events`?`events`:t;if(r.pathname===`/`){let e=document.getElementById(s)||document.getElementById(`events`)||document.getElementById(`technical-events`);e&&(e.scrollIntoView({behavior:`smooth`}),window.history.pushState(null,``,`#${e.id}`),l(s))}else i(`/#${s}`)};return(0,w.useEffect)(()=>{if(r.pathname!==`/`)return;let e=[`home`,`about`,`technical-events`,`cultural-events`,`passes`,`sponsors`,`contact`],t=[];return e.forEach(e=>{let n=document.getElementById(e);if(!n)return;let r=new IntersectionObserver(([t])=>{t.isIntersecting&&l(e)},{rootMargin:`-20% 0px -70% 0px`,threshold:0});r.observe(n),t.push(r)}),()=>{t.forEach(e=>e.disconnect())}},[r.pathname]),(0,T.jsxs)(`nav`,{className:`fixed top-0 left-0 w-full z-[70] transition-all duration-300 ease-in-out montserrat-light h-16 ${u?`bg-[#10040D]/95 backdrop-blur-2xl border-b border-[#24BCE0]/30 shadow-[0_10px_35px_rgba(0,0,0,0.7)]`:e?`bg-[#12040E]/80 backdrop-blur-xl border-b border-[#24BCE0]/20`:`bg-[#140610]/90 backdrop-blur-xl border-b border-[#24BCE0]/20`}`,children:[(0,T.jsx)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full`,children:(0,T.jsxs)(`div`,{className:`flex items-center justify-between h-full`,children:[(0,T.jsx)(`div`,{className:`flex-shrink-0 flex items-center`,children:(0,T.jsx)(`a`,{href:`#home`,onClick:e=>E(e,`home`),className:`flex items-center gap-2 cursor-pointer`,children:t.navbar_logo?(0,T.jsx)(g,{src:t.navbar_logo,alt:t.website_name||`Kalam Logo`,preset:`NAVBAR_LOGO`,priority:!0,width:160,height:40,className:`h-8 sm:h-9 md:h-10 w-auto object-contain transition-all duration-200`}):(0,T.jsxs)(`span`,{className:`font-heading font-extrabold text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-[#24BCE0] via-[#D62C76] to-[#F5A623] bg-clip-text text-transparent select-none`,children:[t.website_name||`KALAM`,` `,(0,T.jsx)(`span`,{className:`text-[#FFE6A0]`,children:t.event_year||`2026`})]})})}),(0,T.jsx)(`div`,{className:`hidden lg:flex flex-1 justify-center`,children:(0,T.jsx)(`div`,{className:`flex items-center space-x-7 xl:space-x-8`,children:_.map(e=>{let t=s===e.sectionId;return(0,T.jsxs)(`div`,{className:`relative group flex items-center h-16`,children:[(0,T.jsxs)(`a`,{href:`#${e.sectionId}`,onClick:t=>E(t,e.sectionId,e.categoryCode||e.name,null),className:`text-[14px] font-medium transition-all duration-200 ease-out flex items-center gap-1.5 cursor-pointer py-1 ${t?`text-[#F2D10A] font-semibold`:`text-white/75 hover:text-white`}`,children:[e.name,(e.columns||e.dropdown)&&(0,T.jsx)(f,{size:12,className:`opacity-60 group-hover:rotate-180 transition-transform`})]}),e.columns&&(0,T.jsx)(`div`,{className:`absolute top-16 left-1/2 -translate-x-1/2 w-[85vw] max-w-3xl rounded-2xl shadow-2xl bg-[#180614]/95 backdrop-blur-3xl border border-[#F5A623]/35 shadow-[0_20px_50px_rgba(0,0,0,0.6)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform -translate-y-2 group-hover:translate-y-0 overflow-hidden z-50`,children:(0,T.jsx)(`div`,{className:`p-6 md:p-8 grid grid-cols-2 gap-4 md:gap-6`,children:e.columns.map((t,n)=>(0,T.jsx)(`div`,{className:`space-y-2`,children:(0,T.jsx)(`div`,{className:`flex flex-col space-y-1`,children:t.links.map((t,n)=>(0,T.jsx)(`a`,{href:`#events`,onClick:n=>E(n,`events`,t.categoryName||e.name,t.code),className:`px-3.5 py-2 text-[14px] font-medium text-white/75 hover:text-[#F2D10A] hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer`,children:t.name},n))})},n))})}),e.dropdown&&(0,T.jsx)(`div`,{className:`absolute top-16 left-1/2 -translate-x-1/2 w-48 rounded-2xl shadow-2xl bg-[#180614]/95 backdrop-blur-3xl border border-[#D62C76]/35 shadow-[0_20px_50px_rgba(214,44,118,0.25)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform -translate-y-2 group-hover:translate-y-0 overflow-hidden z-50`,children:(0,T.jsx)(`div`,{className:`p-2 flex flex-col space-y-1`,children:e.dropdown.map((t,n)=>(0,T.jsx)(`a`,{href:`#events`,onClick:n=>E(n,`events`,t.categoryName||e.name,t.code),className:`px-4 py-2.5 text-[14px] font-medium text-white/70 hover:text-[#D62C76] hover:bg-[#D62C76]/15 rounded-xl transition-all duration-200 cursor-pointer`,children:t.name},n))})})]},e.name)})})}),(0,T.jsx)(`div`,{className:`hidden lg:flex items-center gap-3`,children:(0,T.jsx)(`a`,{href:`#passes`,onClick:e=>E(e,`passes`),className:`px-5 py-2 rounded-xl text-xs font-heading font-semibold text-white bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:from-[#bf2264] hover:to-[#e09418] shadow-[0_0_20px_rgba(214,44,118,0.4)] border border-[#F2D10A]/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer`,children:`Get Passes`})}),(0,T.jsx)(`div`,{className:`flex items-center lg:hidden`,children:(0,T.jsx)(`button`,{onClick:()=>o(!a),className:`p-2 text-white/80 hover:text-white cursor-pointer`,"aria-label":a?`Close navigation menu`:`Open navigation menu`,"aria-expanded":a,children:a?(0,T.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,T.jsx)(`span`,{className:`text-xs font-semibold text-white/90`,children:`Close`}),(0,T.jsx)(d,{size:22})]}):(0,T.jsx)(c,{size:22})})})]})}),a&&(0,T.jsx)(`div`,{className:`lg:hidden fixed inset-0 z-[75] bg-black/60 backdrop-blur-sm`,onClick:()=>o(!1),"aria-hidden":`true`}),(0,T.jsx)(`div`,{className:`lg:hidden fixed top-16 right-0 z-[80] w-[85%] max-w-sm h-[calc(100dvh-4rem)] bg-[#140610]/98 backdrop-blur-2xl border-l border-[#D62C76]/30 transition-all duration-300 ease-in-out ${a?`opacity-100 translate-x-0`:`opacity-0 translate-x-full pointer-events-none`}`,children:(0,T.jsxs)(`div`,{className:`flex flex-col p-6 space-y-2 overflow-y-auto h-full`,children:[_.map(e=>(0,T.jsx)(`div`,{className:`border-b border-white/5 last:border-0 pb-2`,children:e.columns||e.dropdown?(0,T.jsxs)(`div`,{children:[(0,T.jsxs)(`div`,{className:`flex items-center justify-between w-full`,children:[(0,T.jsx)(`a`,{href:`#${e.sectionId}`,onClick:t=>E(t,e.sectionId,e.categoryCode||e.name,null),className:`flex-1 py-2 text-base font-medium text-white/80 cursor-pointer`,children:e.name}),(0,T.jsx)(`button`,{onClick:t=>{t.stopPropagation(),S(e.name)},className:`p-2 text-white/80 cursor-pointer`,children:(0,T.jsx)(f,{size:18,className:`transition-transform duration-300 ${b===e.name?`rotate-180`:``}`})})]}),(0,T.jsx)(`div`,{className:`grid transition-all duration-300 overflow-hidden ${b===e.name?`grid-rows-[1fr] opacity-100`:`grid-rows-[0fr] opacity-0`}`,children:(0,T.jsx)(`div`,{className:`min-h-0 pl-4 flex flex-col space-y-2 pt-2 pb-3`,children:e.columns?e.columns.map((t,n)=>(0,T.jsx)(`div`,{className:`space-y-1`,children:t.links.map((t,n)=>(0,T.jsx)(`a`,{href:`#events`,className:`block py-1.5 text-sm text-white/60 hover:text-[#F2D10A] transition-colors cursor-pointer`,onClick:n=>E(n,`events`,t.categoryName||e.name,t.code),children:t.name},n))},n)):e.dropdown.map((t,n)=>(0,T.jsx)(`a`,{href:`#events`,className:`block py-1.5 text-sm text-white/60 hover:text-[#D62C76] transition-colors cursor-pointer`,onClick:n=>E(n,`events`,t.categoryName||e.name,t.code),children:t.name},n))})})]}):(0,T.jsx)(`a`,{href:`#${e.sectionId}`,className:`block py-2 text-base font-medium text-white/80 cursor-pointer`,onClick:t=>E(t,e.sectionId,e.categoryCode||e.name,null),children:e.name})},e.name)),(0,T.jsx)(`a`,{href:`#passes`,className:`mt-6 bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] text-white py-3 rounded-xl font-bold text-center text-sm shadow-lg shadow-[#D62C76]/30 cursor-pointer`,onClick:e=>E(e,`passes`),children:`Get Your Pass`})]})})]})},D=t((e=>{function t(e){if(!e||typeof window>`u`)return;let t=document.createElement(`style`);return t.setAttribute(`type`,`text/css`),t.innerHTML=e,document.head.appendChild(t),e}Object.defineProperty(e,`__esModule`,{value:!0});var n=s();function r(e){return e&&typeof e==`object`&&`default`in e?e:{default:e}}var i=r(n);t(`.rfm-marquee-container {
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  width: var(--width);
  transform: var(--transform);
}
.rfm-marquee-container:hover div {
  animation-play-state: var(--pause-on-hover);
}
.rfm-marquee-container:active div {
  animation-play-state: var(--pause-on-click);
}

.rfm-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}
.rfm-overlay::before, .rfm-overlay::after {
  background: linear-gradient(to right, var(--gradient-color), rgba(255, 255, 255, 0));
  content: "";
  height: 100%;
  position: absolute;
  width: var(--gradient-width);
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.rfm-overlay::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}
.rfm-overlay::before {
  left: 0;
  top: 0;
}

.rfm-marquee {
  flex: 0 0 auto;
  min-width: var(--min-width);
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  animation: scroll var(--duration) linear var(--delay) var(--iteration-count);
  animation-play-state: var(--play);
  animation-delay: var(--delay);
  animation-direction: var(--direction);
}
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.rfm-initial-child-container {
  flex: 0 0 auto;
  display: flex;
  min-width: auto;
  flex-direction: row;
  align-items: center;
}

.rfm-child {
  transform: var(--transform);
}`),e.default=n.forwardRef(function({style:e={},className:t=``,autoFill:r=!1,play:a=!0,pauseOnHover:o=!1,pauseOnClick:s=!1,direction:c=`left`,speed:l=50,delay:u=0,loop:d=0,gradient:f=!1,gradientColor:p=`white`,gradientWidth:m=200,onFinish:h,onCycleComplete:g,onMount:_,children:v},y){let[b,x]=n.useState(0),[S,C]=n.useState(0),[w,T]=n.useState(1),[E,D]=n.useState(!1),O=n.useRef(null),k=y||O,A=n.useRef(null),j=n.useCallback(()=>{if(A.current&&k.current){let e=k.current.getBoundingClientRect(),t=A.current.getBoundingClientRect(),n=e.width,i=t.width;(c===`up`||c===`down`)&&(n=e.height,i=t.height),T(r&&n&&i&&i<n?Math.ceil(n/i):1),x(n),C(i)}},[r,k,c]);n.useEffect(()=>{if(E&&(j(),A.current&&k.current)){let e=new ResizeObserver(()=>j());return e.observe(k.current),e.observe(A.current),()=>{e&&e.disconnect()}}},[j,k,E]),n.useEffect(()=>{j()},[j,v]),n.useEffect(()=>{D(!0)},[]),n.useEffect(()=>{typeof _==`function`&&_()},[]);let M=n.useMemo(()=>r?S*w/l:S<b?b/l:S/l,[r,b,S,w,l]),N=n.useMemo(()=>Object.assign(Object.assign({},e),{"--pause-on-hover":!a||o?`paused`:`running`,"--pause-on-click":!a||o&&!s||s?`paused`:`running`,"--width":c===`up`||c===`down`?`100vh`:`100%`,"--transform":c===`up`?`rotate(-90deg)`:c===`down`?`rotate(90deg)`:`none`}),[e,a,o,s,c]),P=n.useMemo(()=>({"--gradient-color":p,"--gradient-width":typeof m==`number`?`${m}px`:m}),[p,m]),F=n.useMemo(()=>({"--play":a?`running`:`paused`,"--direction":c===`left`?`normal`:`reverse`,"--duration":`${M}s`,"--delay":`${u}s`,"--iteration-count":d?`${d}`:`infinite`,"--min-width":r?`auto`:`100%`}),[a,c,M,u,d,r]),I=n.useMemo(()=>({"--transform":c===`up`?`rotate(90deg)`:c===`down`?`rotate(-90deg)`:`none`}),[c]),L=n.useCallback(e=>[...Array(Number.isFinite(e)&&e>=0?e:0)].map((e,t)=>i.default.createElement(n.Fragment,{key:t},n.Children.map(v,e=>i.default.createElement(`div`,{style:I,className:`rfm-child`},e)))),[I,v]);return E?i.default.createElement(`div`,{ref:k,style:N,className:`rfm-marquee-container `+t},f&&i.default.createElement(`div`,{style:P,className:`rfm-overlay`}),i.default.createElement(`div`,{className:`rfm-marquee`,style:F,onAnimationIteration:g,onAnimationEnd:h},i.default.createElement(`div`,{className:`rfm-initial-child-container`,ref:A},n.Children.map(v,e=>i.default.createElement(`div`,{style:I,className:`rfm-child`},e))),L(w-1)),i.default.createElement(`div`,{className:`rfm-marquee`,style:F},L(w))):null})})),O=({bgKey:e,fallbackKey:t,mobileBgKey:n,config:r,fallbackGradient:i=`bg-[#14050E]`,overlayOpacity:a=``,className:o=``})=>{let{isMobile:s}=x(),[c,l]=(0,w.useState)({}),u=n||(e?`${e}_mobile`:null),d=t?`${t}_mobile`:null,f=``,p=``;if(s){let n=r&&u&&r[u]&&String(r[u]).trim()||u&&_[u]||``,i=r&&d&&r[d]&&String(r[d]).trim()||d&&_[d]||``,a=r&&e&&r[e]&&String(r[e]).trim()||e&&_[e]||``,o=r&&t&&r[t]&&String(r[t]).trim()||t&&_[t]||``;f=n||a,p=i||o}else f=r&&e&&r[e]&&String(r[e]).trim()||e&&_[e]||``,p=r&&t&&r[t]&&String(r[t]).trim()||t&&_[t]||``;let m=!c[f]&&f?f:!c[p]&&p?p:``,h=!!(m&&m.trim().length>0),g=e=>{l(t=>({...t,[e]:!0}))};if(!h)return(0,T.jsx)(`div`,{className:`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${o}`,children:(0,T.jsx)(`div`,{className:`w-full h-full ${i}`})});let v=b(m),y=S(m);return(0,T.jsxs)(`div`,{className:`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${o}`,children:[y?(0,T.jsx)(`video`,{src:v,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,onError:()=>g(m),className:`w-full h-full object-cover object-center transition-opacity duration-700`},`${v}-${s?`m`:`d`}`):(0,T.jsx)(`img`,{src:v,alt:`Section Background`,loading:`lazy`,onError:()=>g(m),className:`w-full h-full object-cover object-center transition-opacity duration-700`},`${v}-${s?`m`:`d`}`),a?(0,T.jsx)(`div`,{className:`absolute inset-0 ${a}`}):null]})},k=e(D(),1),A=k.default.default||k.default,j=()=>{let e=y(),{config:t,sponsors:s,clubs:c}=v();m();let[d,f]=(0,w.useState)(window.innerWidth<768),[p,h]=(0,w.useState)(null);(0,w.useEffect)(()=>{let e=()=>f(window.innerWidth<768);return window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[]);let _=d&&t.footer_bg_video_mobile?t.footer_bg_video_mobile:t.footer_bg_video,x=t.contact_phones?t.contact_phones.split(`,`).map(e=>e.trim()):[t.contact_phone||`+91 12345 67890`];return(0,T.jsxs)(`footer`,{className:`relative text-white border-t border-[#D62C76]/25 overflow-hidden bg-gradient-to-b from-[#140610] via-[#081820] to-[#16050e]`,children:[(0,T.jsx)(O,{bgKey:`footer_bg_video`,fallbackKey:`footer_bg`,config:t,fallbackGradient:`bg-gradient-to-b from-[#140610] via-[#081820] to-[#16050e]`,overlayOpacity:``}),(0,T.jsxs)(`div`,{className:`relative z-10`,children:[s.length>0&&(0,T.jsxs)(`section`,{id:`sponsors`,className:`w-full max-w-7xl mx-auto px-4 md:px-6 py-8 sm:py-10`,children:[(0,T.jsx)(`h3`,{className:`text-xl md:text-2xl font-bold text-center mb-5 sm:mb-6`,children:`Our Sponsors`}),(0,T.jsx)(`div`,{className:`space-y-6 sm:space-y-8`,children:[`Title`,`Platinum`,`Gold`,`Silver`,`Associate`].map(e=>{let t=s.filter(t=>t.tier===e||e===`Silver`&&!t.tier);return t.length===0?null:(0,T.jsx)(`div`,{className:`flex flex-col items-center`,children:(0,T.jsx)(`div`,{className:`flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8`,children:t.map(e=>(0,T.jsxs)(`div`,{className:`group flex flex-col items-center`,children:[(0,T.jsx)(`div`,{className:`\r
                    relative\r
                    w-16 h-16\r
                    sm:w-20 sm:h-20\r
                    md:w-24 md:h-24\r
                    lg:w-28 lg:h-28\r
                    flex items-center justify-center\r
                    bg-[#180715]/70\r
                    rounded-xl\r
                    p-2 sm:p-2.5\r
                    border border-[#D62C76]/20\r
                    shadow-md\r
                    backdrop-blur-sm\r
                    transition-all duration-300\r
                    group-hover:border-[#24BCE0]/50\r
                    group-hover:shadow-[0_0_20px_rgba(36,188,224,0.25)]\r
                  `,children:e.logo&&/\.(mp4|webm|ogg)$/i.test(e.logo)?(0,T.jsx)(`video`,{src:b(e.logo),autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:`\r
                          w-full h-full object-contain\r
                          opacity-80\r
                          transition-all duration-300\r
                          group-hover:opacity-100\r
                          group-hover:scale-105\r
                        `}):(0,T.jsx)(g,{src:e.logo,alt:e.name,preset:`SPONSOR_LOGO`,width:112,height:112,className:`\r
                          w-full h-full object-contain\r
                          opacity-80\r
                          transition-all duration-300\r
                          group-hover:opacity-100\r
                          group-hover:scale-105\r
                        `})}),(0,T.jsx)(`div`,{className:`text-center mt-1.5`,children:(0,T.jsx)(`p`,{className:`text-[10px] md:text-[11px] font-semibold text-white/90 uppercase tracking-wide`,children:e.name})})]},e._id))})},e)})})]}),c.length>0&&(0,T.jsxs)(`section`,{className:`py-6 sm:py-8 ${e?`bg-transparent`:`bg-[#0e040c]/90`} border-y border-[#D62C76]/20`,children:[(0,T.jsx)(`h3`,{className:`text-xl sm:text-2xl font-bold text-center mb-6`,children:`Our Clubs`}),(0,T.jsx)(A,{gradient:!1,speed:40,autoFill:!0,pauseOnHover:!0,children:c.map((e,t)=>(0,T.jsx)(`div`,{className:`mx-4 sm:mx-6 md:mx-8 w-24 md:w-32 flex items-center justify-center hover:grayscale-0 transition-all opacity-100 hover:opacity-100`,children:(0,T.jsx)(g,{src:e.logo,alt:e.name,preset:`SPONSOR_LOGO`,width:128,height:60,className:`h-10 md:h-12 w-full object-contain`})},e._id||t))})]}),(0,T.jsxs)(`div`,{id:`contact`,className:`w-full max-w-full relative ${s.length>0||c.length>0?`border-t border-[#D62C76]/20`:``} pt-6 sm:pt-10 pb-6 overflow-hidden ${_?`bg-transparent`:`bg-gradient-to-b from-[#140610]/95 via-[#081820]/95 to-[#16050e]/95`}`,children:[_?(0,T.jsx)(`div`,{className:`absolute inset-0 z-0`,children:/\.(mp4|webm|ogg)$/i.test(_)?(0,T.jsx)(`video`,{src:b(_),autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:`w-full h-full object-cover`},_):(0,T.jsx)(g,{src:_,alt:`Footer Background`,preset:`PAGE_BG`,className:`w-full h-full object-cover`})}):(0,T.jsx)(`div`,{className:`absolute inset-0 bg-[#140610]/40 z-0`}),(0,T.jsxs)(`div`,{className:`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-8 mb-6 sm:mb-8`,children:[(0,T.jsxs)(`div`,{className:`col-span-1`,children:[(0,T.jsxs)(`h2`,{className:`text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] mb-2 sm:mb-3`,children:[t.website_name||`KALAM`,` `,t.event_year||`2026`]}),(0,T.jsx)(`p`,{className:`text-xs sm:text-sm text-[#D8D4F0]/80 leading-relaxed`,children:`The ultimate technical, cultural, and science festival celebrating talent, innovation, and spirit.`})]}),(0,T.jsxs)(`div`,{className:`col-span-1`,children:[(0,T.jsx)(`h3`,{className:`text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3`,children:`Quick Links`}),(0,T.jsxs)(`ul`,{className:`space-y-1.5 text-xs sm:text-sm text-[#D8D4F0]/80`,children:[(0,T.jsx)(`li`,{children:(0,T.jsx)(`a`,{href:`#about`,onClick:e=>{e.preventDefault(),document.getElementById(`about`)?.scrollIntoView({behavior:`smooth`})},className:`hover:text-[#F5A623] transition-colors cursor-pointer`,children:`About`})}),(0,T.jsx)(`li`,{children:(0,T.jsx)(`a`,{href:`#technical-events`,onClick:e=>{e.preventDefault(),document.getElementById(`technical-events`)?.scrollIntoView({behavior:`smooth`})},className:`hover:text-[#F5A623] transition-colors cursor-pointer`,children:`Technical Fest`})}),(0,T.jsx)(`li`,{children:(0,T.jsx)(`a`,{href:`#cultural-events`,onClick:e=>{e.preventDefault(),document.getElementById(`cultural-events`)?.scrollIntoView({behavior:`smooth`})},className:`hover:text-[#F5A623] transition-colors cursor-pointer`,children:`Cultural Fest`})}),(0,T.jsx)(`li`,{children:(0,T.jsx)(`a`,{href:`#passes`,onClick:e=>{e.preventDefault(),document.getElementById(`passes`)?.scrollIntoView({behavior:`smooth`})},className:`hover:text-[#F5A623] transition-colors cursor-pointer`,children:`Get Passes`})})]})]}),(0,T.jsxs)(`div`,{className:`col-span-1`,children:[(0,T.jsx)(`h3`,{className:`text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3`,children:`Contact Us`}),(0,T.jsxs)(`ul`,{className:`space-y-2 text-xs sm:text-sm text-[#D8D4F0]/80`,children:[(0,T.jsxs)(`li`,{className:`flex items-start gap-2`,children:[(0,T.jsx)(i,{size:15,className:`text-[#F5A623] mt-0.5 shrink-0`}),(0,T.jsx)(`span`,{children:t.contact_address||`College Campus, India`})]}),x.map((e,t)=>(0,T.jsxs)(`li`,{className:`flex items-center gap-2`,children:[(0,T.jsx)(n,{size:15,className:`text-[#F5A623] shrink-0`}),(0,T.jsx)(`a`,{href:`tel:${e.replace(/\s+/g,``)}`,className:`hover:text-[#F5A623] transition-colors`,children:e})]},t)),(0,T.jsxs)(`li`,{className:`flex items-center gap-2`,children:[(0,T.jsx)(o,{size:15,className:`text-[#F5A623] shrink-0`}),(0,T.jsx)(`a`,{href:`mailto:${t.contact_email||`kcekalam2026@gmail.com`}`,className:`hover:text-[#F5A623] transition-colors break-all`,children:t.contact_email||`kce.kalamcontact@gmail.com`})]})]})]}),(0,T.jsxs)(`div`,{className:`col-span-1`,children:[(0,T.jsx)(`style`,{children:`
                                .social-link-facebook:hover .social-badge-facebook {
                                    background: #1877F2 !important;
                                    border-color: #1877F2 !important;
                                    box-shadow: 0 0 16px rgba(24, 119, 242, 0.6) !important;
                                    transform: scale(1.12);
                                    color: #ffffff !important;
                                }
                                .social-link-facebook:hover .social-text-facebook {
                                    color: #1877F2 !important;
                                }

                                .social-link-youtube:hover .social-badge-youtube {
                                    background: #FF0000 !important;
                                    border-color: #FF0000 !important;
                                    box-shadow: 0 0 16px rgba(255, 0, 0, 0.6) !important;
                                    transform: scale(1.12);
                                    color: #ffffff !important;
                                }
                                .social-link-youtube:hover .social-text-youtube {
                                    color: #FF0000 !important;
                                }

                                .social-link-instagram:hover .social-badge-instagram {
                                    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
                                    border-color: #dc2743 !important;
                                    box-shadow: 0 0 16px rgba(220, 39, 67, 0.6) !important;
                                    transform: scale(1.12);
                                    color: #ffffff !important;
                                }
                                .social-link-instagram:hover .social-text-instagram {
                                    color: #E4405F !important;
                                }

                                .social-link-linkedin:hover .social-badge-linkedin {
                                    background: #0A66C2 !important;
                                    border-color: #0A66C2 !important;
                                    box-shadow: 0 0 16px rgba(10, 102, 194, 0.6) !important;
                                    transform: scale(1.12);
                                    color: #ffffff !important;
                                }
                                .social-link-linkedin:hover .social-text-linkedin {
                                    color: #0A66C2 !important;
                                }
                            `}),(0,T.jsx)(`h3`,{className:`text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3`,children:`Follow Us`}),(0,T.jsx)(`div`,{className:`flex flex-col gap-2.5`,children:[{id:`facebook`,Icon:l,label:`Facebook`,href:t.facebook_url||`https://www.facebook.com/share/1ERFLsRYj7/`,brandColor:`#1877F2`,bg:`#1877F2`,glow:`0 0 16px rgba(24, 119, 242, 0.6)`},{id:`youtube`,Icon:u,label:`Youtube`,href:t.youtube_url||`https://www.youtube.com/@wekceians?si=2UClrWxuRShi8Xoy`,brandColor:`#FF0000`,bg:`#FF0000`,glow:`0 0 16px rgba(255, 0, 0, 0.6)`},{id:`instagram`,Icon:a,label:`Instagram`,href:t.instagram_url||`https://www.instagram.com/kcekalam/`,brandColor:`#E4405F`,gradient:`linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)`,glow:`0 0 16px rgba(220, 39, 67, 0.6)`},{id:`linkedin`,Icon:r,label:`LinkedIn`,href:t.linkedin_url||`https://www.linkedin.com/school/wekceians/`,brandColor:`#0A66C2`,bg:`#0A66C2`,glow:`0 0 16px rgba(10, 102, 194, 0.6)`}].map((e,t)=>{let n=p===t;return(0,T.jsxs)(`a`,{href:e.href,target:`_blank`,rel:`noopener noreferrer`,onMouseEnter:()=>h(t),onMouseLeave:()=>h(null),className:`social-link-${e.id} flex items-center gap-2.5 text-xs sm:text-sm transition-colors duration-200 cursor-pointer`,style:{color:n?e.brandColor:`rgba(216, 212, 240, 0.8)`},children:[(0,T.jsx)(`div`,{className:`social-badge-${e.id} w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300`,style:{background:n?e.gradient||e.bg:`rgba(245, 166, 35, 0.1)`,border:n?`1px solid ${e.brandColor}`:`1px solid rgba(245, 166, 35, 0.2)`,color:n?`#ffffff`:`rgba(255, 255, 255, 0.9)`,boxShadow:n?e.glow:`none`,transform:n?`scale(1.12)`:`scale(1)`},children:(0,T.jsx)(e.Icon,{size:14})}),(0,T.jsx)(`span`,{className:`social-text-${e.id} transition-colors duration-200 font-medium`,style:{color:n?e.brandColor:void 0},children:e.label})]},t)})})]}),(0,T.jsxs)(`div`,{className:`col-span-2 lg:col-span-1`,children:[(0,T.jsx)(`h3`,{className:`text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3`,children:`Location`}),(0,T.jsx)(`div`,{className:`w-full h-32 sm:h-36 rounded-lg overflow-hidden border border-[#F5A623]/30 shadow-md`,children:(0,T.jsx)(`iframe`,{src:`https://maps.google.com/maps?q=Karpagam%20College%20of%20Engineering&t=&z=13&ie=UTF8&iwloc=&output=embed`,className:`w-full h-full`,style:{border:0},allowFullScreen:``,loading:`lazy`,title:`Karpagam College of Engineering Location`})})]})]}),(0,T.jsx)(`div`,{className:`relative z-10 border-t border-[#D62C76]/15 pt-4 text-center text-xs text-gray-400`,children:(0,T.jsxs)(`p`,{children:[`© `,t.event_year||`2026`,` `,t.website_name||`Kalam`,` Team. All rights reserved.`]})})]})]})]})};export{O as n,E as r,j as t};