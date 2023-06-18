import CartService from "@/services/cart.service";

export default {
  namespaced: true,
  state: () => ({
    cart: [],
    cartId: '',
  }),
  getters: {
    CART: (state) => state.cart,
    CART_ID: (state) => state.cartId,
  },
  mutations: {
    SET_CART: (state, cart) => state.cart = cart,
    SET_CART_ID: (state, cartId) => state.cartId = cartId,
    SET_ITEM_TO_CART: (state, product) => {
      if (state.cart.length) {
        let isProductExists = false;
        state.cart.map(item => {
          if (item._id === product._id) {
            isProductExists = true;
            item.quantity++
          }
        })
        if (!isProductExists) {
          state.cart.push(product);
        }
      } else {
        state.cart.push(product);
      }
    },
    DEL_ITEM_FROM_CART: (state, index) => {
      state.cart[index].quantity = 1;
      state.cart.splice(index, 1);
    },
    DECREMENT_LOCAL_CART_ITEM: (state, index) => {
      if (state.cart[index].quantity > 1) {
        state.cart[index].quantity -= 1;
      }
    },
    INCREMENT_LOCAL_CART_ITEM: (state, index) => state.cart[index].quantity += 1,
  },
  actions: {
    async GET_CART_FROM_API({ commit }, id) {
      try {
        const cart = await CartService.getCart(id);
        commit('SET_CART', cart.products);
        commit("SET_CART_ID", cart._id);
      } catch (err) {
        console.log(err);
      }
    },
    async ADD_TO_CART({ commit }, { cartId, productId }) {
      try {
        const newCart = await CartService.addCartItem(cartId, productId);

        commit('SET_CART', newCart)

      } catch (err) {
        console.log(err);
      }
    },
    async INCREMENT_CART_ITEM({ commit }, { cartId, productId }) {
      try {
        const newCartProducts = await CartService.incrementCartItem(cartId, productId);
        commit('SET_CART', newCartProducts);

      } catch (err) {
        console.log(err);
      }
    },
    async DECREMENT_CART_ITEM({ commit }, { cartId, productId, quantity }) {
      try {
        if (quantity > 1) {
          const newCartProducts = await CartService.decrementCartItem(cartId, productId);
          commit('SET_CART', newCartProducts);
        }

      } catch (err) {
        console.log(err);
      }
    },
    async DELETE_FROM_CART({ commit }, { cartId, productId }) {
      try {
        const newCartProducts = await CartService.deleteCartItem(cartId, productId);
        commit('SET_CART', newCartProducts);

      } catch (err) {
        console.log(err);
      }
    },
    async DELETE_ALL_FROM_CART({ commit }, cartId) {
      try {
        const newCartProducts = await CartService.deleteAllFromCart(cartId);

        commit('SET_CART', newCartProducts);
      } catch (err) {
        console.log(err);
      }
    },
    SET_CART({ commit }, cart) {
      commit("SET_CART", cart);
    },
  }
}
