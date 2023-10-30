import{u as i,a}from"./cookie.5691c368.js";import{u as n}from"./ssr.02200a8e.js";import{B as u,r as h}from"./entry.676b6978.js";const f=u("user",{state:()=>{const e=h(void 0),t="/api/users/",s=i("ac_token");return{user:e,path:t,accessToken:s}},getters:{},actions:{async login(e,t){if(!t){const{data:c,error:l}=await a(`${this.path}${e}/`,{method:"get"},"$HARvoBElv5");return c.value}const{data:s,error:o}=await a(`${this.path}${e}/${t}/`,{method:"post"},"$yNZiGrleRA");if(o.value)return;const r=i("ac_token");return this.accessToken=r.value,this.user=s.value,s.value},async check(){return await $fetch(`${this.path}check/`,{method:"get",headers:{Authorization:`Bearer ${this.accessToken}`}}).then(e=>{this.user=e}).catch(e=>{e&&e.statusCode===401&&(console.log(e.value),this.clearCookies())}),!0},async register(e,t,s){const{data:o,error:r}=await a(`${this.path}registration/`,{method:"post",body:{email:e,fio:t,code:s}},"$fHRf6DnaXs");if(!r.value)return o.value},async logout(){const e=n(),{data:t,error:s}=await a("/api/users/logout","$46vmQb5TGa");return t.value==="OK"&&await this.clearUserAndRedirect(e),this.clearCookies(e),!0},async clearUserAndRedirect(e){this.clearCookies(),window.location.href="/"},clearCookies(e){if(e&&e.context.user)deleteCookie(e,"ac_token"),e.context.user&&delete e.context.user;else{const t=i("ac_token");t.value=null}this.user=void 0,this.accessToken=void 0}}});export{f as u};
