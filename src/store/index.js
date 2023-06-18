import { createStore } from 'vuex'
import productsModule  from '@/store/modules/productsModule';
import productModule from '@/store/modules/productModule';
import cartModule from '@/store/modules/cartModule';
import searchModule  from '@/store/modules/searchModule';
import filterModule from '@/store/modules/filterModule';
import loadingConditionsModule  from '@/store/modules/loadingConditionsModule';
import authModule  from '@/store/modules/authModule';
import userFeaturesModule  from '@/store/modules/userFeaturesModule';

export default createStore({
  modules: {
    products: productsModule,
    product: productModule,
    cart: cartModule,
    search: searchModule,
    filter: filterModule,
    loadingConditions: loadingConditionsModule,
    auth: authModule,
    userFeatures: userFeaturesModule
  }
})
