<template>
  <div>
    <label class="formItem">
      <span class="name">{{ fieldName }}</span>
      <template v-if="type === 'date'">
        <input
          :type="type || 'text'"
          :placeholder="placeholder"
          :value="x(value)"
          @input="onValueChange($event.target.value)"
        />
      </template>
      <template v-else>
        <input
          :type="type || 'text'"
          :placeholder="placeholder"
          :value="value"
          @input="onValueChange($event.target.value)"
        />
      </template>
    </label>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class FormItem extends Vue {
  @Prop({ default: "" }) readonly value!: string;
  @Prop({ required: true }) fieldName!: string;
  @Prop() placeholder?: string;
  @Prop() type?: string;
  // @Watch("value")
  onValueChange(value: string) {
    this.$emit("update:value", value);
  }
  x(isoString: string) {
    return dayjs(isoString).format("YYYY-MM-DD");
  }
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
