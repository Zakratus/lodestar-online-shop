<template>
  <div class="lode-cards">
    <div class="container">
      <div
        v-if="categoriesCards"
        class="lode-cards__categories"
      >
        <lode-cards-categories-item
          v-for="object in categories"
          :key="object._id"
          :itemsObject="object"
        />
      </div>
      <div
        v-if="seriesCards"
        class="lode-cards__series"
      />
    </div>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import LodeCardsCategoriesItem from "@/components/cards/LodeCardsCategoriesItem";

export default {
  components: {
    LodeCardsCategoriesItem,
  },
  props: {
    categoriesCards: {
      type: Boolean,
      default: false,
    },
    seriesCards: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('search', ["CATEGORIES"]),
    ...mapGetters('loadingConditions', ['ARE_CATEGORIES_LOADED']),
    categories() {
      if (this.categoriesCards && this.ARE_CATEGORIES_LOADED) {
        return [...this.CATEGORIES]
          .filter(
            (category) => category._id !== import.meta.env.VITE__CATEGORY_ALL_ID,
          )
          .reverse();
      }

      return [];
    },
  },
};
</script>

<style lang="scss">
.lode-cards {
  margin: 0 -1.5rem;

  &__categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
}
</style>
