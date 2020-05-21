<template>
  <div>
    <el-dialog :title="title"
               fullscreen
               append-to-body
               :close-on-click-modal='false'
               :visible.sync="formVisible"
               custom-class="dialog-default no-padding no-footer">
      <div class="dialog-contant-default"
           v-if="formVisible">
        <el-tabs v-model="activeName"
                 class="conditionTabs">
          <el-tab-pane label="计算流程图"
                       name="first">
            <div class="task-options">
              <div class="btn-group">
                <div class="btn btn-flush"
                     @click="flashCanvas">
                  <el-button size="mini"
                             plain>刷新</el-button>
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="ignore" /> 忽略条件
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="jump" /> 跳过
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="stopHandler" /> 中止
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="subTask" /> 子任务
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="reRun" /> 重算中
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="runShape" /> 计算中
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="noRecalculatedShape" /> 未重算
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="noCalculatedShape" /> 未计算
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="errorShape" /> 失败
                </div>
                <div class="btn img-btn">
                  <img class="btn mode"
                       :src="successShape" /> 成功
                </div>
                <div class="btn legend">图例</div>
              </div>
            </div>
            <div id="flowChart">
              <ul class='contextmenu g6execute'>
                <li @click="setSuccess()">设置成完成</li>
                <li v-if="reShow"
                    @mouseover="secondFloor=true"
                    @mouseout="secondFloor=false">重算
                  <ul class='contextmenu g6execute second-floor'
                      v-show="secondFloor">
                    <li @click="recalculation(1)">当前节点</li>
                    <li @click="recalculation(2)">所有下级</li>
                    <li @click="recalculation(3)">当前及所有下级</li>
                  </ul>
                </li>
                <li v-if="handerShow"
                    @mouseover="threeFloor=true"
                    @mouseout="threeFloor=false">处理
                  <ul class='contextmenu g6execute second-floor'
                      v-show="threeFloor">
                    <li @click="processMode(2)">中止</li>
                    <li @click="processMode(3)">跳过</li>
                    <li @click="processMode(4)">忽略条件</li>
                  </ul>
                </li>
              </ul>
              <node-dialog ref="nodeDialog"></node-dialog>
            </div>
            <flow-structure ref="flowStructure"
                            @centeNode="centeNode"
                            :nodes="nodes"></flow-structure>
          </el-tab-pane>
          <el-tab-pane label="计算流程列表"
                       name="second">
            <table-list :taskFlowId='taskFlowId'
                        @searchNode='searchNode'
                        @openNodeDialog='openNodeDialog'></table-list>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <el-dialog title="下级节点信息"
               append-to-body
               :close-on-click-modal='false'
               :visible.sync="nodeVisible"
               top="8vh"
               custom-class="dialog-default dialog-default-more">
      <div class="dialog-contant-default">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column type="index"
                           width="50"></el-table-column>
          <el-table-column prop="node_name"
                           label="节点名称"></el-table-column>
          <el-table-column prop="field_convert_map.node_type"
                           label="节点类型"></el-table-column>
          <el-table-column label="服务器ID">
            <template slot-scope="scope">
              {{serverMap[scope.row.server_id] }}
            </template>
          </el-table-column>
          <el-table-column label="是否重设子任务">
            <template slot-scope="scope">
              <el-select v-if="scope.row.sub_task_count !== 0"
                         v-model="scope.row.reSub"
                         placeholder="请选择">
                <el-option label="否"
                           value="0"></el-option>
                <el-option label="是"
                           value="1"> </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="nodeVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmRe()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import noCalculatedShape from '../../../assets/flowPng/noCalculated.png' // 未计算
