<template>
  <div class="main-page">
    <lode-main-section>
      <lode-cards :categoriesCards="true" />
    </lode-main-section>

    <lode-main-section>
      <template v-slot:title>
        Товары в топе продаж
      </template>
      <template v-slot:default>
        <lode-catalog-slider :products="SLIDER_PRODUCTS" />
      </template>
    </lode-main-section>

    <lode-register v-if="!IS_USER_AUTH" />
  </div>

</template>

<script>
import LodeCards from '@/components/cards/LodeCards';
import LodeMainSection from '@/components/main/LodeMainSection';
import LodeCatalogSlider from '@/components/catalog/LodeCatalogSlider';
import LodeRegister from '@/components/registration/LodeRegister';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    LodeCards,
    LodeMainSection,
    LodeCatalogSlider,
    LodeRegister,
  },
  computed: {
    ...mapGetters('products', ['SLIDER_PRODUCTS']),
    ...mapGetters('auth', ['IS_USER_AUTH']),
  },
  methods: {
    ...mapActions('products', ['GET_SLIDER_PRODUCTS_FROM_API']),
  },
  mounted() {
    this.GET_SLIDER_PRODUCTS_FROM_API();
  },
};
</script>

<style lang="scss">
.lode-cards__item-1 {
  margin: 0 1rem;
  width: 33.3%;
  height: 300px;

  background-color: #333;
}
</style>
