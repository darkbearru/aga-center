import{f as r,r as l,o as u,c as _,q as f,s as d,u as m,_ as v}from"./entry.676b6978.js";const C=r({__name:"PopupContainer",emits:["close"],setup(P,{expose:n,emit:t}){const a=t;n({show:c,hide:i});const o=l(!1);function c(){o.value=!0}function i(){o.value=!1}function p(e){var s;(s=e==null?void 0:e.target)!=null&&s.classList.contains("popup-container")&&a("close")}return(e,s)=>(u(),_("div",{class:d(["popup-container",m(o)?"show":""]),onClick:p},[f(e.$slots,"default",{},void 0,!0)],2))}});const x=v(C,[["__scopeId","data-v-6467fe4b"]]);export{x as P};
