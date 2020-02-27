<template>
  <Layout>
    <Tabs class-prefix="type" :value.sync="type" :data-source="recordTypeList"></Tabs>
    <Tabs class-prefix="interval" :value.sync="interval" :data-source="intervalList"></Tabs>
    <ol>
      <li v-for="(group,index) in result" :key="index">
        <h3 class="title">{{group.title}}</h3>
        <ol>
          <li class="record" v-for="item in group.items" :key="item.id">
            <span class="statistics-tags">{{item.tags[0].name}}</span>
            <span class="statistics-notes">{{item.notes}}</span>
            <span>￥{{item.amount}}</span>
          </li>
        </ol>
      </li>
    </ol>
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Tabs from "@/components/Tabs.vue";
import intervalList from "@/constants/intervalList";
import recordTypeList from "@/constants/recordTypeList";

@Component({
  components: { Tabs }
})
export default class Statistics extends Vue {
  type = "-";
  interval = "day";
  intervalList = intervalList;
  recordTypeList = recordTypeList;
  tagString(tags: Tag[]) {
    return tags.length === 0 ? "无" : tags.join(",");
  }
  get recordList() {
    return (this.$store.state as RootState).recordList;
  }
  get result() {
    const { recordList } = this;
    type HashTableValue = { title: string; items: RecordItem[] };
    const hashTable: { [key: string]: HashTableValue } = {};
    for (let i = 0; i < recordList.length; i++) {
      const [date, time] = recordList[i].createdAt!.split("T");
      hashTable[date] = hashTable[date] || { title: date, items: [] };
      hashTable[date].items.push(recordList[i]);
    }
    return hashTable;
  }
  created() {
    this.$store.commit("fetchRecords");
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .type-tabs-item {
    background: white;
    &.selected {
      background: #c4c4c4;
      &::after {
        display: none;
      }
    }
  }
  .interval-tabs-item {
    height: 48px;
  }
}
%item {
  padding: 0 16px;
  min-height: 40px;
  // padding: 8px 16px;
  // line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  @extend %item;
}
.record {
  background: white;
  @extend %item;
}
.statistics-tags {
  white-space: nowrap;
}
.statistics-notes {
  margin-right: auto;
  margin-left: 16px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: wrap;
}
</style>