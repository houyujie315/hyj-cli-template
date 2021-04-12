<template>
  <a-modal title="操作" :width="600" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作代码" hasFeedback>
          <a-input
            placeholder="操作代码"
            v-decorator="[
              'code',
              {
                rules: [{required: true, message: '请输入操作代码' }],
                initialValue: mdlData.code
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="操作名称" hasFeedback>
          <a-input
            placeholder="操作名称"
            v-decorator="[
              'name',
              {
                rules: [{required: true, message: '请输入操作名称' }],
                initialValue: mdlData.name
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { apiManagerMenus } from '@/api/manager'

export default {
  name: 'PermitEditor',
  components: {},
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      mdlData: {},
      permissionList: null,
      editType: 0,
      editId: null
    }
  },
  created () {
  },
  methods: {
    add (data) {
      const self = this
      self.editType = data.editType
      self.mdlData = {
        code: '',
        name: ''
      }
      self.visible = true
      const { form: { setFieldsValue } } = self
      self.$nextTick(() => {
        setFieldsValue(self.mdlData)
      })
    },
    edit (data) {
      const self = this
      self.visible = true
      self.editType = data.editType
      self.editId = data.id
      self.mdlData = pick(data, ['code', 'name'])
      const { form: { setFieldsValue } } = self
      self.$nextTick(() => {
        setFieldsValue(self.mdlData)
      })
    },
    handleSubmit () {
      const self = this
      const { form: { validateFields } } = this
      self.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          let cmd = 'add'
          let params = { ...values }
          if (self.editType === 1) {
            cmd = 'edit'
            params = { ...params, id: self.editId }
          }
          apiManagerMenus(`action/${cmd}`, params).then(res => {
            if (res.code === 200) {
              self.visible = false
              self.confirmLoading = false
              self.form.resetFields()
              self.$notification.success({
                message: '提示',
                description: self.editType === 1 ? '编辑成功' : '添加成功'
              })
              self.$emit('ok', values)
            } else {
              self.$notification.error({
                message: '错误',
                description: res.info,
                duration: 4
              })
              self.confirmLoading = false
            }
          })
        } else {
          self.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
