<template>
  <div class="table-box">
    <!-- 表格 -->
    <el-table
      border
      :data="tableData"
      @selection-change="changeSelection"
    >
      <slot name="expand" />
      <template v-for="(item, index) in tableColumn">
        <!-- 索引列 -->
        <el-table-column
          v-if="item.prop=='index'"
          :key="'%'+index"
          type="index"
          :label="item.label"
          :width="item.width"
          :align="item.align"
        />
        <!-- 选择列 -->
        <el-table-column
          v-else-if="item.prop=='selection'"
          :key="'%'+index"
          type="selection"
          :width="item.width"
          :align="item.align"
        />
        <!-- 此列需要自定义 -->
        <el-table-column
          v-else-if="item.slot"
          :key="'%'+index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
        >
          <template slot-scope="{row}">
            <slot
              :name="item.prop"
              :row="row"
            />
          </template>
        </el-table-column>
        <!-- 正常列 -->
        <el-table-column
          v-else
          :key="'%'+index"
          :show-overflow-tooltip="item.showTooltip"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
        >
          <template slot-scope="{row}">
            <!-- 操作列 -->
            <template v-if="item.btnButton">
              <el-button
                v-for="(value, i) in item.btnButton"
                :key="'$'+i"
                :type="value.type"
                :icon="value.icon"
                @click="value.callback(row)"
              >{{ value.text }}</el-button>
            </template>
            <!-- 直接展示列 -->
            <template v-else>
              {{ row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <div style="display: flex; justify-content: flex-end;align-item:center;">
      <el-pagination
        style="margin-top: 10px; margin-right: 0"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationData.total"
        :current-page.sync="paginationData.pageIndex"
        :page-size.sync="paginationData.pageSize"
        :page-sizes="[5, 10, 15, 20]"
        @current-change="changeIndexOrPage"
        @size-change="changeIndexOrPage"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 分页数据
    paginationData: {
      type: Object,
      default: () => { }
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 表格展示数据
    tableColumn: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 改变选中行的回调
    changeSelection(val) {
      this.$emit('changeSelection', val)
    },
    // 改变页码或者数量
    changeIndexOrPage() {
      this.$emit('changeIndexOrPage')
    }
  }

}
</script>
<style lang="scss" scoped>
.table-box {
  display: flex;
  flex-direction: column;
}
// 滚动条的宽度
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px; // 横向滚动条
  height: 6px; // 纵向滚动条 必写
}
// 滚动条的滑块
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style>
