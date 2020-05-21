/*
 * @Author: M.HQ 
 * @Date: 2019-04-15 10:10:59 
 * @Last Modified by: M.HQ
 * @Last Modified time: 
 * @Description: 任务配置
 */

<template>
  <div>
    <el-dialog :title="paramData.title"
               fullscreen
               append-to-body
               :close-on-click-modal='false'
               :visible.sync="formVisible"
               custom-class="dialog-default-flow">
      <div v-if="formVisible"
           class="dialog-contant-default rewupeizhi">
        <div class="task-options">
          <div class="btn-group"
               id="divId">
            <div class="btn node"
                 @click="insertShape('conditionShape')"
                 title="计算节点">
              <img :src="conditionsShapeImg"
                   class="topBtn">
            </div>
            <div class="btn node"
                 @click="insertShape('loadShape')"
                 title="加载节点">
              <img :src="loadShapeImg"
                   class="topBtn">
            </div>
            <div class="btn node"
                 @click="insertShape('judgeShape')"
                 title="判断节点">
              <img :src="judgeShapeImg"
                   class="topBtn">
            </div>
            <div class="btn line"
                 @click="insertEage('arrow')"
                 title="箭头直线">
              <svg-icon icon-class="zhixianjiantou" />
            </div>
            <div class="btn line"
                 @click="insertEage('polyLineFlow')"
                 title="箭头折现">
              <svg-icon icon-class="zhexian" />
            </div>
            <div class="btn mode"
                 @click="changeMode('edit')"
                 title="选择模式">
              <svg-icon icon-class="mouse" />
            </div>
            <div class="btn mode"
                 @click="changeMode('drag')"
                 title="拖拽模式">
              <svg-icon icon-class="cross" />
            </div>
            <div class="btn delete"
                 @click="del"
                 title="删除">
              <svg-icon icon-class="delete" />
            </div>
            <div class="btn save"
                 @click="saveAs()"
                 title="另存为">
              <svg-icon icon-class="save" />
            </div>
            <div class="btn down"
                 @click="exportFlow()"
                 title="导出">
              <!-- <img :src="downImg" class="down"> -->
              <i style="font-size:14px;"
                 class="el-icon-download"></i>
            </div>
            <div class="btn validator"
                 @click="validateFlow()"
                 title="校验">
              <!-- <img :src="downImg" class="down"> -->
              <i style="font-size:14px;"
                 class="el-icon-paperclip"></i>
            </div>
          </div>
        </div>
        <taskConfigFlowChart @clearActive="clearActive"
                             @flushTitle="flushTitle"
                             @closeDialog="closeDialog"
                             ref="taskConfigFlowChart"
                             :paramData="paramData"></taskConfigFlowChart>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="formVisible = false">关闭</el-button>
        <el-button type="primary"
                   @click="save(0)">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="另存为"
               :visible.sync="newFrameVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-flowInfo">
        <el-form class="baseUpdate-form"
                 ref="form"
                 label-width="100px">
          <el-form-item label="流程名称">
            <el-input class="form-input"
                      v-model="paramData.title"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="流程描述">
            <el-input class="form-input"
                      v-model="paramData.subtitle"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="newFrameVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="determined()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { download } from '@/utils/download'
