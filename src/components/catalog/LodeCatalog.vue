<template>
  <div class="container">
    <div class="lode-catalog">
      <lode-catalog-sidebar
        :updateSidebarFilters="updateSidebarFilters"
        :createSidebarFilters="createSidebarFilters"
        :clearFilters="clearFilters"
        @filtersOpened="toggleFilters"
      />
      <div class="lode-catalog__content">
        <lode-catalog-tags
          :clearFilters="clearFilters"
          @acceptFilters="acceptPrefilteredProducts()"
        />
        <h1
          class="lode-catalog__loading"
          v-if="IS_PRODUCTS_LOADING"
        >Идет загрузка...</h1>
        <h1
          class="lode-catalog__found"
          v-if="!IS_FOUND"
        >Товар не найден</h1>
        <div
          v-show="!IS_PRODUCTS_LOADING && IS_FOUND"
          class="lode-catalog__list"
        >
          <transition-group name="catalog-list">
            <lode-catalog-item
              v-show="!IS_PRODUCTS_LOADING && IS_FOUND"
              v-for="product in pagedProducts"
              :key="product._id"
              :product="product"
              :areFiltersOpened="areFiltersOpened"
            />
          </transition-group>
        </div>
        <lode-catalog-pagination
          :products="searchedAndFilteredProducts"
          :pages="pages"
          :currentPage="currentPage"
        ></lode-catalog-pagination>

      </div>

    </div> <!-- /lode-catalog -->
  </div>
</template>

<script>
import LodeCatalogItem from '@/components/catalog/LodeCatalogItem';
import LodeCatalogSidebar from '@/components/catalog/LodeCatalogSidebar';
import LodeCatalogTags from '@/components/catalog/LodeCatalogTags';
import LodeCatalogPagination from '@/components/catalog/LodeCatalogPagination';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'lode-catalog',
  components: {
    LodeCatalogItem,
    LodeCatalogSidebar,
    LodeCatalogTags,
    LodeCatalogPagination,
  },
  data() {
    return {
      createSidebarFilters: false,
      maxProductsOnPage: 9,
      areFiltersOpened: false,
    };
  },
  props: {
    category: {
      type: String,
      default: '',
    },
    updateSidebarFilters: {
      type: Boolean,
      default: false,
    },
    clearFilters: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('products', [
      'PRODUCTS',
      'IS_PRODUCTS_LOADING',
      'SEARCHED_PRODUCTS',
      'FILTERED_PRODUCTS',
      'PREFILTERED_PRODUCTS',
    ]),
    ...mapGetters('search', ['IS_FOUND', 'WAS_SEARCHED']),
    searchedAndFilteredProducts() {
      if (this.FILTERED_PRODUCTS.length) {
        return this.FILTERED_PRODUCTS;
      }

      if (
        this.SEARCHED_PRODUCTS.length ||
        this.WAS_SEARCHED ||
        !this.IS_FOUND
      ) {
        return this.SEARCHED_PRODUCTS;
      }

      return this.PRODUCTS;
    },
    productsQuantity() {
      return this.searchedAndFilteredProducts.length;
    },
    pages() {
      return Math.ceil(this.productsQuantity / this.maxProductsOnPage) || 1;
    },
    currentPage() {
      return this.$route.query.page ? +this.$route.query.page : 1;
    },
    pagedProducts() {
      const start = (this.currentPage - 1) * this.maxProductsOnPage;

      return [...this.searchedAndFilteredProducts].splice(
        start,
        this.maxProductsOnPage,
      );
    },
  },
  methods: {
    ...mapActions('products', ['GET_PRODUCTS_FROM_API', 'SET_FILTERED_PRODUCTS']),
    async getCategoryProducts() {
      if (!this.category.length) {
        return;
      }

      if (this.category === process.env.VUE_APP_CATEGORY_ALL_ID) {
        await this.GET_PRODUCTS_FROM_API();
      } else {
        await this.GET_PRODUCTS_FROM_API(this.category);
      }

      this.createSidebarFilters = true;
    },
    acceptPrefilteredProducts() {
      this.SET_FILTERED_PRODUCTS(this.PREFILTERED_PRODUCTS);
    },
    toggleFilters(boolean) {
      this.areFiltersOpened = boolean;
    },
  },

  mounted() {
    if (!this.PRODUCTS.length || !this.FILTERED_PRODUCTS.length) {
      this.getCategoryProducts();
    }
  },
};
</script>

<style lang="scss">
.lode-catalog {
  display: flex;
  margin: 0 auto 3rem auto;

  max-width: $full-size;

  &__content {
    width: 70%;
  }

  &__loading,
  &__found {
    grid-area: message;
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;

    font-size: 1.8rem;
    font-weight: 500;
  }

  &__list {
    grid-area: catalog;
    display: flex;
    justify-content: center;
    align-self: start;
    flex-wrap: wrap;
  }

  @include for-tablet-portrait-down {
    & {
      margin-top: 2rem;
    }
  }

  @include for-phone-down {
    &__content {
      width: 95%;
    }
  }
}

.catalog-list {
  &-enter-active {
    transition: all 0.5s ease;
  }

  &-leave-active {
    transition: all 0s linear;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scale(0.1);
  }

  //! НАДО РЕШИТЬ ПРОБЛЕМУ ВЫЛЕТА ИЗ УГЛА СТРАНИЦЫ
  // &-move {
  //   transition: transform 0.5s ease;
  // }
}
</style>
