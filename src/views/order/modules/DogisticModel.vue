<template>
  <a-modal title="物流轨迹" :width="800" :visible="visible" @cancel="handleCancel">
    <a-table :pagination="false" :columns="columns" :data-source="logisticTrackData" rowKey="accept_time">
    </a-table>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="handleCancel">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
import { getLogistics } from '@/api/logistics'
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
      columns: [
        {
          title: '时间',
          dataIndex: 'accept_time'
        },
        {
          title: '内容',
          dataIndex: 'accept_station'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        }
      ],
      logisticTrackData: []
    }
  },
  computed: {},
  methods: {
    show () {
      const self = this
      self.visible = true
      this.getDogisticTrack()
    },
    getDogisticTrack () {
      getLogistics({ business_no: this.orderDetali.business_no })
      .then((res) => {
        if (res.code === 200) {
          this.logisticTrackData = JSON.stringify(res.response) !== '{}' ? res.response : []
        } else {
          this.$message.error(res.msg)
        }
      })
      .catch(() => {
        this.$message.error('请求失败，请稍后重试')
      })
    },
    handleCancel () {
      self.visible = false
    }
  }
}
</script>
