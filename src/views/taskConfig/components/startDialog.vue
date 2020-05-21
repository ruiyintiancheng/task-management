<template>
  <div>
    <el-dialog title="编辑"
               v-if="formVisible"
               append-to-body
               :visible.sync="formVisible"
               width="40%"
               custom-class="dialog-default-more dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-form class="baseUpdate-form"
                 ref="form"
                 label-width="100px">
          <el-form-item>
            <span class="input-label">加载类</span>
            <el-select @change="getTaskClassParams"
                       class="form-select"
                       clearable
                       v-model="updateFromData.classId">
              <el-option v-for="item in taskClassList"
                         :key="item.classId"
                         :label="item.classDesc"
                         :value="item.classId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="item in taskClassParamList"
                        :key="item.paramId">
            <span class="input-label">{{item.paramKey}}</span>
            <el-input class="form-input"
                      v-model="item.formParam"
                      clearable></el-input>
          </el-form-item>
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
  name: 'taskConfigComponentsStartDialog',
  components: {
    SearchForm,
    BasicTable,
    times
  },
  mounted() {
    this.getTaskClass()
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
      taskClassParamList: [],
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
      this.updateFromData = JSON.parse(JSON.stringify(this.paramData.model))
      // this.getTaskClassParams(this.updateFromData.classId)
      this.paramData.model.taskClassParamList ? this.taskClassParamList = JSON.parse(JSON.stringify(this.paramData.model.taskClassParamList)) : ''
      this.formVisible = true
    },
    getTaskClass() {
      baseRequest('/basic/taskClasses/selects', { urlMode: '2', classType: '1' }).then(response => {
        this.taskClassList = response.data.item
      })
    },
    getTaskClassParams(value) {
      if (value === '') {
        this.taskClassParamList = null
      } else {
        baseRequest('/basic/taskparamsDef/selects', { urlMode: '2', classId: value }).then(response => {
          this.taskClassParamList = response.data.item
        })
      }
    },
    saveOperate() {
      for (var key in this.updateFromData) {
        this.paramData.model[key] = this.updateFromData[key]
      }
      if (!this.paramData.model.taskClassParamList || !this.taskClassParamList) {
        this.paramData.model.taskClassParamList = this.taskClassParamList
      } else {
        for (var itemkey in this.taskClassParamList) {
          this.paramData.model.taskClassParamList[itemkey] = this.taskClassParamList[key]
        }
      }

      this.formVisible = false
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
