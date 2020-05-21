/*
 * @Author: 1k 
 * @Date: 2019-07-17 18:20:43 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-07-23 10:26:25
 * @Description:  
 */ 节点信息
<template>
  <div class="node_information">
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">部署节点ID</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.deployNodeId}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">部署流程</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.flowName}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">服务器</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.serverDesc}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">节点名称</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.nodeName}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">节点类型</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{options.nodeType[configData.nodeType]}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">计算类</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.classDesc}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">节点描述</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.nodeDesc}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">上级依赖</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{options.nodeRequire[configData.nodeRequire]}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">时间依赖</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{options.timeRequire[configData.timeRequire]}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">流程依赖</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.flowRequire}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">重试次数</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.retryCount}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">最早执行时间</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.startTime}}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">最晚执行时间</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light">{{configData.endTime}}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
// import { baseSearch } from '@/api/base'
export default {
  directives: {},
  name: 'deployedProcessComponentsNodeInformation',
  components: {
  },
  data() {
    return {
      configData: {},
      options: {
        'nodeType': {
          '0': '起始节点',
          '1': '结束节点',
          '2': '连接节点',
          '3': '加载节点',
          '4': '计算节点'
        },
        'nodeRequire': {
          '0': '全部完成',
          '1': '任意完成'
        },
        'timeRequire': {
          '0': '无',
          '1': '上期节点完成',
          '2': '上期流程完成'
        }
      }
    }
  },
  props: {
    paramData: Object
  },
  created() {
    this.searchOption()
  },
  methods: {
    searchOption(page) {
      const searchData = {
        deployNodeId: this.paramData.deployNodeId
      }
      // /deployNode/getNodeInfo
      baseRequest('/basic/deployNode/getNodeInfo', searchData).then(response => {
        this.configData = response.data.item
      })
    }
  }
}
</script>
<style lang="scss">
.node_information {
  padding: 10px 0;
  .node_value {
    float: right;
    font-size: 16px;
    font-weight: 700;
    color: #409eff;
  }
}
</style>
<style lang="scss" scoped>
.bg-purple-light {
  background: #ffffff;
}
.grid-content {
  // border-radius: 4px;
  min-height: 36px;
  line-height: 50px;
  border-top: 1px solid #e6eff6;
  // border-bottom: 1px solid #e6eff6;
  font-size: 16px;
  padding-left: 8px;
}
.bg-purple {
  background: #f0f7fc;
  // text-align: center;
}
</style>

