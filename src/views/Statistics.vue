<template>
  <Layout>
    <Tabs
      class-prefix="type"
      :value.sync="type"
      :data-source="recordTypeList"
    ></Tabs>
    <div class="chart-wrapper">
      <Chart :options="chartOptions" class="chart" ref="chartWrapper"></Chart>
    </div>
    <ol v-if="groupedList.length > 0">
      <li v-for="(group, index) in groupedList" :key="index">
        <h3 class="title">
          {{ beautify(group.title) }}
          <span>￥{{ group.total }}</span>
        </h3>
        <ol>
          <li class="record" v-for="item in group.items" :key="item.id">
            <span class="statistics-tags">{{ tagString(item.tags) }}</span>
            <span class="statistics-notes">{{ item.notes }}</span>
            <span>￥{{ item.amount }}</span>
          </li>
        </ol>
      </li>
    </ol>
    <!-- <div v-else class="noResult">目前没有相关记录</div> -->
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Tabs from "@/components/Tabs.vue";
import recordTypeList from "@/constants/recordTypeList";
import clone from "@/lib/clone";
import dayjs from "dayjs";
import Chart from "@/components/Chart.vue";
import _ from "lodash";

@Component({
  components: { Tabs, Chart },
})
export default class Statistics extends Vue {
  type = "-";
  interval = "day";
  recordTypeList = recordTypeList;
  tagString(tags: Tag[]) {
    if (tags.length === 0) {
      return "无";
    } else {
      return tags.map((t) => t.name).join("，");
    }
  }
  beautify(string: string) {
    const day = dayjs(string);
    const now = dayjs();
    if (dayjs(string).isSame(new Date(), "day")) {
      return "今天";
    } else if (day.isSame(now.subtract(1, "day"), "day")) {
      return "昨天";
    } else if (day.isSame(now.subtract(2, "day"), "day")) {
      return "前天";
    } else if (day.isSame(now, "year")) {
      return day.format("MM月D日");
    } else {
      return day.format("YYYY年MM月D日");
    }
  }
  get keyValueList() {
    const today = new Date();
    const array = [];

    for (let i = 0; i < 29; i++) {
      const date = dayjs(today)
        .subtract(i, "day")
        .format("YYYY-MM-DD");
      const found = _.find(this.groupedList, { title: date });
      array.push({
        key: date,
        value: found ? found.total : 0,
      });
    }
    array.sort((a, b) => {
      if (a.key > b.key) {
        return 1;
      } else if (a.key === b.key) {
        return 0;
      } else {
        return -1;
      }
    });
    return array;
  }
  get chartOptions() {
    // this.recordList.map((r) => ({ createdAt: r.createdAt, amount: r.amount }));
    // this.recordList.map((r) => _.pick(r, ["createdAt", "amount"]));

    const keys = this.keyValueList.map((item) => item.key);
    const values = this.keyValueList.map((item) => item.value);
    return {
      grid: {
        left: 0,
        right: 0,
      },
      xAxis: {
        type: "category",
        data: keys,
        axisTick: { alignWidthLabel: true },
        axisLine: { lineStyle: { color: "#666" } },
        axisLabel: {
          formatter: function(value: string, index: number) {
            return value.substr(5);
          },
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          type: "line",
          symbol: "circle",
          symbolSize: 12,
          itemStyle: { borderWidth: 1, color: "#666", borderColor: "#666" },
          data: values,
        },
      ],
      tooltip: {
        show: true,
        triggerOn: "click",
        position: "top",
        formatter: "{c}",
      },
    };
  }
  get recordList() {
    return (this.$store.state as RootState).recordList;
  }
  get groupedList() {
    const { recordList } = this;
    if (recordList.length === 0) {
      return [];
    }
    const newList = clone(recordList)
      .filter((t) => t.type === this.type)
      .sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
    if (newList.length === 0) {
      return [];
    }
    type Result = {
      title: string;
      total?: number;
      items: RecordItem[];
    }[];
    const result: Result = [
      {
        title: dayjs(newList[0].createdAt).format("YYYY-MM-DD"),
        items: [newList[0]],
      },
    ];
    for (let i = 1; i < newList.length; i++) {
      const current = newList[i];
      const last = result[result.length - 1];

      if (dayjs(last.title).isSame(dayjs(current.createdAt), "day")) {
        last.items.push(current);
      } else {
        result.push({
          title: dayjs(current.createdAt).format("YYYY-MM-DD"),
          items: [current],
        });
      }
    }

    result.map((group) => {
      group.total = group.items.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    });
    return result;
  }
  created() {
    this.$store.commit("fetchRecords");
  }
  mounted() {
    const div = this.$refs.chartWrapper as HTMLDivElement;
    div.scrollLeft = div.scrollWidth;
  }
}
</script>

<style lang="scss" scoped>
.noResult {
  padding: 16px;
  text-align: center;
}
::v-deep {
  .type-tabs-item {
    background: #c4c4c4;
    &.selected {
      background: white;
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
.chart {
  width: 430%;
  &-wrapper {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
