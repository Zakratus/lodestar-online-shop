<template>
  <div class="container">
    <div
      v-if="IS_USER_AUTH"
      class="lode-profile"
    >
      <h1 class="lode-profile__title">Личная информация</h1>

      <div class="lode-profile__inner">
        <div class="lode-profile__labels">
          <p
            v-for="label in dataNames"
            :key="label"
            class="lode-profile__labels-item"
          >{{ label }}:</p>
        </div>

        <div class="lode-profile__inputs">

          <!-- v-for start -->
          <div
            v-for="[name,data] in userData"
            :key="name"
            class="lode-profile__inputs-item"
          >
            <p
              v-if="isDataChanging(name, data)"
              class="lode-profile__inputs-item-text"
            >
              {{ data }}
              <button @click="openDataChange(name)">Изм.</button>
            </p>
            <div
              v-else
              class="lode-profile__inputs-change"
            >
              <lode-input
                v-model="inputs[name]"
                class="input--default lode-profile__input"
              ></lode-input>
              <div class="lode-profile__inputs-buttons">
                <lode-button
                  class="btn--hover-darker lode-profile__inputs-button"
                  @click="closeDataChange(name)"
                >Отменить
                </lode-button>
              </div>
            </div>
          </div>
          <!-- v-for end -->

        </div>
      </div> <!-- /lode-profile__inner -->
      <lode-button
        class="lode-profile__inputs-button lode-profile__inputs-button--update btn--accent-color btn--hover-lighten"
        v-if="showUpdateButton"
        @click="updateUserData(USER.email, userDataToSave)"
      >Сохранить изменения
      </lode-button>
      <h2
        v-if="UPDATING_USER_MESSAGE.length"
        class="lode-profile__message-error"
      >{{ UPDATING_USER_MESSAGE }}</h2>
      <h2
        v-if="showEmailMessage"
        class="lode-progile__message"
      >Для активации вашего аккаунта перейдите по ссылке, которую мы отправили вам на почту.</h2>

    </div> <!-- /lode-profile -->
    <h1
      v-else
      class="lode-profile__unauthorized"
    >Вы не зарегистрированы!<br>Пройдите процедуру регистрации</h1>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LodeInput from '@/components/UI/LodeInput.vue';
import LodeButton from '../components/UI/LodeButton.vue';

export default {
  components: {
    LodeInput,
    LodeButton,
  },
  data() {
    return {
      dataNames: [
        'Имя',
        'Фамилия',
        'Электронная почта',
        'Номер телефона',
        'Отделение почты',
      ],
      inputs: {
        name: '',
        surname: '',
        phone: '',
        email: '',
      },
      dataChangeState: {
        name: false,
        surname: false,
        phone: false,
        email: false,
      },
      showMessage: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['IS_USER_AUTH', 'USER', 'UPDATING_USER_MESSAGE']),
    isUserAuth: {
      get() {
        return this.IS_USER_AUTH;
      },
    },
    userData() {
      return Object.entries({
        name: this.USER.name,
        surname: this.USER.surname,
        email: this.USER.email,
        phone: this.USER.phone,
      });
    },
    userDataToSave() {
      return Object.fromEntries(
        Object.entries(this.inputs).filter(([name, data]) => data.length),
      );
    },
    showUpdateButton() {
      return Object.values(this.dataChangeState).includes(true);
    },
    showEmailMessage() {
      return this.showMessage && !this.UPDATING_USER_MESSAGE.length;
    },
  },
  methods: {
    ...mapActions('auth', ['UPDATE_USER']),
    isDataChanging(name, data) {
      return data.length ? !this.dataChangeState[name] : false;
    },
    openDataChange(name) {
      this.inputs[name] = this.USER[name];
      return (
        this.dataChangeState[name] = true
      );
    },
    closeDataChange(name) {
      this.inputs[name] = '';
      return (
        this.dataChangeState[name] = false
      );
    },
    updateUserData(email, userData) {
      for (let key in userData) {
        if (userData[key] === this.USER[key]) {
          return;
        }
      }

      this.UPDATE_USER({ email, userData });

      for (let key in this.dataChangeState) {
        this.dataChangeState[key] = false;
        this.inputs[key] = '';
      }

      if ('email' in userData) {
        this.showMessage = true;
      }
    },
  },
};
</script>

<style lang="scss">
.lode-profile {
  border: 1px solid $grey;
  padding: 3rem;
  box-shadow: $block-shadow;

  &__inner {
    display: flex;
    margin: 0 auto;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-weight: 500;
    font-size: 2.6rem;
    margin-bottom: 1.5rem;
  }

  &__labels,
  &__inputs {
    width: 25%;
    text-align: left;

    &-item {
      margin-bottom: 1rem;
      height: 2.5rem;

      &-text {
        position: relative;
        height: 2.5rem;
      }
    }
  }

  &__labels {
    width: 25%;
  }

  &__inputs {
    &-change {
      position: relative;
    }

    &-buttons {
      position: absolute;
      right: -11rem;
      top: 50%;
      z-index: 2;
      transform: translateY(-54%);
      display: flex;
    }

    &-button {
      padding: 0.3rem 1rem;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 1rem 0 0;

      &--update {
        padding: 0.5rem 1.5rem;
        font-size: 1.4rem;
      }
    }
  }

  &__message {
    font-size: 1.4rem;
    font-weight: 700;

    &-error {
      color: $error;
    }
  }

  /* Breakpoints */
  @include for-tablet-portrait-down {
    &__labels,
    &__inputs {
      width: 50%;

      &-item {
        margin-bottom: 4rem;
      }

      &-buttons {
        right: auto;
        top: auto;
        left: 0;
        bottom: -4.5rem;
      }
    }

    &__inputs {
      &-item {
        &-text {
          button {
            position: absolute;
            left: 0;
            bottom: -2rem;
          }
        }
      }
    }

    &__input {
      width: 50%;
      padding: 0 0.5rem;
    }

    &__labels {
      padding-left: 25%;
    }
  }

  @include for-phone-down {
    &__labels {
      padding-left: 15%;
    }

    &__input {
      width: 100%;
      padding: 0 0.5rem;
    }
  }

  @include for-small-phone-down {
    & {
      padding: 1.5rem;
    }

    &__labels {
      padding-left: 0;
    }
  }
}
</style>
