<!-- 文章分类 -->
<template>
  <a-card>
    <a-button @click="$refs.classifyListEditor.set({ editType: 0 })" type="primary">添加分类</a-button>
    <a-table
      ref="table"
      :columns="columns"
      :data-source="data"
      rowKey="id"
      style="marginTop: 15px"
      :showPagination="false">
      <span slot="name" slot-scope="text, record">
        <img class="table-img" :src="record.picture | setImgUrl('goods', 1)" />
        <span>{{ record.name }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-space size="small">
          <a-button size="small" @click="$refs.classifyListEditor.set({ ...record, editType: 1 })">编辑</a-button>
          <a-button size="small" @click="handleDelete(record)">删除</a-button>
          <a-button size="small" @click="$refs.classifyListEditor.set({ ...record, editType: 2 })">添加子分类</a-button>
        </a-space>
      </span>
    </a-table>
    <classify-list-editor ref="classifyListEditor" @ok="handleOk"></classify-list-editor>
  </a-card>
</template>
<script>
import ClassifyListEditor from './modules/ClassifyListEditor'
import { getArticlesCategoryDrop, apiArticlesCategory } from '@/api/content'
export default {
  name: 'ClassifyList',
  components: {
    ClassifyListEditor
  },
  data () {
    return {
      columns: [
        {
          title: '分类名称',
          dataIndex: 'name',
          key: 'name',
          width: '80%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    // 获取列表数据
    loadData () {
      const self = this
      getArticlesCategoryDrop()
        .then(res => {
          if (res.code === 200) {
            self.data = res.response
            console.log(self.data)
          } else {
            self.$message.error(res.msg)
          }
        })
        .catch(() => {
          self.$message.error('获取数据失败，请重试！')
        })
    },
    // 添加编辑完成回调
    handleOk () {
      const self = this
      self.loadData()
    },
    // 删除分类
    handleDelete (item) {
      const self = this
      if (item.children.length > 0) {
        self.$message.error('请先删除其子分类')
      } else {
        self.$confirm({
        title: '提示',
        content: '确定删除该分类吗？',
        onOk () {
          apiArticlesCategory('del', {
            id: item.id
          }).then(res => {
            if (res.code === 200) {
              self.loadData()
              self.$message.success('删除成功')
            } else {
              console.log(res)
              self.$message.error(res.msg)
            }
          })
        }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.table-img {
  width: 35px;
  height: 35px;
  margin-right: 5px;
}
/deep/.ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
  padding: 8px;
}
</style>
