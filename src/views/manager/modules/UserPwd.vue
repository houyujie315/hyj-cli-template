<template>
  <a-modal title="修改密码" :width="480" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item hidden>
          <a-input v-decorator="['recid', { initialValue: mdlData.recid }]" />
        </a-form-item>
        <a-form-item label="登陆名称" :labelCol="labelCol" :wrapperCol="wrapperCol" id="loginame">{{ mdlData.loginame }}</a-form-item>
        <a-form-item label="中文名称" :labelCol="labelCol" :wrapperCol="wrapperCol" id="realname">{{ mdlData.realname }}</a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="登陆密码">
          <a-input-password
            autocomplete="false"
            placeholder="登陆密码"
            v-decorator="[
              'passwd',
              {
                rules: [{required: true, message: '请输入登陆密码' }]
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
import md5 from 'md5'
import pick from 'lodash.pick'
import { apiUsers } from '@/api/manager'

export default {
  name: 'UserPwd',
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
      mdlData: {}
    }
  },
  methods: {
    edit (data) {
      const self = this
      self.mdlData = pick(data, ['loginame', 'realname', 'roleid', 'status'])
      self.visible = true
    },
    handleSubmit () {
      const self = this
      const { form: { validateFields } } = this
      self.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const cmd = 'update'
          values.passwd = md5(values.passwd)
          values.loginame = self.mdlData.loginame
          values.status = self.mdlData.status
          values.roleid = self.mdlData.roleid
          apiUsers(`user/${cmd}`, values).then(res => {
            if (res.code === 0) {
              self.visible = false
              self.confirmLoading = false
              self.$emit('ok', values)
            } else {
              self.$notification.error({
                message: '错误',
                description: res.info,
                duration: 4
              })
              this.confirmLoading = false
            }
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
