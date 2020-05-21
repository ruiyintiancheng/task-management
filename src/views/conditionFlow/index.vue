/*
 * @Author: M.HQ 
 * @Date: 2019-07-25 15:48:29 
 * @Last Modified by: M.HQ
 * @Last Modified time: 
 * @Description: 任务流程列表
 */

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
                   :tableOption="configData"
                   :pagenation="true"
                   :rowNum="true">
        <el-table-column slot="optionColumn"
                         label="操作"
                         fixed="right"
                         align="center"
                         width="150">
          <template slot-scope="scope">
            <el-button type="success"
                       v-if="scope.row.cal_status === '4'"
                       plain
                       size="mini"
                       @click="runFlow(scope.row)">计算</el-button>
            <el-button type="danger"
                       v-if="scope.row.cal_status !== '3' && scope.row.cal_status !== '4'"
                       plain
                       size="mini"
                       @click="stopFlow(scope.row)">中止</el-button>
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="look(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </basic-table>
    </div>
    <flow-figure ref="flowFigure"></flow-figure>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
// import flowFigure from './conponents/processG6'
import flowFigure from 'process-g6-ry'
import { baseRequest } from '@/api/base'
const url = '/basic/taskFlow/selects'
export default {
  directives: {},
  name: 'conditionIndex',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm,
    flowFigure
  },
  data() {
    return {
      searchToggle: true,
      tableToggle: true,
      configData: {}
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    searchOption() {
      this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
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
      console.log(row)
      this.$refs.flowFigure.openDialog(row)
    },
    runFlow(row) {
      baseRequest('/basic/taskFlow/update', { taskFlowId: row.task_flow_id, calStatus: '1' }).then(response => {
        this.$Message.success('操作成功')
        this.searchOption()
      })
    },
    stopFlow(row) {
      this.$confirm('流程将在当前计算中节点完成后暂停执行,确定中止?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/basic/taskFlow/update', { taskFlowId: row.task_flow_id, calStatus: '4' }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>



