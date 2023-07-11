import CategoryService from '@/services/categories.service';
import ProductService from '@/services/products.service';

export default {
  namespaced: true,
  state: () => ({
    searchForm: {
      category: 'Все категории',
      text: '',
    },
    categories: [],
    selected: 'Все категории',
    isProductsFound: true,
    wasSearched: false,
  }),
  getters: {
    // Search getters
    SEARCH_FORM: (state) => state.searchForm,
    CATEGORIES: (state) => state.categories,
    SELECTED: (state) => state.selected,
    IS_FOUND: (state) => state.isProductsFound,
    WAS_SEARCHED: (state) => state.wasSearched,
  },
  mutations: {
    // Search
    SET_SEARCH_CATEGORY: (state, category) => state.searchForm.category = category,
    SET_SEARCH_TEXT: (state, text) => state.searchForm.text = text,
    SET_CATEGORIES: (state, categories) => state.categories = categories,
    SET_FOUND: (state, bool) => state.isProductsFound = bool,
    SET_SEARCHED: (state, bool) => state.wasSearched = bool,
  },
  actions: {
    // Change state props
    async GET_CATEGORIES_FROM_API({ commit }) {
      try {
        let categories = await CategoryService.getCategories();
        categories = categories.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          } else {
            return 0;
          }
        });

        commit('SET_CATEGORIES', categories);
        return this.categories;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    CHANGE_SEARCH_CATEGORY({ commit }, category) {
      commit('SET_SEARCH_CATEGORY', category);
    },
    CHANGE_SEARCH_TEXT({ commit }, text) {
      commit('SET_SEARCH_TEXT', text);
    },
    SET_SEARCHED({ commit }, bool) {
      commit('SET_SEARCHED', bool);
    },
    CHANGE_FOUND({ commit }, bool) {
      commit('SET_FOUND', bool);
    },

    // Search
    async SEARCH_PRODUCTS({ commit }, { categoryQuery, textQuery }) {
      try {
        commit('SET_SEARCHED', true);
        let products = [];

        if (categoryQuery === '61ef07be51a966f430d29f13') {
          products = await ProductService.getProductsBySearch(textQuery);
        } else {
          products = await ProductService.getProductsBySearch(textQuery, categoryQuery);
        }

        Array.isArray(products) ?
          commit('products/SET_SEARCHED_PRODUCTS', products, { root: true }) :
          commit('products/SET_SEARCHED_PRODUCTS', [], { root: true });

        products.length > 0 ? commit('SET_FOUND', true) : commit('SET_FOUND', false);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
