<template>
  <div class="app-container">
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <div class="row-option">
          <el-button icon="el-icon-search"
                     @click="searchOption"
                     type="primary">查询</el-button>
          <el-button icon="el-icon-refresh"
                     @click="getOption">重置</el-button>
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <search-form v-show="searchToggle"
                   ref="searchForm"
                   :searchFormData="configData"></search-form>
    </div>
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="ul" />
          <span>数据列表</span>
        </div>
        <div class="row-option">
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <basic-table v-show="tableToggle"
                   ref="basicTable"
                   :height="getDefaultHeight"
                   :tableOption="configData"
                   :pagenation="true"
                   :rowNum="true">
      </basic-table>
    </div>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { baseRequest } from '@/api/base'
const url = '/basic/taskNode/getCondition'
export default {
  directives: {},
  name: 'conditionFlowConponentsChildTask',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm
  },
  mounted() {
  },
  created() {
    this.getOption()
  },
  data() {
    return {
      configData: {},
      searchToggle: true,
      tableToggle: true,
      formVisible: false,
      tableData: []
    }
  },
  props: {
    paramData: Object
  },
  methods: {
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      param.taskNodeId = this.paramData.taskNodeId
      this.$refs.basicTable.getData(url, param)
    },
    getOption() {
      baseRequest(url, { urlMode: '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        this.$nextTick(_ => {
          this.searchOption()
        })
      })
    }
  },
  computed: {
    getDefaultHeight() { // 获取表格高度
      return this.$store.state.app.containHeight * 0.8 - 250
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
