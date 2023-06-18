<template>
  <lode-catalog
    :updateSidebarFilters="updateSidebarFilters"
    :category="selectedCategory"
    :clearFilters="clearFilters"
  />
</template>

<script>
import LodeCatalog from "@/components/catalog/LodeCatalog";
import { getQueryStringWithinRouterHook } from "@/helpers/router";
import { mapActions } from "vuex";

export default {
  components: {
    LodeCatalog,
  },
  data() {
    return {
      selectedCategory: "61ef07be51a966f430d29f13",
      query: {},
      updateSidebarFilters: false,
      clearFilters: false,
    };
  },
  methods: {
    ...mapActions('products', ["GET_FILTERED_PRODUCTS_FROM_API"]),
    ...mapActions('filter', ["SET_TAGS"]),

    updateTags() {
      const tags = JSON.parse(localStorage.getItem("tags"));
      return tags ? this.SET_TAGS(tags) : null;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let filterString = getQueryStringWithinRouterHook(to);
      console.log(filterString);

      if (filterString.includes("&page")) {
        filterString = filterString.split("&page")[0];
      }

      if (from.path !== "/catalog") {
        vm.GET_FILTERED_PRODUCTS_FROM_API(filterString).then((res) => {
          vm.updateTags();
        });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.clearFilters = true;
    next();
  },
};
</script>

<style>
</style>
