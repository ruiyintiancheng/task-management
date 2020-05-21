<template>
  <div>
    <div class="node_information">
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">节点名称</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.node_name}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">节点描述</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.node_desc}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">节点状态</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.field_convert_map.node_status}}</div>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">服务器ID</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{serverMap[data.server_id]}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">计算开始时间</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.start_time}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">计算完成时间</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.end_time}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">计算时间</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.cal_time}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">节点计算次数</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.exec_count}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">处理方式</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.field_convert_map.process_mode}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">处理状态</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.field_convert_map.process_status}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">父节点状态</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.field_convert_map.parent_status}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">子任务处理方式</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.field_convert_map.sub_task_mode}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">最早执行时间</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.start_date}}</div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">最晚执行时间</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple-light">{{data.end_date}}</div>
        </el-col>
      </el-row>
    </div>
    <div class="node_input_param">
      <el-table ref="tableData"
                :data="tableData"
                style="width: 100%;"
                element-loading-text="给我一点时间"
                :height="getDefaultHeight"
                stripe
                border
                highlight-current-row
                fit
                header-cell-class-name="ai-el-table-header">
        <el-table-column width=50
                         type="index"
                         align="center"
                         fixed="left"></el-table-column>
        <el-table-column :min-width="100"
                         align='center'
                         label="服务器信息">
          <template slot-scope="scope">
            {{scope.row.server_desc}}
          </template>
        </el-table-column>
        <el-table-column :min-width="100"
                         align='center'
                         label="日志等级">
          <template slot-scope="scope">
            {{scope.row.field_convert_map.log_level}}
          </template>
        </el-table-column>
        <el-table-column :min-width="250"
                         align='center'
                         label="日志信息">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.log_msg"
                        placement="top"
                        effect="light"
                        :visible-arrow="false">
              <div class="basic-table-column">
                {{scope.row.log_msg}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :min-width="100"
                         align='center'
                         label="添加时间">
          <template slot-scope="scope">
            {{scope.row.add_time}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { baseRequest } from '@/api/base'
export default {
  directives: {},
  name: 'taskConfigComponentsNodeInfo',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm
  },
  mounted() {
  },
  created() {
    this.getServiceInfo()
    this.searchOption()
    this.getLog()
  },
  data() {
    return {
      formVisible: false,
      data: {},
      serverMap: {},
      tableData: [],
      activeName: 'first'
    }
  },
  props: {
    paramData: Object
  },
  computed: {
    getDefaultHeight() { // 获取表格高度
      return this.$store.state.app.containHeight * 0.8 - 300
    }
  },
  methods: {
    searchOption() {
      baseRequest('/basic/taskNode/getNodeInfo', { urlMode: '2', taskFlowId: this.paramData.taskFlowId, deployNodeId: this.paramData.deployNodeId }).then(response => {
        this.data = response.data.item
      })
    },
    getServiceInfo() { // 获取服务器列表
      baseRequest('/basic/servers/selects', { urlMode: '2' }).then(response => {
        const serversList = response.data.item
        for (var i in serversList) {
          //   this.serverMap[serversList[i].serverId + ''] = serversList[i].serverDesc
          this.$set(this.serverMap, serversList[i].serverId + '', serversList[i].serverDesc)
        }
      })
    },
    getLog() {
      baseRequest('/basic/taskLog/getLogInfo', { 'taskFlowId': this.paramData.taskFlowId, 'taskNodeId': this.paramData.taskNodeId }).then(response => {
        this.tableData = response.data.item
      })
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
.node_information {
  padding: 10px 0;
  .node_value {
    float: right;
    font-size: 16px;
    font-weight: 700;
    color: #409eff;
  }
  & > .el-row > .el-col > .grid-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.bg-purple-light {
  background: #ffffff;
}
.grid-content {
  min-height: 36px;
  line-height: 50px;
  border-top: 1px solid #e6eff6;
  font-size: 16px;
  padding-left: 8px;
}
.bg-purple {
  background: #f0f7fc;
}
</style>
