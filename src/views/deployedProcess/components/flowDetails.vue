<template>
  <div>
    <el-dialog :title="workflowName"
               @close='closeDialog'
               fullscreen
               append-to-body
               :close-on-click-modal='false'
               :visible.sync="formVisible"
               custom-class="dialog-default-flow no-footer">
      <div class="dialog-contant-default flow-details">
        <!-- 刷新按钮 -->
        <!--流程图画布 -->
        <div id="flowChart1">
        </div>
      </div>
      <flow-structure ref="flowStructure"
                      @centeNode="centeNode"
                      :nodes="nodes"></flow-structure>
    </el-dialog>
    <taskLog ref="taskLog"
             :paramData='paramData'></taskLog>
  </div>
</template>
<script>
import { registG6Shape } from '../../../utils/g6Shape'
import { baseRequest } from '@/api/base'
import taskLog from './nodeLog'
import stopPng from '../../../assets/flowPng/stop.png'
import flowStructure from './flowStructure'
export default {
  currentFun: '',
  directives: {},
  name: 'deployedProcessComponentsFlowDetails',
  components: {
    taskLog,
    flowStructure
  },
  mounted() {
    this.paramData.tableHeight = this.$store.state.app.containHeight * 0.8 - 200
  },
  created() {
  },
  props: {
    paramData: Object
  },
  data() {
    return {
      net: null,
      Util: '',
      activation: '', // 当前激活的节点
      workflowName: '',
      formVisible: false,
      stopPng,
      completeVisible: false,
      nodes: [] // 节点数组,
    }
  },
  methods: {
    resetCanvas() {
      this.net.destroy()
      this.initG6()
      baseRequest('/basic/deployFlow/getNodesAndEdges', { deployFlowId: this.paramData.deployFlowId }).then(response => {
        this.nodes = response.data.item.nodes
        this.net.source(response.data.item.nodes, response.data.item.edges)
        this.net.render()
      })
    },
    openDialog() {
      baseRequest('/basic/deployFlow/getNodesAndEdges', { deployFlowId: this.paramData.deployFlowId }).then(response => {
        this.formVisible = true
        this.workflowName = response.name || '查看'
        this.$nextTick(_ => {
          this.initG6()
          const flowChart = document.querySelector('#flowChart1')
          flowChart.oncontextmenu = function(e) {
            return false
          }
          this.nodes = response.data.item.nodes
          this.net.source(response.data.item.nodes, response.data.item.edges)
          this.net.render()
        })
      })
    },
    closeDialog() {
      this.net.destroy()
    },
    initG6(nodes, edges) {
      const self = this
      self.Util = window.G6.Util

      self.net = new window.G6.Net({
        id: 'flowChart1', // 容器ID
        mode: 'defalut',
        // plugins: [minimap],
        modes: {
          defalut: ['dragCanvas', 'clickFocus']
        },
        grid: {
          forceAlign: true, // 是否支持网格对齐
          cell: 15 // 网格大小
        },
        fitView: 'lc', // 布局
        width: window.innerWidth, // 画布宽
        height: window.innerHeight - 65 // 画布高
      })
      // 双击事件
      self.net.on('dblclick', (ev) => {
        if (self.Util.isNode(ev.item)) {
          const model = ev.item.getModel()
          self.paramData.model = model
          self.paramData.deployNodeId = model.id
          self.$refs.taskLog.openDialog()
        }
      })

      // 注册节点形状
      registG6Shape()
      // 流程方形 节点创建
      self.net.source(nodes, edges)
      self.net.render()
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
  border: 1px solid #ebeef5;
  position: relative;
  overflow: hidden;
}
.contextmenu.execute {
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
.flow-details {
  position: relative;
  .flow-details-menu {
    position: absolute;
    top: 0;
    left: 0;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    overflow: hidden;
    background-color: #fff;
    z-index: 999;
    padding-left: 10px;
    width: 100%;
    .el-button--mini {
      padding: 7px;
    }
  }
}
</style>