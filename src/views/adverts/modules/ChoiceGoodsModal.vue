<template>
  <div>
    <a-modal v-model="choiceGoodsModal" title="选择商品" width="900px">
      <div class="control-goods">
        <div>
          <router-link :to="{path:'/goods/list'}" target="_blank">
            <a-button style="margin-right:5px">管理商品</a-button>
          </router-link>
          <a-button @click="()=>getGoodsList('')">刷新列表</a-button>
        </div>
        <a-input
          style="width:200px"
          search
          placeholder="搜索商品名称"
          v-model="searchGoodsTitle"
          @on-search="(value)=>getGoodsList(value)"
        />
      </div>

      <a-table
        ref="selection"
        rowKey="id"
        @change="(value)=>(selectedGoods = value)"
        :loading="loading"
        :columns="columns"
        :data-source="goodsList"
      >
        <span slot-scope="text, record" slot="goodsPic">
          <img
            :src="record.cover | setImgUrl('goods',1)"
            style="height:40px;width:40px;margin-top:5px"
          />
        </span>
        <span slot-scope="text, record" slot="goodsTitle">
          <span>{{ record.title }}</span>
        </span>
        <span slot-scope="text, record" slot="goodsPrice">
          <span>{{ record.price }}</span>
          <span>元</span>
        </span>
        <span slot-scope="text, record" slot="goodsCreateTime">
          <span>{{ record.up_datetime }}</span>
        </span>
        <span slot-scope="text, record" slot="action">
          <a-button @click="choiceOneGoods(record)">选取商品</a-button>
        </span>
      </a-table>
      <template slot="footer">
        <a-button key="back" @click="cancel">取消</a-button>
        <a-button key="submit" type="primary" @click="ok">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getGoodsList } from '@/api/goods'
export default {
  props: {
    value: Boolean,
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      choiceGoodsModal: this.value,
      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      goodsList: [],
      searchGoodsTitle: '',
      selectedGoods: []
    }
  },

  watch: {
    choiceGoodsModal (value) {
      if (value) {
        this.getGoodsList('')
      } else {
        this.$emit('input', false)
      }
    },
    value: {
      handler (value) {
        this.choiceGoodsModal = value
      }
    }
  },
  computed: {
    columns () {
      const list1 = [
        { title: '商品图片', scopedSlots: { customRender: 'goodsPic' }, width: 100 },
        { title: '商品名称', scopedSlots: { customRender: 'goodsTitle' } },
        { title: '商品价格', scopedSlots: { customRender: 'goodsPrice' } },
        { title: '商品创建时间', scopedSlots: { customRender: 'goodsCreateTime' } }
      ]
      const list2 = [
        { title: '商品图片', scopedSlots: { customRender: 'goodsPic' }, width: 100 },
        { title: '商品名称', scopedSlots: { customRender: 'goodsTitle' } },
        { title: '商品价格', scopedSlots: { customRender: 'goodsPrice' } },
        { title: '商品创建时间', scopedSlots: { customRender: 'goodsCreateTime' } },
        { title: '操作', scopedSlots: { customRender: 'action' }, width: 200, align: 'center' }
      ]

      if (this.multiple) {
        return list1
      } else {
        return list2
      }
    }
  },

  methods: {
    async getGoodsList (title) {
      // 获取列表
      this.loading = true
      const res = await getGoodsList({
        goods_status: 1,
        category_id: 0,
        title: title,
        page_index: this.pageIndex,
        page_size: this.pageSize
      })
      if (res.code === 200) {
        this.goodsList = res.response.data // goods_type=1 实物商品
        this.total = res.response.total
      } else {
        this.$Message.warning(res.msg)
      }
      this.loading = false
    },

    ok () {
      this.$emit('selectedGoods', this.selectedGoods)
      this.choiceGoodsModal = false
      this.selectedGoods = []
    },
    cancel () {
      this.choiceGoodsModal = false
      this.selectedGoods = []
    },
    choiceOneGoods (goods) {
      this.$emit('selectedGoods', [goods])
      this.choiceGoodsModal = false
    }
  }
}
</script>

<style lang="less" scoped>
.no-choice-goods {
  width: 70px;
  height: 70px;
  border: 1px dashed silver;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  line-height: 65px;
}
.control-goods {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.has-choose-goods {
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.has-choose-goods img {
  width: 100%;
  height: 100%;
}
.has-choose-goods-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.has-choose-goods:hover .has-choose-goods-cover {
  display: block;
}
.has-choose-goods-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
