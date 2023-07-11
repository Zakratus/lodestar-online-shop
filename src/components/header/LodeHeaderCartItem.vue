<template>
  <slot></slot>
  <li class="lode-header__cart-item">
    <img
      class="lode-header__cart-item-image"
      :src="cartItemImage"
      alt=""
    >
    <div class="lode-header__cart-item-info">
      <p
        @click="$router.push(`/catalog/${cartItem.article}`)"
        class="lode-header__cart-item-name"
      >{{ shorterName(cartItem.name) }}</p>
      <p class="lode-header__cart-item-price">{{ fixedPrice }} грн</p>
      <p class="lode-header__cart-item-quantity">{{ quantity }} шт.</p>
    </div>
    <button
      class="lode-header__cart-item-btn"
      @click="deleteFromCart()"
    >X
    </button>
  </li>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { substringProductName } from '@/helpers/name';
import { fixPrice } from '@/helpers/price';

export default {
  name: 'LodeHeaderCartItem',
  props: {
    cartItem: {
      type: Object,
      default() {
        return {};
      },
      require: true,
    },
    cartId: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      default: 1,
      require: true,
    },
    itemIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapGetters('auth', ['IS_USER_AUTH']),
    fixedPrice() {
      return fixPrice(this.cartItem?.price);
    },
    cartItemImage() {
      return this.cartItem?.image?.includes('http')
        ? this.cartItem.image
        : require(`../../${this.cartItem.image}`);
    },
  },
  methods: {
    ...mapActions('cart', ['DELETE_FROM_CART', 'SET_CART']),
    shorterName(name) {
      return substringProductName(name);
    },
    deleteItemFromLocalStorageCart() {
      let newCart = JSON.parse(localStorage.getItem('cart'));
      newCart.splice(this.itemIndex, 1);

      localStorage.setItem('cart', JSON.stringify(newCart));

      return newCart;
    },
    deleteFromCart() {
      if (this.IS_USER_AUTH) {
        return this.DELETE_FROM_CART({
          cartId: this.cartId,
          productId: this.cartItem._id,
        });
      } else {
        const newCart = this.deleteItemFromLocalStorageCart();
        this.SET_CART(newCart);
      }
    },
  },
};
</script>

<style lang="scss">
.lode-header__cart-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  padding: 0.5rem 1rem;

  height: auto;
  border-bottom: 1px solid $grey;
  color: $black;

  transition: box-shadow 0.1s ease;

  &:hover {
    box-shadow: 0 0 5px $black-shadow;
  }

  &:last-child {
    border-bottom: none;
  }

  &-image {
    margin-right: 2rem;
    width: 20%;
  }

  &-info {
    display: flex;
    flex-wrap: wrap;
    width: 80%;
  }

  &-name {
    width: 100%;
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &-price {
    font-weight: 500;
    width: 50%;
  }

  &-quantity {
    width: 50%;
  }

  &-button {
    width: 10%;
  }
}
</style>
