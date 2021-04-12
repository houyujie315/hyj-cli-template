<!-- 文章分类 -->
<template>
  <a-card>
    <a-button style="margin-bottom: 15px" @click="$refs.classifyListModal.set({ editType: 0 })" type="primary">添加分类</a-button>
    <a-table
      ref="table"
      :columns="columns"
      :data-source="data"
      rowKey="id"
      :showPagination="false"
    >
      <span slot="name" slot-scope="text, record">
        <img class="table-img" :src="record.picture | setImgUrl('goods', 1)" />
        <span>{{ record.name }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-space size="small">
          <a-button size="small" @click="$refs.classifyListModal.set({ ...record, editType: 1 })">编辑</a-button>
          <a-button size="small" @click="handleDelete(record)">删除</a-button>
          <a-button size="small" @click="$refs.classifyListModal.set({ ...record, editType: 2 })">添加子分类</a-button>
        </a-space>
      </span>
    </a-table>
    <classify-list-modal ref="classifyListModal" @ok="handleOk"></classify-list-modal>
  </a-card>
</template>
<script>
import ClassifyListModal from './modules/ClassifyListModal'
import { getCategoryTree, apiGoods } from '@/api/goods'
export default {
  name: 'ClassifyList',
  components: {
    ClassifyListModal
  },
  data () {
    return {
      columns: [
        {
          title: '分类名称',
          dataIndex: 'name',
          width: '30%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '是否展示',
          dataIndex: 'is_show',
          width: '25%',
          customRender: (text) => {
            if (text) {
              return '是'
            }
            return '否'
          }
        },
        {
          title: '是否推荐',
          dataIndex: 'is_red',
          width: '25%',
          customRender: (text) => {
            if (text) {
              return '是'
            }
            return '否'
          }
        },
        {
          title: '操作',
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
      getCategoryTree()
        .then((res) => {
          if (res.code === 200) {
            self.data = res.response
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
            apiGoods('category/deleted', {
              id: item.id
            }).then((res) => {
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
