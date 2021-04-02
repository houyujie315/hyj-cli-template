<template>
  <div>
    <a-form :form="form" layout="inline">
      <a-card :bordered="false">
        <a-space>
          <a-form-item label="订单编号">
            <a-input style="width: 200px" v-decorator="['order_no']" placeholder="请输入订单编号" />
          </a-form-item>
          <a-form-item label="下单时间">
            <a-range-picker
              v-decorator="['timelist']"
              format="YYYY-MM-DD"
            />
          </a-form-item>
          <a-form-item label="订单状态">
            <a-select v-decorator="['status', { initialValue: '0' }]" style="width: 150px" >
              <a-select-option v-for="item in orderStatusArr" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button @click="filter" type="primary">筛选</a-button>
          </a-form-item>
        </a-space>
      </a-card>
      <a-card :bordered="false" style="margin-top: 15px">
        <a-form-item>
          <a-tabs v-decorator="['status']" type="card" @change="handleTabsChange" size="small" :tabBarGutter="5">
            <a-tab-pane v-for="item in orderStatusArr" :key="item.value" :tab="item.label"></a-tab-pane>
          </a-tabs>
        </a-form-item>
        <s-table-new ref="table" :columns="columns" size="default" :data="loadData" rowKey="order_id">
          <span slot="goods" slot-scope="text, record">
            <div v-for="(item, index) in record.goods" :key="index">
              <div style="display:flex;width: 100%;">
                <div style="width: 60px;height: 60px;">
                  <img :src="item.cover| setImgUrl('goods',1)" alt style="width: 60px;height:60px;object-fit: cover" />
                </div>
                <div style="width: 80%;margin-left: 10px">
                  <div class="twoline">{{ item.name }}</div>
                  <div class="text-indigo450 m-t-xs oneline">{{ item.sku_name }}</div>
                </div>
              </div>
            </div>
          </span>
          <span slot="price" slot-scope="text, record">
            <div v-for="(item, index) in record.goods" :key="index">
              <div>{{ item.price.toFixed(2)+'元' }}</div>
              <div>{{ item.number }}(件)</div>
            </div>
          </span>
          <span slot="buyer" slot-scope="text, record">
            <div v-if="record.buyer_name !== ''">{{ record.buyer_name }}</div>
            <div v-else>-</div>
            <div>{{ record.buyer_mobile }}</div>
          </span>
          <span slot="status" slot-scope="text, record">
            <div v-if="record.admin_order_status==1">
              <div>等待买家付款</div>
              <a-button class="m-t-xs" size="small" @click="canCel(item)">取消订单</a-button>
            </div>
            <div v-if="record.admin_order_status==2" >
              <div>等待商家发货</div>
              <a-button class="m-t-xs" size="small" @click="orderShipModal(item)">发货</a-button>
            </div>
            <div v-if="record.admin_order_status==3" >
              <div>商家已发货</div>
            </div>
            <div v-if="record.admin_order_status==4" >
              <div>交易完成</div>
            </div>
            <div v-if="record.admin_order_status==5" >
              <div>售后/维权</div>
            </div>
            <div v-if="record.admin_order_status==6" >
              <div>待付款关闭</div>
            </div>
            <div v-if="record.admin_order_status==7" >
              <div>维权后关闭</div>
            </div>
          </span>
          <span slot="action" slot-scope="text, record">
            <router-link target="_blank" :to="{path:'/order/detail',query:{order_id:record.order_id}}" >
              <a size="small">查看详情</a>
            </router-link>
          </span>
        </s-table-new>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import moment from 'moment'
import { STableNew } from '@/components'
import { getOrderList, apiOrderCancel } from '@/api/order'
export default {
  components: {
    STableNew
  },
  data () {
    return {
      initStatusValue: '0',
      queryParam: {
        // state: 0, // 订单状态
        // order_no: '', // 订单编号
        // create_start_time: '', // 下单开始时间
        // create_end_time: '' // 下单结束时间
      }, // 查询参数
      orderStatusArr: [
        { value: '0', label: '全部' },
        { value: '1', label: '待付款' },
        { value: '2', label: '待发货' },
        { value: '3', label: '已发货' },
        { value: '4', label: '已完成' },
        { value: '5', label: '售后' },
        { value: '6', label: '待付款关闭' },
        { value: '7', label: '维权后关闭' }
      ],
      columns: [
        {
          title: '商品',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '订单编号',
          dataIndex: 'order_no',
          key: 'order_no'
        },
        {
          title: '单价/数量',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '买家',
          scopedSlots: { customRender: 'buyer' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this),
      loadData: parameter => {
        return getOrderList(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res)
          return res.response
        })
      }
    }
  },
  methods: {
    moment,
    filter () {
      const self = this
      const { form: { getFieldsValue } } = self
      const params = getFieldsValue()
      self.queryParam = Object.assign(self.queryParam, params)
      self.$refs.table.refresh()
    },
    handleTabsChange (key) {
      self.queryParam = Object.assign(self.queryParam)
      self.$refs.table.refresh()
      alert(1)
    },
    handleStatusChange () {},
    // 发货
    orderShipModal (record) {},
    // 取消订单
    canCel (record) {
      const self = this
      self.$confirm({
        title: '提示?',
        content: (<p>确定要取消该订单？</p>),
        onOk () {
          apiOrderCancel({ order_no: record.order_no }).then(res => {
            if (res.code === 200) {
              self.$refs.table.refresh()
              self.$notification.success({
                message: '提示',
                description: '成功取消',
                duration: 4
              })
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
    }
  }
}
</script>
<style lang="less" scoped>
.twoline {
  display: -webkit-box !important;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.text-indigo450 {
  color: #2d8cf0;
}

.m-t-xs {
  margin-top: 5px;
}

.oneline {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
