<template>
  <div class="lode-catalog__slider">
    <h1
      class="lode-catalog__slider-loading"
      v-if="IS_PRODUCTS_LOADING"
    >Товары грузятся...</h1>
    <Carousel
      v-if="products.length"
      :settings="carouselSettings"
      :breakpoints="carouselBreakpoints"
    >
      <Slide
        v-for="product in products"
        :key="product._id"
      >
        <lode-catalog-item :product="product" />
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<script>
// Carousel
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
// Others
import LodeCatalogItem from '@/components/catalog/LodeCatalogItem';
import { mapGetters } from 'vuex';

export default {
  name: 'LodeCatalogSlider',
  components: {
    LodeCatalogItem,
    Carousel,
    Slide,
    Navigation,
  },
  props: {
    products: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
  },
  data() {
    return {
      carouselSettings: {
        mouseDrag: false,
        snapAlign: 'start',
        transition: 500,
        // autoplay: 5000,
        // pauseAutoplayOnHover: true,
      },
      carouselBreakpoints: {
        992: {
          itemsToShow: 4,
          itemsToScroll: 4,
        },
        576: {
          itemsToShow: 3,
          itemsToScroll: 3,
        },
        0: {
          itemsToShow: 2,
          itemsToScroll: 2,
        },
      },
    };
  },
  computed: {
    ...mapGetters('products', ['IS_PRODUCTS_LOADING']),
  },
};
</script>

<style lang="scss">
.lode-catalog__slider {
  width: 100%;
  height: 49rem;

  &-loading {
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
  }

  .carousel {
    &__viewport {
      height: 49rem;
    }

    // Arrows
    &__prev,
    &__next {
      top: auto;
      bottom: -1rem;
      z-index: 1;

      border-radius: 0;
      height: 2rem;
      width: 2rem;
    }

    &__prev {
      left: auto;
      right: 6rem;
    }

    &__next {
      right: 3rem;
    }

    @include for-small-phone-down {
      &__viewport {
        height: 55rem;
      }
    }
  }

  @include for-small-phone-down {
    & {
      height: 54rem;
    }
  }
}
</style>
