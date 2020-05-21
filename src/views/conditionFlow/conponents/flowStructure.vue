/*
 * @Author: wlq
 * @Date: 2019-08-14 
 * @Last Modified by: 
 * @Last Modified time: 
 * @Description: 流程结构
 */
<template>
  <div class="nodesInfo">
    <div style="width: 20px; position: relative; height: 100%; float:left; border-left: 1px solid #ccc">
      <div class="botton-body">
        <el-button @click="openRight" v-show="openInfo" type="text" icon="el-icon-d-arrow-right" style="margin-left: 0;"></el-button>
        <el-button @click="openLeft" v-show="!openInfo" type="text" icon="el-icon-d-arrow-left" style="margin-left: 0;"></el-button>
      </div>
    </div>
    <div  class="info-body" :style="{'width': infoWidth}">  
      <div class="row-botton clearfix">
        <div class="row-title">
          <!-- <svg-icon icon-class="tree" /> -->
          <span>流程结构</span>
        </div>
      </div>
      <el-input placeholder="请输入节点名称" v-model="filterText" style="padding:5px 10px;"></el-input>
      <el-tree
        class="filter-tree"
        :data="getTree"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click="handleClick"
        ref="tree">
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    nodes: Array
  },
  components: {

  },
  data() {
    return {
      openInfo: false,
      infoWidth: '0px',
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    getTree() {
      return [{
        id: 1,
        title: '节点',
        children: this.getNodes
      }]
    },
    getNodes() {
      return this.nodes
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    handleClick(data, node) {
      if (node.isLeaf === false) {
        return
      }
      this.$emit('centeNode', data)
    },
    openRight() {
      this.infoWidth = '0px'
      this.openInfo = !this.openInfo
    },
    openLeft() {
      this.infoWidth = '300px'
      this.openInfo = !this.openInfo
    }
  }
}
</script>
<style scoped>
  .nodesInfo {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: white;
  }

  .botton-body{
    width: 20px;
    border :1px solid #ccc;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%)
  }
  .info-body{
    height: 100%; 
    float:right; 
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    overflow: hidden;
    transition: width 0.28s linear 0s;
  }
</style>