<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item>
              <a-button type="primary" icon="plus" @click="$refs.userEditor.add()">添加</a-button>
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
      <span slot="status" slot-scope="text, record" v-if="record.id !== myuserid">
        <template>
          <a-switch checked-children="在职" un-checked-children="离职" :checked="record.status === 1 ? true : false" @change="handleLeave(record)"/>
        </template>
      </span>
      <span slot="action" slot-scope="text, record" v-if="record.id !== myuserid">
        <template>
          <a v-action:edit @click="$refs.userEditor.edit(record)">编辑</a>
        </template>
        <!-- <template v-if="record.id !== myuserid">
          <a-divider type="vertical" />
          <a @click="$refs.userPwd.edit(record)">修改密码</a>
        </template> -->
      </span>
    </s-table-new>

    <user-editor ref="userEditor" @ok="handleOk"></user-editor>
    <!-- <user-pwd ref="userPwd" @ok="handleOk"></user-pwd> -->
  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { STableNew } from '@/components'
import UserEditor from './modules/UserEditor'
// import UserPwd from './modules/UserPwd'
import { apiUsers, getUserList } from '@/api/manager'

export default {
  name: 'UserList',
  components: {
    STableNew,
    UserEditor
  },
  data () {
    return {
      myuserid: 0,

      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '登陆名称',
          dataIndex: 'name'
        },
        {
          title: '角色',
          dataIndex: 'roles_name'
        },
        {
          title: '真实姓名',
          dataIndex: 'true_name'
        },
        {
          title: '电话',
          dataIndex: 'mobile'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '240px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.response
        })
      }
    }
  },
  created () {
    console.log(this.userInfo(), 'this.userInfo()')
    this.myuserid = parseInt(this.userInfo().recid)
  },
  methods: {
    ...mapGetters(['userInfo']),

    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    // 这是用户在职状态
    handleLeave (record) {
      const self = this
      const status = record.status === 1
      apiUsers('leave', { account_id: record.id, is_leave: status }).then(res => {
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
    },
    handleStatus (record) {
      const self = this
      const status = record.status === 1 ? 2 : 1
      const data = {
        recid: record.recid,
        loginame: record.loginame,
        roleid: record.roleid,
        status: status
      }
      apiUsers('user/update', data).then(res => {
        if (res.code === 0) {
          self.$refs.table.refresh()
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
