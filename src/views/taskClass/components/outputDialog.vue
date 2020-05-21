<template>
  <div>
    <el-dialog v-el-drag-dialog
               title='输出参数'
               :visible.sync="formVisible"
               width="70%"
               custom-class="dialog-default no-footer">
      <div class="dialog-contant-default dialog-outputparams"
           style="text-align:left;">
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
                         @click="addParam()">添加</el-button>
              <a @click="tableToggle=false"
                 v-if="tableToggle">
                <svg-icon icon-class="up" />&nbsp;收起</a>
              <a @click="tableToggle=true"
                 v-else>
                <svg-icon icon-class="down" />&nbsp;展开</a>
            </div>
          </div>
          <basic-table v-show="tableToggle"
                       :height="tableHeight"
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
                           @click="updateOption(scope.row)">修改</el-button>
                <el-button type="danger"
                           plain
                           size="mini"
                           @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </basic-table>
        </div>
      </div>
    </el-dialog>
    <el-dialog :title="dialogTitle[operateStatus]"
               append-to-body
               :visible.sync="inputParamFormVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-form class="baseUpdate-form"
                 ref="form"
                 :model="updateFormData"
                 label-width="100px">
          <el-form-item>
            <span class="input-label">参数名称</span>
            <el-input class="form-input"
                      v-model="updateFormData.paramKey"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <span class="input-label">参数描述</span>
            <el-input class="form-input"
                      v-model="updateFormData.paramDesc"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="inputParamFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog'
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import { baseRequest } from '@/api/base'
var url = '/basic/classOutputParams/selects' // 获取该任务类的输入参数
export default {
  directives: { elDragDialog },
  name: 'taskclassOutputDialog',
  components: {
    SearchForm,
    BasicTable
  },
  mounted() {
  },
  created() {
  },
  data() {
    return {
      formVisible: false,
      configData: {},
      tableToggle: true,
      searchToggle: true,
      tableHeight: 0,
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      },
      updateFormData: {
        paramKey: '',
        paramDesc: ''
      },
      inputParamFormVisible: false,
      operateStatus: 1
    }
  },
  props: {
    paramData: Object
  },
  methods: {
    openDialog() {
      this.formVisible = true
      this.getOption()
    },
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      param.classId = this.paramData.classId
      this.$refs.basicTable.getData(url, param)
    },
    getOption() {
      baseRequest(url, { urlMode: '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        this.$nextTick(_ => {
          this.tableHeight = document.querySelector('.dialog-contant-default.dialog-outputparams').offsetHeight - 250
          this.searchOption()
        })
      })
    },
    addParam() {
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      delete this.updateFormData.paramId
      this.inputParamFormVisible = true
    },
    // 获取修改表单
    updateOption(row) {
      this.operateStatus = 2
      const param = { paramId: row.paramId }
      baseRequest('/basic/classOutputParams/select', param).then(response => {
        const result = response.data.item
        for (var i in this.updateFormData) {
          this.updateFormData[i] = result[i]
        }
        this.updateFormData.paramId = result.paramId
        this.$nextTick(function() {
          this.inputParamFormVisible = true
          this.clearError()
        })
      })
    },
    saveOperate() {
      const param = this.updateFormData
      param.classId = this.paramData.classId
      baseRequest('/basic/classOutputParams/add', param).then(response => {
        this.searchOption()
        this.$Message.success('操作成功')
        this.inputParamFormVisible = false
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          paramId: row.paramId
        }
        baseRequest('/basic/classOutputParams/delete', param).then(request => {
          this.searchOption()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    }
  },
  watch: {
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
