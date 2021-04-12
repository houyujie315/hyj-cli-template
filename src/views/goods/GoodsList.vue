<template>
  <div>
    <a-card :bordered="false" class="table-card">
      <a-tabs default-active-key="1" @change="statusChange">
        <a-tab-pane key="1" tab="出售中"></a-tab-pane>
        <a-tab-pane key="2" tab="已售罄"></a-tab-pane>
        <a-tab-pane key="3" tab="仓库"></a-tab-pane>
      </a-tabs>
      <div class="table-page-search-wrapper">
        <a-row>
          <a-col :span="14">
            <a-button type="primary" @click="addGoods">添加商品</a-button>
          </a-col>
          <a-col :span="10">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="12" :sm="24">
                  <a-form-item>
                    <a-select v-model="params.category_id" placeholder="请选择分类" @change="getGoodsList">
                      <a-select-option v-for="item in categoriesList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                  <a-form-item>
                    <a-input-search v-model="params.title" placeholder="搜索商品" @search="getGoodsList" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </div>
      <a-table
        ref="table"
        rowKey="id"
        :columns="columns"
        :data-source="tableData"
        :rowSelection="rowSelection"
        :pagination="{ pageSize: 8 }"
        @change="sortChange"
      >
        <span slot="name" slot-scope="text, record">
          <a class="cover">
            <img class="table-img" :src="record.cover | setImgUrl('goods', 1)" alt />
          </a>
          <div class="info">
            <a class="twoline">{{ record.title }}</a>
            <p class="text-deepOrange500">￥{{ record.min_price }}</p>
          </div>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-space>
            <a-button size="small" @click="editGoods(record.id)">编辑</a-button>
            <a-button v-if="record.goods_status != 1 && record.goods_status != 2" size="small" @click="opengoods(record.id)">上架</a-button>
            <a-button v-if="record.goods_status != 2 && record.goods_status != 3" size="small" @click="closegoods(record.id)">下架</a-button>
            <a-button size="small" @click="delConfirm(record.id)">删除</a-button>
          </a-space>
        </span>
      </a-table>
      <div class="table-operations">
        <a-space>
          <a-button size="small" v-if="params.goods_status==3" @click="opengoods(0)">批量上架</a-button>
          <a-button size="small" v-if="params.goods_status==1 " @click="closegoods(0)">批量下架</a-button>
          <a-button size="small" @click="delConfirm(0)">批量删除</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getGoodsList, getCategoryList, apiGoods } from '@/api/goods'

export default {
  name: 'TableList',
  data () {
    return {
      columns: [
        {
          title: '商品名称',
          key: 'title',
          dataIndex: 'title',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '访问量',
          dataIndex: 'views',
          sorter: true,
          customRender: (text) => text + ' 次'
        },
        {
          title: '库存',
          dataIndex: 'stock',
          sorter: true
        },
        {
          title: '总销量',
          dataIndex: 'sales',
          sorter: true
        },
        {
          title: '排序',
          sorter: true,
          dataIndex: 'sort'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          sorter: true,
          sortOrder: 'created'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      categoriesList: [],
      params: {
        page_index: 1,
        page_size: 8,
        goods_status: 1,
        category_id: -1,
        title: '',
        sort: '',
        desc: true
      },
      goods_ids: []
    }
  },
  computed: {
    rowSelection () {
      return {
        onChange: this.onSelectChange
      }
    }
  },
  created () {
    this.getGoodsList()
    this.getCategoryList()
  },
  methods: {
    // 获取商品分类
    getCategoryList () {
      getCategoryList().then((res) => {
        if (res.code === 200) {
          res.response.unshift({ id: -1, name: '全部' })
          this.categoriesList = res.response
        }
      })
    },
    // 获取商品列表
    getGoodsList () {
      getGoodsList(this.params).then(res => {
        if (res.code === 200) {
          this.tableData = res.response.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 状态筛选
    statusChange (data) {
      this.tableData = []
      this.params.goods_status = data
      this.params.page_index = 1
      this.getGoodsList()
    },
    // 添加商品
    addGoods () {
      this.$router.push({
        path: '/goods/add'
      })
    },
    // 编辑商品
    editGoods (id) {
      this.$router.push({
        path: '/goods/add',
        query: { id: id }
      })
    },
    // 删除商品
    delConfirm (id) {
      const self = this
      if (id === 0 && self.goods_ids.length === 0) {
        return self.$message.error('请选择要删除的商品')
      }
      if (id > 0) {
        self.goods_ids = [id]
      }
      self.$confirm({
        title: '提示',
        content: (<p>商品删除后无法恢复，是否继续删除商品？</p>),
        okText: '永久删除',
        cancelText: '我再想想',
        onOk () {
          apiGoods('delete', { ids: self.goods_ids }).then(res => {
            if (res.code === 200) {
              self.$notification.success({
                message: '提示',
                description: '删除成功'
              })
              self.getGoodsList()
              self.goods_ids = []
            } else {
              self.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      })
    },
    // 上架
    opengoods (id) {
      const self = this
      if (id === 0 && self.goods_ids.length === 0) {
        return self.$message.error('请选择要下架的商品')
      }
      if (id > 0) {
        self.goods_ids = [id]
      }
      self.$confirm({
        title: '提示',
        content: (<p>你确认上架这些商品吗?</p>),
        okText: '确认',
        cancelText: '我再想想',
        onOk () {
          apiGoods('on/shelf', { ids: self.goods_ids }).then(res => {
            if (res.code === 200) {
              self.$notification.success({
                message: '提示',
                description: '上架成功'
              })
              self.getGoodsList()
              self.goods_ids = []
            } else {
              self.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      })
    },
    closegoods (id) {
      const self = this
      if (id === 0 && self.goods_ids.length === 0) {
        return self.$message.error('请选择要下架的商品')
      }
      if (id > 0) {
        self.goods_ids = [id]
      }
      self.$confirm({
        title: '提示',
        content: (<p>你确认要下架这些商品吗?</p>),
        okText: '确认',
        cancelText: '我再想想',
        onOk () {
          apiGoods('off/shelf', { ids: self.goods_ids }).then(res => {
            if (res.code === 200) {
              self.$notification.success({
                message: '提示',
                description: '下架成功'
              })
              self.getGoodsList()
              self.goods_ids = []
            } else {
              self.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.goods_ids = []
      selectedRows.forEach(element => {
        this.goods_ids.push(element.id)
      })
    },
    sortChange (pagination, filters, sorter) {
      const self = this
      self.params.page_index = pagination.current
      self.params.sort = sorter.field
      console.log(sorter, 'sorter')
      if (sorter.field === 'create_time') {
        self.params.sort = 'create'
      }
      this.getGoodsList()
    }
  }
}
</script>
<style lang="less" scoped>
.cover {
  display: block;
  min-width: 60px;
  width: 60px;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  float: left;
}
.cover img {
  width: 100%;
  height: 100%;
}
.info {
  float: left;
  margin-top: 10px;
}
.table-card {
  position: relative;
}
.table-operations {
  position: absolute;
  left: 24px;
  bottom: 45px;
}
/deep/.ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
  padding: 8px;
}
</style>
