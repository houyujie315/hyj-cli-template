<template>
  <a-modal title="选择商品" width="620px" v-model="choiceGoodsModel" :confirm-loading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-row>
        <a-col>
          <a-space>
            <a-button>管理商品</a-button>
            <a-button>刷新列表</a-button>
          </a-space>
        </a-col>
        <a-col>
          <a-input-search placeholder="搜索商品名称" style="width: 200px" @search="onSearch" />
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>
<script>
export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      confirmLoading: false,
      choiceGoodsModel: this.value
    }
  },
  created () {
    console.log(this.value)
  },
  watch: {
    value: {
      handler (value) {
        this.choiceGoodsModal = value
      }
    }
  },
  methods: {
    handleCancel () {},
    onSearch () {}
  }
}
</script>
<style scoped lang='scss'>
</style>
