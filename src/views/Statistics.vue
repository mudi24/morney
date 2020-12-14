<template>
  <Layout>
    <Tabs
      class-prefix="type"
      :value.sync="type"
      :data-source="recordTypeList"
    ></Tabs>
    <div class="chart-wrapper">
      <Chart :options="x" class="chart" ref="chartWrapper"></Chart>
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
  get x() {
    return {
      grid: {
        left: 0,
        right: 0,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisTick: { alignWidthLabel: true },
        axisLine: { lineStyle: { color: "green" } },
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "30%"],
        show: false,
      },
      visualMap: {
        type: "piecewise",
        show: false,
        dimension: 0,
        seriesIndex: 0,
        pieces: [
          {
            gt: 1,
            lt: 3,
            color: "rgba(0, 180, 0, 0.5)",
          },
          {
            gt: 5,
            lt: 7,
            color: "rgba(0, 180, 0, 0.5)",
          },
        ],
      },
      series: [
        {
          type: "line",
          symbol: "circle",
          symbolSize: 12,
          lineStyle: {
            color: "red",
            width: 5,
          },
          data: [
            ["2019-10-10", 200],
            ["2019-10-11", 400],
            ["2019-10-12", 650],
            ["2019-10-13", 500],
            ["2019-10-14", 250],
            ["2019-10-15", 300],
            ["2019-10-16", 450],
            ["2019-10-17", 300],
            ["2019-10-18", 100],
          ],
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
