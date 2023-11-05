<template>
  <div class="lode-cart-order">
    <div class="container">
      <div
        v-if="CART.length"
        class="lode-cart-order__inner"
      >
        <h1 class="lode-cart-order__title">Оформление заказа</h1>
        <div class="lode-cart-order__contacts">
          <h2 class="lode-cart-order__contacts-title">Контактные данные</h2>
          <div
            v-for="(name, key) in contactsInfo"
            :key="key"
            class="lode-cart-order__row"
          >
            <label
              :for="'order' + key"
              class="lode-cart-order__label"
            >{{ contactsInfoLabels[key] }}*
            </label>
            <lode-input
              type="text"
              :id="'order' + key"
              class="lode-cart-order__input"
              v-model="contactsInfo[key]"
            />
          </div>
        </div>
        <div class="lode-cart-order__info">
          <h2 class="lode-cart-order__info-title">Итого</h2>

          <ul
            class="lode-cart-order__products"
            :class="{'lode-cart-order__products--scroll': CART.length > 3}"
          >
            <li
              v-for="item in CART"
              :key="item._id"
              class="lode-cart-order__product"
            >
              <div class="lode-cart-order__product-picture">
                <img
                  :src="getCartItemImage(item.product)"
                  alt=""
                  class="lode-cart-order__product-image"
                >
              </div>
              <div class="lode-cart-order__product-name">
                <router-link
                  :to="{path: `/catalog/${item.product.article}`}"
                  class="lode-cart-order__product-name"
                >
                  <h3>{{ item.product.name }}</h3>
                </router-link>
                <p class="lode-cart-order__product-quantity">{{ item.quantity }} шт.</p>
              </div>
              <p class="lode-cart-order__product-price">{{ getProductItemPrice(item) }} грн.</p>
            </li>
          </ul>

          <p class="lode-cart-order__info-quantity">Общее количество товаров:
            <span>{{ cartQuantityItems }} шт.</span>
          </p>
          <p class="lode-cart-order__info-cost">Итоговая сумма заказа:
            <span>{{ cartTotalCost }} грн.</span>
          </p>
        </div> <!-- /lode-cart-order__info -->

        <lode-button
          @click="submitOrder(USER.id, CART, createOrderData(), contactsInfo)"
          class="lode-cart-order__button btn--accent-color  btn--hover-lighten"
        >Подтвердить заказ
        </lode-button>
        <p class="lode-cart-order__warning">Регистрируясь и оформляя заказ, я принимаю условия пользовательского
          соглашения
        </p>
      </div>

      <div
        v-else
        class="lode-cart-order__done"
      >
        <h2 class="lode-cart-order__done-title">Спасибо за заказ</h2>
        <p class="lode-cart-order__done-message">С вами скоро свяжутся для подтверждения заказа.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { fixPrice, getNumberFromPrice } from '@/helpers/price';

