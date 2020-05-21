<template>
  <div class="app-container">
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <div class="row-option">
          <el-button icon="el-icon-search"
                     @click="searchOption"
                     type="primary">查询</el-button>
          <el-button icon="el-icon-refresh"
                     @click="getOption">重置</el-button>
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <search-form v-show="searchToggle"
                   ref="searchForm"
                   :searchFormData="configData"></search-form>
    </div>
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="ul" />
          <span>数据列表</span>
        </div>
        <div class="row-option">
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <basic-table v-show="tableToggle"
                   ref="basicTable"
                   :height="getDefaultHeight"
                   :tableOption="configData"
                   :pagenation="true"
                   :rowNum="true">
        <el-table-column slot="optionColumn"
                         label="操作"
                         fixed="right"
                         align="center"
                         width="250">
          <template slot-scope="scope">
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="reSubTask(scope.row)">重算</el-button>
            <el-button type="success"
                       plain
                       size="mini"
                       @click="look(scope.row)">查看日志</el-button>
          </template>
        </el-table-column>
      </basic-table>
    </div>
    <el-dialog title="查看"
               :close-on-click-modal='false'
               append-to-body
               :visible.sync="formVisible"
               width="80%"
               top="8vh"
               custom-class="dialog-default  dialog-default-more no-footer">
      <div class="dialog-contant-default">
        <div class="base-row">
          <div class="row-botton clearfix">
            <div class="row-title">
              <svg-icon icon-class="ul" />
              <span>日志列表</span>
            </div>
          </div>
          <el-table :height='getLogHeight'
                    :data="tableData"
                    style="width: 100%">
            <el-table-column align='center'
                             header-align='center'
                             prop="server_desc"
                             label="服务器信息"></el-table-column>
            <el-table-column align='center'
                             header-align='center'
                             prop="sub_task_id"
                             label="子任务ID"></el-table-column>
            <el-table-column align='center'
                             header-align='center'
                             prop="field_convert_map.log_level"
                             label="日志等级"></el-table-column>
            <el-table-column align='center'
                             header-align='center'
                             label="日志信息">
              <template slot-scope="scope">
                <el-tooltip :disabled="textJug(scope.row.log_msg)"
                            :content="scope.row.log_msg"
                            placement="top"
                            visible-arrow
                            effect="light">
                  <div class="basic-table-column">
                    {{scope.row.log_msg}}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align='center'
                             header-align='center'
                             prop="add_time"
                             label="添加时间"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { baseRequest } from '@/api/base'
const url = '/basic/taskNodeSub/selects'
export default {
  directives: {},
  name: 'conditionFlowConponentsChildTask',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm
  },
  mounted() {
  },
  created() {
    this.getOption()
  },
  data() {
    return {
      configData: {},
      searchToggle: true,
      tableToggle: true,
      formVisible: false,
      tableData: []
    }
  },
  props: {
    paramData: Object
  },
  methods: {
    textJug(text) {
      if (text) {
        if (text.length > 19) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      param.taskNodeId = this.paramData.taskNodeId
      this.$refs.basicTable.getData(url, param)
    },
    getOption() {
      baseRequest(url, { urlMode: '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        this.$nextTick(_ => {
          this.searchOption()
        })
      })
    },
    look(row) {
      this.formVisible = true
      baseRequest('/basic/taskLog/getLogInfo', { taskFlowId: this.paramData.taskFlowId, 'subTaskId': row.subTaskId, 'taskNodeId': this.paramData.taskNodeId }).then(response => {
        this.tableData = response.data.item
      })
    },
    reSubTask(row) {
      baseRequest('/basic/taskNodeSub/update', { 'subTaskId': row.subTaskId, 'calStatus': '2' }).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.searchOption()
      })
    }
  },
  computed: {
    getDefaultHeight() { // 获取表格高度
      return this.$store.state.app.containHeight * 0.8 - 250
    },
    getLogHeight() {
      return this.$store.state.app.containHeight * 0.8 - 40
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.baseUpdate-form {
  margin-left: 40px;
}
</style>
