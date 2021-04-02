<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item>
              <a-button v-if="$auth('role.add')" type="primary" icon="plus" @click="$refs.roleEditor.add({ editType: 0 })">添加</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table-new ref="table" size="default" :columns="columns" :data="loadData" rowKey="id">
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-row :gutter="24" :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permit_info" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :span="6">
              <span>{{ role.name }}：</span>
            </a-col>
            <a-col :span="18" v-if="role.action_info.length > 0">
              <a-tag color="darkcyan" v-for="(action, k) in role.action_info" :key="k">{{ action.name }}</a-tag>
            </a-col>
            <a-col :span="18" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <template>
          <a v-action:edit @click="$refs.roleEditor.edit({ ...record, editType: 1 })">编辑</a>
          <a-divider type="vertical" />
        </template>
        <template v-if="$auth('role.disable') || $auth('role.enable') && record.code !== 'manager' && record.code !== myroleid">
          <a v-if="record.status == 1" @click="handleStatus(record)">禁用</a>
          <a v-else @click="handleStatus(record)">启用</a>
        </template>
        <template v-if="$auth('role.delete') && record.code !== 'manager' && record.code !== myroleid">
          <a-divider type="vertical" />
          <a @click="handleDele(record)">删除</a>
        </template>
      </span>
    </s-table-new>

    <role-modal ref="roleEditor" @ok="handleOk"></role-modal>
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { STableNew } from '@/components'
import RoleModal from './modules/RoleModal'
import { getRolesList, apiRoles } from '@/api/manager'

export default {
  name: 'RoleList',
  components: {
    STableNew,
    RoleModal
  },
  data () {
    return {
      description: '',
      myroleid: '',

      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '角色代码',
          dataIndex: 'code'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '描述',
          dataIndex: 'describe'
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: text => {
            switch (text) {
              case 1:
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getRolesList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.response
        })
      }
    }
  },
  created () {
    this.myroleid = this.roles().roleid
  },
  methods: {
    ...mapGetters(['roles']),

    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    handleDele (record) {
      const self = this
      self.$confirm({
        title: '是否确认删除?',
        content: (
          <p>
            角色代码：{record.code} <br />
            角色名称：{record.name}
          </p>
        ),
        onOk () {
          apiRoles('delete/roles', { id: record.id }).then(res => {
            if (res.code === 200) {
              self.$refs.table.refresh()
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
    },
    handleStatus (record) {
      const self = this
      const status = record.status === 1 ? 2 : 1
      apiRoles('disable', { id: record.id, status: status }).then(res => {
        if (res.code === 200) {
          self.$refs.table.refresh()
        } else {
          self.$notification.error({
            message: '错误',
            description: res.msg,
            duration: 4
          })
        }
      })
    }
  }
}
</script>
