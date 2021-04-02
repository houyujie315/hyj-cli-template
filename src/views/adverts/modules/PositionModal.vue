<template>
  <a-modal title="添加 / 编辑 广告位" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :colon="false">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告位标题">
          <a-input placeholder="请输入广告位标题" v-decorator="['title', { initialValue: mdlData.title, rules: [{ required: true, message: '请输入分类标题' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告位标识">
          <a-input placeholder="请输入广告位标识" v-decorator="['call_index',{ initialValue: mdlData.call_index, rules: [{ required: true, message: '请输入分类标识' }]} ]" />
          <p class="describe-text">广告位标识，只允许字母、数字、下划线</p>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="封面">
          <s-upload
            :isShowList="true"
            @uploadListDataRes="(value) => SkuPicSuccess(value)"
            :uploadListData="[{ url: mdlData.cover }]"
            :limitNum="1"
          ></s-upload>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告位尺寸">
          <a-row>
            <a-col :span="11">
              <a-input addon-after="PX" v-decorator="['advert_width', { initialValue: mdlData.advert_width }]" />
              <p class="describe-text">宽 x 高（单位px）</p>
            </a-col>
            <a-col :span="2" style="text-align: center">
              <span>X</span>
            </a-col>
            <a-col :span="11">
              <a-form-item>
                <a-input addon-after="PX" v-decorator="['advert_height', { initialValue: mdlData.advert_height }]" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="广告位描述">
          <a-textarea placeholder="请输入广告位描述" :rows="2" v-decorator="['description', { initialValue: mdlData.description, rules: [{ required: true, message: '请输入广告位描述' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
          <a-radio-group v-decorator="['status', { initialValue: mdlData.status }]">
            <a-radio :value="1">
              启用
            </a-radio>
            <a-radio :value="2">
              禁用
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleSubmit">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
import { apiAdvertsPosition, getAdvertsPositionDetail } from '@/api/adverts'
import { SUpload } from '@/components'

export default {
  name: 'PositionModal',
  components: {
    SUpload
  },
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
      fileParams: {},
      form: this.$form.createForm(this),
      Allclassify: [],
      mdlData: {
        id: 0,
        title: '',
        call_index: '',
        status: 1,
        description: '',
        cover: '',
        advert_width: 0,
        advert_height: 0
      },
      previewVisible: false,
      previewImage: '',
      editType: 0, // 0添加 1编辑
      editId: null
    }
  },
  async created () {
  },
  methods: {
    set (data) {
      const self = this
      self.visible = true
      self.editType = data.editType
      switch (self.editType) {
        case 0:
          self.form.resetFields()
          self.mdlData = {
            id: 0,
            title: '',
            call_index: '',
            status: 1,
            description: '',
            cover: '',
            advert_width: 0,
            advert_height: 0
          }
          break
        case 1:
          self.editId = data.id
          getAdvertsPositionDetail({
            id: data.id
          }).then(res => {
            console.log(data)
            if (res.code === 200) {
              self.mdlData = res.response
            }
          })
          break
        default:
          break
      }
    },
    handleCancel () {
      this.visible = false
      this.form.resetFields()
    },
    // 提交
    handleSubmit () {
      const self = this
      const { form: { validateFields } } = this
      self.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          let url = 'add' // 添加
          let params = { ...values }
          if (self.editType === 1) {
            url = 'edit' // 编辑
            params = { ...values, id: self.editId }
          }
          apiAdvertsPosition(url, params)
            .then(res => {
              if (res.code === 200) {
                self.visible = false
                self.confirmLoading = false
                self.$emit('ok', values)
                self.form.resetFields()
                self.$notification.success({
                  message: '提示',
                  description: self.editType === 1 ? '编辑成功' : '添加成功'
                })
              } else {
                self.$notification.error({
                  message: '错误',
                  description: res.msg,
                  duration: 4
                })
                self.confirmLoading = false
              }
            })
            .finally(() => {
              self.confirmLoading = false
            })
        } else {
          self.confirmLoading = false
        }
      })
    },
    handleUploadCancel () {
      this.previewVisible = false
    },
    // 上传成功
    SkuPicSuccess (value) {
      this.mdlData.cover = value.length > 0 ? value[0].url : ''
    }
  }
}
</script>
