<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item>
              <a-button type="primary" icon="plus" @click="$refs.companyEdit.add()">添加</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table-new ref="table" size="default" :columns="columns" :data="loadData" rowKey="id">
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.companyEdit.edit({ ...record })">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleDele(record)">删除</a>
      </span>
    </s-table-new>

    <company-edit ref="companyEdit" @ok="handleOk"></company-edit>
  </a-card>
</template>

<script>
import { STableNew } from '@/components'
import CompanyEdit from './modules/CompanyEdit'
import { getLogisticsList, apiLogistics } from '@/api/logistics'

export default {
  name: 'CompanyList',
  components: {
    STableNew,
    CompanyEdit
  },
  data () {
    return {
      description: '',

      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '公司名称',
          dataIndex: 'name'
        },
        {
          title: '公司编号',
          dataIndex: 'number'
        },
        {
          title: '公司全拼',
          dataIndex: 'full_spell'
        },
        {
          title: '是否启用',
          dataIndex: 'is_open',
          customRender: (text) => {
            if (text) {
              return '是'
            }
            return '否'
          }
        },
        {
          title: '使用次数',
          dataIndex: 'num'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getLogisticsList(Object.assign(parameter)).then((res) => {
          return res.response
        })
      }
    }
  },
  created () {},
  methods: {
    handleOk () {
      // 新增/修改 成功时，重载列表
      console.log(12312313)
      this.$refs.table.refresh()
    },
    handleDele (record) {
      const self = this
      self.$confirm({
        title: '提示',
        content: (
          <p>是否确认删除?</p>
        ),
        onOk () {
          apiLogistics('delete', { id: record.id }).then((res) => {
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
