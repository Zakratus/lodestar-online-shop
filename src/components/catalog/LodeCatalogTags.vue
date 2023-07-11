<template>
  <div
    :class="{'lode-catalog__tags--active': tagsActive}"
    class="lode-catalog__tags"
  >
    <div class="lode-catalog__tags-wrapper">
      <transition-group name="tag-items">
        <div
          v-for="(tag, index) in TAGS"
          :key="tag.name"
          @click="removeTag(index, value)"
          class="lode-catalog__tags-item"
        >
          <p class="lode-catalog__tags-name">{{ tag.name }}: </p>
          <p
            v-for="value of tag.values"
            :key="value"
            class="lode-catalog__tags-value"
          >{{ value }} </p>
        </div>
      </transition-group>
    </div>
    <div class="lode-catalog__tags-buttons">
      <transition name="tag-result">
        <p
          @click="acceptFilters()"
          v-if="showResultButton"
          class="lode-catalog__tags-result"
        >
          Показать
        </p>
      </transition>

      <p
        @click="cleanAllFilters()"
        class="lode-catalog__tags-clear"
      >Очистить</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { updateFilterPath } from '@/helpers/router';

export default {
  name: 'lode-catalog-tags',
  data() {
    return {
      showResultButton: false,
      areTagsChangedWithLS: true,
    };
  },
  props: {
    clearFilters: {
      type: Boolean,
      defalut: false,
    },
  },
  computed: {
    ...mapGetters('filter', ['TAGS', 'TAGS_QUERY']),
    tags() {
      return this.TAGS;
    },
    tagsActive() {
      return this.showResultButton ? true : this.TAGS.length;
    },
  },
  methods: {
    ...mapActions('filter', ['REMOVE_TAG', 'REMOVE_ALL_TAGS']),

    removeTag(index, value) {
      this.REMOVE_TAG({ index, value });
      if (!this.TAGS.length) this.showResultButton = false;
    },
    acceptFilters() {
      updateFilterPath(this.$router, this.TAGS_QUERY);
      this.showResultButton = false;

      if (!this.TAGS.length) {
        this.$router.push('/catalog');
      } else {
        this.$emit('acceptFilters');
      }
    },
    setTagsInLocalStorage() {
      const tags = JSON.stringify(this.TAGS);
      localStorage.setItem('tags', tags);
    },
    cleanAllFilters() {
      this.REMOVE_ALL_TAGS();
      this.$router.push('/catalog');
    },
  },
  watch: {
    tags: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.showResultButton = true;
        } else {
          this.showResultButton = false;
        }
      },
      deep: true,
    },
    clearFilters(newValue) {
      if (newValue) {
        this.REMOVE_ALL_TAGS();
      }
    },
  },
  emits: {
    acceptFilters: (value) => value === undefined,
  },
  beforeUnmount() {
    this.setTagsInLocalStorage();
  },
  updated() {
    this.setTagsInLocalStorage();
  },
};
</script>

<style lang="scss">
.lode-catalog__tags {
  position: relative;
  display: flex;
  justify-content: space-between;
  min-height: 3.6rem;
  margin-bottom: 1rem;

  grid-area: tags;
  padding: 0 1rem;

  border: 1px solid $grey-light;
  border-radius: 2.3rem;

  transition: box-shadow 0.1s linear, border-color 0.1s linear;

  &--active {
    border-color: $grey;
    box-shadow: 0 0 10px $grey-shadow;
  }

  &-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  &-item {
    position: relative;
    display: inline-flex;
    padding: 0 0.5rem;
    margin: 0.5rem 1rem 0.5rem 0;
    width: auto;

    border: 1px solid $accent;
    border-radius: 1.5rem;
    line-height: 1.6;

    transition: box-shadow 0.1s linear, width 0.5s linear,
    text-decoration 0.2s linear, color 0.2s linear;

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 2;

      width: 0%;
      height: 1px;
      background-color: $accent;

      transform: translateY(-50%);
      transition: width 0.2s linear;
    }

    &:hover {
      box-shadow: 0 0 5px $accent-shadow;
      color: $black-shadow;
      cursor: pointer;

      &::after {
        width: 100%;
      }
    }
  }

  &-name,
  &-value {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-right: 0.3rem;
  }

  &-value {
    &:last-child {
      margin-right: 0;
    }
  }

  &-buttons {
    display: flex;
  }

  &-result {
    align-self: center;
    font-weight: 500;
    padding-right: 0.5rem;
    color: $accent;

    transition: text-shadow 0.1s linear;

    &:hover {
      cursor: pointer;
      text-shadow: 0 0 10px $accent-shadow;
    }
  }

  &-clear {
    align-self: center;

    color: $grey-light;
    transition: all 0.1s linear;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .lode-catalog__tags--active > .lode-catalog__tags-buttons > & {
      cursor: pointer;
      color: $black-half;

      &:hover {
        color: $black;
        text-decoration: underline;
      }
    }
  }

  @include for-phone-down {
    & {
      flex-wrap: wrap;
    }

    &-wrapper {
      width: 100%;
      justify-content: center;
    }

    &-buttons {
      width: 100%;
      justify-content: center;
      margin-bottom: 1rem;
    }
  }

  @include for-small-phone-down {
    &-item {
      flex-wrap: wrap;
      justify-content: center;
      font-size: 1.2rem;
    }

    &-name {
      width: 100%;
    }
  }
}

// Transition styles
.tag {
  &-items {
    &-enter-active,
    &-leave-active {
      transition: all 0.3s ease;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: translateY(-3rem);
    }

    &-move {
      transition: transform 0.3s ease;
    }
  }

  &-result {
    &-enter-active,
    &-leave-active {
      transition: all 0.3s ease;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: translateX(10rem);
    }
  }
}
</style>
