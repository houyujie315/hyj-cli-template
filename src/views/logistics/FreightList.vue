<template>
  <div class="page-setup-order-index">
    <a-card dis-hover style="overflow: hidden">
      <router-link :to="{ path: '/logistics/freight/add', query: { id: 0 } }">
        <a-button type="primary">新建运费模板</a-button>
      </router-link>
      <a-collapse class="b-n bg-w" simple>
        <p v-show="data.length == 0" class="order-index-t">您还没有运费模板。</p>
        <div
          :name="index.toString()"
          class="m-t b-a bg-grey100 r"
          style="border-top: 1px solid #dee5e7"
          v-for="(item, index) in data"
          :key="index"
        >
          {{ item.name }}
          <div class="pull-right m-r">
            <a-button type="text" size="small" class="m-r" @click.native="editExpress(item.id)">修改</a-button>--
            <a-button type="text" size="small" class="m-l" @click.stop="deleteExpress(item.id)">删除</a-button>
          </div>
          <div slot="content">
            <a-row class="padder-v">
              <a-col span="8">可指定区域</a-col>
              <a-col span="4" class="text-center" v-if="item.charge_model == 1">首件(个)</a-col>
              <a-col span="4" class="text-center" v-if="item.charge_model == 2">首重(kg)</a-col>
              <a-col span="4" class="text-center">运费(元)</a-col>
              <a-col span="4" class="text-center" v-if="item.charge_model == 1">续件(个)</a-col>
              <a-col span="4" class="text-center" v-if="item.charge_model == 2">续重(kg)</a-col>
              <a-col span="4" class="text-center">续费(元)</a-col>
            </a-row>
            <a-row v-for="(val, num) in item.valuation_rules" :key="num">
              <a-col span="8">
                <font v-for="(v, i) in val.provinces" :key="i">
                  <font>
                    {{ v.name }}
                    <font class="text-grey600" v-if="!v.is_all">
                      <span v-for="(city, c) in v.citys" :key="c">{{ city.name }}</span>
                      <font
                        class="text-xs text-grey"
                        v-if="!city.is_all"
                      ><span v-for="(country, q) in city.regions" :key="q">{{ country.name }}</span></font
                      >
                    </font>
                  </font>
                </font>
              </a-col>
              <a-col span="4" class="text-center" v-if="item.charge_model == 1">{{ val.initial_workpiece }}</a-col>
              <a-col span="4" class="text-center" v-else>{{ val.the_first_heavy }}</a-col>
              <a-col span="4" class="text-center">{{ val.freight }}</a-col>
              <a-col span="4" class="text-center" v-if="item.charge_model == 1">{{ val.next_piece }}</a-col>
              <a-col span="4" class="text-center" v-else>{{ val.continued_heavy }}</a-col>
              <a-col span="4" class="text-center">{{ val.renew }}</a-col>
            </a-row>
          </div>
        </div>
      </a-collapse>
      <!-- <Page
        v-show="data.length != 0"
        class="m-t m-b pull-right"
        :total="total"
        show-total
        :page-size="params.page_size"
        :current="params.page_index"
        @on-change="changePage"
      ></Page> -->
    </a-card>
  </div>
</template>
<script>
import { getFreightList, apiLogistics } from '@/api/logistics'
export default {
  data () {
    return {
      data: [],
      params: {
        page_index: 1,
        page_size: 6
      },
      total: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取模板列表
    getList () {
      getFreightList(this.params)
        .then((res) => {
          if (res.code === 200) {
            this.total = res.response.total
            this.data = res.response.data
          } else {
            this.$Message.error(res.msg)
          }
        })
        .catch(() => {
          this.$Message.error('数据获取失败，请刷新重试！')
        })
    },
    // 点击修改
    editExpress (id) {
      this.$router.push({ name: 'setup-freight-add', query: { id: id } })
    },
    // 点击删除
    deleteExpress (id) {
      const _this = this
      _this.confirm({
        title: '删除提示',
        content: (<p>你确定要删除这条模版?</p>),
        onOk: () => {
          apiLogistics('template/del', {
            id: id
          }).then((res) => {
            if (res.code === 200) {
              _this.$message.success('删除成功')
              _this.page_index = 1
              _this.getList()
            } else {
              _this.$message.error(res.msg)
            }
          })
        }
      })
    },
    // 切换页码
    changePage (index) {
      this.params.page_index = index
      this.getList()
    }
  }
}
</script>
