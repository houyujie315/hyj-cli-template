<!-- 文章管理 -->
<template>
  <div>
    <a-card :bordered="false">
      <a-row type="flex" justify="space-between" style="margin-bottom: 10px">
        <a-col>
          <a-button @click="$refs.positionModal.set({ editType: 0 })" type="primary">添加广告位</a-button>
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
            <a-form-item label="名称">
              <a-input v-decorator="['title']" style="width: 200px;" />
            </a-form-item>
            <a-form-item label="广告位标识">
              <a-input v-decorator="['call_index']" style="width: 200px;" />
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
            <a-button size="small" @click="$refs.positionModal.set({...record, editType: 1 })">编辑</a-button>
            <a-button size="small" @click="deletePosition(record)">删除</a-button>
          </a-space>
        </span>
      </s-table-new>
      <position-modal ref="positionModal" @ok="handleOk"></position-modal>
    </a-card>
  </div>
</template>
<script>
import { STableNew } from '@/components'
import { getAdvertsPositionList, apiAdvertsPosition } from '@/api/adverts'
import PositionModal from './modules/PositionModal.vue'
export default {
  name: 'AdvertsPosition',
  components: {
    STableNew,
    PositionModal
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
      form: this.$form.createForm(this)
    }
  },
  methods: {
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
          apiAdvertsPosition('del', {
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
