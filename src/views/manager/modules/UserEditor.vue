<template>
  <a-modal title="操作" :width="800" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: mdlData.id }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="登陆名称" hasFeedback>
          <a-input
            placeholder="登陆名称"
            v-decorator="[
              'account_user',
              {
                rules: [{required: true, message: '请输入登陆名称' }],
                initialValue: mdlData.account_user
              }
            ]"
          />
        </a-form-item>

        <a-form-item v-if="mdlData.roles_id === null" :labelCol="labelCol" :wrapperCol="wrapperCol" label="登陆密码">
          <a-input-password
            autocomplete="false"
            placeholder="登陆密码"
            v-decorator="[
              'pass_word',
              {
                rules: [{required: true, message: '请输入登陆密码' }]
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名" hasFeedback>
          <a-input
            placeholder="姓名"
            v-decorator="[
              'real_name',
              {
                rules: [{required: true, message: '请输入姓名' }],
                initialValue: mdlData.real_name
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号码" hasFeedback>
          <a-input
            placeholder="手机号码"
            v-decorator="[
              'phone',
              {
                rules: [{required: true, message: '请输入手机号' }],
                initialValue: mdlData.phone
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色" hasFeedback>
          <a-select
            v-decorator="[
              'roles_id',
              {
                rules: [{required: true, message: '请选择赋予角色' }],
                initialValue: mdlData.roles_id
              }
            ]"
          >
            <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态" hasFeedback>
          <a-select
            v-decorator="[
              'status',
              {
                rules: [{required: true, message: '请选择权限状态' }],
                initialValue: mdlData.status
              }
            ]"
          >
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="2">禁用</a-select-option>
            <a-select-option :value="3">锁定</a-select-option>
          </a-select>
        </a-form-item> -->
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { apiUsers, getRolesDrop } from '@/api/manager'

export default {
  name: 'UserEditor',
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
      roleList: null
    }
  },
  created () {
    this.loadRoleList()
  },
  methods: {
    add () {
      const self = this
      self.mdlData = {
        account_user: '',
        pass_word: '',
        real_name: '',
        phone: '',
        roles_id: null
      }
      self.visible = true
      const { form: { setFieldsValue } } = self
      self.$nextTick(() => {
        setFieldsValue(self.mdlData)
      })
    },
    edit (data) {
      const self = this
      self.mdlData = {
        id: data.id,
        account_user: data.name,
        real_name: data.true_name,
        phone: data.mobile,
        roles_id: data.roles_id
      }
      console.log(self.mdlData)
      self.visible = true
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
          if (values.id > 0) {
            cmd = 'edit/account'
            delete values.passwd
          } else {
            delete values.id
          }
          console.log(values, 'values')
          apiUsers(cmd, values).then(res => {
            if (res.code === 200) {
              self.visible = false
              self.confirmLoading = false
               self.$notification.success({
                message: '提示',
                description: '操作成功',
                duration: 4
              })
              self.$emit('ok', values)
            } else {
              self.$notification.error({
                message: '错误',
                description: res.msg,
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
    },
    loadRoleList () {
      getRolesDrop()
        .then(response => {
          if (response.code === 200) {
            const result = response.response
            console.log(response)
            this.roleList = result
          } else {
            console.log('role/allist', response)
          }
        })
        .catch(error => {
          console.log('role/allist', error)
        })
    }
  }
}
</script>
