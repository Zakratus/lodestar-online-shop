<template>
  <form action="">
    <select
      class="lode-header__search-select"
      v-model="searchCategory"
      name="category"
    >
      <option
        v-for="category in CATEGORIES"
        :value="category.value"
        :key="category._id"
      >{{ category.name }}
      </option>

    </select>
    <lode-input
      class="input--header-search"
      v-model="searchText"
      placeholder="Поиск по названию"
      @keydown.enter.prevent="searchProducts"
    />
    <lode-button
      @click="searchProducts"
      type="button"
      class="btn--search"
    >Поиск
    </lode-button>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { updateSearchPath } from '@/helpers/router';

export default {
  name: 'LodeHeaderSearch',
  computed: {
    ...mapGetters('search', ['SEARCH_FORM', 'CATEGORIES']),
    // Two-way Computed Property (searchText, searchCategory)
    // to be able to use v-model with Vuex data
    searchText: {
      get() {
        return this.SEARCH_FORM.text;
      },
      set(value) {
        this.CHANGE_SEARCH_TEXT(value);
      },
    },
    searchCategory: {
      get() {
        return this.SEARCH_FORM.category;
      },
      set(value) {
        this.CHANGE_SEARCH_CATEGORY(value);
      },
    },
    selectedCategoryId() {
      return this.CATEGORIES.find(
        (category) => category.value === this.SEARCH_FORM.category,
      )._id;
    },
    searchQuery() {
      return this.$route.query;
    },
    routeQuery() {
      return {
        category: this.selectedCategoryId,
        text: this.searchText,
      };
    },
  },
  methods: {
    ...mapActions('search', [
      'CHANGE_SEARCH_CATEGORY',
      'CHANGE_SEARCH_TEXT',
      'SEARCH_PRODUCTS',
      'GET_CATEGORIES_FROM_API',
    ]),
    ...mapActions('products', ['SET_FILTERED_PRODUCTS']),
    ...mapActions('loadingConditions', ['CHANGE_CATEGORIES_LOADED']),

    searchProducts() {
      this.SEARCH_PRODUCTS({
        categoryQuery: this.selectedCategoryId,
        textQuery: this.searchText,
      });
      updateSearchPath(this.$router, this.routeQuery);
    },
    updateCategories() {
      this.GET_CATEGORIES_FROM_API().then((response) => {
        this.CHANGE_CATEGORIES_LOADED(true);
      });
    },
    setSearchQueryFromURL() {
      if (this.$route.query.text) {
        let searchedCategory = this.CATEGORIES.find(
          (category) => category._id === this.$route.query.category,
        );
        this.searchCategory = searchedCategory.value;
        this.searchText = this.searchQuery.text;
      }
    },
  },
  mounted() {
    this.setSearchQueryFromURL();
    this.updateCategories();
  },
};
</script>

<style lang="scss">
.lode-header__search {
  &-select {
    padding: 0px 1.5rem;
    background: $white;
    border: 1px solid $grey;
    height: 40px;

    border-radius: 4rem 0px 0px 4rem;
    -webkit-appearance: button;
  }
}
</style>
