import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueParticles from 'vue-particles'
import { store } from './store/createStore'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import "@/styles/index.scss";
import * as icons from '@element-plus/icons'

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);

  var loggedIn = store.state.loggedIn

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
})

const app = createApp(App)
Object.keys(icons).forEach(key => {
  app.component(key, icons[key])
})
app
  .use(ElementPlus)
  .use(store)
  .use(router)
  .use(VueParticles)
  .mount('#app')