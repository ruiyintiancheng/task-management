<template>
  <div>
    <el-dialog v-if="formVisible"
               :title="updateFormData.title"
               :close-on-click-modal='false'
               append-to-body
               :visible.sync="formVisible"
               width="65%"
               custom-class="dialog-default dialog-default-more"
               top='8vh'
               v-el-drag-dialog>
      <div class="dialog-contant-default">
        <el-steps v-if="stepCount>1"
                  :active="dialogForm"
                  simple=""
                  style="margin:10px 0 30px;">
          <el-step v-for="(item,index) in stepCount"
                   :key="index"
                   :title="dialogTitle[index +1 ][paramData.model.shape]"></el-step>
        </el-steps>
        <template v-if="dialogForm===1 && (paramData.model.shape === 'conditionShape' || paramData.model.shape === 'loadShape' || paramData.model.shape === 'startShape' )">
          <el-form class="baseUpdate-form"
                   ref="form"
                   :model="updateFormData"
                   label-width="100px"
                   label-position="left"
                   :rules="paramData.model.shape === 'startShape'? rules2 : rules">
            <el-form-item label="节点名称">
              <el-input class="form-input"
                        v-model="updateFormData.title"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="服务器"
                          prop="serverId">
              <el-select class="form-input"
                         clearable
                         v-model="updateFormData.serverId">
                <el-option v-for="item in serviceList"
                           :key="item.serverId"
                           :label="item.serverDesc"
                           :value="item.serverId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="加载类"
                          prop="classId">
              <el-select @change="initUpdateParams"
                         class="form-input"
                         clearable
                         v-model="updateFormData.classId">
                <el-option v-for="item in taskClassList"
                           :key="item.classId"
                           :label="item.classDesc"
                           :value="item.classId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="重试次数"
                          v-if="paramData.model.shape === 'conditionShape'">
              <el-input class="form-input"
                        v-model="updateFormData.retryCount"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="最早执行时间"
                          v-if="paramData.model.shape === 'conditionShape'">
              <el-time-picker clearable
                              class="form-input"
                              size="mini"
                              v-model="updateFormData.startTime"
                              :format="'HH:mm'"
                              :value-format="'HH:mm'"></el-time-picker>
            </el-form-item>
            <el-form-item label="最晚执行时间"
                          v-if="paramData.model.shape === 'conditionShape'">
              <el-time-picker clearable
                              class="form-input"
                              size="mini"
                              v-model="updateFormData.endTime"
                              :format="'HH:mm'"
                              :value-format="'HH:mm'"></el-time-picker>
            </el-form-item>
            <el-form-item label="时间依赖"
                          v-if="paramData.model.shape === 'conditionShape' && this.updateFormData.timeRequireFlag">
              <el-select class="form-input"
                         v-model="updateFormData.timeRequire"
                         clearable>
                <el-option label="上期流程完成"
                           value="0"></el-option>
                <el-option label="上期节点完成"
                           value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template v-if="dialogForm===1 && paramData.model.shape === 'judgeShape'">
          <judge-table ref="judgeTable"
                       :paramData="updateFormData"></judge-table>
        </template>
        <template v-else-if="dialogForm===2  && (paramData.model.shape === 'conditionShape' || paramData.model.shape === 'startShape' || paramData.model.shape === 'loadShape')">
          <input-table ref="inputTable"
                       :net="paramData.net"
                       :paramData="updateFormData"
                       :nodeModel='paramData.model'
                       :classList='paramData.classList'></input-table>
        </template>
        <template v-else-if="dialogForm===3 && paramData.model.shape === 'startShape'">
          <output-table ref="outputTable"
                        :paramData="updateFormData"
                        :nodeShape='paramData.model.shape'></output-table>
        </template>
        <template v-else-if="(dialogForm===3 && paramData.model.shape === 'conditionShape') || (dialogForm===2 && paramData.model.shape === 'judgeShape')">
          <condition-table ref="conditionTable"
                           :paramData="updateFormData"
                           :nodeModel='paramData.model'
                           :net="paramData.net"></condition-table>
        </template>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button v-if="dialogForm > 1"
                   @click="dialogBefore()">上一步</el-button>
        <el-button v-if="dialogForm !== stepCount"
                   @click="dialogSubmit()"
                   type="primary">下一步</el-button>
        <el-button v-if="dialogForm === stepCount"
                   @click="saveOperate()"
                   type="primary">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import times from '../../../components/cronTrigger/triggerIndex'
