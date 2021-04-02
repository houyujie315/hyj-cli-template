<template>
  <div>
    <a-form :form="form" style="max-width: 500px; margin: 40px auto 0;">
      <a-form-item label="角色代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="['code', { initialValue: roleInfo.code, rules: [{required: true, message: '角色代码必须填写'}] }]" />
      </a-form-item>
      <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="['name', { initialValue: roleInfo.name, rules: [{required: true, message: '角色名称必须填写'}]}]" />
      </a-form-item>
      <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea rows="4" v-decorator="['describe', { initialValue: roleInfo.describe}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态" hasFeedback>
        <a-select
          v-decorator="[
            'status',
            {
              rules: [{required: true, message: '请选择角色状态' }],
              initialValue: roleInfo.status
            }
          ]"
        >
          <a-select-option :value="0">正常</a-select-option>
          <a-select-option :value="1">禁用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'RoleStep1',
  props: {
    roleInfo: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    clearMsg () {
      const self = this
      self.$nextTick(function () {
        self.form.resetFields()
      })
    },
    nextStep () {
      const { form: { validateFields } } = this
      // 先校验，通过表单校验后，才进入下一步
      validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
