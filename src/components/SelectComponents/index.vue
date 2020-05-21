<template>
    <div class="condition-option">
        <el-select v-if="selectComponentOptions.componentType === '1'" :multiple="selectComponentOptions.selectType==='2'" collapse-tags v-model="val" @input="iptInput" class="input-condition">
            <el-option v-for="(text,value) in selectComponentOptions.selectOptions" :key="value" :value="value" :label="text"></el-option>
        </el-select>
        <treeselect 
            v-else-if="selectComponentOptions.componentType === '3'"
            :multiple="selectComponentOptions.selectType==='2'"
            v-model="val" 
            @input="iptInput"
            class="input-condition"
            placeholder="请选择"
            :valueConsistsOf="'ALL'"
            :defaultExpandLevel="5"
            :clearable="false"
            :clear-on-select="true"
            :close-on-select="true"
            :limit="1"
            :limitText="(count) => `+ ${count}`"
            :options="selectComponentOptions.selectOptions"
            >
        </treeselect>
    </div>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  model: { // 定义model
    prop: 'value', // 绑定prop传递的值
    event: 'input' // 定义触发事件名称
  },
  props: {
    value: [String, Number, Array], // 接受父组件传递的值
    selectComponentOptions: Object
  },
  components: {
    Treeselect
  },
  data() {
    return {
      val: this.value
    }
  },
  mounted() {
  },
  methods: {
    iptInput() {
      // 通过$emit触发input（model内定义）事件，将内部值传递给给父组件
      this.$emit('input', this.val)
    }
  }
}
</script>
