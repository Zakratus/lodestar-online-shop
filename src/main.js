import { createApp } from 'vue';
import App from './App.vue';
import store from '@/store';
import router from '@/router/router';
import UiComponents from '@/components/UI';

const app = createApp(App);

// import UI components into all apps components
UiComponents.forEach(component => {
  app.component(component.name, component);
});

app
  .use(store)
  .use(router)
  .mount('#app');
