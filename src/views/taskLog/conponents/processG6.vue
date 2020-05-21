<template>
  <div>
    <!--流程图画布 -->
    <el-dialog :title="title"
               fullscreen
               append-to-body
               :close-on-click-modal='false'
               :visible.sync="formVisible"
               custom-class="dialog-default no-padding no-footer">
      <div class="dialog-contant-default"
           v-if="formVisible">
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
      </div>
    </el-dialog>
    <el-dialog title="下级节点信息"
               append-to-body
               :close-on-click-modal='false'
               :visible.sync="nodeVisible"
               custom-class="dialog-default">
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
import { registG6Shape } from '../../../utils/g6Shape'
import nodeDialog from './nodeDialog'
import { baseRequest } from '@/api/base'
export default {
  currentFun: '',
  directives: {},
  name: 'conditionFlowConponentsProcessG6',
  components: {
    baseRequest,
    nodeDialog
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
      nodeTitle: '',
      nodeCenter: false
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
        height: document.body.offsetHeight - 63 // 画布高
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
            style.top = ev.domEvent.y + 'px'
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
      this.taskFlowId = row.serverId
      this.title = row.flowName
      this.formVisible = true
      this.nodeTitle = row.nodeName
      this.nodeCenter = true
      this.$nextTick(_ => {
        const flowChart = document.querySelector('#flowChart')
        flowChart.oncontextmenu = function(e) {
          return false
        }
        this.flashCanvas()
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
    flashCanvas() {
      const contextmenu = document.querySelector('.contextmenu.g6execute') // 右键的菜单
      contextmenu.style.display = 'none'
      baseRequest('/basic/taskFlow/getTaskFlowInfo', { 'taskFlowId': this.taskFlowId }).then(response => {
        try {
          this.net.destroy()
        } catch (error) {
          //
        }
        this.initG6()
        this.net.source(response.data.item)
        this.net.render()
        if (this.nodeCenter === true) {
          this.centeNode()
          this.nodeCenter = false
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
      })
    },
    processMode(code) { // 处理
      baseRequest('/basic/taskNode/updateProcessMode', { 'taskNodeId': this.activeNode.taskNodeId, 'processMode': code }).then(response => {
        this.$Message.success('操作成功')
        this.flashCanvas()
      })
    },
    centeNode() {
      const point = { x: 0, y: 0 }
      const nodes = this.net.getNodes()
      nodes.forEach(d => {
        const node = d.getModel()
        if (node.title === this.nodeTitle) {
          point.x = node.x
          point.y = node.y
        }
      })
      this.net.focusPoint(point)
    }
  },
  watch: {
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
</style>
