<!--  -->
<template>
  <div>
    <a-modal title="用户详情" :visible="visible" @cancel="visible=false" @ok="visible=false">
      <a-descriptions layout="horizontal">
        <a-descriptions-item label="头像">
          <a-avatar size="large" :icon="userInfo.avator" />
        </a-descriptions-item>
        <a-descriptions-item label="昵称">
          {{ userInfo.nick_name }}
        </a-descriptions-item>
        <a-descriptions-item label="姓名">
          {{ userInfo.real_name }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ userInfo.create_time }}
        </a-descriptions-item>
        <a-descriptions-item label="最后登录时间">
          {{ userInfo.last_login_time }}
        </a-descriptions-item>
        <a-descriptions-item label="最后登录IP">
          {{ userInfo.last_login_ip }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>
import { getUsersInfo } from '@/api/users'
export default {
  data () {
    return {
      visible: false,
      userInfo: {}
    }
  },
  methods: {
    open (id) {
      const self = this
      self.visible = true
      getUsersInfo({ user_id: id }).then(res => {
        if (res.code === 200) {
          self.userInfo = res.response
        } else {
          self.$message.error(res.msg)
        }
      })
      .catch(() => {
        self.$message.error('请求失败，请稍后重试')
      })
    }
  }
}
</script>
