/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-05-16 10:59:27 
 * @Last Modified by: M.HQ
 * @Last Modified time: 2019-09-06 16:26:04
 * @Desc 计算条件列表
 */
<template>
    <div class="table-demo">
        <el-table :data="paramData.judgeParams" stripe border style="width:100%;" class="judgeList">
            <el-table-column label="节点参数" align="center" width="250">
                <template slot-scope="scope">
                 {{getNodeParamInfo(scope.row.nodeParam)}}
                </template>
            </el-table-column>
            <el-table-column label="表达式" align="center" width="150">
              <!-- 0:等于 1:不等于 2:包含 3:不包含 4:大于 5:小于  -->
                <template slot-scope="scope">
                  {{calModeList[scope.row.calMode]}}
                </template>
            </el-table-column>
            <el-table-column label="值" align="center">
              <template slot-scope="scope">
                    {{scope.row.paramValue}}
                </template>
            </el-table-column>
            <el-table-column label="处理方式" align="center">
              <template slot-scope="scope">
                   {{processModeList[scope.row.processMode]}}
              </template>
            </el-table-column>
            <el-table-column width="150" :render-header="renderHeader" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" plain @click="deleteRow(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
               title="新增参数"
               :close-on-click-modal='false'
               append-to-body
               :visible.sync="formVisible"
               width="50%"
               custom-class="dialog-default dialog-default-more"
               top='8vh'
               v-el-drag-dialog>
            <div class="dialog-contant-default">
              <el-form class="baseUpdate-form" :rules="rules" ref="form" :model="conditionData" label-width="100px" label-position="left">
                <el-form-item label="节点参数" prop="nodeParam">
                  <el-cascader class="form-input" :options="nodeOutPutParams" v-model="conditionData.nodeParam"></el-cascader>
                </el-form-item>
                <el-form-item label="表达式" prop="calMode">
                  <el-select class="form-input" clearable v-model="conditionData.calMode">
                      <el-option label="等于" value="0"></el-option> 
                      <el-option label="不等于" value="1"></el-option>
                      <el-option label="包含" value="2"></el-option>
                      <el-option label="不包含" value="3"></el-option>
                      <el-option label="大于" value="4"></el-option>
                      <el-option label="小于" value="5"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="值" prop="paramValue">
                  <el-input class="form-input" v-model="conditionData.paramValue"></el-input>
                </el-form-item>
                <el-form-item label="处理方式" prop="processMode">
                  <el-select class="form-input" clearable v-model="conditionData.processMode">
                      <el-option label="异常" value="1"></el-option>
                      <el-option label="中止" value="2"></el-option>
                      <el-option label="跳过" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="formVisible = false">取消</el-button>
              <el-button @click="saveOperate()" type="primary">完成</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import formComponents from './formComponents'
// import { baseRequest } from '@/api/base'
export default {
  directives: { },
  name: 'taskConfigComponentsNodeDialogConditions',
  components: {
    SearchForm,
    BasicTable,
    formComponents,
    UpdateForm
  },
  mounted() {
  },
  created() {
    this.getOptions()
  },
  data() {
    return {
      nodeOutPutParams: [],
      formVisible: false,
      conditionData: {
        'nodeParam': [],
        'calMode': '',
        'paramValue': '',
        'processMode': ''
      },
      processModeList: {
        '1': '异常',
        '2': '中止',
        '3': '跳过'
      },
      calModeList: {
        '0': '等于', '1': '不等于', '2': '包含', '3': '不包含', '4': '大于', '5': '小于'
      },
      rules: {
        nodeParam: [
          { required: true, message: '请输入' }
        ],
        calMode: [
          { required: true, message: '请输入' }
        ],
        paramValue: [
          { required: true, message: '请输入' }
        ],
        processMode: [
          { required: true, message: '请输入' }
        ]
      }
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
    net: Object,
    nodeModel: Object
  },
  methods: {
    renderHeader(h) {
      return (
        <div>
          <span>操作 </span>
          <el-button onClick={this.add} type='warning' icon='el-icon-plus' size='mini'></el-button>
        </div>
      )
    },
    add() {
      this.conditionData = {
        'nodeParam': [],
        'calMode': '',
        'paramValue': '',
        'processMode': ''
      }
      this.formVisible = true
      this.$nextTick(_ => {
        this.$refs.form.clearValidate()
      })
      // this.paramData.judgeParams.push({
      //   'nodeParam': [],
      //   'calMode': '',
      //   'paramValue': '',
      //   'processMode': ''
      // })
    },
    getOptions() {
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
          for (var a in outputParams) {
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
    deleteRow(index) {
      this.paramData.judgeParams.splice(index, 1)
    },
    saveOperate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // for (const index in this.paramData.judgeParams) {
          //   if (this.paramData.judgeParams[index].paramKey === this.conditionData.paramKey) {
          //     this.$message({ type: 'error', message: '已存在相同的节点参数' })
          //     return
          //   }
          // }
          this.formVisible = false
          this.paramData.judgeParams.push(this.conditionData)
        } else {
          return false
        }
      })
    },
    getNodeParamInfo(param) {
      if (param && param.length !== 0) {
        for (const key in this.nodeOutPutParams) {
          if (this.nodeOutPutParams[key].value === param[0]) {
            for (const key2 in this.nodeOutPutParams[key].children) {
              if (this.nodeOutPutParams[key].children[key2].value === param[1]) {
                return this.nodeOutPutParams[key].label + ' - ' + this.nodeOutPutParams[key].children[key2].label
              }
            }
          }
        }
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
</style>
