<template>
  <Layout class-prefix="layout">
    <NumberPad :value.sync="record.amount" @submit="saveRecord" />
    <Types :value.sync="record.type" />
    <Notes @update:value="onUpdateNotes" />
    <Tags :data-source.sync="tags" @update:value="onUpdateTags" />
  </Layout>
</template>

<style lang="scss" >
.layout-content {
  display: flex;
  flex-direction: column-reverse;
}
</style>
<script lang="ts">
import Vue from "vue";
import NumberPad from "@/components/Money/NumberPad.vue";
import Types from "@/components/Money/Types.vue";
import Notes from "@/components/Money/Notes.vue";
import Tags from "@/components/Money/Tags.vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import recordListModel from "@/models/recordListModel.ts";
import tagListModel from "@/models/tagListModel.ts";
// const recordListModel = require("@/recordListModel.js").default;

const recordList = recordListModel.fetch();
const tagList = tagListModel.fetch();

@Component({
  components: { Tags, Notes, Types, NumberPad }
})
export default class Money extends Vue {
  recordList: RecordItem[] = recordList;
  tags = tagList;
  record: RecordItem = {
    tags: [],
    notes: "",
    type: "-",
    amount: 100
  };
  onUpdateTags(value: string[]) {
    this.record.tags = value;
  }

  onUpdateNotes(value: string) {
    this.record.notes = value;
  }
  saveRecord() {
    const record2: RecordItem = recordListModel.clone(this.record);
    record2.createAt = new Date();
    this.recordList.push(record2);
  }
  @Watch("recordList")
  onRecordListChange() {
    recordListModel.save(this.recordList);
    window.localStorage.setItem("recordList", JSON.stringify(this.recordList));
  }
}
</script>



// 数据迁移
// const version = window.localStorage.getItem("version");
// if (version === "0.0.1") {
//   // 数据库升级，数据迁移
//   recordList.forEach(record => {
//     record.createAt = new Date(2020, 0, 1);
//   });
//   // 保存数据
//   window.localStorage.setItem("recordList", JSON.stringify(recordList));
// }
// window.localStorage.setItem("version", "0.0.2");