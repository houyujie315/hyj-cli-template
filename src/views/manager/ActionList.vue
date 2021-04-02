<!-- 权限操作列表 -->
<template>
  <a-card>
    <a-form layout="inline" style="margin-bottom: 15px">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-form-item>
            <a-button v-if="$auth('action.add')" type="primary" icon="plus" @click="$refs.actionEditor.add({ editType: 0 })">添加</a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <s-table-new ref="table" size="default" :columns="columns" :data="loadData" rowKey="id">
      <span slot="action" slot-scope="text, record">
        <a v-if="$auth('action.edit')" @click="$refs.actionEditor.edit({...record, editType: 1})">编辑</a>
        <a-divider type="vertical" />
        <a v-if="$auth('action.delete')" @click="handleDele(record)">删除</a>
      </span>
    </s-table-new>
    <action-editor ref="actionEditor" @ok="handleOk"></action-editor>
  </a-card>
</template>
<script>
import { STableNew } from '@/components'
import { apiManagerMenus, getMenusActionList } from '@/api/manager'
import ActionEditor from './modules/ActionEditor'
export default {
  name: 'ActionList',
  components: {
    STableNew,
    ActionEditor
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '操作名称',
          dataIndex: 'name'
        },
        {
          title: '操作代码',
          dataIndex: 'code'
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
        return getMenusActionList(Object.assign(parameter)).then(res => {
          return res.response
        })
      }
    }
  },
  methods: {
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    handleDele (record) {
      const self = this
      self.$confirm({
        title: '提示',
        content: '是否确认删除?',
        onOk () {
          apiManagerMenus('action/delete', { id: record.id }).then(res => {
            if (res.code === 200) {
              self.$refs.table.refresh()
              self.$notification.success({
                message: '提示',
                description: '删除成功'
              })
            } else {
              self.$notification.error({
                message: '错误',
                description: res.info,
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
