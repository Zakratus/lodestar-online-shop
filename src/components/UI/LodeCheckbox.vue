<template>
  <div
    class="lode-checkbox__inner"
    :class="{'lode-checkbox__inner--disabled': disabled}"
  >
    <input
      class="lode-checkbox"
      id="checkbox"
      type="checkbox"
      :disabled="disabled"
      :value="value"
      :checked="isInputChecked"
      @change="event => onInputChange(event.target.value)"
    >
    <label
      class="lode-checkbox-custom"
      for="checkbox"
    ></label>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'lode-checkbox',
  props: {
    // Array that should be searched in
    checkArray: {
      type: Array,
      default: () => [],
      require: true,
    },

    // Value of checkbox
    value: {
      type: String,
      default: null,
    },

    // {name: "", values: []}
    filterObject: {
      type: Object,
      default: () => null,
    },
    tag: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isInputChecked: false,
    };
  },
  methods: {
    onInputChange(value) {
      if (this.filterObject) {
        const { name, urlName } = this.filterObject;
        this.$emit('update:tag', { name, value, urlName });
      } else {
        this.$emit('update:tag', value);
      }
      this.$emit('change');
    },
    isChecked() {
      if (this.checkArray.length) {
        for (let item of this.checkArray) {
          if (item.values?.includes(this.value)) {
            this.isInputChecked = true;
            break;
          } else {
            this.isInputChecked = false;
          }
        }
      } else {
        this.isInputChecked = false;
      }
    },
  },
  watch: {
    checkArray: {
      handler() {
        this.isChecked();
      },
      deep: true,
    },
  },
  emits: {
    change: (value) => value === undefined,
    'update:tag': (value) => typeof value === 'object' || typeof value === 'string',
  },
  mounted() {
    this.isChecked();
  },
};
</script>

<style lang="scss">
.lode-checkbox {
  position: absolute;
  opacity: 0;
  width: 1.7rem;
  height: 1.7rem;

  &__inner {
    display: flex;
    align-items: center;

    &--disabled {
      color: $grey;

      .lode-checkbox-custom::before {
        background-color: $grey-light;
        border-color: $grey-light;
      }
    }
  }

  &:checked + &-custom::before {
    border-color: $accent;
    background-color: $accent;
    background-size: 100%;
    background-image: url("../../assets/svg/check-fat.svg");
  }

  &-custom {
    margin-right: 1rem;
    display: inline-flex;
    align-items: center;
    user-select: none;

    &::before {
      display: inline-block;
      content: "";
      width: 1.7rem;
      height: 1.7rem;
      border: 1px solid $grey;
      border-radius: 0.4rem;
      background: center no-repeat;

      transition: background 0.2s linear;
    }

    &--disabled {
      &::before {
        background-color: $grey-light;
      }
    }
  }
}
</style>
