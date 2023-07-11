<template>
  <h1 v-if="IS_PRODUCT_LOADING">Товар грузиться...</h1>
  <div
    v-else
    class="container"
  >
    <div class="lode-product">
      <div class="lode-product__visual">
        <h2
          v-if="ARE_PRODUCT_IMAGES_LOADING"
          class="lode-images-loading"
        >Фотографии грузятся...</h2>
        <Carousel
          v-else
          :items-to-show="1"
        >
          <Slide
            v-for="image in fullProductImages"
            :key="image._id"
          >
            <img
              :src="require(`../${image.path}`)"
              :alt="image.name"
              class="lode-product__image"
            >
          </Slide>
          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>
      <div class="lode-product__info">
        <h1 class="lode-product__name">{{ PRODUCT.name }}</h1>
        <h2 class="lode-product__price">
          <span class="lode-product__label">Цена:</span>
          {{ fixedPrice }} грн
        </h2>
        <div class="lode-product__available">
          <span class="lode-product__label">Есть в наличии:</span>
          <p class="lode-product__available-sign">Да</p>
        </div>
        <div class="lode-product__brand">
          <span class="lode-product__label">Брeнд:</span>
          <p class="lode-product__attentions">{{ PRODUCT.brand }}</p>
        </div>
        <div class="lode-product__description">
          <span class="lode-product__label">Описание:</span>
          <p class="lode-product__text">{{ PRODUCT.description }}</p>
        </div>
        <div class="lode-product__specs">
          <span class="lode-product__label">Характеристики:</span>
          <ul class="lode-product__specs-list">
            <li
              v-for="spec in PRODUCT.specifications"
              :key="spec._id"
              class="lode-product__specs-item"
            >
              <span class="lode-product__specs-label">{{ spec.specObj.name }}</span>:
              {{ spec.specValue }} {{ spec.specObj.sign }}
            </li>
          </ul>
        </div>
        <div class="lode-product__navigation">
          <lode-button
            @click="buyProduct()"
            class="lode-product__button"
          >Купить
          </lode-button>
          <lode-button
            @click="addToCart()"
            class="lode-product__button"
          >Добавить в корзину
          </lode-button>
          <lode-button-wishlist
            :isWishlistToggled="isWishlistToggled"
            :productId="PRODUCT._id"
            @click="addToWishlist"
          ></lode-button-wishlist>
        </div>
      </div>
    </div> <!-- /lode-product -->

    <lode-catalog-item
      v-show="false"
      :product="PRODUCT"
      :addToWishlist="isWishlistToggled"
      @addedToWishlist="addedToWishlist"
    ></lode-catalog-item>

    <div class="lode-product__else">
      <h2 class="lode-product__else-title">
        Возможно вас это заинтересует
      </h2>
      <lode-catalog-slider :products="PRODUCTS" />
    </div>

  </div> <!-- /container  -->

  <lode-register v-if="!IS_USER_AUTH"></lode-register>

</template>

<script>
// Carousel
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

// Components
import LodeCatalogSlider from '@/components/catalog/LodeCatalogSlider';
import LodeRegister from '@/components/registration/LodeRegister';
import LodeCatalogItem from '@/components/catalog/LodeCatalogItem';

// Other
import { mapActions, mapGetters } from 'vuex';
import { fixPrice } from '@/helpers/price';

