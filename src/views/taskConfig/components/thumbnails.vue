<template>
        <!--流程图画布 -->
        <div id="thumbnails" class="thumbnails">
        </div>
</template>
<script>
import { registG6Shape } from '../../../utils/g6Shape'
// import { baseRequest } from '@/api/base'
export default {
  currentFun: '',
  directives: { },
  name: 'taskConfigCompontsThumbnails',
  components: {
  },
  mounted() {
    this.initG6() // 初始化画布
  },
  created() {
  },
  props: {
    thumbnailsParam: Object
  },
  data() {
    return {
      net: '',
      Util: '',
      width: 300,
      height: 230
    }
  },
  methods: {
    initG6() {
      const self = this
      self.Util = window.G6.Util
      self.net = new window.G6.Net({
        id: 'thumbnails', // 容器ID
        mode: 'default',
        modes: {
          default: []
        },
        grid: null,
        fitView: 'autoZoom', // 布局
        width: self.width, // 画布宽
        height: self.height // 画布高
      })
      self.net.on('click', (ev) => {
        // console.log(window.G6.Matrix)
        // console.log(ev.domEvent.view.G6.Matrix)
        // const i = new window.G6.Matrix3()
        const r = self.net.get('width')
        const o = self.net.get('height')
        const u = self.net.getBBox()
        const h = (u.maxY + u.minY) / 2
        const l = self.net.get('fitViewPadding')
        const g = u.maxX - u.minX + 2 * l
        const p = u.maxY - u.minY + 2 * l
        let t = null
        t = r / g
        r / g > o / p && (t = o / p)
        self.thumbnailsParam.xTranslate = (ev.domX - u.minX) / t
        self.thumbnailsParam.yTranslate = (ev.domY - h) / t
      })

      // 注册节点形状
      registG6Shape()
      // 流程方形 节点创建
      self.net.render()
    },
    flushThumbnails(type, data) {
      if (type === 1) { // 刷新整个画布
        try {
          this.net.destroy()
        } catch (error) {
          //
        }
        this.initG6()
        this.net.source(data)
        this.net.render()
      }
    }
  },
  computed: {
    flushThumbnail() {
      return this.thumbnailsParam.flushFlag
    }
  },
  watch: {
    flushThumbnail() {
      const nodeData = this.thumbnailsParam.net.getNodes()
      const edgeData = this.thumbnailsParam.net.getEdges()
      const nodes = []
      const edges = []
      if (nodeData && nodeData.length !== 0) {
        for (var i in nodeData) {
          nodes.push(nodeData[i].getModel())
        }
      }
      if (edgeData && edgeData.length !== 0) {
        for (var k in edgeData) {
          edges.push(edgeData[k].getModel())
        }
      }
      const data = { nodes: nodes, edges: edges }
      this.flushThumbnails(1, data)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #flowChart {
    position: relative;
    overflow: hidden;
  }
  .thumbnails{
    position: absolute;
    z-index: 1000;
    bottom: 0;
    border: 1px solid rgb(19, 241, 86);
    height: 100%;
  }
</style>