<template>
  <div class="lode-wishlist">
    <div class="container">
      <h1 class="lode-wishlist__title">
        Избранные товары
      </h1>
      <div class="lode-wishlist__info">
        <p class="lode-wishlist__total-cost">
          {{ WISHLIST.length }} товаров на сумму {{ wishlistCost }} грн
        </p>

        <lode-button
          class="lode-wishlist__button"
          :class="{'lode-wishlist__button--disabled': !WISHLIST.length}"
          @click="deleteAllItems()"
        >Удалить всё
        </lode-button>
      </div>
      <div
        v-if="WISHLIST.length"
        class="lode-wishlist__list"
      >
        <lode-catalog-item
          v-for="product in WISHLIST"
          :key="product._id"
          :product="product"
        />
      </div>
      <h2
        v-else
        class="lode-wishlist__empty"
      >В Избранном пусто.</h2>
    </div>
  </div>

</template>

<script>
import LodeCatalogItem from '@/components/catalog/LodeCatalogItem';
import { mapGetters, mapActions } from 'vuex';
import { fixPrice } from '@/helpers/price';
import LodeButton from '@/components/UI/LodeButton.vue';

export default {
  components: {
    LodeCatalogItem,
    LodeButton,
  },
  computed: {
    ...mapGetters('userFeatures', ['WISHLIST']),
    ...mapGetters('auth', ['USER', 'IS_USER_AUTH']),
    wishlistCost() {
      return this.WISHLIST.length
        ? fixPrice(
          this.WISHLIST.reduce((acc, product) => acc + product.price, 0),
        )
        : 0;
    },
  },
  methods: {
    ...mapActions('userFeatures', ['REMOVE_ALL_ITEMS_FROM_WISHLIST', 'SET_WISHLIST']),
    deleteAllItems() {
      if (this.WISHLIST.length) {
        if (this.IS_USER_AUTH) {
          return this.REMOVE_ALL_ITEMS_FROM_WISHLIST(this.USER.wishlist);
        } else {
          const wishlist = JSON.stringify([]);
          localStorage.setItem('wishlist', wishlist);
          this.SET_WISHLIST([]);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.lode-wishlist {
  &__title {
    font-size: 2.4rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }

  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: $block-shadow;
    border: 1px solid $grey;
    padding: 1.5rem 1.5rem;
    margin-bottom: 3rem;

    font-size: 1.6rem;
  }

  &__button {
    font-weight: 400;
    border: none;
    padding: 0;
    vertical-align: middle;
    cursor: pointer;

    &:hover {
      color: $accent;
      text-decoration: underline;
    }

    &--disabled {
      color: $grey;
      cursor: auto;

      &:hover {
        color: $grey;
        text-decoration: none;
      }
    }
  }

  &__list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__empty {
    font-size: 1.6rem;
  }
}
</style>