export default {
  components: {
    LodeCatalogSlider,
    Carousel,
    Slide,
    Pagination,
    Navigation,
    LodeRegister,
    LodeCatalogItem,
  },
  props: {
    article: {
      type: String,
      default: '',
      require: true,
    },
  },
  data() {
    return {
      isWishlistToggled: false,
    };
  },
  computed: {
    ...mapGetters('product', ['PRODUCT', 'PRODUCT_IMAGES', 'IS_PRODUCT_LOADING', 'ARE_PRODUCT_IMAGES_LOADING']),
    ...mapGetters('products', ['PRODUCTS']),
    ...mapGetters('cart', ['CART_ID']),
    ...mapGetters('auth', ['IS_USER_AUTH']),

    fixedPrice() {
      return this.PRODUCT.price ? fixPrice(this.PRODUCT.price) : null;
    },
    fullProductImages() {
      return this.PRODUCT_IMAGES.length ? this.PRODUCT_IMAGES : [];
    },
  },
  methods: {
    ...mapActions('product', ['GET_PRODUCT_FROM_API', 'GET_PRODUCT_IMAGES_FROM_API']),
    ...mapActions('products', ['GET_PRODUCTS_FROM_API']),
    ...mapActions('cart', ['SET_CART', 'ADD_TO_CART']),

    addItemToLocalStorageCart(product) {
      let cart = JSON.parse(localStorage.getItem('cart'));
      let newCart = [...cart];
      if (newCart.length) {
        let isProductExsist = false;

        newCart.map((item) => {
          if (item.id === product._id) {
            isProductExsist = true;
            item.quantity += 1;
          }
        });

        if (!isProductExsist) {
          let newProduct = {
            quantity: 1,
            product: product,
            id: product._id,
          };
          newCart.push(newProduct);
        }
      } else {
        let newProduct = {
          quantity: 1,
          product: product,
          id: product._id,
        };
        newCart.push(newProduct);
      }

      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    },
    addToCart() {
      if (this.IS_USER_AUTH) {
        this.ADD_TO_CART({ cartId: this.CART_ID, productId: this.PRODUCT._id });
      } else {
        const newCart = this.addItemToLocalStorageCart(this.PRODUCT);
        this.SET_CART(newCart);
      }
    },
    buyProduct() {
      this.addToCart();
      this.$router.push('/cart');
    },
    addToWishlist() {
      this.isWishlistToggled = true;
    },
    addedToWishlist() {
      this.isWishlistToggled = false;
    },
  },
  beforeMount() {
    this.GET_PRODUCT_FROM_API(this.article).then((res) => {
      this.GET_PRODUCT_IMAGES_FROM_API();
      this.GET_PRODUCTS_FROM_API(this.PRODUCT.category);
    });
  },
  beforeRouteUpdate(to, from, next) {
    let article = to.params.article;

    this.GET_PRODUCT_FROM_API(article)
      .then((res) => {
        return this.GET_PRODUCT_IMAGES_FROM_API();
      })
      .then((res) => {
        return this.GET_PRODUCTS_FROM_API(this.PRODUCT.category);
      })
      .then((res) => {
        next();
      });
  },
};
</script>

<style lang="scss">
.lode-product {
  display: flex;
  justify-content: center;

  &__visual {
    display: block;
    width: 40%;
    padding: 1.5rem;
    margin-right: 3%;
    max-height: 42rem;
  }

  &__image {
    max-height: 35rem;
  }

  &__info {
    padding: 1.5rem;
    width: 57%;

    border: 1px solid $grey;
    box-shadow: $block-shadow;

    * {
      text-align: left;
    }
  }

  &__name {
    margin-bottom: 1.5rem;
    font-size: 2.4rem;
    font-weight: 600;
    color: $black;
  }

  &__price {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 500;
  }

  &__label {
    font-weight: 700;
    margin-right: 0.5rem;
  }

  &__available,
  &__brand {
    display: flex;
  }

  &__available,
  &__brand,
  &__description,
  &__specs {
    margin-bottom: 1rem;
  }

  &__description {
    text-align: left;
  }

  &__specs {
    &-label {
      text-decoration: underline;
    }
  }

  &__navigation {
    display: flex;
  }

  &__else {
    padding: 3rem 0;

    &-title {
      margin: 2rem 0;

      font-size: 1.8rem;
      font-weight: 700;
      text-align: start;
      text-transform: uppercase;
    }
  }

  &__button {
    text-align: center;
    width: 50%;
    background-color: $accent;
    border: 1px solid $accent;
    color: $white;

    &:hover {
      background-color: $white;
      color: $black;
      border-color: $black;
    }
  }

  /* Breakpoints */
  @include for-tablet-portrait-down {
    & {
      flex-wrap: wrap;
      justify-content: center;
    }

    &__visual {
      width: 50%;
      margin-right: 0;
    }

    &__info {
      width: 100%;
    }
  }

  @include for-phone-down {
    &__visual {
      width: 100%;
    }
  }

  @include for-small-phone-down {
    &__navigation {
      flex-wrap: wrap;
      justify-content: center;
    }

    &__button {
      width: 39%;
      padding: 0.4em 1.1em;
      margin-bottom: 1rem;
      margin-top: 1rem;
    }
  }

  .carousel {
    // Arrows
    &__prev {
      left: 3rem;
    }

    &__next {
      right: 3rem;
    }

    @include for-small-phone-down {
      &__prev {
        left: 1rem;
      }

      &__next {
        right: 1rem;
      }
    }
  }
}
</style>
