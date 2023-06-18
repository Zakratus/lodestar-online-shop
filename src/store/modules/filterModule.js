export default {
  namespaced: true,
  state: () => ({
    // Filters
    wasFiltered: false,
    selectedFilters: [],
    sidebarFilters: [],

    // Tags
    tags: [],
    tagsQuery: {},
  }),
  getters: {
    // Filters getters
    SELECTED_FILTERS: (state) => state.selectedFilters,
    WAS_FILTERED: (state) => state.wasFiltered,
    // todo: remove SIDEBAR_FILTERS to LodeCatalogSidebar component
    SIDEBAR_FILTERS: (state) => state.sidebarFilters,

    // Tags getters
    TAGS: (state) => state.tags,
    TAGS_QUERY: (state) => state.tagsQuery,
  },
  mutations: {
    // Filters mutations
    SET_FILTERED: (state, bool) => state.wasFiltered = bool,
    SET_SELECTED_FILTERS: (state, filter) => state.selectedFilters = filter,
    SET_SIDEBAR_FILTERS: (state, filters) => state.sidebarFilters = filters,
    TOGGLE_SIDEBAR_FILTER: (state, index) => state.sidebarFilters[index].closed = !state.sidebarFilters[index].closed,

    // Tags mutations
    SET_TAG: (state, tag) => state.tags.push(tag),
    SET_TAGS_QUERY: (state, queryObj) => state.tagsQuery = queryObj,
    SET_TAGS: (state, tags) => state.tags = tags,
    DEL_ALL_TAGS: (state) => state.tags.splice(0, state.tags.length),
    DEL_TAG: (state, { tagIndex = null, tagValue = '', tagName = '' }) => {
      let values = state.tags[tagIndex]?.values;

      if (tagValue === '') {
        return state.tags.splice(tagIndex, 1);
      }

      if (values?.length > 1) {
        return values = values.filter(value => value !== tagValue);
      }

      if (tagIndex === null) {
        let finished = false;

        state.tags.map(tag => {
          if (tag.name === tagName && tag.values.length > 1) {
            finished = true;
            tag.values = tag.values.filter(value => value !== tagValue);
          }
        });
        if (finished) return;

        return state.tags = state.tags.filter(tag => tag.name !== tagName);
      }

      return state.tags.splice(tagIndex, 1);
    },
    ADD_TAG_VALUE: (state, { name, value }) => {
      state.tags.map(tag => {
        if (tag.name === name) {
          tag.values.push(value);
        }
      });
    },
  },
  actions: {
    // Filters actions
    CHANGE_SELECTED_FILTERS({ commit }, filters) {
      commit('SET_SELECTED_FILTERS', filters);
    },
    CREATE_FILTER_SPECS({ commit, rootState }) {
      let result = [];
      let set = new Set();
      let productsArray = [];

      if (rootState.products.filteredProducts.length) {
        productsArray = rootState.products.filteredProducts;
      } else if (rootState.products.searchedProducts.length || rootState.search.wasSearched) {
        productsArray = rootState.products.searchedProducts;
      } else {
        productsArray = rootState.products.products;
      }

      productsArray.forEach((product) => {
        if (!product.specifications.length) {
          return;
        }

        product.specifications.map((spec) => {
          let specObjId = spec.specObj._id;

          if (!set.has(specObjId)) {
            set.add(specObjId);
            spec.specObj.variants = [];
            result.push(spec.specObj);
          }

          result.map((item) => {
            if (item._id === specObjId && !set.has(`${specObjId}${spec.specValue}`)) {
              set.add(`${specObjId}${spec.specValue}`);
              item.variants.push(spec.specValue);
            }

            item.variants.sort((a, b) => a - b);
          });
        });
      });

      commit('SET_SIDEBAR_FILTERS', result);
    },
    SET_SIDEBAR_FILTERS({ commit }, filters) {
      commit('SET_SIDEBAR_FILTERS', filters);
    },
    TOGGLE_SIDEBAR_FILTER({ commit }, index) {
      commit('TOGGLE_SIDEBAR_FILTER', index);
    },

    // Tags actions
    ADD_TAG({ commit, state }, tag = {}) {
      const newTag = { name: tag.name, values: [tag.value], urlName: tag.urlName };
      const { name: tagName, value: tagValue } = tag;

      if (state.tags.length) {
        let exists = false;
        state.tags.forEach(item => item.name === tag.name ? exists = true : exists);

        if (exists) {
          exists = false;
          state.tags.forEach(stateTag => {
            return stateTag.values.includes(tagValue) ? exists = true : exists;
          });

          if (exists) {
            return console.log('Such tag already exists');
          } else {
            commit('ADD_TAG_VALUE', { name: tagName, value: tagValue });
          }

        } else {
          commit('SET_TAG', newTag);
        }
      } else {
        commit('SET_TAG', newTag);
      }
    },
    REMOVE_TAG({ commit }, { index, value, name }) {
      commit('DEL_TAG', { tagIndex: index, tagValue: value, tagName: name });
    },
    REMOVE_ALL_TAGS({ commit }) {
      commit('DEL_ALL_TAGS');
    },
    SET_TAGS_QUERY({ commit }, queryObj = {}) {
      commit('SET_TAGS_QUERY', queryObj);
    },
    SET_TAGS({ commit }, tags = []) {
      commit('SET_TAGS', tags);
    },
  },
};
