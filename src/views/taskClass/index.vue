/*
 * @Author: M.HQ 
 * @Date: 2019-04-3 15:48:29 
 * @Last Modified by: M.HQ
 * @Last Modified time: 
 * @Description: 任务类管理
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
                         width="350">
          <template slot-scope="scope">
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="inputParam(scope.row)">输入</el-button>
            <!-- <el-button type="success" plain size="mini" v-if="scope.row.classType === '2'" @click="outputParam(scope.row)">输出参数</el-button> -->
            <el-button type="success"
                       plain
                       size="mini"
                       @click="outputParam(scope.row)">输出</el-button>
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
    <el-dialog :title="dialogTitle[operateStatus]"
               :visible.sync="formVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-form class="baseUpdate-form"
                 ref="form"
                 :model="updateFormData"
                 label-width="100px">
          <el-form-item>
            <span class="input-label">类名</span>
            <el-input class="form-input"
                      v-model="updateFormData.className"
                      :disabled='operateStatus === 2'
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <span class="input-label">任务类描述</span>
            <el-input class="form-input"
                      v-model="updateFormData.classDesc"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <span class="input-label">任务类类型</span>
            <el-select class="form-select"
                       v-model="updateFormData.classType"
                       :disabled='operateStatus === 2'
                       placeholder="">
              <el-option label="加载类"
                         value="1"></el-option>
              <el-option label="计算类"
                         value="2"></el-option>
              <el-option label="开始节点"
                         value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="updateFormData.classType === '2'">
            <span class="input-label">是否有子任务</span>
            <el-select class="form-select"
                       v-model="updateFormData.subFlag"
                       :disabled='operateStatus === 2'
                       placeholder="">
              <el-option label="无"
                         value="0"></el-option>
              <el-option label="有"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="updateFormData.classType === '3'">
            <span class="input-label">粒度标志</span>
            <el-select class="form-select"
                       v-model="updateFormData.granularityFlag"
                       :disabled='operateStatus === 2'
                       placeholder="">
              <el-option label="无"
                         value="0"></el-option>
              <el-option label="有"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span class="input-label">节点样式</span>
            <el-input class="form-input"
                      v-model="updateFormData.nodeStyle"
                      :disabled='operateStatus === 2'
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
    <input-dialog ref="inputDialog"
                  :paramData="paramData"></input-dialog>
    <output-dialog ref="outputDialog"
                   :paramData="paramData"></output-dialog>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import inputDialog from './components/inputDialog'
import outputDialog from './components/outputDialog'
import { baseRequest } from '@/api/base'
const url = '/basic/classDef/selects'
export default {
  directives: {},
  name: 'taskClassIndex',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm,
    inputDialog,
    outputDialog
  },
  data() {
    return {
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      updateFormData: {}, // 弹框数据
      formVisible: false, // 弹框开关
      roleFormVisible: false, // 弹框开关
      languageData: null, // 语言设置数据
      operateStatus: null, // 操作选项
      msgId: null, // 修改保存参数id
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      },
      paramData: {
        classId: ''
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
    // 添加
    addTask() {
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      this.formVisible = true
    },
    // 修改表单
    updateOption(row) {
      this.operateStatus = 2
      this.getUpdateForm(row)
    },
    // 获取修改表单
    getUpdateForm(row) {
      const param = {
        classId: row.classId
      }
      baseRequest('/basic/classDef/select', param).then(response => {
        this.updateFormData = response.data.item
        this.formVisible = true
      })
    },
    // 保存操作
    saveOperate() {
      baseRequest('/basic/classDef/add', this.updateFormData).then(response => {
        this.searchOption()
        this.$Message.success('操作成功')
        this.formVisible = false
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          classId: row.classId
        }
        baseRequest('/basic/classDef/delete', param).then(request => {
          this.searchOption()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    inputParam(row) {
      this.paramData.classId = row.classId
      this.$refs.inputDialog.openDialog()
    },
    outputParam(row) {
      this.paramData.classId = row.classId
      this.$refs.outputDialog.openDialog()
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
</style>



