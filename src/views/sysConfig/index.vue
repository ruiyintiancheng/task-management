<template>
  <div class="sys-config">
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
      <div v-show="searchToggle"
           class="form-search">
        <el-form :inline="true"
                 class="demo-table-expand">
          <div class="input-both-3">
            <el-form-item>
              <span class="input-label">参数代码</span>
              <el-input style="width:250px"
                        v-model="configCode"
                        clearable></el-input>
            </el-form-item>
          </div>
          <div class="input-both-3">
            <el-form-item>
              <span class="input-label">参数描述</span>
              <el-input style="width:250px"
                        v-model="configDes"
                        clearable></el-input>
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
                     @click="addParent">添加</el-button>
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <div>
        <el-table :data="data"
                  v-show="tableToggle"
                  :row-key="treeKey"
                  border
                  :height="tableHeight"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="config_code"
                           label="参数代码"
                           align="left"
                           width="200">
          </el-table-column>
          <el-table-column label="参数值"
                           align="center"
                           width="200">
            <template slot-scope="scope">
              <el-tooltip :disabled="textJug(scope.row.config_value)"
                          :content="scope.row.config_value"
                          placement="top"
                          visible-arrow
                          effect="light">
                <div class="basic-table-column">
                  {{ scope.row.config_value}}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="参数描述"
                           align="center">
            <template slot-scope="scope">
              <el-tooltip :disabled="textJug(scope.row.config_des)"
                          :content="scope.row.config_des"
                          placement="top"
                          visible-arrow
                          effect="light">
                <div class="basic-table-column">
                  {{ scope.row.config_des}}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="server_config_id"
                           label="服务器ID"
                           align="center"
                           width="180">
          </el-table-column>
          <el-table-column prop="server_desc"
                           label="服务器描述"
                           align="center"
                           width="180">
          </el-table-column>
          <el-table-column label="操作"
                           width="250"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row"
                         type="primary"
                         plain
                         size="mini"
                         @click="updateOption(scope.row)">修改</el-button>
              <el-button size="mini"
                         plain
                         type="danger"
                         @click="deleteForm(scope.row)">删除</el-button>
              <el-button size="mini"
                         plain
                         v-if="scope.row.server_config_id"
                         v-show="false"></el-button>
              <el-button size="mini"
                         plain
                         v-else
                         @click="addChildren(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <tree-table :data="data" v-show="tableToggle" :pagenation="true" :rowNum="true" :columns="columns" border> -->
        <!-- <tree-table :data="data" v-show="tableToggle" :pagenation="true" :rowNum="true" :columns="columns" border>
          <el-table-column label="操作" width="300" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row" type="primary" plain size="mini" @click="updateOption(scope.row)">修改</el-button>
              <el-button size="mini" plain type="danger" @click="deleteForm(scope.row)">删除</el-button>
              <el-button size="mini" plain v-if="scope.row.server_config_id" v-show="false"></el-button>
              <el-button size="mini" plain v-else @click="addChildren(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </tree-table> -->
      </div>
    </div>
    <el-dialog :title="dialogTitle[operateStatus]"
               :visible.sync="parentFormVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default">
        <el-form :rules="outsideRules"
                 class="baseUpdate-form"
                 ref="formOutside"
                 :model="updateFormData"
                 label-width="120px">
          <el-form-item prop="configCode"
                        label="参数代码">
            <el-input class="form-input"
                      v-model="updateFormData.configCode"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="configValue"
                        label="参数值">
            <el-input class="form-input"
                      v-model="updateFormData.configValue"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="configDes"
                        label="参数描述">
            <el-input class="form-input"
                      v-model="updateFormData.configDes"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="dynamicFlag"
                        label="动态更新标志">
            <el-select class="form-input"
                       v-model="updateFormData.dynamicFlag"
                       clearable>
              <el-option label="支持动态更新"
                         value="1"></el-option>
              <el-option label="不支持动态更新"
                         value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="parentFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogTitle[operateStatus]"
               :visible.sync="childrenFormVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default">
        <el-form :rules="insideRules"
                 class="baseUpdate-form"
                 ref="formInside"
                 :model="updateFormData"
                 label-width="100px">
          <el-form-item prop="serverId"
                        label="服务器">
            <el-select class="form-input"
                       v-model="updateFormData.serverId"
                       placeholder=""
                       clearable>
              <el-option v-for="item in ConfigValue"
                         :key="item.serverId"
                         :label="item.serverDesc"
                         :value="item.serverId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="configValue"
                        label="参数值">
            <el-input class="form-input"
                      v-model="updateFormData.configValue"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="childrenFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
