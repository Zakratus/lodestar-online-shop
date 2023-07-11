export default {
  namespaced: true,
  state: () => ({
    areCategoriesLoaded: false
  }),
  getters: {
    ARE_CATEGORIES_LOADED: (state) => state.areCategoriesLoaded,
  },
  mutations: {
    SET_CATEGORIES_LOADED(state, bool) {
      state.areCategoriesLoaded = bool
    }
  },
  actions: {
    CHANGE_CATEGORIES_LOADED({ commit }, bool) {
      commit("SET_CATEGORIES_LOADED", bool);
    }
  }
}
