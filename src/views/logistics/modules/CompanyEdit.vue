<!--  -->
<template>
  <a-modal
    title="新增 / 编辑物流公司"
    :visible="visible"
    :bodyStyle="bodyStyle"
    :confirmLoading="confirmLoading"
    @cancel="addLogisticsCancel('form')"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="addLogisticsParams"
        :rules="addLogisticsRuleInline"
        :colon="false"
        v-bind="layout"
      >
        <a-form-model-item label="公司名称" prop="logistics_company">
          <a-input
            v-model="addLogisticsParams.logistics_company"
            style="width: 280px"
            placeholder="请输入快递公司名称"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="公司编号" prop="logistics_number">
          <a-input
            v-model="addLogisticsParams.logistics_number"
            style="width: 280px"
            placeholder="请输入快递公司编号"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="是否启用" prop="is_open">
          <a-radio-group v-model="addLogisticsParams.is_open">
            <a-radio :value="0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-card
          v-for="(item, index) in addLogisticsParams.logistics_branch"
          :key="index"
          :bordered="false"
          :dis-hover="true"
        >
          <p slot="title">物流平台信息-{{ index + 1 }}</p>
          <div slot="extra">
            <a-button
              v-show="addLogisticsParams.logistics_branch.length > 1"
              @click="logisticsPlatformRemove(item, index)"
            ><a-icon type="close" />移除</a-button>
          </div>
          <a-form-model-item
            label="平台类型"
            :prop="'logistics_branch.' + index + '.platform_type'"
            :rules="{ required: true, type: 'number', message: '请选择平台类型', trigger: 'change' }"
          >
            <a-radio-group v-model="item.platform_type" @on-change="platformTypeChange">
              <a-radio :value="0">快递鸟</a-radio>
              <a-radio :value="1">阿里</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            label="快递编码"
            :prop="'logistics_branch.' + index + '.logistics_alias'"
            :rules="{ required: true, message: '请输入平台快递编码', trigger: 'blur' }"
          >
            <a-input v-model="item.logistics_alias" style="width: 280px" placeholder="请输入平台快递编码"></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="是否默认"
            :prop="'logistics_branch.' + index + '.is_open'"
            :rules="{ required: true, type: 'number', message: '请选择平台类型是否默认', trigger: 'change' }"
          >
            <a-radio-group v-model="item.is_open" @on-change="platformIsOpenChange">
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1" :disabled="isDisable(item)">是</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-card>
        <a-form-model-item>
          <a-row>
            <a-col span="12">
              <a-button type="dashed" long @click="logisticsPlatformAdd" icon="md-add">添加物流平台信息</a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="addLogisticsCancel('form')">取消</a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="confirmLoading"
        @click="addLogisticsSubmit('form')"
      >保存</a-button
      >
    </template>
  </a-modal>
</template>
<script>
import { apiLogistics, getLogisticsDetail } from '@/api/logistics'
export default {
  data () {
    return {
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      },
      bodyStyle: {
        'max-height': '620px',
        'overflow-y': 'auto'
      },
      visible: false,
      confirmLoading: false,
      addLogisticsParams: {
        id: 0,
        logistics_company: '', // 快递公司名称
        logistics_number: '', // 快递公司编号
        is_open: 0, // 是否启用 0否 1是
        logistics_branch: [
          {
            platform_type: 0, // 平台类型
            logistics_alias: '', // 平台快递编码
            is_open: 0 // 是否默认 0否 1是
          }
        ] // 物流所用平台信息
      },
      addLogisticsRuleInline: {
        logistics_company: [{ required: true, message: '请输入快递公司名称', trigger: 'blur' }],
        logistics_number: [{ required: true, message: '请输入快递公司编号', trigger: 'blur' }],
        is_open: [{ required: true, type: 'number', message: '请选择是否启用', trigger: 'change' }]
      }, // 表单验证规则
      platformDisable: false, // 是否默认
      platformTypeSelected: 0 // 平台类型
    }
  },
  computed: {
    isDisableType () {
      return function (item) {
        // 选中快递鸟
        if (this.addLogisticsParams.logistics_branch.length > 1) {
          if (this.platformTypeSelected === 0) {
            return 0
          } else if (this.platformTypeSelected === 1) {
            return 1
          }
        } else {
        }
      }
    },
    isDisable () {
      return function (item) {
        if (this.platformDisable === true) {
          if (item.is_open === 1) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      }
    }
  },
  methods: {
    add () {
      const self = this
      self.visible = true
    },
    edit (data) {
      const self = this
      self.visible = true
      getLogisticsDetail({ id: data.id }).then((res) => {
        if (res.code === 200) {
          this.visible = true
          console.log(res.response)
          res.response.logistics_company = res.response.name
          res.response.logistics_number = res.response.number
          res.response.is_open = res.response.is_open === false ? 0 : 1
          res.response.logistics_branch.map((item) => {
            if (item.is_open === true) {
              item.is_open = 1
              this.platformDisable = true
            } else {
              item.is_open = 0
            }
          })
          this.addLogisticsParams = res.response
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 删除平台信息
    logisticsPlatformRemove (item, index) {
      this.addLogisticsParams.logistics_branch.splice(index, 1)
      if (item.is_open === 1) {
        this.platformDisable = false
      }
    },
    // 添加平台信息
    logisticsPlatformAdd () {
      const platformType = this.platformTypeSelected === 0 ? 1 : 0
      this.addLogisticsParams.logistics_branch.push({
        platform_type: platformType, // 平台类型
        logistics_alias: '', // 平台快递编码
        is_open: 0 // 是否默认
      })
    },
    // 选中的平台类型
    platformTypeChange (val) {
      this.platformTypeSelected = val
    },
    // 禁用其他物流平台 是否默认
    platformIsOpenChange (val) {
      if (val === 1) {
        this.platformDisable = true
      } else {
        this.platformDisable = false
      }
    },
    // 添加快递公司
    addLogisticsSubmit (name) {
      this.confirmLoading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          let cmd = 'edit'
          if (this.addLogisticsParams.id === 0) {
            cmd = 'add'
          }
          apiLogistics(cmd, this.addLogisticsParams).then((res) => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.visible = false
              this.confirmLoading = false
              this.addLogisticsParams.logistics_branch = [
                {
                  platform_type: 0, // 平台类型
                  logistics_alias: '', // 平台快递编码
                  is_open: 0 // 是否默认 0否 1是
                }
              ]
              this.$emit('ok')
              this.platformDisable = false
            } else {
              this.$message.error(res.msg)
              this.confirmLoading = false
            }
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    // 取消添加公司
    addLogisticsCancel (name) {
      this.$refs[name].resetFields()
      this.visible = false
      this.platformDisable = false // 是否默认
      this.addLogisticsParams.logistics_branch.length = 1
    }
  }
}
</script>
<style scoped lang='scss'>
</style>
