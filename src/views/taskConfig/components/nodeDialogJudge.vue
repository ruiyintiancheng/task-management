/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-05-16 10:59:27 
 * @Last Modified by: M.HQ
 * @Last Modified time: 2019-09-11 17:08:42
 * @Desc 连接节点
 */
<template>
  <div class="table-demo">
    <el-form ref="form"
             class="baseUpdate-form"
             :model="paramData"
             label-width="150px"
             label-position="left">
      <el-form-item label="判断节点名称">
        <el-input class="form-input"
                  size="mini"
                  clearable
                  v-model="paramData.title"></el-input>
      </el-form-item>
      <el-form-item label="上级节点依赖">
        <el-select class="form-input"
                   size="mini"
                   clearable
                   v-model="paramData.nodeRequire">
          <el-option label="全部"
                     value="0"></el-option>
          <el-option label="任意"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流程依赖">
        <el-select class="form-input"
                   size="mini"
                   :collapse-tags='true'
                   multiple
                   clearable
                   v-model="paramData.flowRequire">
          <el-option v-for="item in flowList"
                     :key="item.deployFlowId"
                     :label="item.flowName"
                     :value="item.deployFlowId + ''">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间依赖"
                    v-if="this.paramData.timeRequireFlag">
        <el-select class="form-input"
                   size="mini"
                   clearable
                   v-model="paramData.timeRequire">
          <el-option label="上期流程完成"
                     value="0"></el-option>
          <el-option label="上期节点完成"
                     value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最早执行时间">
        <el-time-picker class="form-input"
                        size="mini"
                        v-model="paramData.startTime"
                        :format="'HH:mm'"
                        :value-format="'HH:mm'"></el-time-picker>
      </el-form-item>
      <el-form-item label="最晚执行时间">
        <el-time-picker class="form-input"
                        size="mini"
                        v-model="paramData.endTime"
                        :format="'HH:mm'"
                        :value-format="'HH:mm'"></el-time-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import formComponents from './formComponents'
import { baseRequest } from '@/api/base'
export default {
  directives: {},
  name: 'taskConfigComponentsNodeDialogConditions',
  components: {
    SearchForm,
    BasicTable,
    formComponents,
    UpdateForm
  },
  mounted() {
    baseRequest('/basic/deployFlow/getDeployFlowList', { urlMode: '2', flowId: this.paramData.flowId }).then(response => {
      this.flowList = response.data.item
    })
  },
  created() {
  },
  data() {
    return {
      flowList: [],
      timeRequireFlag: false
    }
  },
  props: {
    paramData: Object
  },
  methods: {
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.judgeform {
  margin-left: 20px;
}
.table-demo {
  .form-input {
    width: 180px;
  }
}
</style>
<style lang="scss" >
.judge {
  .el-table--medium td,
  .el-table--medium th {
    padding: 0;
  }
}
</style>