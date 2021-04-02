<template>
  <a-modal title="商品发货" :width="800" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <div>选择商品：待发货 {{ orderDetali.order_goods.length }}</div>
      <a-table :pagination="false" :columns="columns" :data-source="orderDetali.order_goods" rowKey="order_goods_id">
      </a-table>
      <div class="m-t">
        收货地址：{{ orderDetali.receiver.province_name }}{{ orderDetali.receiver.city_name }}{{ orderDetali.receiver.county_name }}{{ orderDetali.receiver.address }}
      </div>
      <a-form :form="form">
        <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 16 }" label="快递单号：">
          <a-row>
            <a-col :span="12">
              <a-select
                placeholder="请选择一个物流公司"
                v-decorator="[
                  'logistics_company_id',
                  {
                    rules: [{required: true, message: '请选择一个物流公司' }]
                  }
                ]"
              >
                <a-select-option :value="0">显示</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="12">
              <span>
                <a @click="allLogisticslist()" class="m-l-xs">刷新</a>
                <router-link
                  :to="{name:'delivery-set'}"
                  target="_blank"
                  class="m-l-xs b-l b-dark"
                  style="padding-left: 10px;"
                >新增物流公司</router-link>
              </span>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="快递单号：">
          <a-input
            placeholder="请选择输入快递单号"
            v-decorator="[
              'logistics_number',
              {
                rules: [{required: true, message: '请输入快递单号' }]
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleSubmit">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
import { apiOrderCancel } from '@/api/order'
export default {
  props: {
    orderDetali: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      form: this.$form.createForm(this),
      columns: [
        {
          title: '商品名称',
          dataIndex: 'name',
          width: '200px'
        },
        {
          title: '规格名称',
          dataIndex: 'sku_name',
          customRender: text => {
            if (text) {
              return <font>{{ text }}</font>
            }
            return <font>-</font>
          }
        },
        // {
        //   title: '订单编号',
        //   dataIndex: 'order_no'
        // },
        {
          title: '数量',
          dataIndex: 'number'
        },
        {
          title: '单价',
          dataIndex: 'price'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    show () {
      const self = this
      self.visible = true
    },
    handleSubmit () {
      const self = this
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values, order_no: self.orderDetali.order_no }
          apiOrderCancel(params).then(res => {
            if (res.code === 200) {
              self.$notification.success({
                message: '提示',
                description: '发货成功',
                duration: 4
              })
              self.visible = false
              self.$emit('ok')
            } else {
               self.$notification.error({
                message: '错误',
                description: res.msg,
                duration: 4
              })
            }
          })
        } else {
          self.$message.error('请完善必填项')
        }
      })
    },
    handleCancel () {
      this.visible = false
    },
    allLogisticslist () {}
  }
}
</script>
