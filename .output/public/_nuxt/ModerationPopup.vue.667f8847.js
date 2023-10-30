import{f as g,o as b,c as P,a as r,t as v,h as S,r as u,g as B,w as o,b as s,u as n,q as F,j as N,d as h}from"./entry.676b6978.js";import{a as q,_ as x,F as j,b as K,f as L}from"./Popup.vue.9460c2dc.js";import{P as M}from"./PopupContainer.54ccd51c.js";const R=["onClick"],T={class:"w-5/12"},z={class:"w-7/12"},A=g({__name:"ListItem",props:{id:Number,title:String,text:String},emits:["click"],setup(m,{emit:c}){const a=m,e=c,i=()=>{e("click",a.id)};return(t,p)=>(b(),P("div",{class:"flex items-center px-4 py-3 bg-dark-light/10 odd:bg-white hover:bg-dark-light/20 cursor-pointer round",onClick:S(i,["prevent","stop"])},[r("div",T,v(a.title),1),r("div",z,v(a.text),1)],8,R))}}),D={class:"max-w-[600px] formkit-w-full"},E={class:"flex gap-4 mt-4 justify-center"},G=g({__name:"ModerationPopup",emits:["approve","decline"],setup(m,{expose:c,emit:a}){const e=u(),i=u(""),t=u(""),p=a,k=d=>{i.value=d,t.value="",e.value&&e.value.show()},l=()=>{e.value&&e.value.hide()},w=()=>{p("approve"),l()},C=()=>K("reason_form"),y=()=>t.value,V=()=>{p("decline",n(t)),l()};return c({popupOpen:k,getReason:y}),(d,f)=>{const _=L;return b(),B(n(j),{"config-file":"true"},{default:o(()=>[s(M,{ref_key:"popup",ref:e,onClose:l},{default:o(()=>[s(q,{class:"bg-gray-light/60 w-full max-h-full min-w-[300px] max-w-[600px] pb-0",title:n(i),onClose:l},{default:o(()=>[F(d.$slots,"default"),r("div",D,[s(_,{id:"reason_form",type:"form","submit-label":"Войти",config:{validationVisibility:"submit"},actions:!1,onSubmit:V},{default:o(()=>[s(_,{id:"reason",type:"textarea",label:"Причина отклонения",placeholder:"В случае отклонения укажите причину",modelValue:n(t),"onUpdate:modelValue":f[0]||(f[0]=$=>N(t)?t.value=$:null),validation:"required","validation-messages":{required:"Необходимо указать причину отклонения"}},null,8,["modelValue"]),r("div",E,[s(x,{class:"bg-main hover:bg-second text-white px-10 py-3",onClick:w},{default:o(()=>[h("Принять")]),_:1}),s(x,{class:"bg-red-600 hover:bg-red-800 text-white px-6 py-3",onClick:C},{default:o(()=>[h("Отклонить")]),_:1})])]),_:1})])]),_:3},8,["title"])]),_:3},512)]),_:3})}}});export{A as _,G as a};
