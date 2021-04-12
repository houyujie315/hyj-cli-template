<template>
  <a-modal title="添加 / 编辑 商品分类" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="classifyForm" :model="formData" :rules="rules" :colon="false">
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级分类" hasFeedback>
          <a-select v-model="formData.parent_id">
            <a-select-option v-for="(item, index) in Allclassify" :key="index" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分类标题" prop="name">
          <a-input placeholder="请输入分类标题" v-model="formData.name" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图片">
          <s-upload
            :isShowList="true"
            @uploadListDataRes="(value) => SkuPicSuccess(value)"
            :uploadListData="[{ url: formData.icon }]"
            :limitNum="1"
            v-if="visible"
          ></s-upload>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
          <a-input placeholder="请输入分类排序" v-model="formData.sort_id" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否展示">
          <a-switch v-model="formData.is_show" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否推荐">
          <a-switch v-model="formData.is_red" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleSubmit">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
import { getCategoryList, getCategoryDetail, apiGoods } from '@/api/goods'
import { SUpload } from '@/components'
export default {
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
      Allclassify: [],
      formData: {
        name: '',
        icon: '',
        sort_id: 0,
        parent_id: 0,
        is_show: true,
        is_red: true
      },
      rules: {
        name: [{ required: true, message: '请输入分类标题', trigger: 'blur' }]
      },
      editType: 0, // 0添加 1编辑 2添加子分类
      editId: null
    }
  },
  methods: {
    // 获取下拉框分类数据
    getList () {
      getCategoryList().then((res) => {
        if (res.code === 200) {
          console.log(res)
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
          if (items.parent_id === it.id && list.findIndex((c) => c.id === items.id) === -1) {
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
      self.getList()
      self.editType = data.editType
      switch (self.editType) {
        case 0:
          self.formData = {
            name: '',
            icon: '',
            sort_id: 0,
            parent_id: 0,
            is_show: true,
            is_red: true
          }
          break
        case 1:
          self.editId = data.id
          await getCategoryDetail({
            id: data.id
          }).then((res) => {
            if (res.code === 200) {
              console.log(res)
              const resObj = res.response
              self.formData = {
                name: resObj.name,
                icon: resObj.icon,
                sort_id: resObj.sort_id,
                parent_id: resObj.parent_id,
                is_show: resObj.is_show,
                is_red: resObj.is_red
              }
            }
          })
          break
        case 2:
          self.$nextTick(() => {
            self.$refs.classifyForm.resetFields()
          })
          self.formData = {
            name: '',
            icon: '',
            sort_id: 0,
            parent_id: data.id,
            is_show: true,
            is_red: true
          }
          break
        default:
          break
      }
      self.visible = true
    },
    handleCancel () {
      this.visible = false
      this.$refs.classifyForm.resetFields()
    },
    // 提交
    handleSubmit () {
      const self = this
      self.confirmLoading = true
      self.$refs.classifyForm.validate((valid) => {
        if (valid) {
          let url = 'category/add' // 添加
          let params = { ...self.formData }
          if (self.editType === 1) {
            url = 'category/edit' // 编辑
            params = { ...self.formData, id: self.editId }
          }
          console.log(params, 'params')
          apiGoods(url, params)
            .then((res) => {
              if (res.code === 200) {
                self.visible = false
                self.confirmLoading = false
                self.$emit('ok')
                self.$refs.classifyForm.resetFields()
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
            .catch(() => {
              self.confirmLoading = false
            })
        } else {
          self.confirmLoading = false
        }
      })
    },
    SkuPicSuccess (value) {
      this.formData.icon = value.length > 0 ? value[0].url : ''
    }
  }
}
</script>
