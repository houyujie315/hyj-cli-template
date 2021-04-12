<!-- 评论管理 -->
<template>
  <a-card :bordered="false" class="table-card">
    <a-input-search
      v-model="queryParam.content"
      placeholder="请输入评论内容"
      @search="handleSearch"
      style="width: 300px; margin-bottom: 10px"
    />
    <s-table-new
      ref="table"
      :columns="columns"
      size="default"
      :data="loadData"
      :rowSelection="rowSelection"
      rowKey="comment_id"
    >
      <div slot="expandIcon">
        <a-icon type="caret-right"></a-icon>
      </div>
      <!-- <span slot="goods" slot-scope="text, record"> -->
      <span slot="goods">
        <a class="cover">
          <!-- <img class="table-img" :src="record.goods.picture | setImgUrl('goods', 1)" alt /> -->
          <img class="table-img" src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3392663359,4194879068&fm=26&gp=0.jpg" alt />
        </a>
        <div class="info">
          <!-- <a class="twoline">{{ record.goods.name }}</a>
          <p class="text-deepOrange500">{{ record.goods.sku_name }}</p> -->
          <a class="twoline">哈哈哈哈哈哈哈哈</a>
          <p class="text-deepOrange500">啦啦啦啦啦啦</p>
        </div>
      </span>
      <span slot="status" slot-scope="text, record">
        <a-space>
          <a-tag color="pink" v-if="record.approve_status == 0">待审核</a-tag>
          <a-tag color="green" v-else-if="record.approve_status == 1">通过</a-tag>
          <a-tag color="red" v-else>不通过</a-tag>
        </a-space>
      </span>
      <span slot="userInfo" slot-scope="text, record">
        <div class="user-info">
          <img class="user-img" :src="record.avator | setImgUrl('goods', 1)" alt />
          <span style="margin-rignt: 5px">{{ record.nick_name }}</span>
        </div>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-space>
          <a-button v-if="record.is_seller_reply" size="small" @click="handleView()">查看</a-button>
          <a-button v-else size="small" @click="$refs.replyModal.reply({ ...record })">回复</a-button>
          <a-button size="small" @click="delConfirm(record.id)">删除</a-button>
        </a-space>
      </span>
      <a-icon slot="expandIcon" type="caret-right"></a-icon>
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <div v-if="!record.is_seller_reply" style="display:flex;align-items:center">
          <div style="margin-right:10px">商家暂未回复评论</div>
          <a @click="$refs.replyModal.reply({ ...record })">添加回复</a>
        </div>
        <div v-else class="seller-reply">
          <div class="reply-time">
            <span style="color: rgb(245, 168, 41)">商家回复:</span>
            <span>{{ record.reply_time }}</span>
          </div>
          <div class="reply-content">
            <div class="img-box" v-if="record.img_list.length > 0">
              <img :src="Img | setImgUrl('goods', 1)" v-for="(Img, ImgI) in record.img_list" :key="ImgI" />
            </div>
            <span>
              <i style="color: #999; font-style: normal">回复内容：</i>
              {{ record.reply_content }}
            </span>
          </div>
        </div>
      </div>
    </s-table-new>
    <div class="table-operations">
      <a-button size="small" @click="delConfirm(0)">批量删除</a-button>
    </div>
    <reply-modal ref="replyModal" @ok="handleOk"></reply-modal>
  </a-card>
</template>
<script>
import { STableNew } from '@/components'
import { getCommentList, apiGoods } from '@/api/goods'
import ReplyModal from './modules/ReplyModal'
export default {
  components: {
    STableNew,
    ReplyModal
  },
  data () {
    return {
      queryParam: {
        content: ''
      }, // 查询参数
      columns: [
        {
          title: '商品名称',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '评论内容',
          dataIndex: 'content',
          key: 'content'
        },
        {
          title: '订单编号',
          dataIndex: 'order_no',
          key: 'order_no'
        },
        {
          title: '评论时间',
          dataIndex: 'update_time',
          key: 'update_time'
        },
        {
          title: '审核状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '买家',
          scopedSlots: { customRender: 'userInfo' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: (parameter) => {
        return getCommentList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.response
        })
      },
      comment_ids: []
    }
  },
  computed: {
    rowSelection () {
      return {
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleSearch () {
      this.$refs.table.refresh()
    },
    // 删除评论
    delConfirm (id) {
      const self = this
      if (id === 0 && self.comment_ids.length === 0) {
        return self.$message.error('请选择要删除的评论')
      }
      if (id > 0) {
        self.comment_ids = [id]
      }
      self.$confirm({
        title: '提示',
        content: <p>确定继续删除评论吗？</p>,
        onOk () {
          apiGoods('delete', { ids: self.comment_ids }).then((res) => {
            if (res.code === 200) {
              self.$notification.success({
                message: '提示',
                description: '删除成功'
              })
              self.getGoodsList()
              self.comment_ids = []
            } else {
              self.$notification.error({
                message: '错误',
                description: res.msg
              })
            }
          })
        }
      })
    },
    // 回复
    handleOk () {
      this.$refs.table.refresh()
    },
    // 查看
    handleView () {},
    onSelectChange (selectedRowKeys, selectedRows) {
      this.comment_ids = []
      selectedRows.forEach((element) => {
        this.comment_ids.push(element.id)
      })
    }
  }
}
</script>
<style scoped lang='less'>
/deep/.ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  padding: 8px;
}
.cover {
  display: block;
  min-width: 60px;
  width: 60px;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  float: left;
}
.cover img {
  width: 100%;
  height: 100%;
}
.info {
  float: left;
  margin-top: 10px;
}
.table-card {
  position: relative;
}
.table-operations {
  position: absolute;
  left: 24px;
  bottom: 45px;
}
.user-info {
  display: flex;
  align-items: center;
  .user-img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
}
.seller-reply {
  width: 500px;
  overflow: hidden;
}
.seller-reply .reply-content .img-box {
  height: 60px;
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 10px 0;
}
.seller-reply .reply-content .img-box img {
  width: 60px;
  margin-right: 10px;
}
.seller-reply .reply-content span {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 9;
  -webkit-box-orient: vertical;
  white-space: normal;
  margin-bottom: 5px;
}
.seller-reply .reply-time {
  font-size: 14px;
}
.seller-reply .reply-time span:first-child {
  color: rgb(245, 168, 41);
}
.seller-reply .reply-time span:last-child {
  color: rgb(152, 152, 159);
}
</style>
