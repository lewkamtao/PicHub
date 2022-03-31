<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '标题',
  },
  direction: {
    type: String,
    default: '',
  },
  small_title: {
    type: String,
    default: '',
  },
  small_title_link: {
    type: String,
    default: '',
  },
  tips: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="form-item" :class="{ isRow: props.direction == 'row' }">
    <label
      >{{ props.title }}
      <a
        v-if="props.small_title"
        target="_blank"
        :href="props.small_title_link"
        >{{ props.small_title }}</a
      ></label
    >
    <div>
      <slot />
      <p class="tips" v-if="tips" v-html="tips"></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-item {
  width: 100%;
  margin-bottom: 20px;
  label {
    display: block;
    width: 100%;
    margin: 0px 0px 5px 10px;
    color: var(--text-color-2);
    a {
      text-decoration: underline;
      margin-left: 10px;
      color: var(--text-color-2);
    }
  }
  .tips {
    font-size: 12px;
    color: var(--text-color-2);
    padding: 10px;
    line-height: 18px;
  }
}
.isRow {
  display: flex;
  align-items: center;
  label {
    width: auto;
    padding-right: 10px;
    display: inline-block;
  }
}
</style>