import inputTable from './nodeDialogInputTable'
import outputTable from './nodeDialogOutputTable'
import conditionTable from './nodeDialogConditions'
import judgeTable from './nodeDialogJudge'
import { baseRequest } from '@/api/base'
export default {
  directives: {},
  name: 'taskConfigComponentsNodeDialog',
  components: {
    SearchForm,
    BasicTable,
    times,
    UpdateForm,
    inputTable,
    outputTable,
    conditionTable,
    judgeTable
  },
  mounted() {
    this.getServiceInfo()
  },
  created() {
  },
  data() {
    return {
      formVisible: false,
      configData: {},
      tableHeight: 0,
      operateStatus: 1,
      taskClassList: [], // 加载类列表
      taskclassSelect: {}, // 当前选中的节点
      taskClassParamList: [],
      serviceList: [],
      stepCount: 3,
      startNode: {},
      updateFormData: {
        title: '',
        serverId: '',
        classId: '',
        timeRequire: '',
        nodeRequire: '',
        timeRequireFlag: false,
        flowRequire: '',
        retryCount: '',
        startTime: '',
        endTime: '',
        inputParams: [],
        outputParams: [],
        judgeParams: [],
        flowParams: []
      },
      dialogForm: 1,
      dialogTitle: {
        1: {
          'startShape': '基本参数',
          'loadShape': '基本参数',
          'conditionShape': '基本参数',
          'judgeShape': '基本参数'
        },
        2: {
          'startShape': '节点参数',
          'loadShape': '节点参数',
          'conditionShape': '节点参数',
          'judgeShape': '计算条件'
        },
        3: {
          'startShape': '流程参数',
          'conditionShape': '计算条件'
        }
      },
      rules: {
        classId: [
          {
            required: true, message: '请选择任务类'
          }
        ],
        serverId: [
          {
            required: true, message: '请选择服务器'
          }
        ]
      },
      rules2: {
        classId: [
          {
            required: true, message: '请选择任务类'
          }
        ]
        // serverId: [
        //   {
        //     required: true, message: '请选择服务器'
        //   }
        // ]
      }
    }
  },
  props: {
    paramData: Object
  },
  methods: {
    openDialog() {
      this.dialogForm = 1
      for (var key in this.updateFormData) { // 第一步显示的数据赋值
        try {
          this.updateFormData[key] = JSON.parse(JSON.stringify(this.paramData.model[key]))
        } catch (Exception) {
          this.updateFormData[key] = ''
        }
      }
      this.updateFormData.timeRequireFlag = this.startNode.timeRequireFlag || false
      this.taskclassSelect = {} // 将当前选中的任务类数据清空
      this.getTaskClass()
      if (this.paramData.model.shape === 'startShape' || this.paramData.model.shape === 'conditionShape') {
        this.stepCount = 3
      } else {
        this.stepCount = 2
      }
      this.updateFormData.flowId = this.paramData.flowId
      this.formVisible = true
    },
    getTaskClass() { // 获取加载类列表  classType 1 为 加载类类型 2为 计算类 3 为开始节点
      const param = { urlMode: '2' }
      if (this.paramData.model.shape === 'startShape') {
        param.classType = '3'
      } else if (this.paramData.model.shape === 'loadShape') {
        param.classType = '1'
      } else {
        param.classType = '2'
      }
      baseRequest('/basic/classDef/selects', param).then(response => {
        this.taskClassList = response.data.item
      })
    },
    getServiceInfo() { // 获取服务器列表
      baseRequest('/basic/servers/selects', { urlMode: '2' }).then(response => {
        this.serviceList = response.data.item
      })
    },
    saveOperate() {
      if (this.paramData.model.shape !== 'loadShape') {
        const mode = this.updateFormData
        if (mode.inputParams.length !== 0) {
          for (const index in mode.inputParams) {
            if (mode.inputParams[index].requireFlag === '1' && (!mode.inputParams[index].value || mode.inputParams[index].value === '') && (!mode.inputParams[index].refNodeParam || mode.inputParams[index].refNodeParam.length === 0 || mode.inputParams[index].refNodeParam[0] === null)) {
              this.$message({ type: 'error', message: mode.inputParams[index].paramKey + ' 参数项为必填项' })
              return false
            }
          }
        }
      }

      for (var key in this.updateFormData) { // 赋值给当前节点
        this.paramData.model[key] = this.updateFormData[key]
      }
      if (this.paramData.model.shape === 'startShape') {
        this.startNode = this.paramData.model
      }
      this.paramData.net.update(this.paramData.item, this.paramData.model)
      this.paramData.net.refresh()
      this.formVisible = false
    },
    dialogBefore() { // 上一步
      this.dialogForm -= 1
    },
    dialogSubmit() { // 下一步
      if (this.paramData.model.shape !== 'judgeShape') {
        if (this.dialogForm === 1) {
          this.$refs.form.validate(valid => {
            if (valid) {
              this.dialogForm += 1
            } else {
              return false
            }
          })
        } else if (this.dialogForm === 2) {
          // 校验输入参数是否必填
          // const mode = this.updateFormData
          // if (mode.inputParams.length !== 0) {
          //   for (const index in mode.inputParams) {
          //     if (mode.inputParams[index].requireFlag === '1' && (!mode.inputParams[index].value || mode.inputParams[index].value === '') && (!mode.inputParams[index].refNodeParam || mode.inputParams[index].refNodeParam.length === 0 || mode.inputParams[index].refNodeParam[0] === null)) {
          //       this.$message({ type: 'error', message: mode.inputParams[index].paramKey + ' 参数项为必填项' })
          //       return false
          //     }
          //   }
          // }
          this.dialogForm += 1
        }
      } else {
        this.dialogForm += 1
      }
    },
    initUpdateParams(data) { // 和输出参数清空
      // 每次更改都将输入参数清空，由输出页面重新查询数据
      this.updateFormData.inputParams = []
      // 每次更改都将数据库中存储的对于该类的输出参数添加到这个节点对象上
      if (data && data !== '') {
        baseRequest('/basic/classOutputParams/selects', { urlMode: '2', classId: data }).then(response => {
          this.updateFormData.outputParams = response.data.item
          // for (const index in this.updateFormData.outputParams) { // 输出参数添加标志
          //   this.updateFormData.outputParams[index].output = 1
          //   delete this.updateFormData.outputParams[index].paramId
          // }
        })
      } else {
        this.updateFormData.outputParams = []
      }
      if (data && this.paramData.model.shape === 'startShape') { // 如果当前节点是 开始节点并且当前选中的任务类拥有粒度，将时间依赖选项显示
        baseRequest('/basic/classDef/select', { urlMode: '2', classId: data }).then(response => {
          if (response.data.item.granularityFlag === '1') {
            this.updateFormData.timeRequireFlag = true
          } else {
            this.updateFormData.timeRequireFlag = false
          }
        })
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
</style>
