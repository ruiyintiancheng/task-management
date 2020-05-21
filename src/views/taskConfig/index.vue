/*
 * @Author: M.HQ 
 * @Date: 2019-04-3 15:48:29 
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
          <el-upload ref="upload"
                     :action="uploadUrl"
                     :before-upload="beforeAvatarUpload"
                     :on-success="uploadSuccess"
                     :on-on-error="uploadError"
                     :show-file-list="false"
                     :headers="myHeaders"
                     accept='.mdl'
                     style="display: inline-block;">
            <el-button icon="el-icon-upload2">上传</el-button>
          </el-upload>
          <el-button icon="el-icon-plus"
                     @click="addTask()">添加</el-button>
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
                         width="280">
          <template slot-scope="scope">
            <el-button type="warning"
                       v-if="scope.row.flowStatus === '1'"
                       plain
                       size="mini"
                       @click="cancelDeploymentFlow(scope.row)">取消部署</el-button>
            <el-button type="success"
                       v-if="scope.row.flowStatus === '0'"
                       plain
                       size="mini"
                       @click="deploymentFlow(scope.row)">部署</el-button>
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="updateOption(scope.row)">修改</el-button>
            <el-button type="danger"
                       plain
                       size="mini"
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </basic-table>
    </div>

    <addFlow ref="addFlow"
             @flushTable="getOption"
             :paramData="paramData"></addFlow>

    <el-dialog :title="flowDialogTitle"
               :visible.sync="newFrameVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-flowInfo">
        <el-form class="baseUpdate-form"
                 ref="form"
                 label-width="100px">
          <el-form-item label="流程名称">
            <el-input class="form-input"
                      v-model="paramData.title"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="流程描述">
            <el-input type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      class="form-input"
                      v-model="paramData.subtitle"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="newFrameVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="determined()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle[operateStatus]"
               :visible.sync="formVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-form class="baseUpdate-form"
                 ref="form"
                 :model="updateFormData"
                 label-width="100px">
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="部署流程-参数"
               :visible.sync="flowParamVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-flowInfo">
        <el-form class="baseUpdate-form"
                 ref="form"
                 label-width="100px">
          <el-form-item label="启用时间">
            <el-date-picker v-model="flowParam.startDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
            </el-date-picker>
            <!-- <el-input class="form-input" v-model="flowParam.startDate" clearable></el-input> -->
          </el-form-item>
          <el-form-item label="停用时间">
            <el-date-picker v-model="flowParam.endDate"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期时间">
            </el-date-picker>
            <!-- <el-input class="form-input" v-model="flowParam.endDate" clearable></el-input> -->
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="flowParamVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="deploymentFlowConfirm()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import addFlow from './components/index'
import { baseRequest } from '@/api/base'
const url = '/basic/flowDef/selects'
import validator from './validator'
export default {
  directives: {},
  name: 'taskConfigIndex',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm,
    addFlow
  },
  data() {
    return {
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      myHeaders: { token: getToken() },
      updateFormData: {
        className: '',
        subFlag: '',
        classType: '',
        classDesc: ''
      }, // 弹框数据
      formVisible: false, // 弹框开关
      roleFormVisible: false, // 弹框开关
      newFrameVisible: false, // 新建内容弹窗开关
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
      flowParam: {
        flowId: '',
        startDate: '',
        endDate: ''
      },
      flowParamVisible: false,
      permissionList: [],
      activeName: 'first',
      flowDialogTitle: '',
      uploadUrl: `${process.env.BASE_API}/flowDef/importFlow`
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
    determined(errorMsg) { // 填完流程名和描述后确定功能
      this.newFrameVisible = false
      this.$refs.addFlow.openDialog(errorMsg)
    },
    // 添加
    addTask() { // 显示 填写流程名和描述弹窗
      this.paramData.title = ''
      this.paramData.subtitle = ''
      this.paramData.defType = ''
      this.paramData.addFlag = true
      this.paramData.flowId = null
      this.flowDialogTitle = '新建流程'
      this.newFrameVisible = true
    },
    // 修改表单
    updateOption(row) {
      // this.operateStatus = 2
      // this.getUpdateForm(row)
      this.paramData.title = row.flowName
      this.paramData.subtitle = row.flowDesc
      this.paramData.addFlag = false
      this.paramData.flowId = row.flowId
      this.flowDialogTitle = '修改流程'
      this.newFrameVisible = true
      // this.$refs.addFlow.openDialog()
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          flowId: row.flowId
        }
        baseRequest('/basic/flowDef/delete', param).then(request => {
          this.searchOption()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    cancelDeploymentFlow(row) { // 取消部署,将部署流程修改状态为暂停(状态码 3 )
      baseRequest('/basic/flowDef/setFlowStatus', { flowId: row.flowId, flowStatus: '0' }).then(request => {
        this.searchOption()
        this.$alert('取消成功!此流程将不再触发新计算流程,已触发的流程将继续完成计算!', '提示', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    },
    uploadSuccess(response) { // 上传成功
      if (response.code && response.code === 100) {
        this.$message.error('上传失败')
      } else {
        this.$message.success('上传成功')
        this.searchOption()
      }
      this.fileLoading = false
    },
    // 上传失败
    uploadError() {
      this.fileLoading = false
      this.$message.error('上传失败')
    },
    deploymentFlow(row) { // 部署
      // 先进行设置开始时间和结束时间
      this.paramData.title = row.flowName
      this.paramData.subtitle = row.flowDesc
      this.paramData.addFlag = false
      this.paramData.flowId = row.flowId

      this.flowParamVisible = true
      this.flowParam.startDate = ''
      this.flowParam.endDate = ''
      this.flowParam.flowId = row.flowId
    },
    // 上传验证
    beforeAvatarUpload(file) {
      this.fileLoading = true
    },
    deploymentFlowConfirm() {
      if (this.flowParam.startDate === '') {
        this.$Message.error('请选择流程开始时间')
        return
      }
      const param = {
        flowId: this.flowParam.flowId
      }
      baseRequest('/basic/flowDef/getFlowInfo', param).then(response => {
        const nodes = response.data.item.nodes
        const edges = response.data.item.edges
        validator(nodes, edges).then(_ => {
          baseRequest('/basic/flowDef/setFlowStatus', { flowId: this.flowParam.flowId, flowStatus: '1', startDate: this.flowParam.startDate, endDate: this.flowParam.endDate }).then(response => {
            this.$Message.success('操作成功')
            this.flowParamVisible = false
            this.searchOption()
          })
        }, error => {
          this.flowDialogTitle = '修改流程'
          this.determined(error)
        })
      })
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



