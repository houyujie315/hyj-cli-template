<template>
  <div>
    <a-form style="margin: 40px auto 0;">
      <result :title="title" :is-success="true" style="max-width: 560px;">
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">角色代码：</a-col>
            <a-col :sm="16" :xs="24">{{ roleInfo.code }}</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">角色名称：</a-col>
            <a-col :sm="16" :xs="24">{{ roleInfo.name }}</a-col>
          </a-row>
        </div>
        <div slot="action">
          <a-button v-if="roleInfo.recid == 0" type="primary" @click="finish">继续添加</a-button>
          <a-button style="margin-left: 8px" @click="closeDlg">查看列表</a-button>
        </div>
      </result>
    </a-form>
  </div>
</template>

<script>
import { Result } from '@/components'

export default {
  name: 'Step3',
  props: {
    roleInfo: {
      type: Object,
      default: null
    },
    editType: {
      type: Number,
      default: 0
    }
  },
  components: {
    Result
  },
  data () {
    let titleStr = '添加成功'
    if (this.editType === 1) {
      titleStr = '修改成功'
    }
    return {
      title: titleStr
    }
  },
  methods: {
    finish () {
      this.$emit('finish')
    },
    closeDlg () {
      this.$emit('closeDlg')
    }
  }
}
</script>
<style lang="less" scoped>
.information {
  line-height: 22px;

  .ant-row:not(:last-child) {
    margin-bottom: 24px;
  }
}
.money {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 14px;
}
</style>
