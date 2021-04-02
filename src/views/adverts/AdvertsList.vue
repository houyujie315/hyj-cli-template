<!-- 文章管理 -->
<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form :form="form" layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="广告名称">
              <a-input v-decorator="['title']" placeholder="请输入广告名称" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="展示方式">
              <a-select v-decorator="['advert_type', { initialValue: -1 }]">
                <a-select-option :value="-1">全部</a-select-option>
                <a-select-option :value="1">文本</a-select-option>
                <a-select-option :value="2">图片</a-select-option>
                <!-- <a-select-option :value="3">视频</a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="广告状态">
              <a-select v-decorator="['status', { initialValue: -1 }]">
                <a-select-option :value="-1">全部</a-select-option>
                <a-select-option :value="1">正常</a-select-option>
                <a-select-option :value="2">隐藏</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label=" 广 告 位 ">
              <a-select v-decorator="['position_id', { initialValue: -1 }]">
                <a-select-option v-for="item in positionList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="开始时间">
              <a-date-picker v-decorator="['start_time']" style="width: 100%" placeholder="请选择日期"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="结束时间">
              <a-date-picker v-decorator="['end_time']" style="width: 100%" placeholder="请选择日期"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-space style="margin: 10px 0">
      <a-button @click="filter" type="primary">筛选</a-button>
      <a-button @click="$refs.advertsEdit.set({ editType: 0 })" type="primary">添加广告</a-button>
    </a-space>
    <s-table-new ref="table" :columns="columns" size="default" :data="loadData" rowKey="id">
      <span slot="status" slot-scope="text, record">
        <a-tag :color="record.status === 1 ? 'green' : 'red'">
          {{ record.status === 1 ? '启用' : '禁用' }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-space>
          <a-button size="small" @click="$refs.advertsEdit.set({...record, editType: 1 })">编辑</a-button>
          <a-button size="small" @click="deletePosition(record)">删除</a-button>
        </a-space>
      </span>
    </s-table-new>
    <adverts-edit ref="advertsEdit" @ok="handleOk"></adverts-edit>
  </a-card>
</template>
<script>
import { STableNew } from '@/components'
import { getAdvertsPositionList, getAdvertsPositionDrop, apiAdverts } from '@/api/adverts'
import AdvertsEdit from './modules/AdvertsEdit.vue'
export default {
  name: 'AdvertsPosition',
  components: {
    STableNew,
    AdvertsEdit
  },
  data () {
    return {
      queryParam: {}, // 查询参数
      columns: [
        {
          title: '广告位名称',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '广告位标识',
          dataIndex: 'call_index',
          key: 'call_index'
        },
        {
          title: '广告位宽度',
          dataIndex: 'advert_width',
          key: 'advert_width'
        },
        {
          title: '广告位高度',
          dataIndex: 'advert_height',
          key: 'advert_height'
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getAdvertsPositionList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.response
        })
      },
      form: this.$form.createForm(this),
      positionList: []
    }
  },
  created () {
    this.getPositionList()
  },
  methods: {
    getPositionList () {
      const self = this
      getAdvertsPositionDrop().then(res => {
        if (res.code === 200) {
          res.response.unshift({ id: -1, name: '全部' })
          self.positionList = res.response
        }
      })
    },
    filter () {
      const self = this
      const { form: { getFieldsValue } } = self
      const params = getFieldsValue()
      self.queryParam = Object.assign(self.queryParam, params)
      self.$refs.table.refresh()
    },
    // 删除广告位
    deletePosition (item) {
      const that = this
      that.$confirm({
        title: '提示',
        content: '确定删除该文章吗？',
        onOk () {
          apiAdverts('del', {
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
    },
    handleOk () {
      const self = this
      self.$refs.table.refresh()
    }
  }
}
</script>