import errorShape from '../../../assets/flowPng/error.png' // 错误
import successShape from '../../../assets/flowPng/success.png' // 成功
import runShape from '../../../assets/flowPng/run.png' // 运行中
import reRun from '../../../assets/flowPng/reRun.png'
import noRecalculatedShape from '../../../assets/flowPng/noRecalculated.png' // 未重算
import subTask from '../../../assets/flowPng/subTask.png' // 子任务图标
import stopHandler from '../../../assets/flowPng/stopHandler.png' // 停止处理
import jump from '../../../assets/flowPng/jump.png' // 跳过处理
import ignore from '../../../assets/flowPng/ignore.png' // 忽略处理
import { registG6Shape } from '../../../utils/g6Shape'
import nodeDialog from './nodeDialog'
import flowStructure from './flowStructure'
import { baseRequest } from '@/api/base'
import tableList from './tableList'
export default {
  currentFun: '',
  directives: {},
  name: 'conditionFlowConponentsProcessG6',
  components: {
    baseRequest,
    nodeDialog,
    tableList,
    flowStructure
  },
  mounted() {
  },
  created() {
    this.getServiceInfo()
  },
  props: {
  },
  data() {
    return {
      net: null,
      Util: '',
      activation: '', // 当前激活的节点
      formVisible: false,
      taskFlowId: '',
      title: '',
      secondFloor: false,
      threeFloor: false,
      activeNode: '',
      reShow: true, // 重算是否显示
      handerShow: false,
      nodeVisible: false, // 下级节点信息弹窗
      tableData: [],
      serverMap: {},
      code: '',
      activeName: 'first', // 当前标签页
      nodes: [], // 节点数组,
      noRecalculatedShape,
      runShape,
      errorShape,
      successShape,
      noCalculatedShape,
      subTask,
      stopHandler,
      jump,
      ignore,
      reRun
    }
  },
  methods: {
    initG6() {
      const self = this
      self.Util = window.G6.Util
      self.net = new window.G6.Net({
        id: 'flowChart', // 容器ID
        mode: 'default',
        modes: {
          default: ['shortcut', 'dragCanvas', 'wheelZoom', 'clickFocus']
        },
        grid: {
          forceAlign: true, // 是否支持网格对齐
          cell: 15 // 网格大小
        },
        fitView: 'lc', // 布局
        width: document.body.offsetWidth, // 画布宽
        height: document.body.offsetHeight - 123 // 画布高
      })
      // 双击事件
      self.net.on('dblclick', (ev) => {
        if (self.Util.isNode(ev.item)) {
          const model = ev.item.getModel()
          self.$refs.nodeDialog.openDialog(self.taskFlowId, model) // 显示弹窗
        }
      })
      self.net.on('click', (ev) => {
        const contextmenu = document.querySelector('.contextmenu.g6execute') // 右键的菜单
        contextmenu.style.display = 'none'
      })
      // 右键事件
      self.net.on('contextmenu', (ev) => {
        this.activation = ev.item
        const isNode = self.Util.isNode(ev.item) // 判断是否是节点
        const contextmenu = document.querySelector('.contextmenu.g6execute') // 右键的菜单
        if (isNode) {
          const model = ev.item.getModel()
          if (model.shape !== 'endShape') { // 除去结束节点
            self.activeNode = model
            const style = contextmenu.style // 获取style 属性
            style.left = ev.domEvent.x + 'px' // 获取当前鼠标的位置并设置菜单的 x
            style.top = ev.domEvent.y - 120 + 'px'
            style.display = 'block' // 设置显示
            // 判断节点是否显示 处理 选项
            if (model.calStatus === '1') {
              self.handerShow = true
            } else {
              self.handerShow = false
            }
            if (model.calStatus === '0' || model.calStatus === '5') {
              self.reShow = true
            } else {
              self.reShow = false
            }
          } else {
            console.log('未找到菜单')
          }
        } else {
          contextmenu.style.display = 'none'
        }
      })
      // 注册节点形状
      registG6Shape()
      // 流程方形 节点创建
      self.net.render()
    },
    openDialog(row) {
      this.taskFlowId = row.task_flow_id
      this.title = row.flow_name + ' - ' + row.data_time
      this.formVisible = true
      this.$nextTick(_ => {
        const flowChart = document.querySelector('#flowChart')
        flowChart.oncontextmenu = function(e) {
          return false
        }
        this.flashCanvas()
      })
    },
    openDialog2(row) {
      this.taskFlowId = row.taskFlowId
      this.title = row.flowName + ' - ' + row.dataTime
      this.formVisible = true
      this.$nextTick(_ => {
        const flowChart = document.querySelector('#flowChart')
        flowChart.oncontextmenu = function(e) {
          return false
        }
        this.flashCanvas(row.deployNodeId)
      })
    },
    getServiceInfo() { // 获取服务器列表
      baseRequest('/basic/servers/selects', { urlMode: '2' }).then(response => {
        const data = response.data.item
        for (const index in data) {
          this.serverMap[data[index].serverId] = data[index].serverDesc
        }
      })
    },
    setSuccess() {
      baseRequest('/basic/taskNode/update', { taskNodeId: this.activation.getModel().taskNodeId, nodeStatus: '5' }).then(response => {
        this.$Message.success('操作成功')
        this.flashCanvas()
      })
    },
    flashCanvas(id) {
      const contextmenu = document.querySelector('.contextmenu.g6execute') // 右键的菜单
      contextmenu.style.display = 'none'
      baseRequest('/basic/taskFlow/getTaskFlowInfo?1=' + new Date().getTime(), { 'taskFlowId': this.taskFlowId }).then(response => {
        try {
          this.net.destroy()
        } catch (error) {
          //
        }
        this.initG6()
        this.nodes = response.data.item.nodes
        this.net.source(response.data.item)
        this.net.render()
        if (id) {
          const node = this.net.find(id)
          // this.net.setItemActived(node)
          const model = node.getModel()
          this.net.focusPoint({ x: model.x, y: model.y })
        }
      })
    },
    recalculation(code) { // 重算
      if (code === 1) { // 重算当前节点
        if (this.activation.getModel().subFlag !== '0') {
          this.$confirm('子任务是否重新设置?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            baseRequest('/basic/taskNode/updateStatus', { 'taskNodeId': this.activeNode.taskNodeId, 'code': code, 'reSetSub': '1' }).then(response => {
              this.$Message.success('操作成功')
              this.flashCanvas()
            })
          }).catch(() => {
            baseRequest('/basic/taskNode/updateStatus', { 'taskNodeId': this.activeNode.taskNodeId, 'code': code }).then(response => {
              this.$Message.success('操作成功')
              this.flashCanvas()
            })
          })
        } else { // code === '2' 重算下级节点 ; code === '3' 重算当前及下级所有节点;
          baseRequest('/basic/taskNode/updateStatus', { 'taskNodeId': this.activeNode.taskNodeId, 'code': code }).then(response => {
            this.$Message.success('操作成功')
            this.flashCanvas()
          })
        }
      } else { // 下级
        // 弹窗显示所有下级所有节点,根据code是否返回当前节点的信息
        baseRequest('/basic/taskNode/getCurrentNodeNextListNode', { 'taskNodeId': this.activeNode.taskNodeId, 'code': code }).then(response => {
          this.tableData = response.data.item
          this.nodeVisible = true
          this.code = code
        })
      }
    },
    confirmRe() {
      baseRequest('/basic/taskNode/updateStatus', { 'taskNodeId': this.activeNode.taskNodeId, 'code': this.code, childrenList: this.tableData }).then(response => {
        this.$Message.success('操作成功')
        this.flashCanvas()
        this.nodeVisible = false
      })
    },
    processMode(code) { // 处理
      baseRequest('/basic/taskNode/updateProcessMode', { 'taskNodeId': this.activeNode.taskNodeId, 'processMode': code }).then(response => {
        this.$Message.success('操作成功')
        this.flashCanvas()
      })
    },
    searchNode(row) {
      this.activeName = 'first'
      const node = this.net.find(row.deploy_node_id)
      // this.net.setItemActived(node)
      const model = node.getModel()
      this.net.focusPoint({ x: model.x, y: model.y })
    },
    openNodeDialog(row) {
      const param = {
        subFlag: row.sub_task_count + '',
        taskNodeId: row.task_flow_id,
        id: row.deploy_node_id
      }
      this.$refs.nodeDialog.openDialog(row.task_flow_id, param)
    },
    centeNode(node) { // 将节点移动到中心
      const point = { x: 0, y: 0 }
      point.x = node.x + 150
      point.y = node.y
      this.net.focusPoint(point)
    }
  },
  watch: {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#flowChart {
  position: relative;
}
.contextmenu.g6execute.second-floor {
  width: 130px;
  text-align: center;
  display: block;
  left: 92px;
  top: 0;
}
</style>
<style lang="scss">
.dialog-default.no-padding .dialog-contant-default {
  padding: 0;
}
.conditionTabs {
  .el-tabs__header {
    margin: 0 0 0 15px;
  }
}

