<template>
  <div class="search-page">
    <div class="container">
      <h1 class="lode-search-page__results">
        Рузультаты поиска
        <span class="lode-search-page__results-query">"{{ searchedText }}"</span>
      </h1>
    </div>
    <lode-catalog />
  </div>

</template>

<script>
import LodeCatalog from '@/components/catalog/LodeCatalog';
import { mapActions } from 'vuex';

export default {
  components: {
    LodeCatalog,
  },
  methods: {
    ...mapActions('search', [
      'SET_SEARCHED',
      'SEARCH_PRODUCTS',
      'CHANGE_FOUND',
    ]),
    ...mapActions('products', ['SET_SEARCHED_PRODUCTS']),
  },
  computed: {
    searchedText() {
      return this.$route.query.text;
    },
    searchedCategory() {
      return this.$route.query.category;
    },
  },
  beforeRouteLeave(to, from, next) {
    this.SET_SEARCHED_PRODUCTS([]);
    this.SET_SEARCHED(false);
    this.CHANGE_FOUND(true);
    next();
  },
  mounted() {
    this.SEARCH_PRODUCTS({
      categoryQuery: this.searchedCategory,
      textQuery: this.searchedText,
    });
  },
};
</script>

<style lang="scss">
.lode-search-page__results {
  margin-left: 30%;
  font-size: 1.5rem;

  &-query {
    font-weight: 500;
  }
}
</style>
