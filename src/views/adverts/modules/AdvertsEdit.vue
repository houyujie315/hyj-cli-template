<template>
  <a-modal title="添加 / 编辑 文章" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel" width="600px">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :colon="false">
        <a-form-item label="广告标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="50" placeholder="请输入广告标题" v-decorator="['title', { initialValue: advertsForm.title, rules: [{ required: true, message: '请输入文章标题' }] }]" />
        </a-form-item>
        <a-form-item label="广告位" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['position_id', { initialValue: advertsForm.position_id, rules: [{ required: true, message: '请选择广告位' }] }]">
            <a-select-option v-for="item in positionList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker v-decorator="['start_time']" placeholder="请选择日期"/>
        </a-form-item>
        <a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker v-decorator="['end_time']" placeholder="请选择日期"/>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: advertsForm.status }]">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="2">隐藏</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :maxLength="10" label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sort_id', { initialValue: advertsForm.sort_id}]" />
        </a-form-item>
        <a-form-item label="点击事件类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['click_event_type', { initialValue: advertsForm.click_event_type }]" @change="onChangeClickType">
            <a-radio :value="1">自定义链接</a-radio>
            <a-radio :value="2">跳转商品</a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="advertsForm.click_event_type === 1">
          <a-form-item label="自定义链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="请输入链接" v-decorator="['link_url',{ initialValue: advertsForm.link_url } ]" />
            <p class="describe-text">请填写完整链接地址，如：http://www.baidu.com</p>
          </a-form-item>
        </template>
        <template v-if="advertsForm.click_event_type === 2">
          <a-form-item label="选择商品" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <!-- <div class="goods-each-data" v-if="advertsForm.click_event.adverts_good.good_id>0">
              <img :src="advertsForm.click_event.adverts_good.cover" />
              <div class="goods-each-mask">
                <a-icon type="plus" @click.native="removeGoods()" />
              </div>
            </div> -->
            <div class="goods-each-add" @click="choiceGoodsModel = true">+</div>
            <choice-goods-modal v-model="choiceGoodsModel"></choice-goods-modal>
          </a-form-item>
        </template>
        <a-form-item label="展示方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['advert_type', { initialValue: advertsForm.advert_type }]">
            <a-radio :value="Number(1)">图片</a-radio>
            <a-radio :value="Number(2)">文本</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="文章封面" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="advertsForm.advert_type === 1">
          <div class="cover-image-add">
            <!-- TODO -->
            <a-upload
              ref="uploader"
              :action="uploadUrl"
              :beforeUpload="preUpload"
              :data="data"
              @change="handleChange"
            >
              <img v-if="advertsForm.img_url" :src="advertsForm.img_url" />
              <div v-else class="cover-image-null">
                <a-icon type="plus" />
              </div>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item label="广告描述" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="advertsForm.advert_type === 2">
          <a-textarea
            :maxLength="300"
            :autoSize="{ minRows: 2 }"
            placeholder="请输入广告描述"
            v-decorator="['code', { initialValue: advertsForm.body.code_body_view_model.code, rules: [{ required: true, message: '广告描述不能为空' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleSubmit">发布文章</a-button>
    </template>
  </a-modal>
</template>
<script>
import { getAdvertsPositionDrop, getAdvertsDetail, apiAdverts } from '@/api/adverts'
import ChoiceGoodsModal from './ChoiceGoodsModal'
import { getToken } from '@/api/api'
export default {
  name: 'AdvertsEdit',
  components: {
    ChoiceGoodsModal
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
      data: null,
      choiceGoodsModel: false,
      form: this.$form.createForm(this),
      positionList: [],
      advertsForm: {
        id: 0,
        position_id: null,
        status: 1,
        advert_type: 1, // 1、文本 2、图片
        sort_id: 0,
        title: '',
        click_event_type: 1,
        click_event: {
          adverts_url: {
            url: ''
          }, // 自定义链接
          adverts_good: {
            good_id: 0,
            good_code: '',
            goods_type: 0
          } // 选择商品
        },
        start_time: '',
        end_time: '',
        body: {
          code_body_view_model: {
            code: ''
          },
          image_body_view_model: {
            size: 0,
            width: 0,
            height: 0,
            url: ''
          }
        }
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      editType: 0, // 0添加 1编辑
      editId: null,
      uploadUrl: 'http://up-z0.qiniup.com'
    }
  },
  async created () {
  },
  methods: {
    onChangeClickType (e) {
      this.advertsForm.click_event_type = e.target.value
      console.log(e.target.value, this.advertsForm)
    },
    // 获取广告位
    obtainArticleCategory () {
      const self = this
      getAdvertsPositionDrop().then(res => {
        if (res.code === 200) {
          self.positionList = res.response
        } else {
          this.$message.error(res.msg)
        }
      })
    },
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
         getAdvertsDetail({ id: data.id })
          .then((res) => {
            if (res.code === 200) {
              self.advertsForm = res.response
            } else {
              self.$message.error(res.msg)
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
        console.log(values)
        if (!errors) {
          let url = 'add' // 添加
          let params = { ...values }
          if (self.editType === 1) {
            url = 'edit' // 编辑
            params = { ...values, id: self.editId }
          }
          apiAdverts(url, params)
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
    async handlePreview (file) {
      // if (!file.url && !file.preview) {
      //   file.preview = await getBase64(file.originFileObj)
      // }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ file }) {
      console.log(file)
    },
    preUpload () {
      const self = this
      getToken().then(res => {
        console.log(res)
        self.$refs.uploader.data = { token: res.response.token }
        self.data = { token: res.response.token }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.goods-each-data {
  position: relative;
  border: 1px dashed silver;
  border-radius: 5px;
  width: 70px;
  height: 70px;
  box-sizing: border-box;
  img {
    width: 68px;
    height: 68px;
    object-fit: cover;
  }
  .goods-each-mask {
    display: none;
    width: 68px;
    height: 68px;
    border-radius: 5px;
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 25px;
    text-align: center;
    line-height: 68px;
    background-color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }
}
.goods-each-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border: 1px dashed silver;
  border-radius: 5px;
  font-size: 30px;
  cursor: pointer;
}
</style>