// import SearchForm from 'search-form-ry'
// import BasicTable from 'basic-table-ry'
// import UpdateForm from 'update-form-ry'
// import { getSearchParam } from '@/utils/index'
import { baseRequest } from '@/api/base'
import { saveUpdate } from '@/utils/validate'
const url = '/basic/sysConfig/getTree'
export default {
  name: 'sysConfigIndex',
  components: { treeTable },
  data() {
    return {
      tableHeight: 0,
      outsideRules: {
        configCode: [
          { required: true, message: '该项为必填项' }
        ],
        configValue: [
          { required: true, message: '该项为必填项' }
        ],
        dynamicFlag: [
          { required: true, message: '该项为必填项' }
        ]
      },
      insideRules: {
        configValue: [
          { required: true, message: '该项为必填项' }
        ],
        serverId: [
          { required: true, message: '该项为必填项' }
        ]
      },
      list: [], // 请求原始数据
      treeDataSource: [], // 组合成树表格接收的数据
      components: {
        treeTable
      },
      item: {
        configCode: '',
        configValue: '',
        configDes: '',
        serverDesc: '',
        dynamicFlag: ''
      },
      ConfigValue: [],
      configData: {}, // 模板数据
      configId: null, // 修改保存，删除参数id
      configDes: null,
      configCode: null,
      serverConfigId: null, // 删除子表参数识别
      searchToggle: true,
      tableToggle: true,
      updateFormData: {
        configCode: '',
        configValue: '',
        configDes: '',
        dynamicFlag: '',
        configId: '',
        serverId: '',
        serverConfigId: '',
        serverDesc: ''
      },
      parentFormVisible: false, // 父类数据弹框开关
      childrenFormVisible: false, // 子类数据弹框开关
      operateStatus: null, // 操作选项
      dataType: null, // 识别父类数据，子类数据,1为父类，2为子类
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      },
      option: {
        'dynamicFlag': {
          '1': '支持动态更新',
          '2': '不支持动态更新'
        }
      },
      data: []
    }
  },
  computed: {
    // tableHeight() {
    //   const formDom = document.querySelector('.form-search')
    //   const formHeight = formDom ? formDom.offsetHeight : 0
    //   console.log(formHeight)
    //   return this.$store.state.app.containHeight - formHeight - 200
    // }
  },
  created() {
    this.getOption()
    this.getConfigValue()
  },
  mounted() {
    this.getTableHeight()
  },
  watch: {
    searchToggle() {
      this.getTableHeight()
    }
  },
  methods: {
    // 判断字数提示
    textJug(text) {
      if (text) {
        if (text.length > 20) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    getTableHeight() {
      this.$nextTick(_ => {
        const formDom = document.querySelector('.form-search')
        const formHeight = formDom ? formDom.offsetHeight : 0
        this.tableHeight = this.$store.state.app.containHeight - formHeight - 130
      })
    },
    getConfigValue() {
      baseRequest('/basic/servers/selects', { urlMode: '2' }).then(response => {
        this.ConfigValue = response.data.item
      })
    },
    searchOption() {
      const param = { configCode: this.configCode, configDes: this.configDes } // this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
      baseRequest(url, param).then(response => {
        this.data = response.data.item
      })
    },
    actionFunc(m) {
      alert('编辑')
    },
    deleteFunc(m) {
      alert('删除')
    },
    // 资源删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = { resourceId: row.resourceId }
        baseRequest('/basic/sysConfig/deleteResource', param).then(request => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    // 删除
    deleteForm(row) {
      if (row.server_config_id === undefined) {
        row.server_config_id = ''
      }
      if (row.config_id === undefined) {
        row.config_id = ''
      }
      const param = { serverConfigId: row.server_config_id, configId: row.config_id }
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        baseRequest('/basic/serverConfig/delete', param).then(response => {
          this.getOption()
          this.$Message.success('操作成功')
          this.searchOption()
        })
      }).catch(() => {

      })
    },
    addParent() {
      this.dataType = 1
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      this.parentFormVisible = true
      this.$nextTick(_ => {
        this.$refs.formOutside.clearValidate()
      })
    },
    addChildren(row) {
      this.dataType = 2
      this.operateStatus = 1
      for (var i in this.updateFormData) {
        this.updateFormData[i] = ''
      }
      this.updateFormData.configId = row.config_id
      this.childrenFormVisible = true
      this.$nextTick(_ => {
        this.$refs.formInside.clearValidate()
      })
    },
    // 修改表单
    updateOption(row) {
      this.operateStatus = 2
      this.getUpdateForm(row)
    },
    // 获取修改表单
    getUpdateForm(row) {
      if (row.server_config_id) {
        const param = {
          serverConfigId: row.server_config_id
        }
        baseRequest('/basic/serverConfig/select', param).then(response => {
          this.updateFormData = response.data.item
          this.childrenFormVisible = true
          this.$nextTick(_ => {
            this.$refs.formInside.clearValidate()
          })
        })
      } else {
        const param = {
          configId: row.config_id
        }
        baseRequest('/basic/sysConfig/select', param).then(response => {
          this.updateFormData = response.data.item
          this.parentFormVisible = true
          this.$nextTick(_ => {
            this.$refs.formOutside.clearValidate()
          })
        })
      }
    },
    // 保存操作
    saveOperate() {
      if (this.updateFormData.serverConfigId || this.dataType === 2) {
        saveUpdate('/basic/serverConfig/add', this.updateFormData, this.insideRules, this.$refs.formInside).then(() => {
          this.childrenFormVisible = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      } else {
        saveUpdate('/basic/sysConfig/add', this.updateFormData, this.outsideRules, this.$refs.formOutside).then(() => {
          this.parentFormVisible = false
          this.$Message.success('操作成功')
          this.searchOption()
        })
      }
    },
    getOption() {
      baseRequest(url, { urlMode: '2' }).then(response => {
        this.data = response.data.item
      })
    },
    // 树行数据的key
    treeKey(row) {
      if (row.server_config_id || row.server_config_id === 0) {
        return row.config_id + '' + row.server_config_id
      } else {
        return row.config_id + ''
      }
    }
  }
}
</script>
<style lang="scss">
// .sys-config{
//   .baseUpdate-form {
//     margin-left: calc(50% - 235px);
//     margin-top: 80px;
//   }
//   .child-form {
//       margin-top: 50px;
//     }
//   .el-input--suffix .el-input__inner {
//       padding-right: 0px;
//   }
//   .form-input, .el-date-editor.el-input.form-input {
//       width: 169px;
//   }
// }
</style>
