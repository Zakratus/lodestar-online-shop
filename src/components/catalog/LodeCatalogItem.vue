<template>
  <div
    class="lode-catalog-item"
    :class="{'lode-catalog-item--filters-opened': areFiltersOpened}"
  >
    <p class="lode-catalog-item__article">Артикул: {{ product.article }}</p>
    <div class="lode-catalog-item__flags">
      <div
        v-if="product.series"
        class="lode-catalog-item__series"
      >{{ product.series }}
      </div>
      <div
        v-else
        class="lode-catalog-item__series  lode-catalog-item__series--nothing"
      >1
      </div>
      <div
        class="lode-catalog-item__series lode-catalog-item__series--subseries"
        v-if="product.subseries"
      >{{ product.subseries }}
      </div>
    </div>
    <div class="lode-catalog-item__preview">
      <router-link :to="`/catalog/${product.article}`">
        <img
          :src="productImage"
          alt="item image"
          class="lode-catalog-item__image"
        >
      </router-link>
    </div>
    <h3
      @click="$router.push(`${categoryPath}`)"
      class="lode-catalog-item__category"
    >{{ productCategory }}</h3>
    <h1
      @click="$router.push(`/catalog/${product.article}`)"
      class="lode-catalog-item__name"
    >{{ product.name }}</h1>
    <h2 class="lode-catalog-item__price">{{ fixedPrice }} грн</h2>

    <div class="lode-catalog-item__buttons">
      <lode-button
        class="lode-catalog-item__cart-button"
        @click="addItemToCart()"
      >
        В корзину
      </lode-button>

      <lode-button-wishlist
        :isWishlistToggled="isWishlistToggled"
        :productId="product._id"
        @click="toggleProductInWishlist()"
      ></lode-button-wishlist>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { fixPrice } from '@/helpers/price';

export default {
  props: {
    product: {
      type: Object,
      default() {
        return {};
      },
      required: true,
    },
    areFiltersOpened: {
      type: Boolean,
      default: false,
    },
    addToWishlist: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isWishlistToggled: false,
    };
  },
  computed: {
    ...mapGetters('cart', ['CART_ID']),
    ...mapGetters('auth', ['USER', 'IS_USER_AUTH']),
    ...mapGetters('search', ['CATEGORIES']),
    ...mapGetters('userFeatures', ['WISHLIST']),
    categoryPath() {
      for (let category of this.CATEGORIES) {
        if (this.product.category === category._id) return category.path;
      }
    },
    fixedPrice() {
      return fixPrice(this.product.price);
    },
    productCategory() {
      let category = this.CATEGORIES.find((category) => {
        return this.product.category === category._id;
      });
      return category ? category.value : null;
    },
    productImage() {
      if (this.product.image) {
        return this.product.image.includes('http')
          ? this.product.image
          : require(`../../${this.product.image}`);
      }
    },
    isProductInWishlist() {
      return this.WISHLIST.find((product) => product._id === this.product._id);
    },
  },
  methods: {
    ...mapActions('userFeatures', ['ADD_ITEM_TO_WISHLIST', 'REMOVE_ITEM_FROM_WISHLIST', 'SET_WISHLIST']),
    ...mapActions('cart', ['ADD_TO_CART', 'SET_CART']),
    ...mapActions('filter', ['ADD_TAG']),

    addTagAndFilterProducts(tag) {
      this.ADD_TAG(tag);
    },
    addItemToCart() {
      if (this.IS_USER_AUTH) {
        this.ADD_TO_CART({ cartId: this.CART_ID, productId: this.product._id });
      } else {
        const newCart = this.addThisItemToLocalStorageCart();
        this.SET_CART(newCart);
      }
    },
    setCartToLocalStorage(cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    },
    addThisItemToLocalStorageCart() {
      const cart = JSON.parse(localStorage.getItem('cart'));
      const newProduct = {
        quantity: 1,
        product: this.product,
        id: this.product._id,
      };

      let newCart = [...cart];

      if (!newCart.length) {
        newCart.push(newProduct);
      } else {
        let isProductExsist = false;

        newCart.map((item) => {
          if (item.id === this.product._id) {
            isProductExsist = true;
            item.quantity += 1;
          }
        });

        if (!isProductExsist) {
          newCart.push(newProduct);
        }
      }

      this.setCartToLocalStorage(newCart);
      return newCart;
    },
    toggleProductInLocalStorageWishlist(item) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist'));
      const alreadyExists = wishlist.find(
        (product) => product._id === item._id,
      );
      let newWishlist = [];

      if (alreadyExists) {
        newWishlist = wishlist.filter((product) => product._id !== item._id);
      } else {
        newWishlist.push(...wishlist, item);
      }

      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    },
    async toggleProductInWishlist() {
      this.isWishlistToggled = true;

      if (!this.IS_USER_AUTH) {
        const newWishlist = this.toggleProductInLocalStorageWishlist(
          this.product,
        );
        this.SET_WISHLIST(newWishlist);

        setTimeout(() => {
          this.isWishlistToggled = false;
        }, 200);

        return;
      }

      if (this.isProductInWishlist) {
        await this.REMOVE_ITEM_FROM_WISHLIST({
          listId: this.USER.wishlist,
          itemId: this.product._id,
        });
      } else {
        await this.ADD_ITEM_TO_WISHLIST({
          listId: this.USER.wishlist,
          itemId: this.product._id,
        });
      }

      this.isWishlistToggled = false;
    },
  },
  watch: {
    addToWishlist(newValue) {
      if (!newValue) {
        return;
      }

      if (!this.IS_USER_AUTH) {
        this.toggleProductInWishlist();

        return setTimeout(() => {
          this.$emit('addedToWishlist');
        }, 200);
      }

      this.toggleProductInWishlist().then((res) => {
        this.$emit('addedToWishlist');
      });
    },
  },
  emits: {
    addedToWishlist: (value) => value === undefined,
  },
};
</script>

