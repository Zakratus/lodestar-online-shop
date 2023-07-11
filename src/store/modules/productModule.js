import ProductService from "@/services/products.service";
import ImageService from "@/services/images.service";
import { fixProductArticle } from "@/helpers/article";

export default {
  namespaced: true,
  state: () => ({
    product: {},
    isProductLoading: false,
    productImages: [],
    areProductImagesLoading: true,
    relatedProducts: [],
  }),
  getters: {
    PRODUCT: (state) => state.product,
    IS_PRODUCT_LOADING: (state) => state.isProductLoading,
    PRODUCT_IMAGES: (state) => state.productImages,
    ARE_PRODUCT_IMAGES_LOADING: (state) => state.areProductImagesLoading,
    RELATED_PRODUCTS: (state) => state.relatedProducts,
  },
  mutations: {
    SET_PRODUCT: (state, product) => state.product = product,
    SET_PRODUCT_LOADING: (state, bool) => state.isProductLoading = bool,
    SET_PRODUCT_IMAGES: (state, images) => state.productImages = images,
    SET_PRODUCT_IMAGES_LOADING: (state, bool) => state.areProductImagesLoading = bool,
    SET_RELATED_PRODUCTS: (state, products) => state.relatedProducts = products,
  },
  actions: {
    async GET_PRODUCT_FROM_API({ commit }, article) {
      try {
        commit("SET_PRODUCT_LOADING", true);

        let product = await ProductService.getProduct(article);
        product.article = fixProductArticle(product.article);

        commit("SET_PRODUCT", product);
      } catch (err) {
        console.log(err);
      } finally {
        commit("SET_PRODUCT_LOADING", false);
      }
    },
    async GET_PRODUCT_IMAGES_FROM_API({ commit, state }) {
      commit("SET_PRODUCT_IMAGES_LOADING", true);
      let imagesId = state.product.images;
      let images = [];

      for (let id of imagesId) {
        let image = await ImageService.getImage(id);
        images.push(image);
      }

      commit("SET_PRODUCT_IMAGES", images);
      commit("SET_PRODUCT_IMAGES_LOADING", false);
    },

  }
}
