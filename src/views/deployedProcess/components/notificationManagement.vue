/*
 * @Author: 1k 
 * @Date: 2019-07-18 15:25:41 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-08-06 15:23:19
 * @Description:  通知管理
 */
<template>
  <div class="notifacation-ma">
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <div class="row-option">
          <!-- <a href="javascript:void(0)" class="button" @click="searchOption">查询</a> -->
          <el-button icon="el-icon-search"
                     @click="searchOption"
                     type="primary">查询</el-button>
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <div v-show="searchToggle"
           class="form-search">
        <el-form ref="form"
                 :inline="true"
                 :model="searchData"
                 class="demo-table-expand">
          <div class="input-both-3">
            <el-form-item>
              <span class="input-label">用户名称:</span>
              <el-input size="small"
                        class="form-input"
                        v-model="searchData.userName"
                        clearable></el-input>
            </el-form-item>
          </div>
          <div class="input-both-3">
            <el-form-item>
              <span class="input-label">通知类型:</span>
              <el-select class="form-input"
                         v-model="searchData.noticeType"
                         size="small"
                         clearable
                         placeholder=''>
                <el-option label="全部"
                           value="0"></el-option>
                <el-option label="开始计算"
                           value="1"></el-option>
                <el-option label="计算完成"
                           value="2"></el-option>
                <el-option label="计算失败"
                           value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="input-both-3">
            <el-form-item>
              <span class="input-label">通知方式:</span>
              <el-select class="form-input"
                         v-model="searchData.noticeMode"
                         size="small"
                         clearable
                         placeholder=''>
                <el-option label="全部"
                           value="0"></el-option>
                <el-option label="邮件"
                           value="1"></el-option>
                <el-option label="短信"
                           value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="ul" />
          <span>数据列表</span>
        </div>
        <div class="row-option">
          <el-button icon="el-icon-plus"
                     @click="addParam">添加</el-button>
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <div v-show="tableToggle">
        <!-- 表格 -->
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
                           label="节点名称">
            <template slot-scope="scope">
              {{scope.row.nodeName}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="流程名称">
            <template slot-scope="scope">
              {{scope.row.flowName}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="用户名">
            <template slot-scope="scope">
              {{scope.row.userName}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="通知类型">
            <template slot-scope="scope">
              {{options.noticeType[scope.row.noticeType]}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="通知方式">
            <template slot-scope="scope">
              {{options.noticeMode[scope.row.noticeMode]}}
            </template>
          </el-table-column>
          <el-table-column :min-width="120"
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button type="danger"
                         plain
                         size="mini"
                         @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination>
      </div>
    </div>

    <el-dialog :close-on-click-modal="false"
               v-el-drag-dialog
               :title="dialogTitle[operateStatus]"
               append-to-body
               :visible.sync="inputParamFormVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-form class="baseUpdate-form"
                 ref="addForm"
                 :rules="addRules"
                 :model="updateFormData"
                 label-width="100px"
                 label-position="right">
          <el-form-item prop="noticeType"
                        label="通知类型:">
            <el-select :style="{width:'155px'}"
                       v-model="updateFormData.noticeType"
                       size="small"
                       clearable
                       placeholder=''
                       @change="requestInformation()">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="开始计算"
                         value="1"></el-option>
              <el-option label="计算完成"
                         value="2"></el-option>
              <el-option label="计算失败"
                         value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="noticeMode"
                        label="通知方式:">
            <el-select :style="{width:'155px'}"
                       v-model="updateFormData.noticeMode"
                       size="small"
                       clearable
                       placeholder=''
                       @change="requestInformation()">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="邮件"
                         value="1"></el-option>
              <el-option label="短信"
                         value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userId"
                        label="用户ID:">
            <el-select :style="{width:'155px'}"
                       v-model="updateFormData.userId"
                       size="small"
                       clearable
                       placeholder=''>
              <el-option v-for="(item,index) in userIdAll"
                         :key="index"
                         :label="item.userName"
                         :value="item.userId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="inputParamFormVisible = false, cancel()">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import { baseSearch } from '@/api/base'
import { saveUpdate } from '@/utils/validate'
// var url = '/taskNotice/getDeployList' // 获取该任务类的输入参数
export default {
  directives: {},
  name: 'deployedProcessComponentsNotificationManagement',
  components: {
  },
  mounted() {
  },
  created() {
  },
  data() {
    return {
      tableToggle: true,
      searchToggle: true,
      userIdAll: null,
      pageNo: 1,
      total: null,
      pageSize: null,
      listLoading: false, // 加载圆圈是否显示
      formVisible: false,
      configData: [],
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      },
      searchData: { // 查询条件字段
        userName: '',
        noticeType: '',
        noticeMode: ''
      },
      updateFormData: { // 添加修改表单数据
        noticeType: '',
        noticeMode: '',
        userId: ''
      },
      inputParamFormVisible: false, // 输入参数添加修改弹窗
      operateStatus: 1,
      addRules: {
        userId: [{
          required: true, message: '请选择用户(前两项必填)'
        }],
        noticeType: [{
          required: true, message: '请选择通知类型'
        }],
        noticeMode: [{
          required: true, message: '请选择通知方式'
        }]
      },
      options: {
        'noticeType': {
          '0': '全部',
          '1': '开始计算',
          '2': '计算完成',
          '3': '计算失败'
        },
        'noticeMode': {
          '0': '全部',
          '1': '邮件',
          '2': '短信'
        }
      }
    }
  },
  props: {
    paramData: Object
  },
  methods: {
    getDefaultHeight() { // 获取表格高度
      return this.$store.state.app.dialogHeight - 340
    },
    openDialog() {
      this.formVisible = true
      this.searchOption()
    },
    searchOption(page) {
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      this.searchData.deployNodeId = this.paramData.deployNodeId
      baseSearch('/basic/taskNotice/getDeployList', this.searchData).then(response => {
        this.configData = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
        this.listLoading = false
      })
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    },
    addParam() {
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      delete this.updateFormData.paramId
      this.$nextTick(_ => {
        this.$refs.addForm.clearValidate()
      })
      this.inputParamFormVisible = true
    },
    saveOperate() {
      const param = this.updateFormData
      param.deployNodeId = this.paramData.deployNodeId
      param.deployFlowId = this.paramData.deployFlowId
      saveUpdate('/basic/taskNotice/add', this.updateFormData, this.addRules, this.$refs.addForm).then(() => {
        this.searchOption()
        this.$Message.success('操作成功')
        this.inputParamFormVisible = false
        this.updateFormData.userId = ''
        this.userIdAll = ''
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
    },
    // 获取userId 用户信息
    requestInformation() {
      const userParam = this.updateFormData
      userParam.deployNodeId = this.paramData.deployNodeId
      userParam.deployFlowId = this.paramData.deployFlowId
      if (userParam.noticeType && userParam.noticeMode) {
        console.log(userParam)

        baseRequest('/basic/users/selects').then(response => {
          this.userIdAll = response.data.item
        })
      }
    },
    cancel() {
      this.updateFormData.userId = ''
      this.userIdAll = ''
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.notifacation-ma .form-search .input-both-3 {
  width: 32.3333%;
}
.notifacation-ma .base-row {
  margin: 5px 0;
}
</style>
<style lang="scss" >
.dialog-default {
  .dialog-contant-default-addOrUpdate {
    padding-top: 30px;
  }
}
</style>