<style lang="scss">
.lode-catalog-item {
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 2rem 1rem;
  margin: 1rem 1rem;

  width: 22.5rem;
  max-width: 22.5rem;
  max-height: 42.1rem;

  border: 1px solid $grey;
  background-color: $white;

  transition: border 0.1s linear, border-color 0.1s linear,
  box-shadow 0.1s linear, height 0.2s linear;

  &:hover {
    border: 1px solid $accent-light;
    box-shadow: 0 3px 10px $accent-shadow;

    .lode-catalog-item__buttons {
      transform: translateY(95%);
      opacity: 1;
    }

    &__cart-button {
      opacity: 1;
    }
  }

  &__article {
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
    z-index: 0;

    font-size: 1rem;
    font-weight: 300;
    text-transform: uppercase;
    color: $grey;
  }

  &__flags {
    display: flex;
    justify-content: center;
  }

  &__series {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    margin-bottom: 1rem;
    margin-right: 0.5rem;

    font-weight: 700;
    color: $black-light;
    cursor: pointer;

    border: 2px solid $grey;

    &--subseries {
      border-color: $series-gold;
    }

    &--nothing {
      opacity: 0;
    }
  }

  &__preview {
    height: 22.5rem;
    width: 20rem;
    overflow: hidden;

    &:hover {
      .lode-catalog-item__image {
        transform: scale(1.18);
      }
    }
  }

  &__image {
    margin: 0 auto 1rem auto;
    max-height: 22.5rem;
    max-width: 20rem;

    cursor: pointer;

    transition: transform 0.5s ease;
  }

  &__category {
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-size: 1.2rem;
    color: #8d99ae;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__name {
    margin-bottom: 2rem;
    text-transform: uppercase;
    font-size: 1.6rem;
    font-weight: 700;
    color: $black;

    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__price {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    width: 90%;

    color: $accent;
    font-size: 1.6rem;
    font-weight: 700;

    transform: translateX(-50%);
  }

  &__buttons {
    display: flex;
    justify-content: space-evenly;
    padding-bottom: 1rem;
    position: absolute;
    bottom: 0;
    left: -1px;
    z-index: 10;
    width: calc(100% + 2px);
    opacity: 0;

    border-bottom: 1px solid $accent-light;
    border-right: 1px solid $accent-light;
    border-left: 1px solid $accent-light;
    background-color: #fff;
    box-shadow: 0 5px 10px -4px $accent-shadow;

    transition: transform 0.2s linear, opacity 0.1s linear;
  }

  &__cart-button {
    background-color: $accent;
    border-radius: 1.6em;
    border: 2px solid $accent;
    margin: 0;
    padding: 0.4em 1.2em;

    color: #fff;

    text-transform: uppercase;

    &:hover {
      background-color: #fff;
      border: 2px solid $accent;
      color: $accent;
    }
  }

  &__favourite-img {
    max-width: 3rem;
    cursor: pointer;

    transition: transform 0.1s linear;

    &:hover {
      transform: scale(1.08);
    }
  }

  /* Breakpoints */
  @include for-tablet-portrait-down {
    .carousel__slide > & {
      width: 100%;
    }

    & {
      width: calc(50% - 2rem);
    }
  }

  @include for-phone-down {
    &__preview {
      height: 20rem;
      min-height: 15rem;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__image {
      max-width: 100%;
    }

    &__flags {
      flex-wrap: wrap;
    }

    &__buttons {
      flex-wrap: wrap;
      padding-top: 1rem;
    }
  }

  @include for-small-phone-down {
    &--filters-opened {
      width: 100%;
    }

    &__article {
      margin-bottom: 0.5rem;
    }

    &__flags {
      margin-bottom: 1rem;
    }

    &__series {
      margin-bottom: 0;
      margin-right: 0;
      width: 100%;
      font-size: 1.2rem;

      &:first-child {
        margin-bottom: 0.5rem;
      }
    }

    &__preview {
      width: 100%;
    }

    &__image {
      max-width: 14rem;
      width: 100%;
    }

    &__name {
      font-size: 1.4rem;
    }

    &__price {
      font-size: 1.4rem;
    }

    .carousel__slide > & > &__name,
    .carousel__slide > & > &__price {
      font-size: 1.6rem;
    }
  }
}

.carousel__slide {
  .lode-catalog-item {
    height: 100%;
  }
}
</style>
