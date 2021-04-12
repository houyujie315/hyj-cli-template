<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item>
              <a-button type="primary" icon="plus" @click="$refs.addressEdit.add({ editType: 0 })">添加退货地址</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table-new ref="table" size="default" :columns="columns" :data="loadData" rowKey="id">
      <span slot="address" slot-scope="text, record">
        <span>{{ record.province_name }} {{ record.city_name }} {{ record.area_name }} {{ record.address }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.addressEdit.edit({ ...record, editType: 1 })">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleDele(record)">删除</a>
      </span>
    </s-table-new>

    <address-edit ref="addressEdit" @ok="handleOk"></address-edit>
  </a-card>
</template>

<script>
import { STableNew } from '@/components'
import AddressEdit from './modules/AddressEdit'
import { getRtaddressList, apiAddress } from '@/api/address'

export default {
  name: 'RtaddressList',
  components: {
    STableNew,
    AddressEdit
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '联系人',
          dataIndex: 'name'
        },
        {
          title: '手机号',
          dataIndex: 'mobile'
        },
        {
          title: '固话',
          dataIndex: 'telephone',
          customRender: text => {
            if (text) {
              return <font>{{ text }}</font>
            }
            return '--'
          }
        },
        {
          title: '地址',
           scopedSlots: { customRender: 'address' }
        },
        {
          title: '默认地址',
          dataIndex: 'is_default',
          customRender: text => {
            if (text) {
              return '是'
            }
            return '否'
          }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getRtaddressList(Object.assign(parameter)).then(res => {
          return res.response
        })
      }
    }
  },
  created () { },
  methods: {
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    handleDele (record) {
      const self = this
      self.$confirm({
        title: '提示?',
        content: (
          <p>
            是否确认该地址删除?
          </p>
        ),
        onOk () {
          apiAddress('del', { id: record.id }).then(res => {
            if (res.code === 200) {
              self.$refs.table.refresh()
              self.$notification.success({
                message: '提示',
                description: '删除成功',
                duration: 4
              })
            } else {
              self.$notification.error({
                message: '错误',
                description: res.msg,
                duration: 4
              })
            }
          })
        }
      })
    }
  }
}
</script>
