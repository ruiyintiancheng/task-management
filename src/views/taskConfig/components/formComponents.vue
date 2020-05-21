<template>
  <div v-if="loading">
    <div v-if="paramData.formType === 'simpleExpress'">
      <times :paramData="paramData"
             type="2"
             ref="times"></times>
    </div>
    <div v-if="paramData.formType === 'cornExpress'">
      <times :paramData="paramData"
             type="1"
             ref="times"></times>
    </div>
    <div v-if="paramData.formType === 'select'">
      <el-select v-model="paramData.value"
                 clearable>
        <el-option v-for="(text,value) in paramData.selectData"
                   :key="value"
                   :label="text"
                   :value="value"></el-option>
      </el-select>
    </div>
    <div v-if="paramData.formType === 'mulselect'">
      <el-select v-model="paramData.value"
                 multiple
                 :collapse-tags='true'
                 clearable>
        <el-option v-for="(text,value) in paramData.selectData"
                   :key="value"
                   :label="text"
                   :value="value"></el-option>
      </el-select>
    </div>
    <div v-if="paramData.formType === 'selectComponent' && paramData.componentId">
      <select-components v-model="paramData.value"
                         :selectComponentOptions="selectComponentOptions"></select-components>
    </div>
    <div v-if="paramData.formType === 'text'">
      <el-input v-model.trim="paramData.value"
                clearable></el-input>
    </div>
    <div v-if="paramData.formType === 'date'">
      <el-date-picker style="width:100%;"
                      clearable
                      v-model="paramData.value"
                      :format="'yyyy-MM-dd HH:mm:ss'"
                      :value-format="'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
    </div>
  </div>
</template>
<script>
import times from '../../../components/cronTrigger/triggerIndex'
// import SelectComponents from '@/components/SelectComponents'
import SelectComponents from 'condition-option-ry'
import { baseRequest } from '@/api/base'
export default {
  directives: {},
  name: 'taskConfigComponentsStartDialogInputTable',
  components: {
    times,
    SelectComponents
  },
  mounted() {
  },
  created() {
    this.loading = false
    if (this.paramData.formType === 'selectComponent' && this.paramData.componentId) {
      baseRequest('/basic/t00VueComponent/select', { componentId: this.paramData.componentId }).then(response => {
        this.selectComponentOptions.componentType = response.data.item.componentType + ''
        this.selectComponentOptions.selectType = response.data.item.selectType + ''
        this.selectComponentOptions.resourceId = response.data.item.resourceId
        baseRequest('/basic/resource/beforeUpdate', { resourceId: response.data.item.resourceId }).then(response2 => {
          this.selectComponentOptions.resourceUrl = response2.data.item.resourceUrl
          baseRequest('/basic' + this.selectComponentOptions.resourceUrl, {}).then(response3 => {
            this.selectComponentOptions.selectOptions = response3.data.item
            this.loading = true
          })
        })
      })
      // this.selectComponentOptions.componentType = '3'
      // this.selectComponentOptions.selectType = '2'
      // baseRequest('/sqlGroup/selectGroups', {}).then(response => {
      //   this.selectComponentOptions.selectOptions =
      //   [{
      //     id: 'a',
      //     label: 'a',
      //     children: [{
      //       id: '1',
      //       label: 'aa'
      //     }, {
      //       id: '2',
      //       label: 'ab'
      //     }]
      //   }, {
      //     id: '3',
      //     label: 'b'
      //   }, {
      //     id: '4',
      //     label: 'c'
      //   }]
      // })
    } else {
      this.loading = true
    }
  },
  data() {
    return {
      loading: false,
      selectComponentOptions: {
        selectOptions: []
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
    clickHandle(t) {
      console.log(t)
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
</style>
