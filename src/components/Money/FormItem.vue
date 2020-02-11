<template>
  <div>
    <label class="formItem">
      <span class="name">{{fieldName}}</span>
      <!-- :value="value" @input="$event.target.value" -->
      <input type="text" :placeholder="placeholder" v-model="value" />
    </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";

@Component
export default class FormItem extends Vue {
  value = "";
  @Prop({ required: true }) fieldName!: string;
  @Prop() placeholder?: string;
}
</script>

<style lang="scss" scoped>
.formItem {
  font-size: 14px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  > .name {
    padding-right: 16px;
  }
  input {
    height: 40px;
    flex-grow: 1;
    background: transparent;
    border: none;
    padding-right: 16px;
  }
}
</style>
