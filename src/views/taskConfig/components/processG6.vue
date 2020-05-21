<template>
  <!--流程图画布 -->
  <div id="flowChart">
    <nodeDialog ref="nodeDialog"
                :paramData="paramData"></nodeDialog>
    <flow-structure ref="flowStructure"
                    @centeNode="centeNode"
                    :nodes="nodes"
                    :thumbnailsParam='thumbnailsParam'></flow-structure>
  </div>
</template>
<script>
import { registG6Shape } from '../../../utils/g6Shape'
import nodeDialog from './nodeDialog'
import flowStructure from './flowStructure'
import { baseRequest } from '@/api/base'
export default {
  currentFun: '',
  directives: {},
  name: 'taskConfigProcessG6',
  components: {
    nodeDialog,
    flowStructure
  },
  mounted() {
    this.initG6() // 初始化画布
    this.paramData.net = this.net
    this.thumbnailsParam.net = this.net
    this.isAdd = false
    if (this.paramData.addFlag) { // 新增操作
      const data = { nodes: [{
        id: 'node111',
        x: 0,
        y: 20,
        inputParams: [],
        outputParams: [],
        judgeParams: [],
        flowParams: [],
        newObj: 1,
        shape: 'startShape',
        title: '开始',
        color: 'green'
      }, {
        id: 'node2322',
        x: 400,
        y: 20,
        inputParams: [],
        outputParams: [],
        judgeParams: [],
        flowParam: [],
        newObj: 1,
        shape: 'endShape',
        title: '结束',
        color: 'gray'
      }] }
      this.net.source(data)
      this.net.render()
      this.addNodes()
      this.isAdd = true
    } else { // 修改操作
      this.getUpdateData()
    }
  },
  created() {
  },
  props: {
    paramData: Object
  },
  data() {
    return {
      net: '',
      Util: '',
      activation: '', // 当前激活的节点
      isAdd: true,
      nodes: [], // 节点数组,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight - 126,
      thumbnailsParam: {
        flushFlag: '',
        net: {},
        xTranslate: null,
        yTranslate: null
      }
    }
  },
  methods: {
    initG6() {
      const self = this
      self.Util = window.G6.Util
      self.net = new window.G6.Net({
        id: 'flowChart', // 容器ID
        mode: 'edit',
        modes: {
          edit: [
            'dragNode', 'clickBlankClearActive', 'clickActive', 'dragNodeEndSetActive', 'wheelZoom',
            'resizeNode', 'dragEdgeEndHideAnchor', 'shortcut'
          ],
          add: ['clickAddNode', 'dragAddEdge', 'hoverAnchorSetActived'],
          drag: ['shortcut', 'dragNode', 'dragCanvas', 'wheelZoom', 'clickFocus']
        },
        grid: {
          forceAlign: true, // 是否支持网格对齐
          cell: 15 // 网格大小
        },
        minZoom: 0.6,
        maxZoom: 2,
        fitView: 'lc', // 布局
        width: self.canvasWidth, // 画布宽
        height: self.canvasHeight // 画布高
      })

      // 双击事件
      self.net.on('dblclick', (ev) => {
        if (self.Util.isNode(ev.item)) {
          const model = ev.item.getModel()
          this.paramData.model = model
          this.paramData.item = ev.item
          if (model.shape !== 'endShape') {
            self.$refs.nodeDialog.openDialog() // 显示弹窗
          }
        } else {
          // 有问题,鼠标双击后 会出现卡顿现象
          // this.net.get('mode') === 'drag' ? this.net.changeMode('edit') : this.net.changeMode('drag')
        }
      })
      /** 图形添加时 监听事件 */
      self.net.on('itemadd', (ev) => {
        const model = ev.item.getModel()
        this.paramData.model = model
        this.paramData.item = ev.item
        const isNode = self.Util.isNode(ev.item)
        model.newObj = 1 // 新增添加标志，用于后台判断是新增还是修改
        if (isNode && self.isAdd) { // 如果添加的是节点，并且是添加操作
          model.inputParams = []
          model.outputParams = []
          model.judgeParams = []
          model.flowParams = []
          self.activation = ev.item
          self.$refs.nodeDialog.openDialog()
          this.nodes.push(model)
        }
        this.$emit('clearActive')
      })
      self.net.on('itemremove', (ev) => { // 子项移除后事件
        const model = ev.item.getModel()
        this.deleteNodes(model)
        this.flushThum()
      })
      self.net.on('afteritemrender', (ev) => { // 子项移除后事件
        this.flushThum()
      })
      self.net.on('itembeforeremove', (ev) => { // 监听退格键
        const model = ev.item.getModel()
        if (model.shape !== 'startShape' && model.shape !== 'endShape') {
          self.net.remove(ev.item)
        }
      })
      // 注册节点形状
      registG6Shape()
      // 流程方形 节点创建
      self.net.render()
    },
    getUpdateData() {
      const param = {
        flowId: this.paramData.flowId
      }
      baseRequest('/basic/flowDef/getFlowInfo', param).then(response => {
        this.net.source(response.data.item)
        this.net.render()
        this.flushThum()
        this.addNodes()
        this.isAdd = true
        this.getClassList(response.data.item.classList)
      })
    },
    getClassList(classList) {
      baseRequest('/basic/classDef/getClassInfo', { 'classList': classList }).then(response => {
        this.paramData.classList = response.data.item
      })
    },
    insertShape(shape) {
      this.net.beginAdd('node', {
        shape: shape,
        color: '#228ACC'
      })
    },
    deleteNode() {
      this.net.remove(this.activation) // 移除 当前节点
      // 取消所有激活状态的 按钮
      const nodes = document.querySelectorAll('.btn.node')
      nodes.forEach((value, index) => { value.classList.remove('actived') })
    },
    save(workflowName, workflowDesc) { // 保存
      // 获取所有的
      try {
        this.bfs()
      } catch (e) {
        this.$message({ type: 'error', message: e.message })
        return
      }
      const data = this.net.save()
      /* 验证流图名称*/

      if (data.source.nodes.length === 0) {
        this.$message({ type: 'error', message: '流图内容不能为空' })
        return false
      }
      /* 验证节点名称*/
      // for (const item of data.source.nodes) {
      //   if (item.title === '' || item.title === null || item.title === undefined) {
      //     this.$message({ type: 'error', message: '节点名称不能为空' })
      //     return false
      //   }
      // }
      data.source.flowId = this.paramData.flowId
      data.source['name'] = workflowName
      data.source['desc'] = workflowDesc
      baseRequest('/basic/flowDef/save', JSON.parse(JSON.stringify(data.source, null, 2))).then(response => {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('closeDialog') // 关闭弹窗
      })
    },
    bfs() {
      const nodes = this.net.getNodes()
      let startnode
      let endnode
      for (const it of nodes) {
        const item = it.getModel()
        if (!item.title) {
          throw new Error('流程图节点标题不能为空')
        }
        // if (item.shape !== 'startShape' && item.shape !== 'endShape') {
        //   if (!item.serverId && item.serverId !== 0) {
        //     throw new Error(item.title + ' 节点服务器不能为空')
        //   }
        // }
        if (item.shape === 'startShape') {
          startnode = { id: item.id }
        } else if (item.shape === 'endShape') {
          endnode = { id: item.id }
        }
        if (item.shape !== 'endShape' && !item.serverId && item.serverId !== 0) {
          throw new Error(item.title + ' 节点服务器不能为空')
        }
        if (item.shape !== 'endShape' && !item.classId && item.classId !== 0) {
          throw new Error(item.title + ' 节点加载类不能为空')
        }
      }
      if (!startnode) {
        throw new Error('缺少开始节点')
      }
      if (!endnode) {
        throw new Error('缺少结束节点')
      }
      const dataMap = {}
      const edges = []
      const edgelist = this.net.getEdges()
      for (const k in edgelist) {
        edges.push({ target: edgelist[k].getModel().target, source: edgelist[k].getModel().source, id: edgelist[k].getModel().id })
      }

      if (edges && edges.length !== 0) {
        for (let i = 0; i < edges.length; i++) {
          const childList = dataMap[edges[i].source]
          if (!childList) {
            dataMap[edges[i].source] = [{ id: edges[i].target }]
          } else {
            childList.push({ id: edges[i].target })
          }
        }
        this.checkRing(startnode, dataMap)
      }
    },
    checkRing(node, dataMap) {
      const childList = dataMap[node.id]
      if (node.isCheck && !node.childAllCheck) {
        const node1 = this.net.find(node.id)
        throw new Error(node1.getModel().title + '附近存在环状线')
      }

      if (!node.isCheck) {
        node.isCheck = true
      }
      if (childList && !node.childAllCheck) {
        for (let index = 0; index < childList.length; index++) {
          this.checkRing(childList[index], dataMap)
        }
      }
      node.childAllCheck = true
    },
    addNodes() {
      const nodes = this.net.getNodes()
      const newNodes = []
      nodes.forEach(d => {
        newNodes.push(d.getModel())
      })
      this.nodes = newNodes
    },
    deleteNodes(data) {
      const nodes = this.net.getNodes()
      nodes.forEach((d, i) => {
        const node = d.getModel()
        if (node.id === data.id) {
          this.nodes.splice(i, 1)
        }
      })
    },
    centeNode(data) { // 将节点移动到中心
      const node = this.net.find(data.id)
      const model = node.getModel()
      this.net.focusPoint({ x: model.x, y: model.y })
    },
    flushCanvas(xTranslate, yTranslate) {
      const scale = this.net.getScale()
      var t = this.net.getBBox()
      const i = this.net.get('height')
      this.net._zoom(scale, void 0, { x: t.minX + xTranslate, y: t.minY - i / 2 + t.height + yTranslate })
      this.net.draw()
    },
    flushThum() {
      this.thumbnailsParam.flushFlag = new Date().getTime()
    }
  },
  computed: {
    flushTranslate() {
      return this.thumbnailsParam.xTranslate + this.thumbnailsParam.yTranslate
    }
  },
  watch: {
    flushTranslate(val) {
      this.flushCanvas(this.thumbnailsParam.xTranslate, this.thumbnailsParam.yTranslate)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#flowChart {
  border: 1px solid #ebeef5;
  position: relative;
  overflow: hidden;
}
</style>