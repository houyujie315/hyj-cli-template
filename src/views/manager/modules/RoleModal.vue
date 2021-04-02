<template>
  <a-modal
    title="操作"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="角色信息" />
        <a-step title="角色权限" />
        <a-step title="完成" />
      </a-steps>
      <div class="content">
        <step1 ref="step1" v-if="currentTab === 0" :roleInfo="mdlData" @nextStep="nextStep" />
        <step2
          ref="step2"
          v-if="currentTab === 1"
          :roleInfo="mdlData"
          :permitlist="permissionList"
          :editType="editType"
          :editId="editId"
          @nextStep="nextStep"
          @prevStep="prevStep"
        />
        <step3
          v-if="currentTab === 2"
          :roleInfo="mdlData"
          @prevStep="prevStep"
          @finish="finish"
          @closeDlg="closeDlg"
          :editType="editType" />
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { getPermitsChoiceList } from '@/api/manager'
import Step1 from './RoleStep1'
import Step2 from './RoleStep2'
import Step3 from './RoleStep3'

export default {
  name: 'RoleModal',
  components: {
    Step1,
    Step2,
    Step3
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      currentTab: 0,
      permissionList: [],
      mdlData: {},
      editType: 0,
      editId: null
    }
  },
  created () {
    this.loadPermissions()
  },
  methods: {
    nextStep (data) {
      console.log(data, 'data')
      const self = this
      switch (this.currentTab) {
        case 0:
          self.mdlData.code = data.code
          self.mdlData.name = data.name
          self.mdlData.describe = data.describe
          self.mdlData.status = data.status
          self.$nextTick(function () {
            this.$refs.step2.initData((self.mdlData.permits_id).map(String))
          })
          break
        case 1:
          self.mdlData.permits_id = (data.permits_id)
          break
      }

      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep (data) {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.add()
    },
    closeDlg () {
      this.currentTab = 0
      this.visible = false
      this.$emit('ok')
    },
    add (data) {
      const self = this
      self.editType = data.editType
      self.editType = 0
      self.mdlData = {
        code: '',
        name: '',
        status: 0,
        describe: '',
        permits_id: []
      }
      self.currentTab = 0
      self.visible = true
      self.$nextTick(function () {
        this.$refs.step1.clearMsg()
      })
    },
    edit (data) {
      const self = this
      self.editType = data.editType
      self.editId = data.id
      self.mdlData = pick(data, ['code', 'name', 'status', 'describe'])
      self.mdlData.permits_id = data.permit_info.map(item => item.id)
      this.currentTab = 0
      self.visible = true
      self.$nextTick(function () {
        this.$refs.step1.clearMsg()
      })
    },
    handleCancel () {
      this.visible = false
      this.$emit('ok')
    },
    loadPermissions () {
      getPermitsChoiceList()
        .then(response => {
          if (response.code === 200) {
            const result = response.response
            this.permissionList = result
          } else {
            console.log('permit/allist', response)
          }
        })
        .catch(error => {
          console.log('permit/allist', error)
        })
    }
  }
}
</script>

<style scoped>
</style>
