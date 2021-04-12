<template>
  <a-modal title="添加 / 编辑 文章分类" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :colon="false">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级分类" hasFeedback>
          <a-select v-decorator="['parent_id', { initialValue: mdlData.parent_id }]">
            <a-select-option v-for="(item, index) in Allclassify" :key="index" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分类标题">
          <a-input placeholder="请输入分类标题" v-decorator="['name', { initialValue: mdlData.name, rules: [{ required: true, message: '请输入分类标题' }] }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分类标识">
          <a-input placeholder="请输入分类标识" v-decorator="['call_index',{ initialValue: mdlData.call_index, rules: [{ required: true, message: '请输入分类标识' }]} ]" />
          <p class="describe-text">分类标识，只允许字母、数字、下划线</p>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图片">
          <s-upload
            :isShowList="true"
            @uploadListDataRes="(value) => SkuPicSuccess(value)"
            :uploadListData="[{ url: mdlData.img_url }]"
            :limitNum="1"
            v-if="visible"
          ></s-upload>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input placeholder="请输入分类排序" v-decorator="['sort_id', { initialValue: mdlData.sort_id }]" />
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
import { apiArticlesCategory, getArticlesCategoryList, getArticlesCategoryDetail } from '@/api/content'
import { SUpload } from '@/components'
export default {
  name: 'ClassifyListEditor',
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
      form: this.$form.createForm(this),
      Allclassify: [],
      mdlData: {
        name: '',
        channel_id: 0,
        call_index: '',
        parent_id: 0,
        sort_id: 999,
        img_url: '',
        template_id: 0
      },
      editType: 0, // 0添加 1编辑 2添加子分类
      editId: null
    }
  },
  async created () {
   this.getList()
  },
  methods: {
    // 获取下拉框分类数据
    getList () {
      getArticlesCategoryList().then(res => {
        if (res.code === 200) {
          this.Allclassify = this.dealData(res.response)
        } else {
          this.$message.error('数据获取失败，请刷新重试！')
        }
      })
    },
    dealData (data) {
      const list = []
      data.map((item) => {
        if (item.parent_id === 0) {
          list.push(item)
        }
      })
      return this.digui(data, list)
    },
    digui (data, list) {
      data.map((items) => {
        list.map((it, i) => {
          if (
            items.parent_id === it.id &&
            list.findIndex((c) => c.id === items.id) === -1
          ) {
            list.splice(i + 1, 0, items)
          }
        })
      })
      if (data.length > list.length) {
        this.digui(data, list)
      } else {
        list.unshift({ id: 0, name: '无上级分类' })
      }
      return list
    },
    async set (data) {
      const self = this
      self.editType = data.editType
      switch (self.editType) {
        case 0:
          self.form.resetFields()
          self.mdlData = {
            name: '',
            channel_id: 0,
            call_index: '',
            parent_id: 0,
            sort_id: 999,
            img_url: '',
            template_id: 0
          }
          break
        case 1:
          self.editId = data.id
          await getArticlesCategoryDetail({
            id: data.id
          }).then(res => {
            if (res.code === 200) {
              console.log(res)
              const resObj = res.response
              self.mdlData = {
                name: resObj.name,
                channel_id: resObj.channel_id,
                call_index: resObj.call_index,
                parent_id: resObj.parent_id,
                sort_id: resObj.sort_id,
                img_url: resObj.img_url,
                template_id: resObj.template_id
              }
              console.log(self.mdlData, 'self.mdlData')
            }
          })
          break
        case 2:
          self.form.resetFields()
          self.mdlData = {
            name: '',
            channel_id: 0,
            call_index: '',
            parent_id: data.id,
            sort_id: 999,
            img_url: '',
            template_id: 0
          }
          self.defaultSelect = data.id
          break
        default:
          break
      }
      self.visible = true
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
          let params = { ...values, img_url: self.mdlData.img_url }
          if (self.editType === 1) {
            url = 'edit' // 编辑
            params = { ...values, id: self.editId, img_url: self.mdlData.img_url }
          }
          console.log(params, 'params')
          apiArticlesCategory(url, params)
            .then(res => {
              if (res.code === 200) {
                self.visible = false
                self.confirmLoading = false
                self.$emit('ok', values)
                self.form.resetFields()
                self.getList()
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
    SkuPicSuccess (value) {
      this.mdlData.img_url = value.length > 0 ? value[0].url : ''
    }
  }
}
</script>
