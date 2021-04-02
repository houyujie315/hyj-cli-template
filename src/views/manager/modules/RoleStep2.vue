<template>
  <div>
    <a-form :form="form" style="max-width: 600px; margin: 40px auto 0;">
      <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol" class="rolename">{{ roleInfo.rolename }}</a-form-item>
      <a-form-item label="角色权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-transfer
          :dataSource="permitData"
          :titles="['待赋予权限', '已有权限']"
          :targetKeys="targetKeys"
          :selectedKeys="selectedKeys"
          @change="handleChange"
          @selectChange="handleSelectChange"
          :render="item=>item.title"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button :loading="loading" type="primary" @click="commitData">提交</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
// import pick from 'lodash.pick'
import { apiRoles } from '@/api/manager'
import { Result } from '@/components'

export default {
  name: 'RoleStep2',
  props: {
    roleInfo: {
      type: Object,
      default: null
    },
    permitlist: {
      type: Array,
      default: null
    },
    editId: {
      type: Number,
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
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      permitData: [],
      targetKeys: [],
      selectedKeys: []
    }
  },
  created () {
    this.permitData = this.permitlist.map(item => {
      const data = {
        key: item.id + '',
        title: item.name,
        disabled: false,
        description: item.name
      }
      return data
    })
  },
  methods: {
    initData (data) {
      const self = this
      self.targetKeys = data
    },
    prevStep () {
      this.$emit('prevStep')
    },
    commitData () {
      const self = this
      self.saveData(self.targetKeys)
    },
    saveData (data) {
      const self = this
      let postData = {
        code: self.roleInfo.code,
        name: self.roleInfo.name,
        status: self.roleInfo.status,
        describe: self.roleInfo.describe,
        permits_id: data
      }
      let cmd = 'add'
      if (self.editType === 1) {
        cmd = 'edit'
        postData = { ...postData, id: self.editId }
      }
      self.loading = true
      apiRoles(cmd, postData)
        .then(response => {
          if (response.code === 200) {
            self.$emit('nextStep', data)
          } else {
            this.$notification.error({
              message: '保存失败',
              description: response.info,
              duration: 4
            })
          }
        })
        .catch(error => {
          console.log(cmd, error)
        }).finally(() => {
          self.loading = false
        })
    },
    handleChange (nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...(targetSelectedKeys)]
    }
  }
}
</script>
<style lang="less" scoped>
.rolename {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 14px;
  color: #0d85f5;
}
</style>
