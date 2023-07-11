<template>
  <lode-button
    :class="{'lode-button-wishlist--add-item': isWishlistToggled}"
    class="lode-button-wishlist"
  >
    <img
      :src="wishlistSVG"
      alt=""
      class="lode-catalog-item__favourite-img"
    >
  </lode-button>
</template>

<script>
import { HeartFillSvgSrc, HeartSvgSrc } from '@/assets/icons';
import { mapGetters } from 'vuex';

export default {
  name: 'lode-button-wishlist',
  props: {
    isWishlistToggled: {
      type: Boolean,
      default: false,
    },
    productId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // SVG
      HeartFillSvgSrc,
      HeartSvgSrc,
    };
  },
  computed: {
    ...mapGetters('userFeatures', ['WISHLIST']),
    wishlistSVG() {
      return this.WISHLIST.find((product) => product._id === this.productId)
        ? this.HeartFillSvgSrc
        : this.HeartSvgSrc;
    },
  },
};
</script>

<style lang="scss">
.lode-button-wishlist {
  border-radius: 50%;
  padding: 0.7rem;
  border: none;
  margin: 0;

  &--add-item {
    background-color: $accent-shadow;
    box-shadow: 0 0 10px $accent-shadow;
    transform: scale(1.1);
  }
}
</style>
