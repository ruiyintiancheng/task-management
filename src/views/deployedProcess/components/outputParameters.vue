/*
 * @Author: 1k 
 * @Date: 2019-07-18 14:16:45 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-07-24 14:14:41
 * @Description:  输出节点参数
 */
<template>
  <div class="node_output_param">
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
import { baseRequest } from '@/api/base'
// import { baseSearch } from '@/api/base'
// const url = '/t02TaskLog/selects'
export default {
  directives: {},
  name: 'deployedProcessComponentsOutputParameter',
  components: {
  },
  data() {
    return {
      listLoading: false, // 加载圆圈是否显示
      total: null,
      pageNo: 1,
      pageSize: null,
      configData: null,
      options: {
        'nodeType': {
          '0': '起始节点',
          '1': '结束节点',
          '2': '连接节点',
          '3': '加载节点',
          '4': '计算节点'
        },
        'nodeRequire': {
          '0': '全部完成',
          '1': '任意完成'
        },
        'timeRequire': {
          '0': '无',
          '1': '上期节点完成',
          '2': '上期流程完成'
        }
      }
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
      baseRequest('/basic/deployOutputParams/getNodeOutputParams', searchData).then(response => {
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
<style lang="scss" scoped>
.form-search {
  margin-left: 20px;
}
</style>
<style lang="scss">
.node_output_param .el-table.el-table--border {
  border-top: none;
}
.node_output_param {
  margin-top: 15px;
  border-top: 1px solid #ebeef5;
}
</style>
