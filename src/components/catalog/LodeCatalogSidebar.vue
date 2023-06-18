<template>
  <aside
    @click.self="toggleFilters()"
    class="lode-catalog__sidebar"
    :class="{
      'lode-catalog__sidebar--toggle': windowWidth < 768,
      'lode-catalog__sidebar--opened': areFiltersOpened
    }"
  >
    <div
      v-if="windowWidth < toggledSidebarWidth"
      @click="toggleFilters()"
      class="lode-catalog__sidebar-open"
    >
      <p class="lode-catalog__sidebar-open-text">Фильтрация</p>
      <svg
        class="lode-catalog__sidebar-arrow"
        :class="{'lode-catalog__sidebar-arrow--closed': areFiltersOpened}"
      >
        <use xlink:href="#svg-sidebar-arrow"></use>
      </svg>
    </div>

    <div
      v-if="areSidebarFiltersLoading"
      class="lode-catalog__sidebar-loading"
    >
      <p class="lode-catalog__sidebar-loading-text">Обновление...</p>
    </div>
    <transition name="sidebar-list">
      <div
        class="lode-catalog__sidebar__list"
        v-show="windowWidth < toggledSidebarWidth ? areFiltersOpened : true"
      >
        <div
          v-for="(filter, index) in SIDEBAR_FILTERS"
          :key="filter._id"
          v-show="filter.variants.length"
          class="lode-catalog__sidebar-item"
        >
          <h1
            @click="TOGGLE_SIDEBAR_FILTER(index)"
            class="lode-catalog__sidebar-header"
          >
            <p class="lode-catalog__sidebar-title">{{ filter.name }}</p>
            <svg
              :class="{'lode-catalog__sidebar-arrow--closed': isFilterClosed(index)}"
              class="lode-catalog__sidebar-arrow"
            >
              <use xlink:href="#svg-sidebar-arrow"></use>
            </svg>
          </h1>
          <div
            v-show="!isFilterClosed(index)"
            class="lode-catalog__sidebar-settings"
          >
            <ul class="lode-catalog__sidebar-list">
              <li
                v-for="variant in filter.variants"
                :key="variant"
                class="lode-catalog__sidebar-list-item"
              >
                <lode-checkbox
                  :disabled="checkFilterAccess(filter, variant)"
                  :filterObject="filter"
                  :value="String(variant)"
                  :checkArray="stateTags"
                  v-model:tag="lastActiveTag"
                >{{ `${variant} ${filter.sign}` }}
                </lode-checkbox>
              </li>
            </ul>
          </div>
        </div>
      </div> <!-- /sidebar__list -->
    </transition>

  </aside>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'LodeCatalogSidebar',
  props: {
    createSidebarFilters: {
      type: Boolean,
      default: false,
    },
    updateSidebarFilters: {
      type: Boolean,
      default: false,
    },
    clearFilters: {
      type: Boolean,
      defalut: false,
    },
  },
  data() {
    return {
      // width
      toggledSidebarWidth: 768,
      windowWidth: window.innerWidth,

      // data
      selectedFilters: [],
      lastActiveTag: {},
      prerenderedSidebarFilters: [],
      areSidebarFiltersLoading: false,
      areFiltersOpened: false,
    };
  },
  computed: {
    ...mapGetters('products', ['SEARCHED_PRODUCTS', 'FILTERED_PRODUCTS', 'PREFILTERED_PRODUCTS']),
    ...mapGetters('search', ['WAS_SEARCHED']),
    ...mapGetters('filter', ['SIDEBAR_FILTERS', 'TAGS', 'TAGS_QUERY']),

    stateTags: {
      get() {
        return this.TAGS;
      },
      set(newValue) {
        this.ADD_TAG(newValue);
      },
    },
  },
  methods: {
    ...mapActions('products', [
      'GET_PREFILTERED_PRODUCTS_FROM_API',
      'SET_PREFILTERED_PRODUCTS',
      'SET_FILTERED_PRODUCTS',
    ]),
    ...mapActions('filter', [
      'CREATE_FILTER_SPECS',
      'TOGGLE_SIDEBAR_FILTER',
      'ADD_TAG',
      'REMOVE_TAG',
      'SET_TAGS_QUERY',
    ]),

    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    toggleFilters() {
      this.areFiltersOpened = !this.areFiltersOpened;

      return this.areFiltersOpened
        ? this.$emit('filtersOpened', true)
        : this.$emit('filtersOpened', false);
    },
    isFilterClosed(index) {
      return this.SIDEBAR_FILTERS[index].closed;
    },
    createTag(name, value) {
      return { name, value };
    },
    getQueryObject(tags) {
      let arr = [];
      [...tags].forEach(({ urlName: key, values }) => {
        arr.push([key, values.join('_')]);
      });
      return Object.fromEntries(arr);
    },
    checkTagExists(tag) {
      const { name: tagName, value: tagValue } = tag;
      let isTagExists = false;

      this.TAGS.forEach(({ name, values }) => {
        if (name === tagName && values.includes(tagValue)) isTagExists = true;
      });

      return isTagExists;
    },
    async getPrefilteredProducts() {
      const filter =
        '?' +
        Object.entries(this.TAGS_QUERY)
          .map((item) => item.join('='))
          .join('&');
      await this.GET_PREFILTERED_PRODUCTS_FROM_API(filter);
    },
    prerenderSidebarFilters(newProductsArray = []) {
      let set = new Set();
      let result = [];

      newProductsArray.forEach((product) => {
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
            if (
              item._id === specObjId &&
              !set.has(`${specObjId}${spec.specValue}`)
            ) {
              set.add(`${specObjId}${spec.specValue}`);
              item.variants.push(spec.specValue);
            }
          });
        });
      });

      this.prerenderedSidebarFilters = result;
    },
    updateSidebar() {
      this.areSidebarFiltersLoading = true;
      this.getPrefilteredProducts()
        .then((response) => {
          this.prerenderSidebarFilters(this.PREFILTERED_PRODUCTS);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.areSidebarFiltersLoading = false;
        });
    },
    checkFilterAccess(filter, value) {
      let result = true;

      if (!this.TAGS.length) {
        return false;
      }

      this.prerenderedSidebarFilters.forEach((preFilter) => {
        if (
          this.TAGS[0].name === filter.name ||
          (preFilter._id === filter._id && preFilter.variants.includes(value))
        ) {
          return (result = false);
        }
      });

      return result;
    },
    updateFilterSpecs() {
      this.areSidebarFiltersLoading = true;
      this.CREATE_FILTER_SPECS();
      this.areSidebarFiltersLoading = false;
    },
  },
  watch: {
    // Watching data
    lastActiveTag(newValue) {
      const { name: tagName, value: tagValue } = newValue;
      const isTagExists = this.checkTagExists(newValue);

      if (isTagExists) {
        this.REMOVE_TAG({ value: tagValue, name: tagName });
      } else {
        this.ADD_TAG(newValue);
      }
    },
    stateTags: {
      handler(newValue) {
        const stateTags = newValue;
        const queryObj = this.getQueryObject(stateTags);

        if (!stateTags.length) {
          this.SET_TAGS_QUERY({});
          this.SET_PREFILTERED_PRODUCTS([]);
          return;
        }

        this.SET_TAGS_QUERY(queryObj);
        this.updateSidebar();
      },
      deep: true,
    },

    // Watching computed
    searchedProducts() {
      this.updateFilterSpecs();
    },
    wasSearched(newValue) {
      return newValue ? (this.selectedFilters = []) : null;
    },

    // Watching props
    createSidebarFilters(newValue) {
      if (newValue) {
        this.updateFilterSpecs();
      }
    },
    updateSidebarFilters(newValue) {
      if (newValue) {
        this.updateFilterSpecs();
      }
    },
    clearFilters(newValue) {
      if (newValue) {
        this.SET_FILTERED_PRODUCTS([]);
      }
    },
  },
  emits: {
    filtersOpened: (value) => typeof value === 'boolean',
  },
  mounted() {
    addEventListener('resize', this.updateWindowWidth);

    if (this.PREFILTERED_PRODUCTS.length) {
      this.prerenderSidebarFilters(this.PREFILTERED_PRODUCTS);
    }
  },

  beforeUnmount() {
    removeEventListener('resize', this.updateWindowWidth);
  },
};
</script>

