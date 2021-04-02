<!-- 添加商品 -->
<template>
  <div>
    <a-card :bordered="false" title="添加/编辑商品">
      <a-form :form="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 8 }">
        <div>
          <h4 class="title">基本信息</h4>
          <a-form-item label="商品名称">
            <a-input v-decorator="['title', { rules: [{ required: true, message: '必须输入商品名称！' }] }]" />
          </a-form-item>
          <a-form-item label="分享描述">
            <a-input />
            <div class="flex">
              <p class="describe-text">微信分享给好友时会显示，建议36个字以内</p>
              <a-tooltip placement="bottom">
                <template slot="title">
                  <p class="describe-text">将商品在微信分享给朋友时，该处填写的内容会展示在商品名称下面：</p>
                  <div class="text-center">
                    <img
                      src="https://img.yzcdn.cn/public_files/2018/04/04/249513f376732ac3d353adcc16a5da5d.png"
                      alt
                      style="width:280px;height:330px"
                    />
                  </div>
                </template>
                <a>查看示例</a>
              </a-tooltip>
            </div>
          </a-form-item>
          <a-form-item label="商品图片">
            <a-upload
              action=""
              list-type="picture-card"
              :file-list="formData.fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="formData.fileList.length < 5">
                <a-icon type="plus" />
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
            <p class="describe-text">建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传5张</p>
          </a-form-item>
        </div>
      </a-form>
    </a-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: this.$form.createForm(this, { name: 'goods_add' }),
      formData: {
        fileList: []
      },
      previewVisible: false,
      previewImage: ''
    }
  },
  methods: {
    handlePreview () {},
    handleChange () {},
    handleCancel () {
      this.previewVisible = false
    }
  }
}
</script>
<style scoped lang='less'>
.flex {
  display: flex;
}
</style>
