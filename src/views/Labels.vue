<template >
  <Layout class-prefix="labels">
    <div>
      <div class="tags" ref="tags">
        <router-link :to="`/labels/edit/${tag.id}`" class="tag" v-for="tag in tags" :key="tag.id">
          <span>{{tag.name}}</span>
          <Icon name="right"></Icon>
        </router-link>
      </div>
      <div class="createTag-wrapper">
        <Button class="createTag" @click="createTag">新建标签</Button>
      </div>
      <div class="backTop-wrapper">
        <Icon class="backTop" name="backtop" @click="goBackTop"></Icon>
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Button from "@/components/Button.vue";
import { mixins } from "vue-class-component";
import TagHelper from "@/mixins/TagHelper";

@Component({
  components: { Button }
})
export default class Labels extends mixins(TagHelper) {
  created() {
    this.$store.commit("fetchTags");
  }
  get tags() {
    return this.$store.state.tagList;
  }
  goBackTop() {
    const labelsContent = document.getElementById("labels-content")!;
    labelsContent.scroll({ top: 0, left: 0, behavior: "smooth" });
  }
}
</script>

<style lang="scss" scoped>
.labels-wrapper {
  position: relative;
  .tags {
    background: white;
    font-size: 16px;
    padding-left: 16px;
    > .tag {
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e6e6e6;
      svg {
        columns: #666;
        width: 18px;
        height: 18px;
        margin-right: 16px;
      }
    }
  }
  .createTag {
    background: #767676;
    color: white;
    border-radius: 4px;
    border: none;
    height: 40px;
    padding: 0 16px;
    &-wrapper {
      text-align: center;
      padding: 16px;
      margin-top: 44-16px;
    }
  }
  .backTop-wrapper {
    padding: 6px 8px;
    border-radius: 50%;
    position: absolute;
    bottom: 18vh;
    right: 32px;
    background: gray;
    .backTop {
      width: 24px;
      height: 24px;
      color: white;
    }
  }
}
</style>