<template>
  <div class="lode-upper-header">
    <div class="container">
      <div class="lode-upper-header__inner">

        <!-- Header Left -->
        <div class="lode-upper-header__left">

          <div class="lode-upper-header__left-item">
            <img
              :src="PhoneSvgSrc"
              class="lode-upper-header__image"
            >
            <a
              href=""
              class="lode-upper-header__link"
            >096-000-00-00
            </a>
          </div>
          <div class="lode-upper-header__left-item">
            <img
              :src="MailSvgSrc"
              class="lode-upper-header__image"
            >
            <a
              href=""
              class="lode-upper-header__link"
            >mail@gmail.com
            </a>
          </div>
          <div class="lode-upper-header__left-item">
            <img
              :src="MapSvgSrc"
              class="lode-upper-header__image"
            >
            <a
              href=""
              class="lode-upper-header__link"
            >г.Киев, Харковское Шоссе, 201/203
            </a>
          </div>

        </div>
        <!-- /Header Left -->

        <!-- Header Right -->
        <div class="lode-upper-header__right">
          <img
            :src="ProfilSvgSrc"
            class="lode-upper-header__image"
          >
          <a
            @click.stop="toggleProfileModal()"
            class="lode-upper-header__link"
          >Мой кабинет
          </a>

          <!-- Modal -->
          <div
            @click.stop=""
            v-if="showProfileModal"
            class="lode-upper-header__modal"
          >
            <div
              v-if="!IS_USER_AUTH"
              class="lode-upper-header__auth"
            >
              <h2 class="lode-upper-header__auth-title">Вы не авторизованы</h2>
              <lode-input
                @keydown.enter.prevent="LOGIN({email, password})"
                v-model="email"
                placeholder="E-mail"
                class="input--login"
              ></lode-input>
              <lode-input
                @keydown.enter.prevent="LOGIN({email, password})"
                v-model="password"
                placeholder="Пароль"
                class="input--login"
                type="password"
              ></lode-input>
            </div>
            <div
              v-else
              class="lode-upper-header__profile"
            >
              <router-link
                class="lode-upper-header__profile-link"
                to="/profile"
              >Личные данные
              </router-link>
              <router-link
                class="lode-upper-header__profile-link"
                to="/history"
              >История заказов
              </router-link>
              <router-link
                class="lode-upper-header__profile-link"
                to="/wishlist"
              >Избранные товары
              </router-link>
              <router-link
                class="lode-upper-header__profile-link"
                to="/cart"
              >Корзина
              </router-link>
            </div>
            <h2
              v-if="ERROR_MESSAGE?.length && !IS_USER_AUTH"
              class="lode-upper-header__error-message"
            >{{ ERROR_MESSAGE }}</h2>

            <!-- AUTHED Button -->
            <lode-button
              @click="logoutAndUpdateCart()"
              v-if="IS_USER_AUTH"
              class="btn--upper-header  btn--hover-lighten"
            >Выйти
            </lode-button>
            <!-- /AUTHED Button  -->

            <!-- NOT AUTHED Buttons -->
            <lode-button
              @click="LOGIN({email, password})"
              v-if="!IS_USER_AUTH"
              class="btn--upper-header  btn--hover-lighten"
            >Войти
            </lode-button>
            <lode-button
              v-if="!IS_USER_AUTH"
              class="btn--upper-header  btn--hover-lighten"
              @click="toRegistrationPage"
            >Регистрация
            </lode-button>
            <!-- /NOT AUTHED Buttons -->

          </div>
          <!-- /Modal -->

        </div>
        <!-- /Header Right -->

      </div>
    </div>
  </div>
</template>

<script>
import LodeButton from '@/components/UI/LodeButton';
import LodeInput from '@/components/UI/LodeInput.vue';
import { mapActions, mapGetters } from 'vuex';
// SVG
import {
  PhoneSvgSrc,
  MailSvgSrc,
  MapSvgSrc,
  ProfilSvgSrc,
} from '@/assets/icons';

export default {
  name: 'LodeUpperHeader',
  components: {
    LodeButton,
    LodeInput,
  },
  data() {
    return {
      showProfileModal: false,
      // SVG
      PhoneSvgSrc,
      MailSvgSrc,
      MapSvgSrc,
      ProfilSvgSrc,
    };
  },
  computed: {
    ...mapGetters('auth', ['EMAIL_INPUT', 'PASSWORD_INPUT', 'IS_USER_AUTH', 'ERROR_MESSAGE']),
    email: {
      set(modelValue) {
        this.SET_EMAIL_INPUT(modelValue);
      },
      get() {
        return this.EMAIL_INPUT;
      },
    },
    password: {
      set(modelValue) {
        this.SET_PASSWORD_INPUT(modelValue);
      },
      get() {
        return this.PASSWORD_INPUT;
      },
    },
  },
  methods: {
    ...mapActions('auth', ['SET_EMAIL_INPUT', 'SET_PASSWORD_INPUT', 'LOGIN', 'LOGOUT']),
    ...mapActions('cart', ['SET_CART']),
    toggleProfileModal() {
      document
        .querySelector('body')
        .addEventListener('click', () => (this.showProfileModal = false), {
          once: true,
        });

      this.showProfileModal = !this.showProfileModal;
    },
    toRegistrationPage() {
      this.$router.push('/registration');
    },
    logoutAndUpdateCart() {
      this.LOGOUT();
      this.SET_CART(JSON.parse(localStorage.getItem('cart')));
    },
  },
};
</script>

<style lang="scss">
.lode-upper-header {
  padding: 1rem 0;
  background-color: $secondary-light;

  &__inner {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  &__left {
    display: flex;
    width: 80%;

    &-item {
      display: flex;
      align-items: baseline;
      justify-content: center;
      text-align: left;
    }

    .lode-upper-header__link {
      margin-right: 1rem;
    }
  }

  &__right {
    position: relative;
    width: 20%;
    text-align: right;
  }

  &__link {
    text-decoration: none;
    color: $white;
    transition: color 0.1s ease;
    cursor: pointer;

    &:hover {
      color: $accent;
    }
  }

  &__image {
    margin-right: 0.5rem;
    width: 1.2rem;
    height: 1.2rem;
  }

  &__modal {
    position: absolute;
    top: 2.5rem;
    right: 0;
    z-index: 100;

    padding: 1rem;
    width: 20rem;

    background-color: $white;
    border-radius: 3px;
    box-shadow: $modal-shadow;
  }

  &__auth-title {
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  &__profile {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    &-link {
      text-decoration: none;
      color: $black;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__error-message {
    font-size: 1.4rem;
    font-weight: 500;
    color: $error;
  }

  @include for-phone-down {
    &__left {
      display: flex;
      justify-content: center;
      align-items: baseline;
      width: auto;
    }

    &__right {
      width: 42%;
    }

    &__inner {
      height: 42px;
    }
  }

  @include for-small-phone-down {
    &__left {
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
      flex-wrap: wrap;
    }

    &__right {
      align-self: center;
      width: 50%;
    }

    &__inner {
      height: 42px;
    }
  }
}
</style>
