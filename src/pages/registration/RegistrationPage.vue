<template>
  <div class="container">
    <div class="lode-registration">
      <h1 class="lode-registration__title">Создать учетную запись</h1>
      <div class="lode-registration__form">
        <label for="registration-email">E-mail *</label>
        <lode-input
          id="registration-email"
          class="lode-registration__input"
          v-model="registrationEmail"
        ></lode-input>
        <label for="registration-password">Пароль *</label>
        <lode-input
          id="registration-password"
          class="lode-registration__input"
          v-model="registrationPassword"
          type="password"
        ></lode-input>
        <label for="registration-password-second">Повторите пароль *</label>
        <lode-input
          id="registration-password-second"
          class="lode-registration__input"
          v-model="passwordSecond"
          type="password"
        ></lode-input>

        <h2 v-if="REGISTRATION_ERROR_MESSAGE">{{ REGISTRATION_ERROR_MESSAGE }}</h2>

        <lode-button
          @click="checkedRegistration"
          class="lode-registration__button btn--registration  btn--hover-lighten"
        >Зарегестрироваться
        </lode-button>
      </div>
      <div class="lode-registration__advantages">
        <h2 class="lode-registration__advantages-title">Преимущества зарегистрированного пользователя:</h2>
        <ul class="lode-registration__advantages-list">
          <li
            v-for="advantage in advantages"
            :key="advantage"
            class="lode-registration__advantages-item"
          >{{ advantage }}
          </li>

        </ul>
      </div>
    </div>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import LodeInput from '@/components/UI/LodeInput.vue';
import LodeButton from '@/components/UI/LodeButton.vue';

export default {
  components: {
    LodeInput,
    LodeButton,
  },
  data() {
    return {
      passwordSecond: '',
      advantages: [
        'Сохранение личных данных',
        'Отслеживание заказов на персональной странице',
        'Возможность настроить магазин под себя для более удобных покупок',
        'Ускоренное оформление последующих заказов',
      ],
    };
  },
  computed: {
    ...mapGetters('auth', [
      'REGISTRATION_EMAIL',
      'REGISTRATION_PASSWORD',
      'REGISTRATION_ERROR_MESSAGE',
    ]),
    registrationEmail: {
      set(modelValue) {
        this.SET_REGISTRATION_EMAIL(modelValue);
      },
      get() {
        return this.REGISTRATION_EMAIL;
      },
    },
    registrationPassword: {
      set(modelValue) {
        this.SET_REGISTRATION_PASSWORD(modelValue);
      },
      get() {
        return this.REGISTRATION_PASSWORD;
      },
    },
  },
  methods: {
    ...mapActions('auth', [
      'REGISTRATION',
      'SET_REGISTRATION_EMAIL',
      'SET_REGISTRATION_PASSWORD',
      'SET_REGISTRATION_ERROR_MESSAGE',
    ]),
    checkedRegistration() {
      if (this.REGISTRATION_PASSWORD === this.passwordSecond) {
        this.REGISTRATION({
          email: this.REGISTRATION_EMAIL,
          password: this.REGISTRATION_PASSWORD,
        });
      } else {
        this.SET_REGISTRATION_ERROR_MESSAGE('Пароли не совпадают');
      }
    },
  },
};
</script>

<style lang="scss">
.lode-registration {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  &__form {
    width: 50%;
    padding-right: 3rem;
    text-align: left;
  }

  &__advantages {
    width: 50%;
    padding-left: 3rem;
    text-align: left;

    &-title {
      font-size: 1.8rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    &-list {
      list-style: circle;
    }

    &-item {
      margin-bottom: 0.5rem;
    }
  }

  &__title {
    width: 100%;
    margin-bottom: 2rem;

    font-size: 2.2rem;
    font-weight: 700;
    text-align: left;
  }

  &__input {
    margin-bottom: 1rem;
    border: 1px solid $grey;

    transition: border-color 0.2s linear, box-shadow 0.1s linear;

    &:focus-visible {
      border-color: $accent;
      box-shadow: 0 0 10px $accent-shadow;
    }
  }

  &__button {
    margin: 0;
    font-size: 1.4rem;
    background-color: $accent;
    border-color: $white;
    color: $white;
  }

  @include for-phone-down {
    &__title {
      text-align: center;
    }

    &__form,
    &__advantages {
      width: 100%;
    }

    &__form {
      margin-bottom: 3rem;
    }
  }
}
</style>
