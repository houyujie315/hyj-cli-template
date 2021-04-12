<template>
  <div class="layout express-add">
    <a-card shadow>
      <a-form-model ref="form" :rules="rules" :model="form" class="m-t-sm" labelAlign="left">
        <a-form-model-item prop="name" label="模板名称" :labelCol="labelCol">
          <a-input
            v-model="form.name"
            @blur="
              () => {
                $refs.name.onFieldBlur()
              }
            "
            placeholder="输入模板名称"
            style="width: 300px"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="计费方式" :labelCol="labelCol">
          <a-radio-group v-model="form.type">
            <a-radio value="按件数" :disabled="$route.query.id != 0 && form.charge_model === 2">按件数</a-radio>
            <a-radio value="按重量" :disabled="$route.query.id != 0 && form.charge_model === 1">按重量</a-radio>
          </a-radio-group>
          <div v-if="$route.query.id != 0" class="text-grey400">计费方式不可修改</div>
        </a-form-model-item>
        <a-form-model-item label="配送区域">
          <div class="rules b r">
            <a-row class="bg-grey200" style="padding-left: 10px">
              <a-col span="9">可配送区域</a-col>
              <a-col span="3" v-if="form.type == '按件数'" class="text-center">首件(个)</a-col>
              <a-col span="3" v-if="form.type == '按重量'" class="text-center">首重(kg)</a-col>
              <a-col span="3" class="text-center">运费</a-col>
              <a-col span="3" v-if="form.type == '按件数'" class="text-center">续件(个)</a-col>
              <a-col span="3" v-if="form.type == '按重量'" class="text-center">续重(kg)</a-col>
              <a-col span="3" class="text-center">续费(元)</a-col>
              <a-col span="3" class="text-center">排序</a-col>
            </a-row>
            <div v-if="form.valuation_rules.length > 0">
              <a-row
                v-for="(item, index) in form.valuation_rules"
                :key="index"
                style="min-height: 50px"
                class="b-t m-n"
                :gutter="20"
              >
                <a-col span="9">
                  <font v-if="item.is_all">全国范围</font>
                  <font v-else>
                    <font v-for="(v, i) in item.provinces" :key="i">
                      <font>
                        {{ v.name }}
                        <font v-if="!v.is_all">
                          <span v-for="(city, c) in v.citys" :key="c" class="text-grey600">
                            {{ city.name }}
                            <font v-if="!city.is_all">
                              <span v-for="(country, q) in city.regions" class="text-xs text-grey" :key="q">{{
                                country.name
                              }}</span>
                            </font>
                          </span>
                        </font>
                      </font>
                    </font>
                  </font>
                  <a-poptip confirm class="pull-right m-l-xs" title="确定删除?" @ok="deleted(item)">
                    <a-button size="small">删除</a-button>
                  </a-poptip>
                </a-col>
                <a-col span="3" class="text-center">
                  <a-input size="small" v-if="form.type === '按件数'" v-model="item.initial_workpiece"></a-input>
                  <a-input size="small" v-if="form.type === '按重量'" v-model="item.the_first_heavy"></a-input>
                </a-col>
                <a-col span="3" class="text-center">
                  <a-input size="small" v-model="item.freight"></a-input>
                </a-col>
                <a-col span="3" class="text-center">
                  <a-input size="small" v-if="form.type === '按件数'" v-model="item.next_piece"></a-input>
                  <a-input size="small" v-if="form.type === '按重量'" v-model="item.continued_heavy"></a-input>
                </a-col>
                <a-col span="3" class="text-center">
                  <a-input size="small" v-model="item.renew"></a-input>
                </a-col>
                <a-col span="3" class="text-center">
                  <a-input size="small" v-model="item.sort"></a-input>
                </a-col>
              </a-row>
            </div>
            <a-row style="padding-left: 10px" class="text-blue500 b-t">
              <div @click="openCity()" class="pointer">指定可配送区域和运费</div>
            </a-row>
            <a-modal
              title="选择可配送区域"
              v-model="cityModel"
              :closable="false"
              @ok="modalOkFn"
              class-name="vertical-center-modal"
            >
              <div class="con clearfix">
                <div class="b pull-left" style="width: 47%; height: 400px; overflow: scroll">
                  <div class="title bg-grey200 wrapper-sm">可选省、市、区</div>
                  <!-- TODO -->
                  <a-tree
                    @check="onCheck"
                    :tree-data="initArea"
                    :autoExpandParent="true"
                    :replace-fields="{ key: 'id' }"
                    checkable
                  />
                </div>
                <div class="b pull-right" style="width: 47%; height: 400px; overflow: scroll">
                  <div class="title bg-grey200 wrapper-sm">已选省、市、区</div>
                  <a-tree :tree-data="rightArea" />
                </div>
              </div>
            </a-modal>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="submit('form')">保存</a-button>
          <router-link :to="{ name: 'setup-freight-list' }">
            <a-button style="margin-left: 8px">返回</a-button>
          </router-link>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>
<script>
import areaData from '@/assets/js/LAreaData'
// import { addtemplate, edittemplate, gettemplateinfo } from '@/api/logistics'
export default {
  data () {
    return {
      labelCol: {
        span: 2
      },
      cityModel: false,
      form: {
        name: '',
        type: '按件数', // 计费方式
        charge_model: 1,
        valuation_rules: []
      },
      rules: {
        name: [
          {
            required: true,
            message: '请填写模板名',
            trigger: 'blur'
          }
        ]
      },
      is_all: false,
      currentIndex: 0,
      showArea: '',
      postal_area: [],
      replaceFields: {
        children: 'children',
        title: 'title',
        key: 'id'
      },
      initArea: [], // 初始'所有地区'数据(用于Tree组件数据重置)
      leftArea: [], // 左边'可选地区'数据(仅用于Tree组件)
      rightArea: [], // 右边'选中地区'数据(仅用于Tree组件)
      selectArea: [], // 选中的地区(用于前台转后台数据时使用,因为Tree组件会将所有checked变为true)
      confirmArea: [],
      repeatBool: true
    }
  },
  created () {
    // 获取所有省市区
    this.initArea = [
      {
        title: '全国',
        id: 0,
        children: areaData
      }
    ]
  },
  methods: {
    getCity (arr, data, city = []) {
      if (typeof data === 'object') {
        for (let i = 0; arr[i] !== undefined; i++) {
          for (let j = 0; data[j] !== undefined; j++) {
            if (arr[i] === data[j].id) {
              city.push(data[j])
            }
          }
        }
        for (let i = 0; data[i] !== undefined; i++) {
          this.getCity(arr, data[i].children, city)
        }
      }
      return city
    },
    onCheck (checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
      const city = this.getCity(this.initArea, checkedKeys)
      console.log(city)
    },
    // 打开城市选项
    openCity () {
      this.cityModel = !this.cityModel
      const areaIdArr = []
      if (this.form.valuation_rules.length > 0) {
        for (const each of this.form.valuation_rules) {
          for (const eitem of each.showArea) {
            areaIdArr.push(eitem.id)
          }
        }
      }
      console.log(areaIdArr, 'areaIdArr')
    }
  },
  modalOkFn () {}
}
</script>
<style>
</style>
