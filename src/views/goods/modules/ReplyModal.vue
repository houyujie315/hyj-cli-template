<template>
  <a-modal title="评价回复" :visible="modalVisible" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="form" :rules="rules" :colon="false">
        <a-form-model-item prop="content">
          <a-textarea v-model="form.content" placeholder="请输入回复评价内容" :maxLength="300" :rows="3" />
        </a-form-model-item>
        <a-form-model-item class="picture-upload-list">
          <div class="flex" style="align-items: center">
            <draggable v-model="pictureList" @end="draggaEnd" style="display: inline-block">
              <div class="picture-upload-item" v-for="(item, index) in pictureList" :key="index">
                <template v-if="item.url">
                  <img :src="item.url | setImgUrl('goods', 1)" />
                  <div class="picture-upload-list-cover">
                    <a-icon type="eye-o" @click.native="handleView(item)"></a-icon>
                    <a-icon type="delete" @click.native="handleRemove(item, index)"></a-icon>
                  </div>
                </template>
                <template v-else>
                  <a-progress v-if="item.showProgress" :percent="item.percentage" :showInfo="false"></a-progress>
                </template>
              </div>
            </draggable>
            <s-upload
              :isShowList="false"
              :multiple="true"
              :uploadListData.sync="pictureList"
              :limitNum="5"
            ></s-upload>
            <a-modal title="商品图片" v-model="visible" @ok="visible = false">
              <img style="width: 100%" :src="img" />
            </a-modal>
          </div>
          <p class="describe-text">建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传5张</p>
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
import { SUpload } from '@/components'
import { apiGoods } from '@/api/goods'
export default {
  components: {
    SUpload
  },
  data () {
    return {
      modalVisible: false,
      visible: false,
      img: '',
      confirmLoading: false,
      form: {
        id: 0,
        admin_id: 0,
        content: '',
        img_list: []
      },
      pictureList: [],
      rules: {
        content: [{ required: true, message: '请输入回复评价内容', trigger: 'blur' }]
      }
    }
  },
  methods: {
    reply (data) {
      this.modalVisible = true
      this.form.id = data.comment_id
      this.form.admin_id = data.admin_id
    },
    handleSubmit () {
      const self = this
      self.pictureList.forEach(element => {
        if (element.url) {
          self.form.img_list.push(element.url)
        }
      })
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.confirmLoading = true
          apiGoods('comment/reply', self.form).then(res => {
            if (res.code === 200) {
              self.modalVisible = false
              self.confirmLoading = false
              self.$notification.success({
                message: '提示',
                description: '回复成功'
              })
              self.$refs.form.resetFields()
              self.$emit('ok')
            } else {
              self.$notification.error({
                message: '错误',
                description: res.msg,
                duration: 4
              })
              self.confirmLoading = false
            }
          })
        }
      })
    },
    handleCancel () {
      const self = this
      self.modalVisible = false
      self.pictureList = []
      self.$refs.form.resetFields()
    },
    draggaEnd () {
      this.pictureList = this.pictureList.slice(0)
    },
    // 点击显示大图片
    handleView (data) {
      this.img = data.url
      this.visible = true
    },
    // 点击删除图片
    handleRemove (item, index) {
      this.pictureList.splice(index, 1)
    }
  }
}
</script>
<style scoped lang='less'>
</style>
