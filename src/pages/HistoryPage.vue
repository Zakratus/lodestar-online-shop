<template>
  <div class="lode-history">
    <div class="container">
      <h1 class="lode-history__title">История заказов</h1>
      <div class="lode-history__labels">
        <div
          v-for="(value, key) in labels"
          :key="key"
          class="lode-history__label"
        >{{ value }}
        </div>
      </div>
      <ul class="lode-history__list">
        <li
          v-for="{_id ,orderData} in ORDERS"
          :key="_id"
          class="lode-history__item"
        >
          <router-link
            to="/"
            class="lode-history__item-number"
          >
            <p>№{{ getTimestamp(orderData.time) }}</p>
          </router-link>

          <div class="lode-history__item-date">{{ orderDate(getTimestamp(orderData.time)) }}</div>
          <div class="lode-history__item-quantity">{{ orderData.itemsQuantity }} шт.</div>
          <div class="lode-history__item-total-cost">{{ orderData.totalCost }} грн.</div>
          <div class="lode-history__item-status">Выполнен</div>
          <div class="lode-history__item-post-number">Самовывоз</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getDateFromTimestamp } from '@/helpers/time';

export default {
  name: 'history-page',
  data() {
    return {
      isHistoryLoading: true,
      showLoadingError: false,
      labels: {
        number: '№ Заказа',
        date: 'Дата заказа',
        quantity: 'Количество товаров',
        totalCost: 'Сумма заказа',
        status: 'Статус',
        postNumber: 'Номер отправки',
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['USER', 'IS_USER_AUTH']),
    ...mapGetters('userFeatures', ['ORDERS']),
    isUserAuth() {
      return this.IS_USER_AUTH;
    },
  },
  methods: {
    ...mapActions('userFeatures', ['GET_USERS_ORDERS_FROM_API']),
    getTimestamp(orderTime) {
      return Number(new Date(orderTime));
    },
    orderDate(timestamp) {
      return getDateFromTimestamp(timestamp);
    },
  },
  watch: {
    isUserAuth() {
      this.GET_USERS_ORDERS_FROM_API(this.USER.id).then((res) => {
        this.isHistoryLoading = false;
      });
    },
  },
  mounted() {
    if (this.IS_USER_AUTH) {
      this.GET_USERS_ORDERS_FROM_API(this.USER.id).then((res) => {
        this.isHistoryLoading = false;
      });
    }
  },
};
</script>

<style lang="scss">
.lode-history {
  &__title {
    font-size: $h1-size;
    font-weight: 700;
    margin-bottom: 3rem;
  }

  &__labels {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 2rem;
  }

  &__label {
    width: calc(100% / 6);
    font-weight: 500;
    color: $black-half;
  }

  &__item {
    display: flex;
    justify-content: center;
    padding: 1rem 0;
    border: 1px solid $grey;
    margin-bottom: 1rem;
    box-shadow: $block-shadow;
    transition: box-shadow 0.1s linear;

    &:hover {
      box-shadow: $modal-shadow;
    }

    &-number,
    &-date,
    &-quantity,
    &-total-cost,
    &-status,
    &-post-number {
      width: calc(100% / 6);
    }

    &-number {
      color: $accent;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    &-total-cost {
      font-weight: 500;
    }
  }
}
</style>
