<template>
  <a-modal title="操作" :width="800" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限代码" hasFeedback>
          <a-input
            placeholder="权限代码"
            v-decorator="[
              'code',
              {
                rules: [{required: true, message: '请输入权限代码' }],
                initialValue: mdlData.code
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限名称" hasFeedback>
          <a-input
            placeholder="权限名称"
            v-decorator="[
              'name',
              {
                rules: [{required: true, message: '请输入权限名称' }],
                initialValue: mdlData.name
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限描述" hasFeedback>
          <a-textarea
            placeholder="权限描述"
            v-decorator="[
              'describe',
              {
                rules: [{required: true, message: '请输入权限描述' }],
                initialValue: mdlData.describe
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态" hasFeedback>
          <a-select
            v-decorator="[
              'status',
              {
                rules: [{required: true, message: '请选择权限状态' }],
                initialValue: mdlData.status
              }
            ]"
          >
            <a-select-option :value="0">正常</a-select-option>
            <a-select-option :value="1">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="赋予权限" hasFeedback>
          <a-select
            mode="multiple"
            :allowClear="true"
            @select="handleSelect "
            v-decorator="[
              'permit_action',
              {
                rules: [{required: true, message: '请选择权限状态' }],
                initialValue: mdlData.actions
              }
            ]"
          >
            <a-select-option
              v-for="(action, index) in permissionList"
              :key="index"
              :value="action.code"
            >{{ action.name }}</a-select-option>
          </a-select>
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
import { apiPermits, getMenusActionAllList } from '@/api/manager'

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
    this.loadPermissionList()
  },
  methods: {
    add () {
      const self = this
      self.editType = 0
      self.mdlData = {
        code: '',
        name: '',
        status: 0,
        describe: '',
        permit_action: []
      }
      self.visible = true
      const { form: { setFieldsValue } } = self
      self.$nextTick(() => {
        setFieldsValue(self.mdlData)
      })
    },
    edit (data) {
      const self = this
      self.editType = 1
      self.editId = data.id
      self.visible = true
      self.mdlData = pick(data, ['code', 'name', 'status', 'describe'])
      const actions = data.key_action.map(function (value, index, arr) { return value.action_code })
      self.mdlData.permit_action = actions
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
          if (self.editId) {
            cmd = 'edit'
            params = { ...values, id: self.editId }
          }
          apiPermits(cmd, params).then(res => {
            if (res.code === 200) {
              self.visible = false
              self.confirmLoading = false
              self.$notification.success({
                message: '提示',
                description: self.editType === 1 ? '编辑成功' : '添加成功'
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
    // 获取操作下拉框数据
    loadPermissionList () {
      getMenusActionAllList()
        .then(res => {
          if (res.code === 200) {
            this.permissionList = res.response
          } else {
            console.log('action/list', res)
          }
        })
        .catch(error => {
          console.log('action/list', error)
        })
    },
    handleSelect (value, option) {
      console.log(value, option)
    }
  }
}
</script>
