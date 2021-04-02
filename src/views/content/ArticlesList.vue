<!-- 文章管理 -->
<template>
  <div>
    <a-card :bordered="false">
      <a-row type="flex" justify="space-between" style="margin-bottom: 10px">
        <a-col>
          <a-button @click="addArticle" type="primary">添加</a-button>
        </a-col>
        <a-col>
          <a-form :form="form" layout="inline">
            <a-form-item label="文章状态">
              <a-select v-decorator="['status', { initialValue: -1 }]" style="width: 120px">
                <a-select-option :value="Number(-1)">
                  全部
                </a-select-option>
                <a-select-option :value="Number(1)">
                  启用
                </a-select-option>
                <a-select-option :value="Number(2)">
                  禁用
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="文章名称">
              <a-input v-decorator="['title']" style="width: 200px;" />
            </a-form-item>
            <a-form-item>
              <a-button @click="filter" type="primary">筛选</a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
      <s-table-new ref="table" :columns="columns" size="default" :data="loadData" rowKey="id">
        <span slot="status" slot-scope="text, record">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="editContent(record)">编辑</a-button>
            <a-button size="small" @click="deleteContent(record)">删除</a-button>
          </a-space>
        </span>
      </s-table-new>
    </a-card>
  </div>
</template>
<script>
import { STableNew } from '@/components'
import { getArticlesList, apiArticles } from '@/api/content'
export default {
  name: 'ManageList',
  components: {
    STableNew
  },
  data () {
    return {
      queryParam: {}, // 查询参数
      columns: [
        {
          title: '文章名称',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '文章链接',
          dataIndex: 'img_url',
          key: 'img_url'
        },
        {
          title: '摘要',
          dataIndex: 'summary',
          key: 'summary'
        },
        {
          title: '文章分类',
          dataIndex: 'category_name',
          key: 'category_name'
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          key: 'create_time'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getArticlesList(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(parameter)
          return res.response
        })
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    addArticle () {
      this.$router.push({
        name: 'AddArticles'
      })
    },
    filter () {
      const self = this
      const { form: { getFieldsValue } } = self
      const params = getFieldsValue()
      self.queryParam = Object.assign(self.queryParam, params)
      self.$refs.table.refresh()
    },
    // 编辑文章
    editContent (item) {
      this.$router.push({
        name: 'AddArticles',
        query: {
          id: item.id
        }
      })
    },
    // 删除文章
    deleteContent (item) {
      const that = this
      that.$confirm({
        title: '提示',
        content: '确定删除该文章吗？',
        onOk () {
          apiArticles('del', {
            id: item.id
          }).then(res => {
            if (res.code === 200) {
              that.$refs.table.refresh()
              that.$message.success('删除成功')
            } else {
              console.log(res)
              that.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>
