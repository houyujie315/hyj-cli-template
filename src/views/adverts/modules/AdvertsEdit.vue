<template>
  <a-modal
    title="添加 / 编辑 文章"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    width="600px"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="advertsForm" :rules="rules" v-bind="layout">
        <a-form-model-item label="广告标题" prop="title">
          <a-input :maxLength="50" v-model="advertsForm.title" placeholder="请输入广告标题" />
        </a-form-model-item>
        <a-form-model-item label="广告位" prop="position_id">
          <a-select v-model="advertsForm.position_id">
            <a-select-option v-for="item in positionList" :key="item.id" :value="item.id">{{
              item.name
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="开始时间" prop="start_time">
          <a-date-picker valueFormat="YYYY-MM-DD HH:mm:ss" v-model="advertsForm.start_time" format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" style="width: 300px" />
        </a-form-model-item>
        <a-form-model-item label="结束时间" prop="end_time">
          <a-date-picker valueFormat="YYYY-MM-DD HH:mm:ss" v-model="advertsForm.end_time" format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" style="width: 300px" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-radio-group v-model="advertsForm.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="2">隐藏</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :maxLength="10" label="排序">
          <a-input v-model="advertsForm.sort_id" />
        </a-form-model-item>
        <a-form-model-item label="点击事件类型">
          <a-radio-group v-model="advertsForm.click_event_type">
            <a-radio :value="1">自定义链接</a-radio>
            <a-radio :value="2">跳转商品</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="advertsForm.click_event_type === 1" label="自定义链接" prop="click_event.adverts_url.url">
          <a-input placeholder="请输入链接" v-model="advertsForm.click_event.adverts_url.url" />
          <p class="describe-text">请填写完整链接地址，如：http://www.baidu.com</p>
        </a-form-model-item>
        <a-form-model-item label="选择商品" v-if="advertsForm.click_event_type == 2">
          <div class="goods-each-data" v-if="advertsForm.click_event.adverts_good.good_id > 0">
            <img :src="advertsForm.click_event.adverts_good.cover" />
            <div class="goods-each-mask">
              <a-icon type="delete" @click.native="removeGoods()"></a-icon>
            </div>
          </div>
          <div class="goods-each-add" @click="choiceGoodsModel = true" v-else>+</div>
          <choice-goods-modal
            v-model="choiceGoodsModel"
            :multiple="false"
            @selectedGoods="handlerSelectedGoods"
          ></choice-goods-modal>
        </a-form-model-item>
        <a-form-model-item label="展示方式">
          <a-radio-group v-model="advertsForm.advert_type">
            <a-radio :value="1">图片</a-radio>
            <a-radio :value="2">文本</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="文章封面" v-if="advertsForm.advert_type === 1" prop="body.image_body_view_model.url">
          <div class="cover-image-add">
            <s-upload
              :isShowList="true"
              @uploadListDataRes="(value) => SkuPicSuccess(value)"
              :uploadListData="[{ url: advertsForm.body.image_body_view_model.url }]"
              :limitNum="1"
              v-if="visible"
            >
            </s-upload>
          </div>
        </a-form-model-item>
        <a-form-model-item label="广告描述" v-if="advertsForm.advert_type === 2" prop="body.code_body_view_model.code">
          <a-textarea
            :maxLength="300"
            :autoSize="{ minRows: 2 }"
            placeholder="请输入广告描述"
            v-model="advertsForm.body.code_body_view_model.code"
          />
        </a-form-model-item>
      </a-form-model>
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
import { SUpload } from '@/components'
export default {
  components: {
    ChoiceGoodsModal,
    SUpload
  },
  data () {
    const startValidate = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择开始时间'))
      } else {
        return callback()
      }
    }
    const endValidate = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择结束时间'))
      } else {
        return callback()
      }
    }
    const textValidate = (rule, value, callback) => {
      if (this.advertsForm.advert_type === 1) {
        if (!value) {
          return callback(new Error('请输入文本内容'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    const imgValidate = (rule, value, callback) => {
      if (this.advertsForm.advert_type === 2) {
        if (!value) {
          return callback(new Error('请上传广告图片'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    return {
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      visible: false,
      confirmLoading: false,
      choiceGoodsModel: false,
      positionList: [], // 广告位
      advertsForm: {
        id: 0,
        position_id: null,
        status: 1,
        advert_type: 2, // 1、文本 2、图片 3、视频
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
          },
          video_body_view_model: {
            size: 0,
            duration: 0, // 时长
            cover: '',
            url: ''
          }
        }
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入广告标题',
            trigger: 'blur'
          }
        ],
        position_id: [
          {
            required: true,
            message: '请选择广告位',
            trigger: 'change',
            type: 'number'
          }
        ],
        start_time: [
          {
            required: true,
            validator: startValidate,
            trigger: 'change'
          }
        ],
        end_time: [
          {
            required: true,
            validator: endValidate,
            trigger: 'change'
          }
        ],
        'body.code_body_view_model.code': [
          {
            required: true,
            validator: textValidate,
            trigger: 'blur'
          }
        ],
        'body.image_body_view_model.url': [
          {
            required: true,
            validator: imgValidate,
            trigger: 'change'
          }
        ]
      },
      editType: 0, // 0添加 1编辑
      editId: null
    }
  },
  async created () {},
  methods: {
    // 获取广告位
    getAdvertsPositionDrop () {
      const self = this
      getAdvertsPositionDrop().then((res) => {
        if (res.code === 200) {
          self.positionList = res.response
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    async set (data) {
      const self = this
      self.visible = true
      self.editType = data.editType
      self.$nextTick(() => {
        self.$refs['form'].resetFields()
      })
      switch (self.editType) {
        case 0:
          break
        case 1:
          self.editId = data.id
           await getAdvertsDetail({ id: data.id }).then((res) => {
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
      self.getAdvertsPositionDrop()
    },
    handleCancel () {
      self.$refs['form'].resetFields()
      this.visible = false
    },
    // 移除商品
    removeGoods () {
      this.advertsForm.click_event.adverts_good = {}
    },
    // 提交
    handleSubmit () {
      const self = this
      self.confirmLoading = true
      self.$refs['form'].validate((valid) => {
        if (valid) {
          let url = 'add' // 添加
          let params = { ...self.advertsForm }
          if (self.editType === 1) {
            url = 'edit' // 编辑
            params = { ...self.advertsForm, id: self.editId }
          }
          apiAdverts(url, params)
            .then((res) => {
              if (res.code === 200) {
                self.visible = false
                self.confirmLoading = false
                self.$refs['form'].resetFields()
                self.$emit('ok')
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
    handlerSelectedGoods (val) {
      const goodsData = {}
      goodsData.good_id = val[0].id
      goodsData.good_code = val[0].good_code
      goodsData.goods_type = val[0].goods_type
      goodsData.cover = val[0].cover
      this.advertsForm.click_event.adverts_good = goodsData
    },
    SkuPicSuccess (value) {
      this.advertsForm.body.image_body_view_model.url = value.length > 0 ? value[0].url : ''
    }
  }
}
</script>
<style lang="less" scoped>
</style>
