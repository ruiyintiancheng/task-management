/*
 * @Author: M.HQ 
 * @Date: 2019-04-27 14:25:14 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-07-23 11:46:41
 * @Description: 节点日志查看
 */

<template>
  <el-dialog title="节点日志"
             width="80%"
             v-el-drag-dialog
             append-to-body
             :close-on-click-modal='false'
             :visible.sync="nodeDetailsVisible"
             custom-class="dialog-default no-footer">
    <div class="dialog-contant-default">
      <div class="app-container">
        <div class="ai-container node_log">
          <el-tabs v-model="activeName2"
                   type="card"
                   @tab-click="handleClick">
            <el-tab-pane label="节点信息"
                         name="first">
              <node-information ref="targetTable"
                                :paramData='paramData'></node-information>
            </el-tab-pane>
            <el-tab-pane label="节点输入参数"
                         name="second">
              <input-parameter ref="sourceTable"
                               :paramData='paramData'>
              </input-parameter>
            </el-tab-pane>
            <el-tab-pane label="节点输出参数"
                         name="three">
              <output-parameter ref="outputParameter"
                                :paramData='paramData'>
              </output-parameter>
            </el-tab-pane>
            <el-tab-pane label="计算条件"
                         name="four">
                <condition-params :paramData='paramData' v-if="activeName2 === 'four'"></condition-params>
            </el-tab-pane>
            <el-tab-pane label="通知管理"
                         name="fourth">
              <notification-management ref="notificationManagement"
                                       :paramData='paramData'>
              </notification-management>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
// import { baseRequest } from '@/api/base'
import nodeInformation from './nodeInformation'
import inputParameter from './inputParameter'
import outputParameter from './outputParameters'
import notificationManagement from './notificationManagement'
import conditionParams from './conditionInfo'
export default {
  directives: {},
  name: 'deployedProcessComponentsNodeLog',
  components: {
    nodeInformation,
    inputParameter,
    outputParameter,
    notificationManagement,
    conditionParams
  },
  data() {
    return {
      activeName2: 'first',
      listLoading: false, // 加载圆圈是否显示
      nodeDetailsVisible: false,
      options: {
        'logLevel': {
          '1': 'debug',
          '2': 'info',
          '3': 'error',
          '4': 'exception'
        },
        'nodeType': {
          '0': '开始节点',
          '1': '结束节点',
          '4': '计算节点'
        },
        'calStatus': {
          '0': '计算失败',
          '1': '未计算',
          '2': '未重算',
          '3': '等待计算',
          '4': '等待重算',
          '5': '计算中',
          '6': '重算中',
          '7': '计算完成',
          '8': '线程等待'
        }
      }, // 转义字符的翻译
      configData: [], // 模板数据
      // total: null,
      pageNo: 1,
      pageSize: null,
      nodeData: {} // 节点信息
    }
  },
  props: {
    paramData: Object
  },
  created() {
  },
  methods: {
    openDialog() {
      this.nodeDetailsVisible = true
      this.$nextTick(_ => {
        if (this.activeName2 === 'first') {
          this.$refs.targetTable.searchOption()
        } else if (this.activeName2 === 'second') {
          this.$refs.sourceTable.searchOption()
        } else if (this.activeName2 === 'three') {
          this.$refs.outputParameter.searchOption()
        } else {
          this.$refs.notificationManagement.searchOption()
        }
      })
    },
    handleClick(tab, event) {
      if (this.activeName2 === 'first') {
        this.$refs.targetTable.searchOption()
      } else if (this.activeName2 === 'second') {
        this.$refs.sourceTable.searchOption()
      } else if (this.activeName2 === 'third') {
        this.$refs.outputParameter.searchOption()
      } else {
        this.$refs.notificationManagement.searchOption()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form-input-range.form-info {
  width: 80%;
}
.el-form-item.el-form-item--medium {
  margin-bottom: 10px;
}
</style>

<style lang="scss">
.node_log {
  .el-tabs__header {
    margin: 0;
  }
}
</style>


