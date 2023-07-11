import AuthService from "@/services/auth.service";
import { API_URL } from "@/services/generic.service";
import UserService from "../../services/user.service";
import createErrorString from "@/helpers/errors";
import router from '@/router/router';
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    user: {},
    emailInput: '',
    passwordInput: '',
    isUserAuth: false,
    errorMessage: '',
    registrationEmail: '',
    registrationPassword: '',
    registrationErrorMessage: '',
    updatingUserMessage: ''
  }),
  getters: {
    USER: (state) => state.user,
    EMAIL_INPUT: (state) => state.emailInput,
    PASSWORD_INPUT: (state) => state.passwordInput,
    IS_USER_AUTH: (state) => state.isUserAuth,
    ERROR_MESSAGE: (state) => state.errorMessage,
    REGISTRATION_EMAIL: (state) => state.registrationEmail,
    REGISTRATION_PASSWORD: (state) => state.registrationPassword,
    REGISTRATION_ERROR_MESSAGE: (state) => state.registrationErrorMessage,
    UPDATING_USER_MESSAGE: (state) => state.updatingUserMessage,
  },
  mutations: {
    SET_USER: (state, user) => state.user = user,
    SET_EMAIL_INPUT: (state, email) => state.emailInput = email,
    SET_PASSWORD_INPUT: (state, password) => state.passwordInput = password,
    SET_USER_AUTH: (state, bool) => state.isUserAuth = bool,
    SET_ERROR_MESSAGE: (state, message) => state.errorMessage = message,
    SET_REGISTRATION_EMAIL: (state, email) => state.registrationEmail = email,
    SET_REGISTRATION_PASSWORD: (state, password) => state.registrationPassword = password,
    SET_REGISTRATION_ERROR_MESSAGE: (state, message) => state.registrationErrorMessage = message,
    SET_UPDATING_USER_MESSAGE: (state, message) => state.updatingUserMessage = message,
  },
  actions: {
    SET_USER({ commit }, user) {
      commit('SET_USER', user);
    },
    SET_EMAIL_INPUT({ commit }, email) {
      commit("SET_EMAIL_INPUT", email);
    },
    SET_PASSWORD_INPUT({ commit }, password) {
      commit("SET_PASSWORD_INPUT", password);
    },
    SET_USER_AUTH({ commit }, bool) {
      commit("SET_USER_AUTH", bool);
    },
    SET_REGISTRATION_EMAIL({ commit }, email) {
      commit('SET_REGISTRATION_EMAIL', email);
    },
    SET_REGISTRATION_PASSWORD({ commit }, password) {
      commit('SET_REGISTRATION_PASSWORD', password);
    },
    SET_REGISTRATION_ERROR_MESSAGE({ commit }, error) {
      commit("SET_REGISTRATION_ERROR_MESSAGE", error)
    },
    async LOGIN({ commit }, { email, password }) {
      try {
        const response = await AuthService.login(email, password);

        localStorage.setItem('token', response.data.accessToken);
        commit("SET_USER_AUTH", true);
        commit("SET_USER", response.data.user);
        commit("SET_ERROR_MESSAGE", '');

      } catch (err) {
        commit("SET_ERROR_MESSAGE", err.response?.data?.message);
        console.log(err.response?.data?.message);
      }
    },
    async REGISTRATION({ commit }, { email, password }) {
      try {
        const response = await AuthService.registration(email, password);
        localStorage.setItem('token', response.data.accessToken);
        commit("SET_USER_AUTH", true);
        commit("SET_USER", response.data.user);

        router.push('/registration/done')

      } catch (err) {
        const message = createErrorString(err.response?.data);

        console.log(message);
        commit("SET_REGISTRATION_ERROR_MESSAGE", message);
      }
    },
    async LOGOUT({ commit }) {
      try {
        const response = await AuthService.logout();
        localStorage.removeItem('token');
        commit("SET_USER_AUTH", false);
        commit("SET_USER", {});

      } catch (err) {
        commit("SET_ERROR_MESSAGE", err.response?.data?.message);
        console.log(err.response?.data?.message);
      }
    },
    async CHECK_AUTH({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/authentication/refresh`, { withCredentials: true });

        localStorage.setItem('token', response.data.accessToken);
        commit("SET_USER_AUTH", true);
        commit("SET_USER", response.data.user);

      } catch (err) {
        console.log(err);
      }
    },
    async UPDATE_USER({ commit }, { email, userData }) {
      try {
        const request = await UserService.updateUserData(email, userData);
        const newUser = request.data;

        commit("SET_USER", newUser);
        commit('SET_UPDATING_USER_MESSAGE', '');
      } catch (err) {
        const message = createErrorString(err.response?.data);
        console.log(message);
        commit('SET_UPDATING_USER_MESSAGE', message);
      }
    }
  }
}