<style lang="scss">
.lode-catalog__sidebar {
  position: relative;
  width: 30%;
  margin-right: 3rem;
  height: auto;

  box-shadow: $block-shadow;
  border: 1px solid $grey;

  &-open {
    display: flex;
    align-items: center;

    position: absolute;
    transform: rotate(90deg);
    top: 15rem;
    right: -4.7rem;

    &-text {
      font-size: 1.6rem;
      margin-right: 1rem;
    }
  }

  &-loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;

    height: 100%;
    width: 100%;
    background-color: $grey-shadow;

    &-text {
      margin-top: 3rem;
      height: 100%;
      font-size: 1.8rem;
      text-transform: uppercase;
    }
  }

  &-item {
    border-bottom: 1px solid $grey;
    padding: 0 1rem 1rem 1rem;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;

    cursor: pointer;
  }

  &-settings {
    &--closed {
      display: none;
    }
  }

  &-title {
    font-weight: 500;
    font-size: 1.8rem;
    text-align: left;
    width: 70%;
  }

  &-list {
    &-item {
      display: flex;
      align-items: center;
    }
  }

  &-checkbox {
    line-height: 1;
  }

  &-arrow {
    height: 2rem;
    width: 2rem;

    transition: transform 0.2s linear;

    &--closed {
      transform: rotate(180deg);
    }
  }

  @include for-phone-down {
    & {
      padding-right: 3rem;
      transition: width 0.3s linear;

      &--toggle {
        width: 4%;
      }

      &--opened {
        width: 40%;
      }
    }

    &-title {
      font-size: 1.6rem;
    }

    &-item {
      border-right: 1px solid $grey;
    }
  }

  @include for-small-phone-down {
    & {
      margin-right: 1.5rem;
    }

    &-title {
      font-size: 1.3rem;
    }
  }
}

.sidebar-list {
  &-enter-active {
    transition: opacity 0.5s ease 0.2s;
  }

  &-leave-active {
    transition: opacity 0.2s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
