<template>
  <a-modal
    title="修改密码"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="旧密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-password
            autocomplete="false"
            placeholder="旧密码"
            v-decorator="['old_password', {rules: [{required: true, message: '请输入旧密码！'}, {required: true, min: 6, max: 12, message: '原密码位数有误！'}]}]"
          />
        </a-form-item>
        <a-form-item label="新密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-password
            autocomplete="false"
            placeholder="新密码"
            v-decorator="['new_password', {rules: [{required: true, min: 6, max: 12, message: '请输入6至12位新密码！'}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { restPassword } from '@/api/login'

export default {
  name: 'PasswordModal',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    edit () {
      this.visible = true
    },
    handleSubmit (e) {
      const self = this
      e.preventDefault()
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const data = { ...values }
          restPassword(data)
            .then((response) => {
              if (response.code === 200) {
                self.$message.success('密码修改成功')
                self.visible = false
                self.form.resetFields()
                self.$emit('ok', 'success')
              } else {
                self.$error({
                  title: '错误',
                  content: response.msg
                })
              }
            })
            .catch((err) => {
              console.log('chgpwd', err)
              self.visible = false
            })
            .finally(() => {
              self.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
