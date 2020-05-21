<template>
  <div>
    <el-dialog v-el-drag-dialog
               title='输入参数'
               :visible.sync="formVisible"
               width="70%"
               custom-class="dialog-default no-footer">
      <div class="dialog-contant-default dialog-inputparams"
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
                             width="250">
              <template slot-scope="scope">
                <el-button type="primary"
                           plain
                           size="mini"
                           v-if="scope.row.defaultFlag !== '1'"
                           @click="updateOption(scope.row)">修改</el-button>
                <el-button type="danger"
                           plain
                           size="mini"
                           v-if="scope.row.defaultFlag !== '1'"
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
                 :rules="rules"
                 :model="updateFormData"
                 label-width="100px"
                 label-position="right">
          <el-form-item prop="paramKey"
                        label="参数名称">
            <el-input class="form-input"
                      v-model="updateFormData.paramKey"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="参数描述"
                        prop="paramDesc">
            <el-input class="form-input"
                      v-model="updateFormData.paramDesc"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="是否必填"
                        prop="requireFlag">
            <el-select class="form-select"
                       v-model="updateFormData.requireFlag"
                       placeholder="">
              <el-option label="否"
                         value="0"></el-option>
              <el-option label="是"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="表单类型"
                        prop="formType">
            <el-select v-model="updateFormData.formType"
                       @change="changeFormType">
              <el-option v-for="(value,key) in formTypeSelects"
                         :key='key'
                         :label='value'
                         :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="updateFormData.formType === 'select' || updateFormData.formType === 'asynSelect'"
                        label="表单下拉选项">
            <el-select class="form-select"
                       v-model="updateFormData.formParam"
                       @change="getFormSelectDefaultSelect">
              <el-option v-for="(value,key) in formSelectSelects"
                         :key='key'
                         :label='value'
                         :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="updateFormData.formType === 'selectComponent'"
                        label="组件下拉选项">
            <el-select class="form-select"
                       v-model="updateFormData.formParam">
              <el-option v-for="value in formSelectComponents"
                         :key='value.componentId'
                         :label="value.componentDesc+'-'+value.field_convert_map.selectType"
                         :value="value.componentId+''"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="updateFormData.formType === 'cascader'"
                        label="表单下拉选项">
            <el-select class="form-select"
                       v-model="updateFormData.formParam">
              <el-option v-for="(value,key) in formSelectCascader"
                         :key='value'
                         :label='key'
                         :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="updateFormData.formType === 'remoteSelect'"
                        label="表单下拉请求">
            <el-select class="form-select"
                       v-model="updateFormData.formParam">
              <el-option v-for="(value,key) in formSelectResources"
                         :key='key'
                         :label='value'
                         :value="key"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-if="updateFormData.formType !== 'remoteSelect'" label="表单默认值">
            <el-select v-if="updateFormData.formType === 'select' || updateFormData.formType === 'asynSelect'" v-model="updateFormData.defaultValue" clearable>
              <el-option v-for="(value,key) in formSelectDefaultSelect" :key='key' :label='value' :value="key"></el-option>
            </el-select>
            <el-input v-else class="form-input" v-model="updateFormData.formParam"></el-input>
          </el-form-item> -->
          <el-form-item v-if="updateFormData.formType === 'textRange' || updateFormData.formType === 'dateRange'"
                        label="结束默认值">
            <el-input class="form-input"
                      v-model="updateFormData.formParam"></el-input>
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
import UpdateForm from 'update-form-ry'
import { baseRequest } from '@/api/base'
var url = '/basic/classInputParams/selects' // 获取该任务类的输入参数
export default {
  directives: { elDragDialog },
  name: 'taskclassInputDialog',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm
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
      formTypeSelects: [],
      updateFormData: {
        paramKey: '',
        paramDesc: '',
        formType: '',
        formParam: '',
        requireFlag: '' },
      inputParamFormVisible: false,
      operateStatus: 1,
      formSelectResources: [],
      formSelectSelects: {}, // 下拉select选项
      formSelectCascader: [], // 下拉select选项
      formSelectComponents: [], // 下拉select选项
      formSelectDefaultSelect: {}, // 表单下拉select默认值下拉
      rules: {
        paramKey: [
          {
            required: true, message: '请输入', trigger: 'blur'
          }
          // {
          //   validator: (rules, value, callback) => {
          //     if (/^\d+/.test(value)) {
          //       callback()
          //     } else {
          //       callback(new Error('只能输入数字'))
          //     }
          //   }
          // }
        ],
        paramDesc: [
          {
            required: true, message: '请输入'
          }
        ],
        formType: [
          {
            required: true, message: '请输入'
          }
        ],
        requireFlag: [
          {
            required: true, message: '请输入'
          }
        ]
      }
    }
  },
  props: {
    paramData: Object
  },
  methods: {
    openDialog() {
      this.formVisible = true
      this.getOption()
      this.getSelects()
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
          this.tableHeight = document.querySelector('.dialog-contant-default.dialog-inputparams').offsetHeight - 250
          this.searchOption()
        })
      })
    },
    // 改变formtype事件
    changeFormType(val) {
      this.updateFormData.formParam = ''
      // this.formInputModel.formSelects = ''
      // this.formInputModel.defaultValue = ''
      // this.formInputModel.defaultRangeValue = ''
      // if (this.updateFormData.formType === 'selectComponent') {
      //   baseRequest('/t00VueComponent/selects', { urlMode: '2' }).then(response => {
      //     this.formSelectComponents = response.data.item
      //   })
      // }
    },
    getFormSelectDefaultSelect() {

    },
    getSelects() { // 获取下拉选项节点
      baseRequest('/basic/common/getSelectOptions', { dictType: 'vueComponents' }).then(response => {
        const temp = response.data.item
        delete temp.table
        delete temp.column
        this.formTypeSelects = temp
      })
      baseRequest('/basic/resourceParams/getCascaderOptions').then(response => {
        this.formSelectCascader = response.data.item
      })
      baseRequest('/basic/common/getSelectOptions', { dictType: 'basicDictType' }).then(response => {
        this.formSelectSelects = response.data.item
      })
      baseRequest('/basic/resource/getFormSelectResources').then(response => {
        this.formSelectResources = response.data.item
      })
      baseRequest('/basic/t00VueComponent/selects', { urlMode: '2' }).then(response => {
        this.formSelectComponents = response.data.item
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
      baseRequest('/basic/classInputParams/select', param).then(response => {
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = this.updateFormData
          param.classId = this.paramData.classId
          baseRequest('/basic/classInputParams/add', param).then(response => {
            this.searchOption()
            this.$Message.success('操作成功')
            this.inputParamFormVisible = false
          })
        }
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
        baseRequest('/basic/classInputParams/delete', param).then(request => {
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
    margin-left: calc(50% - 150px);
    .form-input {
      width: 200px;
    }
  }
}
</style>
