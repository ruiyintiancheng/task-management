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
        <el-table-column slot="firstColumn"
                         label="节点名称"
                         align="center"
                         width="250">
          <template slot-scope="scope">
            <a href="javaScipt:void 0;"
               @click="getNode(scope.row)">{{scope.row.node_name}}</a>
          </template>
        </el-table-column>
        <el-table-column slot="optionColumn"
                         label="操作"
                         fixed="right"
                         align="center"
                         width="250">
          <template slot-scope="scope">
            <el-button type="success"
                       size="mini"
                       plain
                       @click="look(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </basic-table>
    </div>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { baseRequest } from '@/api/base'
const url = '/basic/taskNode/getNodeList'
export default {
  directives: {},
  name: 'conditionFlowConponentsTableList',
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
      formVisible: false
    }
  },
  props: {
    taskFlowId: Number
  },
  methods: {
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      param.taskFlowId = this.taskFlowId
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
    },
    look(row) {
      this.$emit('openNodeDialog', row)
    },
    getNode(row) {
      this.$emit('searchNode', row)
    }
  },
  computed: {
    getDefaultHeight() { // 获取表格高度
      return this.$store.state.app.containHeight * 0.8 - 70
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
a:link {
  color: rgb(70, 22, 243);
  text-decoration: none;
}
a:visited {
  color: #00ff00;
  text-decoration: none;
}
a:hover {
  color: #e61010;
  text-decoration: none;
}
a:active {
  color: rgb(10, 238, 105);
  text-decoration: none;
}
</style>
