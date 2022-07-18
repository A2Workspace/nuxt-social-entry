<template>
  <a href="#" class="c-button" :style="style" @click="handleClick">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    provider: {
      type: String,
      required: true,
    },
    bg: {
      type: String,
      default: '#fff',
    },
    color: {
      type: String,
      default: '#666',
    },
  },

  methods: {
    handleClick() {
      this.$socialEntry.authorize(this.provider).redirect();
    },
  },

  computed: {
    style() {
      let styleOptions = {
        backgroundColor: this.bg,
        color: this.color,
      };

      return styleOptions;
    },
  },
};
</script>

<style>
.c-button {
  display: block;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  line-height: 47px;
  margin-top: 12px;
  border: 1px solid rgba(192, 192, 192, 0.1);
  border-radius: 8px;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.c-button:not(:hover) {
  opacity: 0.9;
  top: 1px;
}
</style>