.contextmenu.g6execute {
  width: 92px;
  margin: 0;
  background: #fff;
  z-index: 1000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  display: none;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
.task-options {
  position: absolute;
  top: 0;
  left: 0;
  height: 40px;
  border-bottom: 1px solid #ccc;
  overflow: hidden;
  background-color: #fff;
  z-index: 999;
  width: 100%;
  padding-left: 10px;
  padding-right: 14px;

  &:last-of-type {
    border-right: 0;
  }
  .btn.legend {
    font-weight: bold;
    color: black;
  }
  .btn-flush.btn {
    float: left;
    margin: 2px;
    margin-right: 30px;
    margin-top: 3px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    color: #a6a6a8;
    border: 1px solid rgba(233, 233, 233, 0);
  }
  .btn.mode {
    // width: 30px;
    height: 20px;
    float: left;
  }
  .btn {
    float: right;
    margin: 2px;
    margin-top: 5px;
    margin-left: 5px;
    line-height: 30px;
    text-align: center;
    // cursor: pointer;
    color: #a6a6a8;
    border: 1px solid rgba(233, 233, 233, 0);
    &.img-btn {
      // width: 30px;
      height: 20px;
      margin-top: 5px;
    }
    i {
      font-size: 20px;
    }
    .topBtn {
      height: 25px;
    }
  }
  .btn.actived {
    border: 1px solid #e9e9e9;
    color: #767a85;
    border-radius: 2px;
    background: #fafafe;
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
