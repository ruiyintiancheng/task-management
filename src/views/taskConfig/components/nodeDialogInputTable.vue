<template>
  <div class="table-demo dialog-input-table">
    <el-collapse v-model="activeNames"
                 style="margin: 5px"
                 accordion>
      <el-collapse-item title="输入参数"
                        name="1"
                        class="collapse-head">
        <div class="base-row">
          <!-- <div class="row-botton clearfix">
              <div class="row-title">
                <svg-icon icon-class="ul" />
                <span>输入参数</span>
              </div>
            </div> -->
          <el-table :data="paramData.inputParams"
                    stripe
                    border
                    style="width:100%;">
            <el-table-column label="名称"
                             align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.requireFlag === '1'"
                      style="color:red;">* </span><span>{{scope.row.paramKey}}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述"
                             align="center">
              <template slot-scope="scope">
                <span>{{scope.row.paramDesc}}</span>
              </template>
            </el-table-column>
            <el-table-column label="节点参数"
                             align="center"
                             v-if="nodeOutPutParams.length != 0">
              <template slot-scope="scope">
                <el-cascader clearable
                             :options="nodeOutPutParams"
                             v-model="scope.row.refNodeParam"></el-cascader>
              </template>
            </el-table-column>
            <el-table-column label="默认类型值"
                             align="center"
                             width="220">
              <template slot-scope="scope">
                <formComponents :paramData="scope.row"></formComponents>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <el-collapse-item title="输出参数"
                        name="2"
                        class="collapse-head">
        <div class="base-row">
          <!-- <div class="row-botton clearfix">
            <div class="row-title">
              <svg-icon icon-class="ul" />
              <span>输出参数</span>
            </div>
          </div> -->
          <el-table :data="paramData.outputParams"
                    stripe
                    border
                    style="width:100%;">
            <el-table-column label="名称"
                             align="center">
              <template slot-scope="scope">
                <span>{{scope.row.paramKey}}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述"
                             align="center">
              <template slot-scope="scope">
                <span>{{scope.row.paramDesc}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import formComponents from './formComponents'
import { baseRequest } from '@/api/base'
export default {
  directives: {},
  name: 'taskConfigComponentsNodeDialogInputTable',
  components: {
    SearchForm,
    BasicTable,
    formComponents,
    UpdateForm
  },
  mounted() {
    this.selectNodeOutParams()
  },
  created() {
    if (this.paramData.classId === '') {
      this.paramData.inputParams = []
    } else {
      if (!this.paramData.inputParams || this.paramData.inputParams.length === 0) { // 不需要每次都查询，如果该节点的输入列表中有参数就不需要查询该任务类有多少个输入参数
        baseRequest('/basic/classInputParams/getInputParamExpress', { urlMode: '2', classId: this.paramData.classId }).then(response => {
          for (const iterator of response.data.item) {
            iterator.refNodeId = ''
            iterator.refParamId = ''
          }
          this.paramData.inputParams = response.data.item
        })
      } else {
        const input = this.classList['input' + this.paramData.classId]
        // 判断存储的输入参数和 数据库中输入参数是否一致
        const nodeInputparams = this.paramData.inputParams
        for (const index in input) {
          let b = true
          for (const index2 in nodeInputparams) {
            if (nodeInputparams[index2].paramKey === input[index].paramKey) {
              b = false
            }
          }
          if (b) {
            this.paramData.inputParams.push(input[index])
          }
        }

        const output = this.classList['output' + this.paramData.classId]
        const nodeOutputparams = this.paramData.outputParams
        for (const index in output) {
          let b = true
          for (const index2 in nodeOutputparams) {
            if (nodeOutputparams[index2].paramKey === output[index].paramKey) {
              b = false
            }
          }
          if (b) {
            this.paramData.nodeOutputparams.push(output[index])
          }
        }
      }
    }
  },
  data() {
    return {
      nodeOutPutParams: [],
      activeRow: null,
      refParamMap: [],
      activeNames: '1'
    }
  },
  props: {
    paramData: {
      type: Object,
      default: function() {
        return {
        }
      }
    },
    nodeModel: Object,
    net: Object,
    classList: Object
  },
  methods: {
    selectChangeHandle(scope) {
      this.refParamMap = this.getChildren(scope.row.refNodeId)
    },
    selectNodeOutParams(row) {
      this.activeRow = row
      // 查找箭头的来源及所有上级节点
      // console.log(this.net.getNodes(), this.net.getEdges())
      const nodes = this.net.getNodes() // 获取所有节点
      const nodeMap = {} // 存放所有的节点信息 key 为节点id value 为节点数组
      for (var k in nodes) {
        nodeMap[nodes[k].getModel().id] = nodes[k].getModel()
      }
      const edges = this.net.getEdges()

      const map = {}
      for (var i in edges) {
        const model = edges[i].getModel()
        let targetMap = map[model.target]
        if (!targetMap) {
          targetMap = { 'children': [] }
          map[model.target] = targetMap
        }
        targetMap.id = model.target
        let sourceMap = map[model.source]
        if (!sourceMap) {
          sourceMap = { 'children': [] }
          map[model.source] = sourceMap
        }
        sourceMap.id = model.source
        targetMap.children.push(sourceMap)
      }
      const data = map[this.nodeModel.id]
      this.nodeOutPutParams = []
      const set = {}
      this.getOutputParams(data.children, nodeMap, set)
      for (const key in set) {
        if (set[key].children.length !== 0) {
          this.nodeOutPutParams.push(set[key])
        }
      }
    },
    getOutputParams(data, nodeMap, set) {
      if (data.length === 0) {
        return
      }
      for (var k in data) {
        const option = []
        const nodeinfo = nodeMap[data[k].id]
        const outputParams = nodeinfo.outputParams
        if (outputParams && outputParams.length !== 0) {
          for (const a in outputParams) {
            option.push({ 'value': outputParams[a].paramKey, 'label': outputParams[a].paramDesc })
          }
        }
        const flowParam = nodeinfo.flowParams
        if (flowParam && flowParam.length !== 0) {
          for (const a in flowParam) {
            option.push({ 'value': flowParam[a].paramKey, 'label': flowParam[a].paramDesc })
          }
        }
        set[data[k].id] = {
          'label': nodeMap[data[k].id].title,
          'value': nodeMap[data[k].id].id,
          'children': option
        }
        this.getOutputParams(data[k].children, nodeMap, set)
      }
    },
    getChildren(value) {
      if (value) {
        for (var i in this.nodeOutPutParams) {
          if (this.nodeOutPutParams[i].value === value) {
            return this.nodeOutPutParams[i].children
          }
        }
      }
      return []
    },
    getClassList(classList) {
      baseRequest('/basic/classDef/getClassInfo', { 'classList': classList }).then(response => {
        this.classList = response.data.item.classList
      })
    },
    getHeight() {
      this.clientHeight = `${document.documentElement.clientHeight}`
      return this.clientHeight * 0.85 - 25 - 48 - 6 - 48 - 66 - 25 - 46 - 60 - 60
    }
  },
  watch: {
  }
}
</script>
<style lang="scss">
.collapse-head .el-collapse-item__header {
  font-size: 16px;
  color: #409eff;
}
.dialog-input-table {
  .el-collapse-item__wrap {
    overflow: initial;
  }
  .el-table {
    overflow: initial;
    .el-table__body-wrapper {
      overflow: initial;
      .cell {
        overflow: initial;
      }
    }
  }
}
</style>