import taskConfigFlowChart from './processG6'
import loadShapeImg from '../../../assets/flowPng/load.png'
import judgeShapeImg from '../../../assets/flowPng/join.png'
import conditionsShapeImg from '../../../assets/flowPng/java.png'
import downImg from '../../../assets/flowPng/down.png'
import validator from '../validator'
export default {
  directives: {},
  name: 'taskConfigComponentsIndex',
  components: {
    taskConfigFlowChart
  },
  props: {
    paramData: Object
  },
  data() {
    return {
      dialogTitle: '',
      operateStatus: 1,
      formVisible: false,
      workflowName: '',
      workflowDesc: '',
      loadShapeImg,
      judgeShapeImg,
      downImg,
      conditionsShapeImg,
      newFrameVisible: false
    }
  },
  mounted() {

  },
  created() {
  },
  methods: {
    // 校验节点
    validateFlow() {
      const nodes = this.$refs.taskConfigFlowChart.net.getNodes().map(item => item.getModel())
      const edges = this.$refs.taskConfigFlowChart.net.getEdges().map(item => item.getModel())
      validator(nodes, edges).then(_ => {
        this.$message.success('校验通过')
      }, error => {
        this.$message.error(error)
      })
    },
    openDialog(errorMsg) { // 打开弹窗
      this.formVisible = true
      this.$nextTick(_ => {
        this.addClickEvent()
        if (errorMsg) {
          setTimeout(_ => {
            this.$message.error(errorMsg)
          }, 100)
        }
      })
    },
    closeDialog() { // 关闭弹窗
      // this.formVisible = false
      this.$emit('flushTable') // 刷新列表
    },
    addClickEvent() {
      const btns = document.querySelectorAll('.btn-group .btn')
      btns.forEach((val, index) => {
        const btn = val.classList
        if (btn.contains('line') || btn.contains('mode') || btn.contains('node')) {
          val.onclick = function() {
            this.clearActive()
            btn.add('actived')
          }.bind(this)
        }
      })
    },
    clearActive() {
      const btns = document.querySelectorAll('.btn-group .btn')
      btns.forEach((value, index) => { value.classList.remove('actived') })
    },
    insertShape(shape) { // 插入图形
      this.$refs.taskConfigFlowChart.insertShape(shape)
    },
    changeMode(mode) { // 改变模式
      this.$refs.taskConfigFlowChart.net.changeMode(mode)
    },
    insertEage(shape) { // 插入线
      this.$refs.taskConfigFlowChart.net.beginAdd('edge', {
        shape: shape
      })
    },
    flushTitle(title, subtitle) {
      this.paramData.title = title
      this.paramData.subtitle = subtitle
    },
    del() { // 删除当前活跃的节点
      this.$refs.taskConfigFlowChart.net.del2()
    },
    save(code) {
      if (code === 1) { // 1 为另存为
        this.paramData.flowId = null
        // this.newFrameVisible = false
      }
      if (this.paramData.title !== '') {
        this.$refs.taskConfigFlowChart.save(this.paramData.title, this.paramData.subtitle)
      } else {
        this.$message({ type: 'error', message: '流图名称不能为空' })
      }
    },
    exportFlow() {
      download('/basic/flowDef/exportFlow', { urlMode: '2', flowId: this.paramData.flowId }, function() {
        this.$message({ type: 'success', message: '导出成功' })
      })
    },
    saveAs() {
      this.newFrameVisible = true
    },
    determined() {
      this.save(1)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.rewupeizhi {
  position: relative;
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
  }
}
.operating {
  position: absolute;
  z-index: 99;
  background-color: #ffffff;
  padding: 20px 10px;
  box-shadow: 1px 1px 4px 0 #0a0a0a2e;
  width: 200px;
  height: 250px;
}
.info {
  position: absolute;
  right: 0;
  z-index: 99;
  box-shadow: 1px 1px 4px 0 #0a0a0a2e;
  .title {
    height: 40px;
    padding-left: 10px;
    border-top: 1px solid #dce3e8;
    border-bottom: 1px solid #dce3e8;
    border-left: 1px solid #dce3e8;
    background: rgb(235, 238, 242);
    line-height: 40px;
    span {
      font-size: 14px;
    }
  }
  .content {
    background: rgba(247, 249, 251, 0.45);
    width: 200px;
    height: 800px;
    border-left: 1px solid #e6e9ed;
    padding: 10px;
  }
}
.btn-group {
  // border-right: 1px solid #efefef;
  // display: inline-block;
  padding-left: 10px;
  padding-right: 14px;
  &:last-of-type {
    border-right: 0;
  }
  .btn {
    // display: inline-block;
    float: left;
    margin: 2px;
    margin-top: 9px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    color: #a6a6a8;
    border: 1px solid rgba(233, 233, 233, 0);
    &.node {
      img {
        margin-top: 3px;
        margin-left: 2px;
      }
    }
    &.img-btn {
      width: 60px;
      height: 60px;
      margin-top: 10px;
    }
    i {
      font-size: 20px;
    }
    &:hover {
      border: 1px solid #e9e9e9;
      color: #767a85;
      border-radius: 2px;
      background: #fafafe;
    }
    .topBtn {
      height: 20px;
    }
    .down {
      height: 16px;
      margin: 6px;
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
div.g6-html-node-container {
  border: 0 solid #fff !important;
}
// div{
//   .el-dialog{
//     .dialog-default-flow{
//       margin-top: 1vh;
//     }
//   }
// }
</style>
<style>
.el-dialog.is-fullscreen.dialog-default-flow {
  /* height: 98%; */
  overflow: hidden;
}
</style>



