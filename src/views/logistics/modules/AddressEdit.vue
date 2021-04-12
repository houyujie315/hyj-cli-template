<template>
  <a-modal
    title="添加 / 编辑地址"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="设为默认地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-switch v-decorator="['is_default', { valuePropName: 'checked' }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人" hasFeedback>
          <a-input
            placeholder="请输入联系人姓名"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入联系人姓名' }],
                initialValue: mdlData.name,
              },
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号" hasFeedback>
          <a-input
            placeholder="请输入联系人手机号"
            v-decorator="[
              'mobile',
              {
                rules: [{ required: true, message: '请输入联系人手机号' }],
                initialValue: mdlData.mobile,
              },
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="固定电话" hasFeedback>
          <a-input
            placeholder="区号-固定电话"
            v-decorator="[
              'telephone',
              {
                initialValue: mdlData.telephone,
              },
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选择省市区">
          <a-input
            hidden
            v-decorator="[
              'province_id',
              {
                rules: [{ required: true, message: '选择省市区' }],
                initialValue: mdlData.province_id,
              },
            ]"
          />
          <a-cascader
            :value="selectCity"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            :options="options"
            placeholder="请选择区域"
            change-on-select
            :load-data="loadCityData"
            @change="onChange"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="详细地址" hasFeedback>
          <a-input
            placeholder="请输入详细地址"
            v-decorator="[
              'address',
              {
                rules: [{ required: true, message: '请输入详细地址' }],
                initialValue: mdlData.address,
              },
            ]"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="邮政编码" hasFeedback>
          <a-input
            placeholder="请输入邮政编码"
            :maxLength="6"
            v-decorator="[
              'post_code',
              {
                initialValue: mdlData.post_code,
              },
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
import { apiAddress, getRegions } from '@/api/address'

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
      mdlData: {
        id: 0,
        is_default: false,
        name: '',
        mobile: '',
        telephone: '',
        province_id: 0,
        province_name: '',
        city_id: 0,
        city_name: '',
        area_id: 0,
        area_name: '',
        address: '',
        post_code: ''
      },
      editType: 0,
      editId: null,
      options: [],
      selectCity: [],
      selectCityOpt: []
    }
  },
  created () {
    this.loadCityData()
  },
  methods: {
    add (data) {
      const self = this
      self.editType = data.editType
      self.mdlData = {}
      self.visible = true
      const {
        form: { setFieldsValue }
      } = self
      self.$nextTick(() => {
        setFieldsValue(self.mdlData)
      })
    },
    async edit (data) {
      const self = this
      self.visible = true
      self.editType = data.editType
      self.editId = data.id
      self.selectCity = []
      self.mdlData = pick(data, ['name', 'mobile', 'telephone', 'address', 'post_code', 'is_default', 'province_id'])
      const {
        form: { setFieldsValue }
      } = self
      self.$nextTick(() => {
        setFieldsValue(self.mdlData)
      })
      await self.initCityData(0, 0)
      await self.initCityData(data.province_id, 1)
      await self.initCityData(data.city_id, 2, data.province_id)
      self.selectCity = [data.province_id, data.city_id, data.area_id]
      self.selectCityOpt = [
        { id: data.province_id, name: data.province_name },
        { id: data.city_id, name: data.city_name },
        { id: data.area_id, name: data.area_name }
      ]
    },
    // 修改回显省市区下拉框
    async initCityData (parentId, layer, id) {
      let cmd = 'province'
      if (layer === 1) {
        cmd = 'city'
      } else if (layer === 2) {
        cmd = 'area'
      }
      await getRegions(cmd, { id: parentId }).then(res => {
        if (layer < 2) {
          res.response.forEach((item) => {
            item.isLeaf = false
          })
        }
        if (layer === 0) {
            this.options = res.response
          } else if (layer === 1) {
            this.options.forEach(item => {
              if (item.id === parentId) {
                item.children = res.response
              }
            })
          } else if (layer === 2) {
            this.options.forEach(item => {
              if (item.id === id) {
                item.children.forEach(d => {
                  if (d.id === parentId) {
                    d.children = res.response
                  }
                })
              }
            })
          }
      })
    },
    // 获取省市区选择框数据
    loadCityData (selectedOptions) {
      let targetOption = {}
      let cmd = 'province'
      if (selectedOptions) {
        targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        if (selectedOptions.length === 1) {
          cmd = 'city'
        } else if (selectedOptions.length === 2) {
          cmd = 'area'
        }
      } else {
        targetOption.id = 0
      }
      getRegions(cmd, { id: targetOption.id }).then((res) => {
        if (res.code === 200) {
          if (this.selectCity.length < 2) {
            res.response.forEach((item) => {
              item.isLeaf = false
            })
          }
          if (targetOption.id > 0) {
            targetOption.loading = false
            targetOption.children = res.response
            this.options = [...this.options]
          } else {
            this.options = res.response
          }
        }
      })
    },
    onChange (value, selectedOptions) {
      this.selectCity = value
      this.selectCityOpt = selectedOptions
      // TODO 表单验证
      this.form.setFieldsValue({ province_id: value[0] })
    },
    handleSubmit () {
      const self = this
      const { form: { validateFields } } = this
      self.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          let cmd = 'add'
          let params = { ...self.mdlData, ...values }
          if (self.selectCityOpt.length > 0) {
            params.province_id = self.selectCityOpt[0].id
            params.province_name = self.selectCityOpt[0].name
          }
          if (self.selectCityOpt.length > 1) {
            params.city_id = self.selectCityOpt[1].id
            params.city_name = self.selectCityOpt[1].name
          }
          if (self.selectCityOpt.length > 2) {
            params.area_id = self.selectCityOpt[2].id
            params.area_name = self.selectCityOpt[2].name
          }
          if (self.editType === 1) {
            cmd = 'edit'
            params = { ...params, id: self.editId }
          }
          apiAddress(cmd, params).then((res) => {
            if (res.code === 200) {
              self.visible = false
              self.confirmLoading = false
              self.form.resetFields()
              self.selectCity = []
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
      this.form.resetFields()
      this.selectCity = []
    }
  }
}
</script>
