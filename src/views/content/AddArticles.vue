<!--  -->
<template>
  <div>
    <a-card :bordered="false" title="添加 / 编辑文章">
      <a-form :form="form" :colon="false">
        <a-form-item label="文章标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :maxLength="50" placeholder="请输入文章标题" v-decorator="['title', { initialValue: articleVerify.title, rules: [{ required: true, message: '请输入文章标题' }] }]" />
        </a-form-item>
        <a-form-item :maxLength="50" label="文章标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入文章标识" v-decorator="['call_index',{ initialValue: articleVerify.call_index, rules: [{ required: true, message: '请输入分类标识' }]} ]" />
          <p class="describe-text">分类标识，只允许字母、数字、下划线</p>
        </a-form-item>
        <a-form-item :maxLength="10" label="作者" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入文章作者" v-decorator="['author_name', { initialValue: articleVerify.author_name, rules: [{ required: true, message: '请输入文章作者' }]}]" />
        </a-form-item>
        <a-form-item label="地址链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入文章链接" v-decorator="['link_url',{ initialValue: articleVerify.link_url } ]" />
          <p class="describe-text">请填写完整链接地址，如：http://www.baidu.com</p>
        </a-form-item>
        <a-form-item label="文章封面" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['img_url',{ initialValue: articleVerify.img_url } ]" hidden/>
          <s-upload
            :isShowList="true"
            @uploadListDataRes="(value) => SkuPicSuccess(value)"
            :uploadListData="[{ url: imgUrl }]"
            :limitNum="1"
          ></s-upload>
        </a-form-item>
        <a-form-item label="文章分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-select v-decorator="['category_id', { initialValue: articleVerify.category_id, rules: [{ required: true, message: '请选择文章分类' }] }]">
                <a-select-option v-for="item in Allclassify" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8" style="margin-left: 10px">
              <a @click="obtainArticleCategory()">刷新</a>
              <router-link
                :to="{ path:'/content/classify' }"
                target="_blank"
                style="padding-left: 5px; margin-left: 5px; border-left: 1px solid #3a3f51;"
              >创建文章分类</router-link>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: articleVerify.status }]">
            <a-radio :value="1">
              启用
            </a-radio>
            <a-radio :value="2">
              禁用
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-row style="margin-left:45px;">
          <a-col :span="2">
            <a-form-item label="是否可评论" :labelCol="{span:16}" :wrapperCol="{ span:1 }">
              <a-switch v-decorator="['is_msg', { initialValue: articleVerify.is_msg, valuePropName: 'checked' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="2">
            <a-form-item label="是否置顶" :labelCol="{span:16}" :wrapperCol="{ span:1 }">
              <a-switch v-decorator="['is_top', { initialValue: articleVerify.is_top, valuePropName: 'checked' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="2">
            <a-form-item label="是否推荐" :labelCol="{span:16}" :wrapperCol="{ span:1 }">
              <a-switch v-decorator="['is_red', { initialValue: articleVerify.is_red, valuePropName: 'checked' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="2">
            <a-form-item label="是否热门" :labelCol="{span:16}" :wrapperCol="{ span:1 }">
              <a-switch v-decorator="['is_host', { initialValue: articleVerify.is_host, valuePropName: 'checked' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <a-form-item label="是否是系统文章" :labelCol="{span:16}" :wrapperCol="{ span:1 }">
              <a-switch v-decorator="['is_sys', { initialValue: articleVerify.is_sys, valuePropName: 'checked' }]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="文章摘要" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            :maxLength="300"
            :autoSize="{ minRows: 4 }"
            v-decorator="['summary', { initialValue: articleVerify.summary, rules: [{ required: true, message: '文章摘要不能为空' }] }]"
          />
        </a-form-item>
        <a-form-item label="文章内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <quill-editor ref="myQuillEditor" v-decorator="['content', { initialValue: articleVerify.content, rules: [{ required: true, message: '文章内容不能为空' }] }]"></quill-editor>
        </a-form-item>
        <a-form-item label=" " :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-space>
            <a-button type="primary" @click="handleSubmit">发布文章</a-button>
            <a-button @click="handleCancel">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import { getArticlesCategoryList, getArticlesDetail, apiArticles } from '@/api/content'
import { QuillEditor, SUpload } from '@/components'
export default {
  name: 'AddArticles',
  components: {
    QuillEditor,
    SUpload
  },
  data () {
    return {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 10
      },
      imgUrl: '',
      form: this.$form.createForm(this),
      articleVerify: {
        channel_id: -1,
        category_id: null,
        title: '',
        link_url: '',
        img_url: '',
        summary: '',
        content: '',
        sort_id: 0,
        status: 1,
        is_msg: false, // 是否可评论
        is_top: false, // 是否置顶
        is_red: false, // 是否推荐
        is_host: false, // 是否热门
        author_name: '',
        call_index: '', // 调用名称
        is_sys: false, // 是否是系统文章
        template_id: 0,
        clicks: 0
      },
      Allclassify: []
    }
  },
  created () {
    this.obtainArticleCategory()
    if (this.$route.query.id) {
      this.geDetail(this.$route.query.id)
    }
  },
  methods: {
    // 获取文章分类
    obtainArticleCategory () {
      const self = this
      getArticlesCategoryList().then(res => {
        if (res.code === 200) {
          self.Allclassify = res.response
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 提交
    handleSubmit () {
      const self = this
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          let url = 'add' // 添加
          const params = { ...self.articleVerify, ...values }
          console.log(params)
          if (self.$route.query.id > 0) {
            url = 'edit' // 编辑
          }
          apiArticles(url, params)
            .then(res => {
              if (res.code === 200) {
                self.$message.success('操作成功')
                self.$form.resetFields()
                self.$router.push({
                  path: '/content/articles'
                })
              } else {
                self.$message.error(res.msg)
              }
            })
            .catch(() => {
              self.$message.error('保存失败，请稍后重试！')
            })
        } else {
          self.$message.error('请完善必填项')
        }
      })
    },
    // 取消
    handleCancel () {
      this.form.resetFields()
      this.$router.push({
        path: '/content/articles'
      })
    },
    geDetail (id) {
      const self = this
      getArticlesDetail({ id })
        .then((res) => {
          if (res.code === 200) {
            self.articleVerify = res.response
            self.imgUrl = res.response.img_url
          } else {
            self.$message.error(res.msg)
          }
        })
    },
    SkuPicSuccess (value) {
      this.form.setFieldsValue({
        img_url: value.length > 0 ? value[0].url : ''
      })
      // this.articleVerify.img_url = value.length > 0 ? value[0].url : ''
    }
  }
}
</script>
<style lang="less" scoped>
.cover-image-add {
  width: 80px;
  height: 80px;
  border: 1px dashed #dcdee2;
  .cover-image-null {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
