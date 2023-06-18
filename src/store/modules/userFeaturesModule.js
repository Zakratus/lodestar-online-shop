import UserFeaturesService from "../../services/user-features.service";

export default {
  namespaced: true,
  state: () => ({
    wishlist: [],
    orders: []
  }),
  getters: {
    WISHLIST: (state) => state.wishlist,
    ORDERS: (state) => state.orders
  },
  mutations: {
    SET_WISHLIST: (state, products) => state.wishlist = products,
    SET_ORDERS: (state, orders) => state.orders = orders,
  },
  actions: {
    /* WISHLIST */
    SET_WISHLIST({ commit }, list) {
      commit('SET_WISHLIST', list);
    },
    // API request actions
    async GET_WISHLIST_FROM_API({ commit }, listId) {
      try {
        const wishlist = await UserFeaturesService.getWishlist(listId);

        commit('SET_WISHLIST', wishlist.products);
      } catch (err) {
        console.log(err);
      }
    },
    async ADD_ITEM_TO_WISHLIST({ commit }, { listId, itemId }) {
      try {
        const newWishlist = await UserFeaturesService.addWishlistItem(listId, itemId);

        commit('SET_WISHLIST', newWishlist.products);
      } catch (err) {
        console.log(err);
      }
    },
    async REMOVE_ITEM_FROM_WISHLIST({ commit }, { listId, itemId }) {
      try {
        const newWishlist = await UserFeaturesService.removeWishlistItem(listId, itemId);

        commit("SET_WISHLIST", newWishlist.products);
      } catch (err) {
        console.log(err);
      }
    },
    async REMOVE_ALL_ITEMS_FROM_WISHLIST({ commit }, listId) {
      try {
        const newWishlist = await UserFeaturesService.removeAllWishlistItems(listId);

        commit('SET_WISHLIST', newWishlist.products);
      } catch (err) {
        console.log(err);
      }
    },

    /* ORDERS */
    SET_ORDERS({ commit }, orders) {
      commit('SET_ORDERS', orders);
    },

    async GET_USERS_ORDERS_FROM_API({ commit }, userId) {
      try {
        const orders = await UserFeaturesService.getOrdersByUser(userId);

        commit('SET_ORDERS', orders);
      } catch (err) {
        console.log(err);
      }
    },
    async CREATE_ORDER({ commit }, { userId, products, orderData, userData }) {
      try {
        const updatedUser = await UserFeaturesService.createOrder(userId, products, orderData, userData);

        commit('SET_ORDERS', updatedUser.history);
        commit("SET_USER", updatedUser);
        return true
      } catch (err) {
        console.log(err);
        return false
      }
    },
    async CREATE_GUEST_ORDER({ commit }, { products, orderData, userData }) {
      try {
        const GUEST_USER_ID = process.env.VUE_APP_GUEST_USER_ID;
        await UserFeaturesService.createOrder(GUEST_USER_ID, products, orderData, userData);

        return true
      } catch (err) {
        console.log(err);
        return false
      }
    },

  }
}
