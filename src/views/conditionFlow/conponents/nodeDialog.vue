<template>
    <div>
        <el-dialog title="查看"  :close-on-click-modal='false' append-to-body :visible.sync="formVisible" width="85%" top="8vh" custom-class="dialog-default dialog-default-more no-footer">
            <div class="dialog-contant-default" v-if="formVisible">
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="节点信息" name="first">
                        <node-info :paramData='paramData' v-if="activeName === 'first'"></node-info>
                    </el-tab-pane>
                    <el-tab-pane label="子任务信息" name="second" v-if="subFlag">
                        <child-task ref="childTask" :paramData='paramData' v-if="activeName === 'second'"></child-task>
                    </el-tab-pane>
                    <el-tab-pane label="输入/输出参数" name="three">
                        <param-info :paramData='paramData' v-if="activeName === 'three'"></param-info>
                    </el-tab-pane>
                    <el-tab-pane label="通知列表" name="four" >
                        <notice-monitor :paramData='paramData' v-if="activeName === 'four'"></notice-monitor>
                    </el-tab-pane>
                    <el-tab-pane label="计算条件" name="five" >
                        <condition-info :paramData='paramData' v-if="activeName === 'five'"></condition-info>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>
    </div>  
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import nodeInfo from './nodeInfo'
import childTask from './childTask'
import noticeMonitor from './noticeMonitor'
import paramInfo from './paramInfo'
import conditionInfo from './conditionInfo'
export default {
  directives: { },
  name: 'taskConfigComponentsNodeDialog',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm,
    childTask,
    noticeMonitor,
    paramInfo,
    nodeInfo,
    conditionInfo
  },
  mounted() {
  },
  created() {
  },
  data() {
    return {
      formVisible: false,
      data: {},
      serverList: [],
      tableData: [],
      activeName: '',
      paramData: {},
      subFlag: false
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    openDialog(taskFlowId, model) {
      this.subFlag = model.subFlag !== '0'
      this.paramData.taskFlowId = taskFlowId
      this.paramData.taskNodeId = model.taskNodeId
      this.paramData.deployNodeId = model.id
      this.activeName = 'first'
      this.formVisible = true
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
  .baseUpdate-form {
      margin-left: 40px;
  }
</style>
