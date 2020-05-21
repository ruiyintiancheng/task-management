/*
 * @Author: 1k 
 * @Date: 2019-07-16 17:38:23 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-08-06 15:55:25
 * @Description:  已部署流程
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
                         width="200">
          <template slot-scope="scope">
            <el-button type="success"
                       v-if="scope.row.flowStatus === '4' && scope.row.flowStatus !== '5'"
                       plain
                       size="mini"
                       @click="deploymentFlow(scope.row)">启用</el-button>
            <el-button type="danger"
                       v-if="(scope.row.flowStatus === '1' || scope.row.flowStatus === '2') && scope.row.flowStatus !== '5'"
                       plain
                       size="mini"
                       @click="TimeOutFlow(scope.row)">停用</el-button>
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="flowLook(scope.row)">流程查看</el-button>
          </template>
        </el-table-column>
      </basic-table>
    </div>
    <flowShow ref="flowShow"
              @flushTable='searchOption'
              :paramData='paramData'></flowShow>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
// import addFlow from './components/index'
import flowShow from './components/flowDetails'
import { baseRequest } from '@/api/base'
const url = '/basic/deployFlow/selects'
export default {
  directives: {},
  name: 'deployedProcessIndex',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm,
    flowShow
  },
  data() {
    return {
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      updateFormData: {
        className: '',
        subFlag: '',
        classType: '',
        classDesc: ''
      }, // 弹框数据
      formVisible: false, // 弹框开关
      roleFormVisible: false, // 弹框开关
      // newFrameVisible: false, // 新建内容弹窗开关
      languageData: null, // 语言设置数据
      operateStatus: null, // 操作选项
      msgId: null, // 修改保存参数id
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      },
      paramData: {
        defType: '',
        addFlag: false,
        title: '',
        subtitle: ''
      },
      permissionList: [],
      activeName: 'first'
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
    deploymentFlow(row) { // 启用
      baseRequest('/basic/deployFlow/update', { deployFlowId: row.deployFlowId, flowStatus: '1' }).then(response => {
        this.$Message.success('操作成功')
        this.searchOption()
      })
    },
    TimeOutFlow(row) { // 停用
      this.$confirm('暂停后不再触发新流程,已生成的计算流程不受影响,是否暂停?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/basic/deployFlow/update', { deployFlowId: row.deployFlowId, flowStatus: '3' }).then(response => {
          this.$Message.success('操作成功')
          this.searchOption()
        })
      })
    },
    flowLook(row) { // 流程查看
      this.paramData.deployFlowId = row.deployFlowId
      this.$refs.flowShow.openDialog()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-contant-default-addOrUpdate {
  margin-top: 10px;
  padding: 0px;
  border: 0px;
}
.dialog-contant-default-addOrUpdate {
  .baseUpdate-form {
    margin-left: calc(50% - 250px);
    .form-input {
      width: 200px;
    }
  }
}
.dialog-contant-default-flowInfo {
  padding-top: 30px;
  .baseUpdate-form {
    margin-left: calc(50% - 160px);
    .form-input {
      width: 200px;
    }
  }
}
</style>