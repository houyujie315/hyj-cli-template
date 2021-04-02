<template>
  <a-card :bordered="false">
    <div v-action:add class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item>
              <a-button v-if="$auth('permit.add')" type="primary" icon="plus" @click="$refs.permitEditor.add({ editType: 0 })">添加</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table-new ref="table" :columns="columns" :data="loadData" rowKey="id">
      <span slot="actions" slot-scope="text, record">
        <a-tag color="darkcyan" v-for="(action, index) in record.key_action" :key="index">{{ action.action_name }}</a-tag>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:edit @click="$refs.permitEditor.edit({ ...record, editType: 1 })">编辑</a>
          <a-divider type="vertical" />
        </template>
        <template v-if="$auth('permit.disable') || $auth('permit.enable') && record.code !== 'manager' && record.code !== myroleid">
          <a v-if="record.status == 0" @click="handleStatus(record)">禁用</a>
          <a v-else @click="handleStatus(record)">启用</a>
          <a-divider type="vertical" />
        </template>
        <template v-if="$auth('permit.delete')">
          <a @click="handleDele(record)">删除</a>
        </template>
      </span>
    </s-table-new>

    <permit-editor ref="permitEditor" @ok="editOk"></permit-editor>
  </a-card>
</template>

<script>
import { STableNew } from '@/components'
import { getPermitsList, apiPermits } from '@/api/manager'
import PermitEditor from './modules/PermitEditor'

export default {
  name: 'PermitList',
  components: {
    STableNew,
    PermitEditor
  },
  data () {
    return {
      // description: '系统权限管理，基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 表头
      columns: [
        {
          title: '权限代码',
          dataIndex: 'code'
        },
        {
          title: '权限名称',
          dataIndex: 'name'
        },
        {
          title: '可操作权限',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: text => {
            switch (text) {
              case 2:
                return <font color="red">禁用</font>
            }
            return '正常'
          }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 向后端拉取可以用的操作列表
      // permissionList: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPermitsList(Object.assign(parameter)).then(res => {
          return res.response
        })
      }
    }
  },
  created () {
    // this.loadPermissionList()
  },
  methods: {
    // loadPermissionList () {
    //   getMenusActionAllList()
    //     .then(response => {
    //       if (response.code === 0) {
    //         const result = response
    //         this.permissionList = result.response
    //       } else {
    //         console.log('action/list', response)
    //       }
    //     })
    //     .catch(error => {
    //       console.log('action/list', error)
    //     })
    // },
    editOk () {
      this.$refs.table.refresh()
    },
    handleDele (record) {
      const self = this
      self.$confirm({
        title: '是否确认删除?',
        content: (
          <p>
            权限代码：{record.code} <br />
            权限名称：{record.name}
          </p>
        ),
        onOk () {
          apiPermits('delete', { id: record.id }).then(res => {
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
    },
    handleStatus (record) {
      const self = this
      const status = record.status === 1 ? 2 : 1
      apiPermits('status', { id: record.id, status: status }).then(res => {
        if (res.code === 200) {
          self.$refs.table.refresh()
          self.$notification.success({
            message: '提示',
            description: '操作成功'
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
  }
}
</script>
