import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vueDompurifyHTMLPlugin from 'vue-dompurify-html'
createApp(App).use(router).use(vueDompurifyHTMLPlugin,{
    default:{
        ALLOW_COMMENTS:false,
        FORBID_URI:['*'],
        ALLOWED_TAGS:['font'],
        ADD_URI_SAFE_ATTR: ['src'],
        ALLOWED_ATTR: ['color'],
    }
}).use(createPinia()).mount('#app')
