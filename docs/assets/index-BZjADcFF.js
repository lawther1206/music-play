import{_ as g}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{a as C,o as D,u as N,x as T,y as x,c as r,h as d,F as k,i as y,n as S,t as E,j as I,p as A,l as B,f as F}from"./index-eAQTeVra.js";const q=l=>(A("data-v-b64d2a9a"),l=l(),B(),l),U={key:0,class:"navs"},b=q(()=>F("div",{class:"title"},"快速导航",-1)),w=["onClick"],H={__name:"index",props:{navData:Array},setup(l,{expose:h}){const a=l,t=C({mainnNode:null,navContentList:[],active:""});D(()=>{N(()=>{var s;if(a.navData&&a.navData.length>0){let n=document.querySelectorAll("#app");t.active=(s=a.navData[0])==null?void 0:s.id,n.length>0&&(t.mainnNode=n[0],t.mainnNode.addEventListener("scroll",p,{passive:!0}))}})}),T(()=>{_()});const _=()=>{t.mainnNode&&(t.mainnNode.removeEventListener("scroll",p,{passive:!0}),console.log("移除监听"))};x(()=>{});const v=()=>{if(a.navData&&a.navData.length>0){let s=0;t.navContentList=[],a.navData.forEach(n=>{let e=document.getElementById(n.id);e&&(s+=e.offsetHeight,t.navContentList.push({id:n.id,top:e.offsetTop,offsetHeight:s}))})}},p=()=>{v();const s=t.mainnNode.scrollTop;let n="";for(var e=0;e<=t.navContentList.length;e++)t.navContentList[e]&&s>=t.navContentList[e].top&&(n=t.navContentList[e].id);n||(n=t.navContentList&&t.navContentList.length>0?t.navContentList[0].id:""),t.active=n},f=s=>{v();let n=s??(a.navData&&a.navData.length>0?a.navData[0].id:"");t.active=n;let e=t.navContentList.find(L=>L.id==s);const i=(e==null?void 0:e.top)??0;let o=t.mainnNode.scrollTop;const c=50;o>i?u():m();function m(){o<i&&(i-o>=c?o+=c:o=i,t.mainnNode.scrollTop=o,requestAnimationFrame(m))}function u(){o>i&&(o-i>=c?o-=c:o=i,t.mainnNode.scrollTop=o,requestAnimationFrame(u))}};return h({scrollTo:f}),(s,n)=>(r(),d("div",null,[a.navData&&a.navData.length>0?(r(),d("ul",U,[b,(r(!0),d(k,null,y(a.navData,(e,i)=>(r(),d("li",{key:i,class:S({active:t.active===e.id}),onClick:o=>f(e.id)},E(e.title),11,w))),128))])):I("",!0)]))}},z=g(H,[["__scopeId","data-v-b64d2a9a"]]);export{z as default};