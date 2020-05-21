<template>
    <div class="table-demo">
        <el-table :data="paramData.flowParams" stripe border style="width:100%;">
            <el-table-column label="名称" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.paramKey}}</span>
                </template>
            </el-table-column>
            <el-table-column label="描述"  align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.paramDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column label="值" prop="des" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.paramValue}}</span>
                </template>
            </el-table-column>
            <el-table-column :render-header="renderHeader" align="center" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" plain @click="update(scope.row, scope.$index)">修改</el-button>
                    <el-button size="mini" type="danger" plain  @click="deleteRow(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
               title="新增参数"
               :close-on-click-modal='false'
               append-to-body
               :visible.sync="formVisible"
               width="50%"
               custom-class="dialog-default dialog-default-more"
               top='8vh'
               v-el-drag-dialog>
            <div class="dialog-contant-default">
              <el-form class="baseUpdate-form" :rules="rules" ref="form" :model="flowData" label-width="100px" label-position="left">
                <el-form-item label="名称" prop="paramKey">
                  <el-input class="form-input" clearable v-model="flowData.paramKey">
                  </el-input>
                </el-form-item>
                <el-form-item label="描述" prop="paramDesc">
                  <el-input class="form-input" clearable v-model="flowData.paramDesc">
                  </el-input>
                </el-form-item>
                <el-form-item label="值" prop="paramValue">
                  <el-input class="form-input" v-model="flowData.paramValue"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="formVisible = false">取消</el-button>
              <el-button @click="saveOperate()" type="primary">完成</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'taskConfigComponentsNodeDialogOutputTable',
  components: {
  },
  mounted() {
  },
  data() {
    return {
      data: [],
      formVisible: false,
      updateKey: '',
      rules: {
        paramKey: [
          { required: true, message: '请输入' }
        ],
        paramDesc: [
          { required: true, message: '请输入' }
        ],
        paramValue: [
          { required: true, message: '请输入' }
        ]
      },
      flowData: {
        paramKey: '',
        paramDesc: '',
        paramValue: ''
      }
    }
  },
  props: {
    paramData: {
      type: Object,
      default: function() {
        return {
        }
      }
    }
  },
  methods: {
    renderHeader(h) {
      return (
        <div>
          <span>操作 </span>
          <el-button onClick={this.add} type='warning' icon='el-icon-plus' size='mini'></el-button>
        </div>
      )
    },
    add() {
      this.flowData = {
        paramKey: '',
        paramDesc: '',
        paramValue: ''
      }
      this.formVisible = true
      this.$nextTick(_ => {
        this.$refs.form.clearValidate()
      })
    },
    update(row, index) {
      this.updateflag = true
      this.updateIndex = index
      this.flowData = JSON.parse(JSON.stringify(row))
      this.formVisible = true
    },
    saveOperate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          for (let index = 0; index < this.paramData.flowParams.length; index++) {
            if (this.paramData.flowParams[index].paramKey === this.flowData.paramKey) {
              if (this.updateflag && index === this.updateIndex) {
                continue
              }
              this.$message({ type: 'error', message: '已存在相同的节点参数' })
              return
            }
          }
          for (let k = 0; k < this.paramData.outputParams.length; k++) {
            if (this.paramData.outputParams[k].paramKey === this.flowData.paramKey) {
              this.$message({ type: 'error', message: '已存在相同的节点参数' })
              return
            }
          }
          if (this.updateflag) {
            this.$set(this.paramData.flowParams, this.updateIndex, this.flowData)
          } else {
            this.paramData.flowParams.push(this.flowData)
          }
          this.formVisible = false
          this.updateIndex = null
          this.updateflag = false
        } else {
          return false
        }
      })
    },
    deleteRow(index) {
      this.paramData.flowParams.splice(index, 1)
    }
  }
}
</script>

