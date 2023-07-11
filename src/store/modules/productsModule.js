import ProductService from '@/services/products.service';
import { fixProductArticle } from '@/helpers/article';


export default {
  namespaced: true,
  state: () => ({
    products: [],
    isProductsLoading: false,
    sidebarLoading: false,
    searchedProducts: [],
    filteredProducts: [],
    prefilteredProducts: [],
    sliderProducts: [],
  }),
  getters: {
    PRODUCTS: (state) => state.products,
    IS_PRODUCTS_LOADING: (state) => state.isProductsLoading,
    SEARCHED_PRODUCTS: (state) => state.searchedProducts,
    FILTERED_PRODUCTS: (state) => state.filteredProducts,
    PREFILTERED_PRODUCTS: (state) => state.prefilteredProducts,
    SLIDER_PRODUCTS: (state) => state.sliderProducts,
    SIDEBAR_LODADING: (state) => state.sidebarLoading,
  },
  mutations: {
    SET_PRODUCTS: (state, products) => state.products = products,
    SET_PRODUCTS_LOADING: (state, bool) => state.isProductsLoading = bool,
    SET_SIDEBAR_LOADING: (state, bool) => state.sidebarLoading = bool,
    SET_SEARCHED_PRODUCTS: (state, products) => state.searchedProducts = products,
    SET_FILTERED_PRODUCTS: (state, products) => state.filteredProducts = products,
    SET_PREFILTERED_PRODUCTS: (state, products) => state.prefilteredProducts = products,
    SET_SLIDER_PRODUCTS: (state, products) => state.sliderProducts = products,
  },
  actions: {
    SET_SEARCHED_PRODUCTS({ commit }, products) {
      commit('SET_SEARCHED_PRODUCTS', products);
    },
    SET_FILTERED_PRODUCTS({ commit }, products) {
      commit('SET_FILTERED_PRODUCTS', products);
    },
    SET_PREFILTERED_PRODUCTS({ commit }, products) {
      commit('SET_PREFILTERED_PRODUCTS', products);
    },
    SET_SLIDER_PRODUCTS({ commit }, products) {
      commit('SET_SLIDER_PRODUCTS', products);
    },
    // API requests actions
    async GET_PRODUCTS({}, categoryId = '') {
      let products;

      if (categoryId.length) {
        products = await ProductService.getProductsByCategory(categoryId);
      } else {
        products = await ProductService.getProducts();
      }

      products.forEach(product => product.article = fixProductArticle(product.article));

      return products;
    },
    async GET_PRODUCTS_FROM_API({ commit, dispatch }, categoryId = '') {
      try {
        commit('SET_PRODUCTS_LOADING', true);
        const products = await dispatch('GET_PRODUCTS', categoryId);
        commit('SET_PRODUCTS', products);
        return products;
      } catch (err) {
        console.log(err);
      } finally {
        commit('SET_PRODUCTS_LOADING', false);
      }
    },
    async GET_SLIDER_PRODUCTS_FROM_API({ commit, dispatch }, categoryId = '') {
      try {
        commit('SET_PRODUCTS_LOADING', true);
        const products = await dispatch('GET_PRODUCTS', categoryId);
        commit('SET_SLIDER_PRODUCTS', products);
        return products;
      } catch (err) {
        console.log(err);
      } finally {
        commit('SET_PRODUCTS_LOADING', false);
      }
    },
    async GET_FILTERED_PRODUCTS_FROM_API({ commit }, filter) {
      try {
        commit('SET_PRODUCTS_LOADING', true);

        if (!filter.length) {
          commit('SET_FILTERED_PRODUCTS', []);
          commit('SET_LOADING', false);
          return;
        }

        const products = await ProductService.getFilteredProducts(filter);

        products.forEach(product => product.article = fixProductArticle(product.article));
        commit('SET_FILTERED_PRODUCTS', products);
        commit('SET_PRODUCTS_LOADING', false);
      } catch (err) {
        console.log(err);
        commit('SET_PRODUCTS_LOADING', false);
      }
    },
    async GET_PREFILTERED_PRODUCTS_FROM_API({ commit }, filter) {
      try {
        commit('SET_SIDEBAR_LOADING', true);

        if (!filter.length) {
          commit('SET_PREFILTERED_PRODUCTS', []);
          commit('SET_SIDEBAR_LOADING', false);
          return;
        }

        const products = await ProductService.getFilteredProducts(filter);

        products.forEach(product => product.article = fixProductArticle(product.article));
        commit('SET_PREFILTERED_PRODUCTS', products);
        commit('SET_SIDEBAR_LOADING', false);
      } catch (err) {
        console.log(err);
        commit('SET_SIDEBAR_LOADING', false);
      }
    },
  },
};
