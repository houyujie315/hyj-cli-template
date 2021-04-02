<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item>
              <a-button v-if="$auth('manager.add')" type="primary" icon="plus" @click="$refs.menuEditor.add({ editType: 0 })">添加</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table-new ref="table" size="default" :columns="columns" :data="loadData" rowKey="id">
      <span slot="action" slot-scope="text, record">
        <a v-action:edit @click="$refs.menuEditor.edit({ ...record, editType: 1 })">编辑</a>
        <a-divider type="vertical" />
        <a v-action:delete @click="handleDele(record)">删除</a>
      </span>
    </s-table-new>

    <menu-editor ref="menuEditor" @ok="handleOk"></menu-editor>
  </a-card>
</template>

<script>
import { STableNew } from '@/components'
import MenuEditor from './modules/MenuEditor'
import { getMenusList, apiManagerMenus } from '@/api/manager'

export default {
  name: 'MenuList',
  components: {
    STableNew,
    MenuEditor
  },
  data () {
    return {
      description: '',

      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '菜单名称',
          dataIndex: 'menu_code'
        },
        {
          title: '菜单ID',
          dataIndex: 'menu_id'
        },
        {
          title: 'URL路径',
          dataIndex: 'url_path'
        },
        {
          title: '重定向',
          dataIndex: 'redirect'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getMenusList(Object.assign(parameter)).then(res => {
          return res.response
        })
      }
    }
  },
  created () { },
  methods: {
    handleOk () {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    handleDele (record) {
      const self = this
      self.$confirm({
        title: '是否确认删除?',
        content: (
          <p>
            名称：{record.name} <br />
            菜单名称：{record.menu_code} <br />
            菜单ID: {record.menu_id}
          </p>
        ),
        onOk () {
          apiManagerMenus('delete', { id: record.id }).then(res => {
            if (res.code === 200) {
              self.$refs.table.refresh()
              self.$notification.success({
                message: '提示',
                description: '删除成功',
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
