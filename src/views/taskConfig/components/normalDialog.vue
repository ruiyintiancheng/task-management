<template>
  <div>
    <el-dialog title="编辑"
               v-if="formVisible"
               append-to-body
               :visible.sync="formVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-form class="baseUpdate-form"
                 ref="form"
                 label-width="100px">
          <el-form-item label="定时类型">
            <el-select class="form-input"
                       v-model="paramData.model.defType"
                       clearable
                       collapse-tags
                       placeholder="请选择">
              <el-option label="corn表达式"
                         value="1"></el-option>
              <el-option label="simple时间点"
                         value="2"></el-option>
            </el-select>
          </el-form-item>
          <times :paramData="paramData"
                 ref="times"
                 @callback="callback"></times>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from '@/directive/el-dragDialog'
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
// import times from '@/views/cronTrigger/triggerIndex'
import times from '../../cronTrigger/triggerIndex'
import { baseRequest } from '@/api/base'
export default {
  directives: { elDragDialog },
  name: 'taskclassOutputDialog',
  components: {
    SearchForm,
    BasicTable,
    times
  },
  mounted() {
  },
  created() {
  },
  data() {
    return {
      formVisible: false,
      configData: {},
      tableToggle: true,
      searchToggle: true,
      tableHeight: 0,
      operateStatus: 1,
      taskClassList: [],
      startTime: '',
      endTime: '',
      updateFromData: {}
    }
  },
  props: {
    paramData: Object
  },
  methods: {
    openDialog() {
      this.updateFromData = this.paramData.model
      this.formVisible = true
    },
    getTaskClassParams() {
      baseRequest('/basic/taskparamsDef/selects', { urlMode: '1' }).then(response => {
        this.taskClassList = response.data.items
      })
    },
    saveOperate() {
      for (var key in this.updateFromData) {
        this.paramData.model[key] = this.updateFromData[key]
      }
      this.formVisible = false
    },
    callback() {

    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.dialog-contant-default-addOrUpdate {
  margin-top: 10px;
  padding: 0px;
  border: 0px;
}
.dialog-contant-default-addOrUpdate {
  .baseUpdate-form {
    margin-left: calc(50% - 250px);
    .form-input {
      width: 200px;
    }
  }
}
</style>
