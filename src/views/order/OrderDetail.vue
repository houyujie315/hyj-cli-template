<!--  -->
<template>
  <page-header-wrapper>
    <div class="page-order-detail">
      <a-card :bordered="false">
        <a-steps :current="stepStatus" size="small">
          <a-step title="买家下单" :description="detailData.create_time" />
          <a-step title="买家付款" :description="detailData.pay_time" />
          <a-step title="商家发货" :description="detailData.shipped_time" />
          <a-step title="交易完成" :description="detailData.complete_time" />
        </a-steps>
      </a-card>
      <a-card :bordered="false" style="margin-top: 15px">
        <div class="b-a" style="display: flex">
          <div class="b-r wrapper" style="width: 320px; line-height: 30px">
            <div class="text-grey900 font-bold text-base">订单信息</div>
            <table class="info">
              <tbody>
                <tr class="text-grey500">
                  <th>订单编号：</th>
                  <td>{{ detailData.order_no }}</td>
                </tr>
                <tr class="text-grey500">
                  <th>订单类型：</th>
                  <td>普通订单</td>
                </tr>
                <tr class="text-grey500">
                  <th>下单时间：</th>
                  <td>{{ detailData.create_time }}</td>
                </tr>
                <tr class="text-grey500">
                  <th>付款时间：</th>
                  <td>{{ detailData.pay_time }}</td>
                </tr>
                <tr class="text-grey500">
                  <th style="padding-left: 28px">买家：</th>
                  <td>{{ detailData.receiver.name }}</td>
                </tr>
              </tbody>
            </table>
            <table class="info m-t" style="border-top: 1px dashed #dee5e7" v-if="detailData.order_type != 5">
              <tbody>
                <tr class="text-grey500">
                  <th>配送方式：</th>
                  <td>快递发货</td>
                </tr>
                <tr class="text-grey500">
                  <th style="word-break: break-all">收货信息：</th>
                  <td style="word-wrap:break-word;word-break:break-all;">
                    {{ detailData.receiver.province_name }}{{ detailData.receiver.city_name }}
                    {{ detailData.receiver.county_name }}{{ detailData.receiver.address }},
                    {{ detailData.receiver.name }}:{{ detailData.receiver.phone }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="wrapper orderstate">
            <!-- 订单状态：商品已拍下，等待买家付款 -->
            <template v-if="detailData.admin_order_status == 1">
              <div style="margin: 10px">
                <a-icon
                  type="exclamation-circle"
                  class="text-black text-blueA400"
                  style="font-size: 24px; padding-top: 5px; float: left"
                ></a-icon>
                <div class="font-bold m-l-lg">订单状态：商品已拍下，等待买家付款</div>
                <div class="text-xs text-grey600 m-l-lg">如买家未在规定时间内付款，订单将按照设置逾期自动关闭</div>
                <div class="flex m-t">
                  <div class="m-l">
                    <a-button type="info" size="small" @click="closeOrder()">取消订单</a-button>
                  </div>
                </div>
              </div>
            </template>

            <!-- 订单状态：买家已付款,等待商家发货 -->
            <template v-else-if="detailData.admin_order_status == 2">
              <div style="margin: 10px">
                <a-icon
                  type="exclamation-circle"
                  class="text-black text-blueA400"
                  style="font-size: 24px; padding-top: 5px; float: left"
                ></a-icon>
                <div class="font-bold m-l-lg">订单状态：买家已付款,等待商家发货</div>
                <div class="text-xs text-grey600 m-l-lg">买家已付款，请尽快发货，否则买家有权申请退款</div>

                <div class="m-l-lg m-t flex">
                  <a-button type="info" size="small" style="margin-top: 4px" @click="$refs.deliverModel.show(detailData.order_id)">发货</a-button>
                </div>
              </div>
            </template>

            <!-- 订单状态：商家已发货，等待交易成功 -->
            <template v-else-if="detailData.admin_order_status == 3">
              <div style="margin: 10px">
                <a-icon
                  type="exclamation-circle"
                  class="text-black text-blueA400"
                  style="font-size: 24px; padding-top: 5px; float: left"
                  v-if="detailData.shipping_status != 0"
                ></a-icon>
                <div class="font-bold m-l-lg">订单状态：商家已发货，等待交易成功</div>
                <div class="text-xs text-grey600 m-l-lg">买家没有申请退款，交易将在买家确认收货后自动完成；</div>
                <h4 style="margin: 20px 0 10px 30px">已发货包裹</h4>
                <div class="express m-t-xs m-l-lg padder">
                  <div class="ex-title clearfix">
                    <div class="pull-left text-xs">
                      <p>
                        物流公司:
                        <span class="text-grey500" style="margin-left: 10px">{{ detailData.logistics_name }}</span>
                      </p>
                      <p>
                        物流单号:
                        <span class="text-grey500" style="margin-left: 10px">{{ detailData.logistics_no }}</span>
                        <a-button
                          class="pull-rigth m-l"
                          type="info"
                          size="small"
                          @click="logisticTrackShow = true"
                        >查询</a-button
                        >
                      </p>
                    </div>
                  </div>

                  <div class="imglist" style="margin-top: 0">
                    <div class="img" v-for="(pic, key) in detailData.order_goods" :key="key">
                      <img class="cover" :src="pic.cover | setImgUrl('goods', 1)" alt />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 订单状态：交易完成 -->
            <template v-else-if="detailData.admin_order_status == 4">
              <div style="margin: 10px">
                <a-icon
                  type="ios-checkmark-circle-outline"
                  class="text-black text-blueA400"
                  style="font-size: 30px; padding-top: 5px; float: left"
                ></a-icon>
                <div class="font-bold m-l-lg">订单状态：交易完成</div>
                <div class="text-xs text-grey600 m-l-lg">已将货款结算至你的店铺余额账户，请注意查收</div>
                <div class="express m-t-xs m-l-lg">
                  <div class="ex-title clearfix">
                    <div class="pull-left text-xs">
                      <p>
                        物流公司:
                        <span class="text-grey500">{{ detailData.logistics_name }}</span>
                      </p>
                      <p>
                        物流单号:
                        <span class="text-grey500">{{ detailData.logistics_no }}</span>
                        <a-button
                          class="pull-right m-l"
                          type="info"
                          size="small"
                          @click="logisticTrackShow = true"
                        >查询</a-button
                        >
                      </p>
                    </div>
                  </div>

                  <div class="imglist" style="margin-top: 0">
                    <div class="img" v-for="(pic, key) in detailData.order_goods" :key="key">
                      <img class="cover" :src="pic.cover | setImgUrl('goods', 1)" alt />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 订单状态：售后维权 -->
            <template v-else-if="detailData.admin_order_status == 5">
              <div style="margin: 10px">
                <a-icon
                  type="exclamation-circle"
                  class="text-black text-blueA400"
                  style="font-size: 24px; padding-top: 5px; float: left"
                ></a-icon>
                <div class="font-bold m-l-lg">订单状态：售后维权</div>
                <div class="text-xs text-grey600 m-l-lg">
                  买家已经对 此订单申请了退款，请了解进度；
                  <router-link
                    :to="{ name: 'records-detail', query: { id: detailData.refundId } }"
                  >查看退款维权</router-link
                  >
                </div>
              </div>
            </template>

            <!-- 订单状态：交易关闭 -->
            <template v-else-if="detailData.admin_order_status == 6 || detailData.admin_order_status == 7">
              <div style="margin: 10px">
                <a-icon
                  type="exclamation-circle"
                  class="text-black text-blueA400"
                  style="font-size: 24px; padding-top: 5px; float: left"
                ></a-icon>
                <div class="font-bold m-l-lg">订单状态：交易关闭</div>
                <div class="text-xs text-grey600 m-l-lg">交易关闭原因阐述</div>
              </div>
            </template>

            <!-- 订单状态：商家备注 -->
            <template v-if="detailData.seller_memo">
              <div
                class="text-xs text-grey600 m-t"
                style="border-top: 1px dashed #dee5e7; padding-left: 30px; padding-top: 5px"
              >
                商家备注:{{ detailData.seller_memo }}
              </div>
            </template>
          </div>
        </div>
        <div class="b-a m-t-md">
          <a-row class="font-bold text-xs bg-grey50 padder-v wrapper-sm">
            <a-col span="21">
              <div style="display:flex;justify-content: space-between; align-items:center">
                <a-col span="7" class>商品名称</a-col>
                <a-col span="3" class="text-center">单价</a-col>
                <a-col span="3" class="text-center">数量</a-col>
                <a-col span="4" class="text-center">小计</a-col>
              </div>
            </a-col>
            <a-col span="3" class="text-center">状态</a-col>
          </a-row>
          <div v-for="(item,index) in detailData.order_goods" :key="index">
            <a-row class="text-xs" style="display:flex;align-items:center;padding:0 10px">
              <a-col span="21">
                <div
                  style="height: 80px;display:flex;justify-content: space-between; align-items:center"
                >
                  <a-col span="7">
                    <div style="display:flex;width:100%">
                      <div class style="min-width: 60px;;width: 60px;height: 60px">
                        <img
                          :src="item.cover | setImgUrl('goods',1)"
                          alt
                          style="width: 100%;height: 100%;object-fit: cover"
                        />
                      </div>
                      <div class="m-l-sm" style="width:80%">
                        <div class="twoline">{{ item.name }}</div>
                        <div class="text-indigo450 m-t-xs oneline">{{ item.sku_name }}</div>
                      </div>
                    </div>
                  </a-col>
                  <a-col
                    span="3"
                    class="text-center"
                  >{{ parseFloat(item.price).toFixed(2) }}</a-col>
                  <a-col span="3" class="text-center">{{ item.number }}</a-col>
                  <a-col span="4" class="text-center">
                    <div>{{ parseFloat(item.price*item.number).toFixed(2) }}元</div>
                  </a-col>
                </div>
              </a-col>

              <a-col span="3">
                <div
                  style="height:80px;display:flex;flex-direction:column;justify-content: center; align-items:center"
                >
                  <div v-if="detailData.admin_order_status==1">待付款</div>
                  <div v-if="detailData.admin_order_status==2">待发货</div>
                  <div v-if="detailData.admin_order_status==3">已发货</div>
                  <div v-if="detailData.admin_order_status==4">已完成</div>
                  <div v-if="detailData.admin_order_status==5">售后</div>
                  <div v-if="detailData.admin_order_status==6">待付款关闭</div>
                  <div v-if="detailData.admin_order_status==7">维权后关闭</div>
                </div>
              </a-col>
            </a-row>
          </div>

          <!-- 右下角 -->
          <div class="order-summary">
            <div class="padder-l">
              <div v-show="detailData.admin_order_status!=6&&detailData.admin_order_status!=7">
                <div class="text-red400 text-xs">提醒</div>
                <div
                  class="text-xs text-grey400"
                  v-if="detailData.admin_order_status==1"
                >
                  <p>请务必等待订单状态变更为"买家已付款,等待商家发货"再进行发货</p>
                </div>
                <div
                  class="text-xs m-l-md m-l-xs text-grey400"
                  v-if="detailData.admin_order_status==2"
                >
                  <p>如果无法发货,请及时与买家联系并说明情况后进行退款;</p>
                  <p>买家申请退款后，须征得买家同意后再发货，否则买家有权拒收货物；</p>
                  <p>买家付款后超过7天仍未发货，将有权申请客服介入发起退款维权；</p>
                </div>
                <div
                  class="text-xs m-l-md m-l-xs text-grey400"
                  v-if="detailData.admin_order_status==3"
                >
                  <p>交易成功后，将把货款结算至你的店铺账户余额，你可申请提现；</p>
                  <p>请及时关注你发出的包裹状态，确保能配送至买家手中；</p>
                  <p>如果买家表示未收到货或者货物有问题，请及时联系买家积极处理，友好协商；</p>
                </div>
                <div
                  class="text-xs m-l-md m-l-xs text-grey400"
                  v-if="detailData.admin_order_status==4"
                >
                  <p>交易已成功，如果买家提出售后要求，请积极与买家协商，做好售后服务。</p>
                </div>
              </div>
            </div>
            <div class="padder-r">
              <div>
                <span class="order-summary-title">商品总价</span>
                <span>￥{{ parseFloat(detailData.goods_total_money).toFixed(2) }}</span>
              </div>
              <div>
                <span class="order-summary-title">运费</span>
                <span>￥{{ parseFloat(detailData.shipping_money).toFixed(2) }}</span>
              </div>
              <div style="position:relative" v-if="detailData.preferential_money>0">
                <span class="order-summary-title">优惠</span>
                <span>-￥{{ parseFloat(detailData.preferential_money).toFixed(2) }}</span>
              </div>
              <div style="position:relative">
                <span class="order-summary-title">订单金额</span>
                <span class="c-red">￥ {{ parseFloat(detailData.pay_money).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <deliver-model ref="deliverModel" :orderDetali="detailData" @ok="handleOk"></deliver-model>
    <dogistic-model ref="dogisticModel" :orderDetali="detailData"></dogistic-model>
  </page-header-wrapper>
</template>
<script>
import { getOrderDetail, apiOrderCancel } from '@/api/order'
import DeliverModel from './modules/DeliverModel'
import DogisticModel from './modules/DogisticModel'
export default {
  name: 'OrderDetail',
  components: {
    DeliverModel,
    DogisticModel
  },
  data () {
    return {
      stepStatus: 0,
      detailData: {
        receiver: {},
        order_goods: []
      } // 详情参数
    }
  },
  created () {
    this.orderDetail()
  },
  methods: {
    // 获取订单详情
    orderDetail () {
      const self = this
      getOrderDetail({ order_id: self.$route.query.order_id })
        .then((res) => {
          if (res.code === 200) {
            self.detailData = res.response
            if (res.response.shipping_status !== 0) {
              // 获取物流轨迹
              self.logisticTrack(self.detailData.logistics_no)
            }
            if (self.detailData.admin_order_status === 1) {
              // 待付款
              self.stepStatus = 0
            } else if (self.detailData.admin_order_status === 2) {
              // 代发货
              self.stepStatus = 1
            } else if (self.detailData.admin_order_status === 3) {
              // 已发货
              self.stepStatus = 2
            } else if (self.detailData.admin_order_status === 4) {
              // 已完成
              self.stepStatus = 3
            }
          } else {
            self.$notification.error({
              message: '错误',
              description: res.msg,
              duration: 4
            })
          }
        })
        .catch(() => {
          self.$notification.error({
            message: '错误',
            description: '',
            duration: 4
          })
        })
    },
    // 获取物流轨迹
    logisticTrack (logistics) {
    },
    // 取消订单
    closeOrder () {
      const self = this
      self.$confirm({
        title: '提示?',
        content: (<p>确定要取消该订单？</p>),
        onOk () {
          apiOrderCancel({ order_no: this.detailData.order_no }).then(res => {
            if (res.code === 200) {
              self.orderDetail()
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
    },
    // 发货
    orderShipModal () {
      this.$refs.deliverModel.show()
    },
    handleOk () {
      this.orderDetail()
    }
  }
}
</script>
<style lang="less" scoped>
.page-order-detail .info th {
  width: 80px;
  vertical-align: top;
}

.order-summary {
  border-top: 1px solid #e5e5e5;
  text-align: right;
  padding: 12px 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.order-summary .c-red {
  color: #f44;
  font-size: 16px;
}

.order-summary .caution {
  color: #07d;
}
.order-summary > div {
  margin-right: 50px;
}

.order-summary-title + span {
  display: inline-block;
  width: 130px;
  text-align: right;
}
.order-summary .padder-l {
  text-align: left;
}
.order-summary .padder-r {
  text-align: right;
}
.page-order-detail .imglist {
  display: flex;
  flex-wrap: wrap;
}

.page-order-detail .imglist .img {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  /* box-shadow: 0 1px 1px rgba(0,0,0,.2); */
  margin-right: 4px;
}

.page-order-detail .imglist .img .cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-order-detail .imglist .img:hover .demo-upload-list-cover {
  display: block;
}

.page-order-detail .imglist .img .demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  font-size: 20px;
}

.page-order-detail .imglist .img .demo-upload-list-cover .eye {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
