<!--  -->
<template>
  <div>
    <a-card style="margin-bottom:10px;">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-row>
                <a-col :span="12">
                  <a-form-item label="姓名">
                    <a-input v-model="queryParam.real_name" placeholder="" style="width: 90%" />
                  </a-form-item>
                  <a-form-item label="手机号">
                    <a-input-number v-model="queryParam.mobile" style="width: 90%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="昵称">
                    <a-input-number v-model="queryParam.nick_name" style="width: 100%" />
                  </a-form-item>
                  <a-form-item label="使用状态">
                    <a-select v-model="queryParam.status" placeholder="请选择">
                      <a-select-option :value="-1">全部</a-select-option>
                      <a-select-option :value="1">正常</a-select-option>
                      <a-select-option :value="2">封禁</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :md="8" :sm="24">
            </a-col>
          </a-row>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
          </span>
        </a-form>
      </div>
    </a-card>
    <a-card>
      <s-table-new ref="table" rowKey="id" :columns="columns" :data="loadData">
        <span slot="nick_name" slot-scope="text, record">
          <img class="table-img" :src="record.avator" alt>
          <span>{{ record.nick_name }}</span>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-switch checked-children="是" un-checked-children="否" :checked="record.status === 2" @change="handleDisable(record, $event)" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a-button size="small" @click="$refs.usersDetailModal.open(record.id)">详情</a-button>
        </span>
      </s-table-new>
      <users-detail-modal ref="usersDetailModal"></users-detail-modal>
    </a-card>
  </div>
</template>
<script>
import { STableNew } from '@/components'
import { getUsersList, postUsersDisable } from '@/api/users'
import UsersDetailModal from './modules/UsersDetailModal'
export default {
  components: {
    STableNew,
    UsersDetailModal
  },
  data () {
    return {
      queryParam: {},
      columns: [
        {
          title: '昵称',
          scopedSlots: { customRender: 'nick_name' }
        },
        {
          title: '姓名',
          dataIndex: 'real_name',
          customRender: text => {
            if (text) {
              return text
            }
            return '---'
          }
        },
        {
          title: '手机号',
          dataIndex: 'mobile'
        },
        {
          title: '是否封禁',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '注册时间',
          dataIndex: 'create_time'
        },
        {
          title: '最后登录时间',
          dataIndex: 'last_login_time'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getUsersList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.response
        })
      }
    }
  },
  methods: {
    handleDisable (data, e) {
      const self = this
      console.log(data, e)
      postUsersDisable({
        user_id: data.id,
        is_disable: e
      }).then((res) => {
        if (res.code === 200) {
          if (e) {
             self.$message.success('已封禁')
          } else {
            self.$message.success('已启用')
          }
          self.$refs.table.refresh(true)
        } else {
          self.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
<style scoped lang='less'>
/deep/.ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
  padding: 8px;
}
.table-page-search-wrapper .table-page-search-submitButtons {
  margin-bottom: 0;
}
.table-img {
  width: 30px;
  border-radius: 25px;
  margin-right: 5px;
  height: 30px;
}
</style>
