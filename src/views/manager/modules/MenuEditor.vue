<template>
  <a-modal title="操作" :width="800" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item hidden>
          <a-input v-decorator="['status', { initialValue: mdlData.status }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称" hasFeedback>
          <a-input
            placeholder="名称"
            v-decorator="[
              'name',
              {
                rules: [{required: true, message: '请输入名称' }],
                initialValue: mdlData.name
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="父菜单ID" hasFeedback>
          <a-input
            placeholder="父菜单ID"
            v-decorator="[
              'parent_id',
              {
                rules: [{required: true, message: '请输入父菜单ID' }],
                initialValue: mdlData.parent_id
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单ID" hasFeedback>
          <a-input
            placeholder="菜单ID"
            v-decorator="[
              'menu_id',
              {
                rules: [{required: true, message: '请输入菜单ID' }],
                initialValue: mdlData.menu_id
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="菜单代码" hasFeedback>
          <a-input
            placeholder="菜单代码"
            v-decorator="[
              'menu_code',
              {
                rules: [{required: true, message: '请输入菜单代码' }],
                initialValue: mdlData.menu_code
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="url_path">
          <a-input
            placeholder="url_path"
            v-decorator="[
              'url_path',
              {
                initialValue: mdlData.url_path
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="redirect">
          <a-input
            placeholder="redirect"
            v-decorator="[
              'redirect',
              {
                initialValue: mdlData.redirect
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="target">
          <a-input
            placeholder="target"
            v-decorator="[
              'target',
              {
                initialValue: mdlData.target
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="icon">
          <a-input
            placeholder="icon"
            v-decorator="[
              'icon',
              {
                initialValue: mdlData.icon
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="hidden" hasFeedback>
          <a-select
            v-decorator="[
              'hidden',
              {
                rules: [{required: true, message: '请选择是否隐藏' }],
                initialValue: mdlData.hidden
              }
            ]"
          >
            <a-select-option :value="0">显示</a-select-option>
            <a-select-option :value="1">隐藏</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="component" hasFeedback>
          <a-input
            placeholder="component"
            v-decorator="[
              'component',
              {
                rules: [{required: true, message: '请输入组件名' }],
                initialValue: mdlData.component
              }
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="permit" hasFeedback>
          <a-select
            v-decorator="[
              'permit_id',
              {
                rules: [{required: true, message: '请选择permit' }],
                initialValue: mdlData.permit_id
              }
            ]"
          >
            <a-select-option
              v-for="(permit, index) in permissionList"
              :key="index"
              :value="permit.id"
            >{{ permit.name }}</a-select-option>
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
import { apiManagerMenus, getPermitsChoiceList } from '@/api/manager'

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
      permissionList: [],
      editType: 0,
      editId: null
    }
  },
  created () {
    this.loadPermissions()
  },
  methods: {
    add (data) {
      const self = this
      self.editType = data.editType
      self.mdlData = {
        name: '',
        parent_id: 0,
        permit_id: null,
        menu_code: '',
        menu_id: null,
        url_path: '',
        redirect: '',
        target: '',
        icon: '',
        hidden: 0,
        component: '',
        status: 1
      }
      self.visible = true
      const { form: { setFieldsValue } } = self
      self.$nextTick(() => {
        setFieldsValue(self.mdlData)
      })
    },
    edit (data) {
      const self = this
      self.editType = data.editType
      self.editId = data.id
      self.mdlData = pick(data, ['url_path', 'parent_id', 'name', 'redirect',
        'target', 'icon', 'permit_id', 'component', 'menu_code', 'menu_id', 'status'])
      self.mdlData.hidden = data.hidden === true ? 1 : 0
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
          let params = { ...values }
          if (self.editType === 1) {
            cmd = 'edit'
            params = { ...values, id: self.editId }
          }
          params.hidden = values.hidden === 1
          console.log(params)
          apiManagerMenus(cmd, params).then(res => {
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
    loadPermissions () {
      getPermitsChoiceList()
        .then(res => {
          if (res.code === 200) {
            console.log(res, 'resresresres')
            const result = res.response
            this.permissionList = result.map(item => {
              return pick(item, ['id', 'name'])
            })
          } else {
            console.log('permit/allist', res)
          }
        })
        .catch(error => {
          console.log('permit/allist', error)
        })
    },

    getPermitCode (permitid) {
      for (let i = 0; i < this.permissionList.length; i++) {
        if (this.permissionList[i].id === permitid) {
          // return this.permissionList[i].pcode
        }
      }
    }
  }
}
</script>
