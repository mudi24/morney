<template>
  <Layout class-prefix="layout">
    <NumberPad :value.sync="record.amount" @submit="saveRecord" />
    <Types :value.sync="record.type" />
    <div class="notes">
      <FormItem field-name="备注" placeholder="在这里输入备注" @update:value="onUpdateNotes" />
    </div>
    <Tags :data-source.sync="tags" />
  </Layout>
</template>

<style lang="scss" >
.layout-content {
  display: flex;
  flex-direction: column-reverse;
}
.notes {
  padding: 12px 0;
}
</style>
<script lang="ts">
import Vue from "vue";
import NumberPad from "@/components/Money/NumberPad.vue";
import Types from "@/components/Money/Types.vue";
import FormItem from "@/components/Money/FormItem.vue";
import Tags from "@/components/Money/Tags.vue";
import { Component } from "vue-property-decorator";
import recordListModel from "@/models/recordListModel.ts";
// const recordListModel = require("@/recordListModel.js").default;

@Component({
  components: { Tags, FormItem, Types, NumberPad }
})
export default class Money extends Vue {
  recordList = window.recordList;
  tags = window.tagList;
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
    window.createRecord(this.record);
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