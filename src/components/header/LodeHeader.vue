<template>
  <lode-upper-header/>
  <header class="lode-header">
    <div class="container">
      <div class="lode-header__inner">
        <div class="lode-header__logo-wrepper">
          <img
            src="../../assets/Lodestar Logo.jpg"
            class="lode-header__logo"
            @click="$router.push('/')"
          >
        </div>
        <lode-header-search class="lode-header__search"></lode-header-search>
        <div class="lode-header__buttons">
          <div class="lode-header__wishlist">
            <router-link :to="'/wishlist'">
              <img
                :src="HeartWhiteSvgSrc"
                alt=""
                class="lode-header__wishlist-image"
              >
            </router-link>
          </div>
          <lode-header-cart/>
          <div
            @click="toggleNavBar()"
            class="lode-header__burger"
          >
            <div class="lode-header__burger-item"></div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <lode-header-navigation
    :showNavBar="showNavBar"
    @closeNavBar="toggleNavBar()"
  />
</template>

<script>
import LodeHeaderCart from "@/components/header/LodeHeaderCart";
import LodeHeaderNavigation from "@/components/header/LodeHeaderNavigation";
import LodeHeaderSearch from "@/components/header/LodeHeaderSearch";
import LodeUpperHeader from "@/components/header/LodeUpperHeader";
import { HeartWhiteSvgSrc } from "@/assets/icons";

export default {
  name: "LodeHeader",
  components: {
    LodeHeaderCart,
    LodeHeaderNavigation,
    LodeHeaderSearch,
    LodeUpperHeader,
  },
  data() {
    return {
      HeartWhiteSvgSrc,
      showNavBar: false,
    };
  },
  methods: {
    toggleNavBar() {
      this.showNavBar = !this.showNavBar;

      const body = document.querySelector("body");
      return !body.style.overflow
        ? (body.style.overflow = "hidden")
        : (body.style.overflow = "");
    },
  },
  watch: {
    showNavBar(newValue) {
      const main = document.querySelector(".main-wrapper");
      if (newValue) {
        main.addEventListener("click", this.toggleNavBar, { once: true });
      } else {
        main.removeEventListener("click", this.toggleNavBar);
      }
    },
  },
};
</script>

<style lang="scss">
.lode-header {
  display: block;
  padding: 1.5rem 0;
  background-color: $secondary;
  border-bottom: 4px solid $accent;
  color: $white;

  &__inner {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
  }

  &__logo {
    width: 80%;
    cursor: pointer;

    &-wrepper {
      display: flex;
      justify-content: flex-start;
      width: 25%;
    }
  }

  &__search {
    width: 50%;
    padding: 1.5rem 0;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    width: 25%;
  }

  &__wishlist {
    display: flex;
    justify-content: flex-end;
    padding: 1.5rem 0;
    width: 50%;

    &-image {
      max-width: 3.5rem;
      cursor: pointer;

      transition: transform 0.1s linear;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  &__burger {
    display: none;
    position: relative;
    width: 0;

    &-item {
      display: block;
      position: absolute;
      top: 50%;
      right: 0;
      z-index: 10;

      width: 50%;
      height: 3px;

      background-color: $white;
      transform: translateY(-50%);

      &::before,
      &::after {
        display: block;
        position: absolute;
        left: 0;
        z-index: 11;

        content: "";
        height: 3px;
        width: 100%;

        background-color: $white;
      }

      &::before {
        top: -10px;
      }

      &::after {
        top: 10px;
      }
    }
  }

  /* Breakpoints */

  @include for-tablet-portrait-down {
    & {
      margin-bottom: 1.5rem;
    }

    &__logo {
      width: 95%;
    }

    &__search {
      &-select {
        padding: 0 0.5rem;
      }
    }

    &__wishlist {
      width: calc(100% / 3);
    }

    &__burger {
      width: calc(100% / 3);
      display: block;
    }
  }

  @include for-phone-down {
    &__inner {
      flex-wrap: wrap;
    }

    &__logo-wrepper {
      width: 100%;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    &__logo {
      max-width: 70%;
      width: auto;
      max-height: 5.8rem;
    }

    &__search {
      width: 80%;

      &-select {
        padding: 0 1.5rem;
      }
    }

    &__wishlist {
      justify-content: center;
    }

    &__burger-item {
      right: 50%;
      transform: translate(50%, -50%);
    }

    &__buttons {
      width: 70%;
      justify-content: space-evenly;
    }

    &__wishlist,
    &__burger {
      width: 6.5rem;
    }
  }

  @include for-small-phone-down {
    &__search {
      width: 100%;

      &-select {
        padding: 0 0.5rem;
      }
    }
  }
}
</style>