export default {
  name: 'lode-cart-order',
  data() {
    return {
      contactsInfo: {
        name: '',
        phone: '',
        email: '',
        post: '',
      },
      contactsInfoLabels: {
        name: 'Имя',
        phone: 'Телефон',
        email: 'Електронная почта',
        post: 'Номер отделения почты',
      },
      orderCreated: false,
    };
  },
  computed: {
    ...mapGetters('cart', ['CART']),
    ...mapGetters('auth', ['USER', 'IS_USER_AUTH']),

    cartQuantityItems() {
      return this.CART.length
        ? this.CART.reduce((acc, item) => acc + item.quantity, 0)
        : 0;
    },

    cartTotalCost() {
      return this.CART.length
        ? fixPrice(
          this.CART.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0,
          ),
        )
        : 0;
    },
  },

  methods: {
    ...mapActions('cart', ['DELETE_ALL_FROM_CART', 'SET_CART']),
    ...mapActions('userFeatures', ['CREATE_ORDER', 'CREATE_GUEST_ORDER']),

    completeContactsInfo(user) {
      for (let name in this.contactsInfo) {
        this.contactsInfo[name] = user[name];
      }
    },

    getCartItemImage(cartItem) {
      return cartItem?.image?.includes('http')
        ? cartItem.image
        : `/src/${cartItem.image}`;
    },

    getProductItemPrice(cartItem) {
      return fixPrice(cartItem.quantity * cartItem.product.price);
    },

    createOrderData() {
      return {
        time: Date.now(),
        totalCost: getNumberFromPrice(this.cartTotalCost),
        itemsQuantity: this.cartQuantityItems,
      };
    },

    deleteAllFromLocalStorageCart() {
      localStorage.setItem('cart', JSON.stringify([]));
      this.SET_CART([]);
    },

    async submitOrder(userId, products, orderData, userData) {
      if (this.IS_USER_AUTH) {
        const created = await this.CREATE_ORDER({
          userId,
          products,
          orderData,
          userData,
        });

        return created ? this.DELETE_ALL_FROM_CART(this.USER.cart) : null;
      } else {
        const created = await this.CREATE_GUEST_ORDER({
          products,
          orderData,
          userData,
        });

        return created ? this.deleteAllFromLocalStorageCart() : null;
      }
    },
  },

  mounted() {
    if (this.IS_USER_AUTH) {
      this.completeContactsInfo(this.USER);
    }
  },
};
</script>

<style lang="scss">
.lode-cart-order {
  &__inner {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__title {
    width: 100%;
    font-weight: 700;
    margin-bottom: 3rem;
    font-size: $h1-size;
  }

  &__contacts {
    width: 50%;
    padding-right: 2rem;
  }

  &__contacts,
  &__info {
    &-title {
      margin-bottom: 2rem;
      font-size: $h2-size;
      font-weight: 500;
    }
  }

  &__info {
    width: 50%;
    padding-left: 2rem;
    margin-bottom: 2rem;

    &-quantity,
    &-cost {
      margin-bottom: 0.5rem;

      span {
        font-weight: 600;
      }
    }
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__label {
    width: 25%;
    text-align: left;
  }

  &__input {
    width: 70%;
    border: 1px solid $grey;
    padding: 1rem 2rem;
    height: auto;

    transition: border-color 0.2s linear, box-shadow 0.1s linear;

    &:focus-visible {
      border-color: $accent;
      box-shadow: 0 0 10px $accent-shadow;
    }
  }

  &__products {
    margin-bottom: 2rem;
    max-height: 30rem;
    border-bottom: 2px solid $accent;
    border-top: 2px solid $accent;

    &--scroll {
      overflow: scroll;
    }
  }

  &__product {
    height: 8rem;
    display: flex;
    align-items: center;

    border-bottom: 1px solid $grey;

    &-picture {
      width: 20%;
      height: 100%;
    }

    &-image {
      max-height: 100%;
      max-width: 100%;
    }

    &-name {
      width: 60%;
    }

    &-price {
      width: 20%;
    }

    &-quantity {
      color: $grey-dark;
    }
  }

  &__warning {
    margin-top: 1rem;
    width: 100%;
  }

  &__done {
    &-title {
      font-size: 2.2rem;
      font-weight: 600;
      margin-bottom: 2rem;
    }

    &-message {
      font-size: 1.6rem;
    }
  }

  /* Breakpoints */
  @include for-phone-down {
    &__contacts,
    &__info {
      width: 100%;
    }

    &__contacts {
      padding-right: 0;
    }

    &__info {
      padding-left: 0;
    }
  }

  @include for-small-phone-down {
    &__contacts,
    &__info {
      width: 100%;
      margin-bottom: 2rem;
    }

    &__product {
      &-picture {
        display: flex;
      }

      &-image {
        margin: auto 0;
      }
    }

    &__label {
      font-size: 1.3rem;
    }
  }
}
</style>
