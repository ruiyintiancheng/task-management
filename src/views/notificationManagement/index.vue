/*
 * @Author: weilq
 * @Date: 2019-07-17
 * @Last Modified by:
 * @Last Modified time:
 * @Description: 通知管理
 */
<template>
  <div class="task-log">
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
        <!-- <el-table-column prop="nodeName" slot="optionColumn" label="节点名称" fixed="left" align="center" width="350">
              <el-input class="form-input"  type="textarea" rows="2" readonly="readonly"  v-model="item.flowName" clearable>
                <template slot-scope="scope">
                  {{scope.row.nodeName}}
                </template>
              </el-input>
            </el-table-column> -->
        <el-table-column slot="optionColumn"
                         label="操作"
                         fixed="right"
                         align="center"
                         width="100">
          <template slot-scope="scope">
            <el-button type="danger"
                       plain
                       size="mini"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
          <!-- <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" @click="inputParam(scope.row)">输入参数</el-button>
                  <el-button type="success" plain size="mini" v-if="scope.row.classType === '2'" @click="outputParam(scope.row)">输出参数</el-button>
                  <el-button type="primary" plain size="mini" @click="updateOption(scope.row)">修改</el-button>
                  <el-button type="danger" plain size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template> -->
        </el-table-column>
      </basic-table>
    </div>
    <!-- <el-dialog title="详细信息" :visible.sync="formVisible" :close-on-click-modal='false' v-el-drag-dialog width="40%" custom-class="dialog-default">
            <div class="dialog-contant-default">
              <update-form  ref="updateFrom" :updateFormData="updateFormData"></update-form>
              <el-form ref="form" :model="item" label-position="left" label-width="100px" class="baseUpdate-form">
                <el-form-item  prop="flowName" label="流程名称" >
                    <el-input class="form-input"  type="textarea" rows="2" readonly="readonly"  v-model="item.flowName" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item  prop="nodeName" label="节点名称" >
                    <el-input class="form-input"  type="textarea" rows="3" readonly="readonly"  v-model="item.nodeName" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item  prop="logMsg" label="日志信息" >
                    <el-input class="form-input"  type="textarea" rows="6" readonly="readonly"  v-model="item.logMsg" clearable>
                    </el-input>
                </el-form-item>
              </el-form>
            </div>
        </el-dialog> -->
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { getSearchParam } from '@/utils/index'
import { baseRequest } from '@/api/base'
const url = '/basic/taskNotice/selects'
export default {
  name: 'taskNotice',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm
  },
  data() {
    return {
      item: {
        flowName: '',
        nodeName: '',
        logMsg: ''
      },
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      updateFormData: null, // 弹框数据
      formVisible: false // 弹框开关
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    searchOption() {
      // console.log('searchOption')
      // console.log(this.$refs.searchForm.searchParam())
      this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
    },
    getOption() {
      baseRequest(url, { urlMode: '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        const param = getSearchParam(result.formConfig)
        this.$refs.basicTable.getData(url, param)
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          noticeDefId: row.noticeDefId
        }
        baseRequest('/basic/taskNotice/delete', param).then(request => {
          this.searchOption()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    }
    // 展示日志信息
    // seeView(row) {
    //   this.getSeeView(row)
    // },
    // 获取日志信息
    // getSeeView(row) {
    //   const param = { logId: row.log_msg }
    //   baseRequest('/taskLog/select', param).then(response => {
    //     const result = response.data
    //     this.item.logMsg = result.item.log_msg
    //     result.formConfig = JSON.parse(result.formConfig)
    //     this.updateFormData = result
    //     this.formVisible = true
    //     this.$nextTick(function() {
    //       this.$refs.form.clearValidate()
    //       this.$refs.updateFrom.clearValidate()
    //     })
    //   })
    // },
    // 格式化日志信息
    // formatLogMsg(row) {
    //   const logMsg = row.log_msg
    //   const newLogMsg = logMsg.substring(0, 40)
    //   return newLogMsg + '...'
    // }
  }
}
</script>
<style lang="scss">
.task-log {
  .baseUpdate-form {
    margin-left: calc(50% - 150px);
    .form-input,
    .el-date-editor.el-input.form-input {
      width: 205px;
    }
  }
}
</style>
