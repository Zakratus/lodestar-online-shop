<template>
  <footer class="lode-footer">
    <div class="container">
      <div class="lode-footer__upper">

        <div class="lode-footer__upper-column">
          <h1 class="lode-footer__upper-column-title">Про нас</h1>
          <div class="lode-footer__about">
            <p class="lode-footer__about-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem voluptates voluptas doloremque nostrum praesentium assumenda illo ea laudantium libero itaque, dolorem nesciunt! Temporibus exercitationem at repudiandae quidem.</p>
          </div>
        </div>

        <div class="lode-footer__upper-column">
          <h1 class="lode-footer__upper-column-title">Категории</h1>
          <ul class="lode-footer__links">
            <li
              v-for="category in footerCategories"
              :key="category._id"
              class="lode-footer__links-item"
            >
              <router-link :to="{path: category.path}">
                {{ category.value }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="lode-footer__upper-column">
          <h1 class="lode-footer__upper-column-title">Информация</h1>
          <ul class="lode-footer__links">
            <li class="lode-footer__links-item">
              <router-link :to="'/'">Про нас</router-link>
            </li>
            <li class="lode-footer__links-item">
              <router-link :to="'/'">Контакты</router-link>
            </li>
            <li class="lode-footer__links-item">
              <router-link :to="'/'">Заказ и возврат</router-link>
            </li>
            <li class="lode-footer__links-item">
              <router-link :to="'/'">Условия и договора</router-link>
            </li>
          </ul>
        </div>

        <div class="lode-footer__upper-column">
          <h1 class="lode-footer__upper-column-title">Услуги</h1>
          <ul class="lode-footer__links">
            <li
              v-if="IS_USER_AUTH"
              class="lode-footer__links-item"
            >
              <router-link :to="'/profile'">Мой профиль</router-link>
            </li>
            <li
              v-else
              class="lode-footer__links-item"
            >
              <router-link :to="'/registration'">Регистрация</router-link>
            </li>
            <li class="lode-footer__links-item">
              <router-link :to="'/cart'">Посмотреть корзину</router-link>
            </li>
            <li class="lode-footer__links-item">
              <router-link :to="'/'">Сохраненные товары</router-link>
            </li>
            <li class="lode-footer__links-item">
              <router-link :to="'/'">Отследить заказ</router-link>
            </li>
            <li class="lode-footer__links-item">
              <router-link :to="'/'">Помощь</router-link>
            </li>
          </ul>
        </div>
      </div>

    </div> <!-- .container -->

    <div class="lode-footer__bottom">
      <div class="container">
        <ul class="lode-footer__bottom-list">
          <li class="lode-footer__bottom-item">
            <img
              class="lode-footer__bottom-img"
              :src="MapSvgSrc"
              alt=""
            >
            г.Киев, Харковское Шоссе, 201/203
          </li>
          <li class="lode-footer__bottom-item">
            <img
              class="lode-footer__bottom-img"
              :src="PhoneSvgSrc"
              alt=""
            >
            096-000-00-00
          </li>
          <li class="lode-footer__bottom-item">
            <img
              class="lode-footer__bottom-img"
              :src="MailSvgSrc"
              alt=""
            >
            mail@gmail.com
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex';
// SVG
import { PhoneSvgSrc, MailSvgSrc, MapSvgSrc } from '@/assets/icons';

export default {
  components: {
    PhoneSvgSrc,
    MailSvgSrc,
    MapSvgSrc,
  },
  data() {
    return {
      PhoneSvgSrc,
      MailSvgSrc,
      MapSvgSrc,
    };
  },
  computed: {
    ...mapGetters('search', ['CATEGORIES']),
    ...mapGetters('auth', ['IS_USER_AUTH']),
    footerCategories() {
      const INVALID_CATEGORY_NAME = 'Все категории';
      return [...this.CATEGORIES].filter(
        (category) => category.name !== INVALID_CATEGORY_NAME,
      );
    },
  },
};
</script>

<style lang="scss">
.lode-footer {
  background-color: $secondary;
  border-top: 3px solid $accent;
  box-shadow: -10px 0 10px $grey-shadow;
  padding: 5rem 0 0 0;
  font-size: 1.5rem;
  color: $grey-light;
  margin-top: 3rem;

  &__upper {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5rem;

    &-column {
      width: 20%;
      text-align: left;

      &:first-child {
        width: 25%;
      }

      &-title {
        font-weight: 700;
        font-size: 2.2rem;
        color: $white;
        margin-bottom: 1rem;
      }
    }
  }

  &__links {
    a {
      color: $grey-light;
      text-decoration: none;
      transition: color 0.1s linear;

      &:hover {
        color: $accent-light;
      }
    }
  }

  &__bottom {
    padding: 1.5rem 0;
    background-color: $secondary-light;

    &-item {
      margin-right: 2rem;
    }

    &-list {
      display: flex;
      justify-content: center;
    }

    &-text {
      margin-bottom: 1rem;
    }

    &-img {
      height: 15px;
      width: 15px;
      margin-right: 0.5rem;
    }
  }

  @include for-small-phone-down {
    & {
      padding: 3rem 0 0 0;
    }

    &__upper {
      flex-wrap: wrap;
      padding: 0 5rem;

      &-column {
        text-align: center;
        width: 100%;
        margin-bottom: 3rem;

        &:first-child {
          width: 100%;
        }
      }
    }

    &__bottom {
      &-list {
        flex-wrap: wrap;
      }

      &-item {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
