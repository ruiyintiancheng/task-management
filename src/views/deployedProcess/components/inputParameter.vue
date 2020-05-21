/*
 * @Author: 1k 
 * @Date: 2019-07-18 11:12:56 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-07-23 09:58:40
 * @Description:  节点输入参数
 */
<template>
  <div class="node_input_param">
    <el-table ref="basicTable"
              :data="configData"
              style="width: 100%;"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              :height="getDefaultHeight()"
              stripe
              border
              highlight-current-row
              fit
              header-cell-class-name="ai-el-table-header">
      <el-table-column width=50
                       type="index"
                       align="center"
                       fixed="left"></el-table-column>

      <el-table-column :min-width="150"
                       align='center'
                       label="部署节点">
        <template slot-scope="scope">
          {{scope.row.deployNodeName}}
        </template>
      </el-table-column>
      <el-table-column :min-width="150"
                       align='center'
                       label="参数描述">
        <template slot-scope="scope">
          {{scope.row.paramDesc}}
        </template>
      </el-table-column>
      <el-table-column :min-width="150"
                       align='center'
                       label="参数名称">
        <template slot-scope="scope">
          {{scope.row.paramKey}}
        </template>
      </el-table-column>
      <el-table-column :min-width="150"
                       align='center'
                       label="参数值">
        <template slot-scope="scope">
          {{scope.row.paramValue}}
        </template>
      </el-table-column>
      <el-table-column :min-width="130"
                       align='center'
                       label="关联部署节点">
        <template slot-scope="scope">
          {{scope.row.refNodeName}}
        </template>
      </el-table-column>
      <el-table-column :min-width="130"
                       align='center'
                       label="关联参数名称">
        <template slot-scope="scope">
          {{scope.row.refParamKey}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageNo"
                   :page-sizes="[10,15,20]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </div>
</template>
<script>
// import { baseRequest } from '@/api/base'
import { baseSearch } from '@/api/base'
// const url = '/t02TaskLog/selects'
export default {
  directives: {},
  name: 'deployedProcessComponentsInputParameter',
  components: {
  },
  data() {
    return {
      listLoading: false, // 加载圆圈是否显示
      total: null,
      pageNo: 1,
      pageSize: null,
      configData: null
    }
  },
  props: {
    paramData: Object
  },
  created() {

  },
  methods: {
    searchOption(page) {
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      const searchData = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        deployNodeId: this.paramData.deployNodeId
      }
      baseSearch('/basic/deployInputParams/getNodeInputParams', searchData).then(response => {
        this.configData = response.data.item
        // console.log(this.configData)

        this.total = response.data.total
        this.pageSize = response.data.pageSize
        this.listLoading = false
      })
    },
    getDefaultHeight() { // 获取表格高度
      return this.$store.state.app.dialogHeight - 165
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    }
  }
}
</script>
<style lang="scss">
.node_input_param .el-table.el-table--border {
  border-top: none;
}
.node_input_param {
  margin-top: 15px;
  border-top: 1px solid #ebeef5;
}
</style>
