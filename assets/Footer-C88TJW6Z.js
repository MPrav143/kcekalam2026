import{a as e,t}from"./rolldown-runtime-Cn8xt2Gj.js";import{A as n,B as r,F as i,G as a,I as o,Lt as s,it as c,n as l}from"./vendor-lucide-DgQCPrkz.js";import{s as u}from"./vendor-react-BZN4CqxK.js";import{r as d}from"./vendor-motion-BgQuTHLy.js";import{a as f,i as p,l as m,n as h,o as g,r as _,s as v}from"./index-C4_7zjvs.js";var y=t((e=>{function t(e){if(!e||typeof window>`u`)return;let t=document.createElement(`style`);return t.setAttribute(`type`,`text/css`),t.innerHTML=e,document.head.appendChild(t),e}Object.defineProperty(e,`__esModule`,{value:!0});var n=s();function r(e){return e&&typeof e==`object`&&`default`in e?e:{default:e}}var i=r(n);t(`.rfm-marquee-container {
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
}`),e.default=n.forwardRef(function({style:e={},className:t=``,autoFill:r=!1,play:a=!0,pauseOnHover:o=!1,pauseOnClick:s=!1,direction:c=`left`,speed:l=50,delay:u=0,loop:d=0,gradient:f=!1,gradientColor:p=`white`,gradientWidth:m=200,onFinish:h,onCycleComplete:g,onMount:_,children:v},y){let[b,x]=n.useState(0),[S,C]=n.useState(0),[w,T]=n.useState(1),[E,D]=n.useState(!1),O=n.useRef(null),k=y||O,A=n.useRef(null),j=n.useCallback(()=>{if(A.current&&k.current){let e=k.current.getBoundingClientRect(),t=A.current.getBoundingClientRect(),n=e.width,i=t.width;(c===`up`||c===`down`)&&(n=e.height,i=t.height),T(r&&n&&i&&i<n?Math.ceil(n/i):1),x(n),C(i)}},[r,k,c]);n.useEffect(()=>{if(E&&(j(),A.current&&k.current)){let e=new ResizeObserver(()=>j());return e.observe(k.current),e.observe(A.current),()=>{e&&e.disconnect()}}},[j,k,E]),n.useEffect(()=>{j()},[j,v]),n.useEffect(()=>{D(!0)},[]),n.useEffect(()=>{typeof _==`function`&&_()},[]);let M=n.useMemo(()=>r?S*w/l:S<b?b/l:S/l,[r,b,S,w,l]),N=n.useMemo(()=>Object.assign(Object.assign({},e),{"--pause-on-hover":!a||o?`paused`:`running`,"--pause-on-click":!a||o&&!s||s?`paused`:`running`,"--width":c===`up`||c===`down`?`100vh`:`100%`,"--transform":c===`up`?`rotate(-90deg)`:c===`down`?`rotate(90deg)`:`none`}),[e,a,o,s,c]),P=n.useMemo(()=>({"--gradient-color":p,"--gradient-width":typeof m==`number`?`${m}px`:m}),[p,m]),F=n.useMemo(()=>({"--play":a?`running`:`paused`,"--direction":c===`left`?`normal`:`reverse`,"--duration":`${M}s`,"--delay":`${u}s`,"--iteration-count":d?`${d}`:`infinite`,"--min-width":r?`auto`:`100%`}),[a,c,M,u,d,r]),I=n.useMemo(()=>({"--transform":c===`up`?`rotate(90deg)`:c===`down`?`rotate(-90deg)`:`none`}),[c]),L=n.useCallback(e=>[...Array(Number.isFinite(e)&&e>=0?e:0)].map((e,t)=>i.default.createElement(n.Fragment,{key:t},n.Children.map(v,e=>i.default.createElement(`div`,{style:I,className:`rfm-child`},e)))),[I,v]);return E?i.default.createElement(`div`,{ref:k,style:N,className:`rfm-marquee-container `+t},f&&i.default.createElement(`div`,{style:P,className:`rfm-overlay`}),i.default.createElement(`div`,{className:`rfm-marquee`,style:F,onAnimationIteration:g,onAnimationEnd:h},i.default.createElement(`div`,{className:`rfm-initial-child-container`,ref:A},n.Children.map(v,e=>i.default.createElement(`div`,{style:I,className:`rfm-child`},e))),L(w-1)),i.default.createElement(`div`,{className:`rfm-marquee`,style:F},L(w))):null})})),b=s(),x=d(),S=({bgKey:e,fallbackKey:t,mobileBgKey:n,config:r,fallbackGradient:i=`bg-[#14050E]`,overlayOpacity:a=``,className:o=``})=>{let{isMobile:s}=_(),[c,l]=(0,b.useState)({}),u=n||(e?`${e}_mobile`:null),d=t?`${t}_mobile`:null,f=``,m=``;if(s){let n=r&&u&&r[u]&&String(r[u]).trim()||u&&p[u]||``,i=r&&d&&r[d]&&String(r[d]).trim()||d&&p[d]||``,a=r&&e&&r[e]&&String(r[e]).trim()||e&&p[e]||``,o=r&&t&&r[t]&&String(r[t]).trim()||t&&p[t]||``;f=n||a,m=i||o}else f=r&&e&&r[e]&&String(r[e]).trim()||e&&p[e]||``,m=r&&t&&r[t]&&String(r[t]).trim()||t&&p[t]||``;let h=!c[f]&&f?f:!c[m]&&m?m:``,y=!!(h&&h.trim().length>0),S=e=>{l(t=>({...t,[e]:!0}))};if(!y)return(0,x.jsx)(`div`,{className:`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${o}`,children:(0,x.jsx)(`div`,{className:`w-full h-full ${i}`})});let C=g(h),w=v(h);return(0,x.jsxs)(`div`,{className:`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${o}`,children:[w?(0,x.jsx)(`video`,{src:C,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,onError:()=>S(h),className:`w-full h-full object-cover object-center transition-opacity duration-700`},`${C}-${s?`m`:`d`}`):(0,x.jsx)(`img`,{src:C,alt:`Section Background`,loading:`lazy`,onError:()=>S(h),className:`w-full h-full object-cover object-center transition-opacity duration-700`},`${C}-${s?`m`:`d`}`),a?(0,x.jsx)(`div`,{className:`absolute inset-0 ${a}`}):null]})},C=e(y(),1),w=C.default.default||C.default,T=()=>{let e=h(),{config:t,sponsors:s,clubs:d}=m();u();let[p,_]=(0,b.useState)(window.innerWidth<768),[v,y]=(0,b.useState)(null);(0,b.useEffect)(()=>{let e=()=>_(window.innerWidth<768);return window.addEventListener(`resize`,e),()=>window.removeEventListener(`resize`,e)},[]);let C=p&&t.footer_bg_video_mobile?t.footer_bg_video_mobile:t.footer_bg_video,T=t.contact_phones?t.contact_phones.split(`,`).map(e=>e.trim()):[t.contact_phone||`+91 12345 67890`];return(0,x.jsxs)(`footer`,{className:`relative text-white border-t border-[#D62C76]/25 overflow-hidden bg-gradient-to-b from-[#140610] via-[#081820] to-[#16050e]`,children:[(0,x.jsx)(S,{bgKey:`footer_bg_video`,fallbackKey:`footer_bg`,config:t,fallbackGradient:`bg-gradient-to-b from-[#140610] via-[#081820] to-[#16050e]`,overlayOpacity:``}),(0,x.jsxs)(`div`,{className:`relative z-10`,children:[s.length>0&&(0,x.jsxs)(`section`,{id:`sponsors`,className:`w-full max-w-7xl mx-auto px-4 md:px-6 py-8 sm:py-10`,children:[(0,x.jsx)(`h3`,{className:`text-xl md:text-2xl font-bold text-center mb-5 sm:mb-6`,children:`Our Sponsors`}),(0,x.jsx)(`div`,{className:`space-y-6 sm:space-y-8`,children:[`Title`,`Platinum`,`Gold`,`Silver`,`Associate`].map(e=>{let t=s.filter(t=>t.tier===e||e===`Silver`&&!t.tier);return t.length===0?null:(0,x.jsx)(`div`,{className:`flex flex-col items-center`,children:(0,x.jsx)(`div`,{className:`flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8`,children:t.map(e=>(0,x.jsxs)(`div`,{className:`group flex flex-col items-center`,children:[(0,x.jsx)(`div`,{className:`\r
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
                  `,children:e.logo&&/\.(mp4|webm|ogg)$/i.test(e.logo)?(0,x.jsx)(`video`,{src:g(e.logo),autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:`\r
                          w-full h-full object-contain\r
                          opacity-80\r
                          transition-all duration-300\r
                          group-hover:opacity-100\r
                          group-hover:scale-105\r
                        `}):(0,x.jsx)(f,{src:e.logo,alt:e.name,preset:`SPONSOR_LOGO`,width:112,height:112,className:`\r
                          w-full h-full object-contain\r
                          opacity-80\r
                          transition-all duration-300\r
                          group-hover:opacity-100\r
                          group-hover:scale-105\r
                        `})}),(0,x.jsx)(`div`,{className:`text-center mt-1.5`,children:(0,x.jsx)(`p`,{className:`text-[10px] md:text-[11px] font-semibold text-white/90 uppercase tracking-wide`,children:e.name})})]},e._id))})},e)})})]}),d.length>0&&(0,x.jsxs)(`section`,{className:`py-6 sm:py-8 ${e?`bg-transparent`:`bg-[#0e040c]/90`} border-y border-[#D62C76]/20`,children:[(0,x.jsx)(`h3`,{className:`text-xl sm:text-2xl font-bold text-center mb-6`,children:`Our Clubs`}),(0,x.jsx)(w,{gradient:!1,speed:40,autoFill:!0,pauseOnHover:!0,children:d.map((e,t)=>(0,x.jsx)(`div`,{className:`mx-4 sm:mx-6 md:mx-8 w-24 md:w-32 flex items-center justify-center hover:grayscale-0 transition-all opacity-100 hover:opacity-100`,children:(0,x.jsx)(f,{src:e.logo,alt:e.name,preset:`SPONSOR_LOGO`,width:128,height:60,className:`h-10 md:h-12 w-full object-contain`})},e._id||t))})]}),(0,x.jsxs)(`div`,{id:`contact`,className:`w-full max-w-full relative ${s.length>0||d.length>0?`border-t border-[#D62C76]/20`:``} pt-6 sm:pt-10 pb-6 overflow-hidden ${C?`bg-transparent`:`bg-gradient-to-b from-[#140610]/95 via-[#081820]/95 to-[#16050e]/95`}`,children:[C?(0,x.jsx)(`div`,{className:`absolute inset-0 z-0`,children:/\.(mp4|webm|ogg)$/i.test(C)?(0,x.jsx)(`video`,{src:g(C),autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:`w-full h-full object-cover`},C):(0,x.jsx)(f,{src:C,alt:`Footer Background`,preset:`PAGE_BG`,className:`w-full h-full object-cover`})}):(0,x.jsx)(`div`,{className:`absolute inset-0 bg-[#140610]/40 z-0`}),(0,x.jsxs)(`div`,{className:`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-8 mb-6 sm:mb-8`,children:[(0,x.jsxs)(`div`,{className:`col-span-1`,children:[(0,x.jsxs)(`h2`,{className:`text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] mb-2 sm:mb-3`,children:[t.website_name||`KALAM`,` `,t.event_year||`2026`]}),(0,x.jsx)(`p`,{className:`text-xs sm:text-sm text-[#D8D4F0]/80 leading-relaxed`,children:`The ultimate technical, cultural, and science festival celebrating talent, innovation, and spirit.`})]}),(0,x.jsxs)(`div`,{className:`col-span-1`,children:[(0,x.jsx)(`h3`,{className:`text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3`,children:`Quick Links`}),(0,x.jsxs)(`ul`,{className:`space-y-1.5 text-xs sm:text-sm text-[#D8D4F0]/80`,children:[(0,x.jsx)(`li`,{children:(0,x.jsx)(`a`,{href:`#about`,onClick:e=>{e.preventDefault(),document.getElementById(`about`)?.scrollIntoView({behavior:`smooth`})},className:`hover:text-[#F5A623] transition-colors cursor-pointer`,children:`About`})}),(0,x.jsx)(`li`,{children:(0,x.jsx)(`a`,{href:`#technical-events`,onClick:e=>{e.preventDefault(),document.getElementById(`technical-events`)?.scrollIntoView({behavior:`smooth`})},className:`hover:text-[#F5A623] transition-colors cursor-pointer`,children:`Technical Fest`})}),(0,x.jsx)(`li`,{children:(0,x.jsx)(`a`,{href:`#cultural-events`,onClick:e=>{e.preventDefault(),document.getElementById(`cultural-events`)?.scrollIntoView({behavior:`smooth`})},className:`hover:text-[#F5A623] transition-colors cursor-pointer`,children:`Cultural Fest`})}),(0,x.jsx)(`li`,{children:(0,x.jsx)(`a`,{href:`#passes`,onClick:e=>{e.preventDefault(),document.getElementById(`passes`)?.scrollIntoView({behavior:`smooth`})},className:`hover:text-[#F5A623] transition-colors cursor-pointer`,children:`Get Passes`})})]})]}),(0,x.jsxs)(`div`,{className:`col-span-1`,children:[(0,x.jsx)(`h3`,{className:`text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3`,children:`Contact Us`}),(0,x.jsxs)(`ul`,{className:`space-y-2 text-xs sm:text-sm text-[#D8D4F0]/80`,children:[(0,x.jsxs)(`li`,{className:`flex items-start gap-2`,children:[(0,x.jsx)(i,{size:15,className:`text-[#F5A623] mt-0.5 shrink-0`}),(0,x.jsx)(`span`,{children:t.contact_address||`College Campus, India`})]}),T.map((e,t)=>(0,x.jsxs)(`li`,{className:`flex items-center gap-2`,children:[(0,x.jsx)(n,{size:15,className:`text-[#F5A623] shrink-0`}),(0,x.jsx)(`a`,{href:`tel:${e.replace(/\s+/g,``)}`,className:`hover:text-[#F5A623] transition-colors`,children:e})]},t)),(0,x.jsxs)(`li`,{className:`flex items-center gap-2`,children:[(0,x.jsx)(o,{size:15,className:`text-[#F5A623] shrink-0`}),(0,x.jsx)(`a`,{href:`mailto:${t.contact_email||`kcekalam2026@gmail.com`}`,className:`hover:text-[#F5A623] transition-colors break-all`,children:t.contact_email||`kce.kalamcontact@gmail.com`})]})]})]}),(0,x.jsxs)(`div`,{className:`col-span-1`,children:[(0,x.jsx)(`style`,{children:`
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
                            `}),(0,x.jsx)(`h3`,{className:`text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3`,children:`Follow Us`}),(0,x.jsx)(`div`,{className:`flex flex-col gap-2.5`,children:[{id:`facebook`,Icon:c,label:`Facebook`,href:t.facebook_url||`https://www.facebook.com/share/1ERFLsRYj7/`,brandColor:`#1877F2`,bg:`#1877F2`,glow:`0 0 16px rgba(24, 119, 242, 0.6)`},{id:`youtube`,Icon:l,label:`Youtube`,href:t.youtube_url||`https://www.youtube.com/@wekceians?si=2UClrWxuRShi8Xoy`,brandColor:`#FF0000`,bg:`#FF0000`,glow:`0 0 16px rgba(255, 0, 0, 0.6)`},{id:`instagram`,Icon:a,label:`Instagram`,href:t.instagram_url||`https://www.instagram.com/kcekalam/`,brandColor:`#E4405F`,gradient:`linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)`,glow:`0 0 16px rgba(220, 39, 67, 0.6)`},{id:`linkedin`,Icon:r,label:`LinkedIn`,href:t.linkedin_url||`https://www.linkedin.com/school/wekceians/`,brandColor:`#0A66C2`,bg:`#0A66C2`,glow:`0 0 16px rgba(10, 102, 194, 0.6)`}].map((e,t)=>{let n=v===t;return(0,x.jsxs)(`a`,{href:e.href,target:`_blank`,rel:`noopener noreferrer`,onMouseEnter:()=>y(t),onMouseLeave:()=>y(null),className:`social-link-${e.id} flex items-center gap-2.5 text-xs sm:text-sm transition-colors duration-200 cursor-pointer`,style:{color:n?e.brandColor:`rgba(216, 212, 240, 0.8)`},children:[(0,x.jsx)(`div`,{className:`social-badge-${e.id} w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300`,style:{background:n?e.gradient||e.bg:`rgba(245, 166, 35, 0.1)`,border:n?`1px solid ${e.brandColor}`:`1px solid rgba(245, 166, 35, 0.2)`,color:n?`#ffffff`:`rgba(255, 255, 255, 0.9)`,boxShadow:n?e.glow:`none`,transform:n?`scale(1.12)`:`scale(1)`},children:(0,x.jsx)(e.Icon,{size:14})}),(0,x.jsx)(`span`,{className:`social-text-${e.id} transition-colors duration-200 font-medium`,style:{color:n?e.brandColor:void 0},children:e.label})]},t)})})]}),(0,x.jsxs)(`div`,{className:`col-span-2 lg:col-span-1`,children:[(0,x.jsx)(`h3`,{className:`text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3`,children:`Location`}),(0,x.jsx)(`div`,{className:`w-full h-32 sm:h-36 rounded-lg overflow-hidden border border-[#F5A623]/30 shadow-md`,children:(0,x.jsx)(`iframe`,{src:`https://maps.google.com/maps?q=Karpagam%20College%20of%20Engineering&t=&z=13&ie=UTF8&iwloc=&output=embed`,className:`w-full h-full`,style:{border:0},allowFullScreen:``,loading:`lazy`,title:`Karpagam College of Engineering Location`})})]})]}),(0,x.jsx)(`div`,{className:`relative z-10 border-t border-[#D62C76]/15 pt-4 text-center text-xs text-gray-400`,children:(0,x.jsxs)(`p`,{children:[`© `,t.event_year||`2026`,` `,t.website_name||`Kalam`,` Team. All rights reserved.`]})})]})]})]})};export{S as n,T as t};