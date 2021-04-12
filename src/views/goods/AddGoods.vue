<!-- 添加商品 -->
<template>
  <div>
    <a-card :bordered="false" title="添加/编辑商品">
      <a-form-model
        ref="form"
        class="form-card"
        :model="form"
        :rules="ruleInline"
        :label-col="{ span: 2 }"
        :colon="false"
        :wrapper-col="{ span: 22 }"
      >
        <div v-if="step == 0">
          <h4 class="title">基本信息</h4>
          <a-form-model-item label="商品名称" prop="title">
            <a-input v-model="form.title" :maxLength="100" style="width: 400px" />
          </a-form-model-item>
          <a-form-model-item label="分享描述">
            <a-input v-model="form.share_content" :maxLength="160" style="width: 400px" />
            <div class="flex">
              <p class="describe-text">微信分享给好友时会显示，建议36个字以内</p>
            </div>
          </a-form-model-item>
          <a-form-model-item label="商品图片" class="picture-upload-list" prop="pictureList">
            <div class="flex" style="align-items: center">
              <draggable v-model="form.pictureList" @end="draggaEnd" style="display: inline-block">
                <div class="picture-upload-item" v-for="(item, index) in form.pictureList" :key="index">
                  <template v-if="item.url">
                    <img :src="item.url | setImgUrl('goods', 1)" />
                    <div class="picture-upload-list-cover">
                      <a-icon type="eye-o" @click.native="handleView(item)"></a-icon>
                      <a-icon type="delete" @click.native="handleRemove(item, index)"></a-icon>
                    </div>
                  </template>
                  <template v-else>
                    <a-progress v-if="item.showProgress" :percent="item.percentage" :showInfo="false"></a-progress>
                  </template>
                </div>
              </draggable>
              <s-upload
                :isShowList="false"
                :multiple="true"
                :uploadListData.sync="form.pictureList"
                :limitNum="5"
              ></s-upload>
              <a-modal title="商品图片" v-model="visible" @ok="visible = false">
                <img style="width: 100%" :src="img" />
              </a-modal>
            </div>
            <p class="describe-text">建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传5张</p>
          </a-form-model-item>
          <a-form-model-item label="商品分类" class="m-t" prop="goods_category_id">
            <a-select v-model="form.goods_category_id" mode="multiple" style="width: 300px">
              <!-- <a-icon slot="suffixIcon" type="down" /> -->
              <a-select-option v-for="item in categoriesList" :key="item.id" :value="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
            <a @click="getCategoryList()" class="m-l-xs">刷新</a>
            <router-link
              :to="{ path: '/goods/classify' }"
              target="_blank"
              class="m-l-xs b-l b-dark"
              style="padding-left: 5px"
            >创建商品分类</router-link
            >
          </a-form-model-item>
          <a-form-model-item label="商品卖点">
            <a-input v-model="form.super_title" placeholder="简单描述下该商品的优势" style="width: 400px" />
            <p class="describe-text">在商品详情页标题下面展示卖点信息，建议60字以内</p>
          </a-form-model-item>
          <a-form-model-item label="商品排序">
            <a-input-number v-model="form.sort" :precision="0" :max="99999999" style="width: 400px" />
            <p class="describe-text">
              排序值越大，在用户端列表中的位置越靠上。排序值相同时，时间越早在列表的排序越靠上。
            </p>
          </a-form-model-item>
          <h4 class="title">价格库存</h4>
          <a-form-model-item label="商品规格" class="form-skus">
            <div class="sku-group">
              <div v-for="(val, key) in form.skuGorup" :key="key">
                <a-row class="group">
                  <a-col :span="20">
                    <a-form-model-item :label="'规格名'" prop="skuGorup">
                      <a-auto-complete
                        class="gorup-name"
                        :data-source="skuName"
                        style="width: 200px"
                        v-model="val.text"
                        placeholder="请选择"
                      />
                      <a-checkbox
                        class="m-l-md"
                        v-if="key == 0 && val.leaf.length > 0"
                        v-model="form.skuPic"
                        @change="changeSkuPic"
                      >添加规格图片</a-checkbox
                      >
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="4">
                    <a-button class="pull-right m-r-md" type="dashed" @click="removeGroup(key)">
                      <a-icon type="close" />移除
                    </a-button>
                  </a-col>
                </a-row>
                <div class="items">
                  <a-row>
                    <a-col class="specs">规格值</a-col>
                    <a-col :span="20">
                      <div class="list">
                        <div class="sku" v-for="(v, k) in val.leaf" :key="k">
                          <a-auto-complete
                            :class="!v.text ? 'has-error' : ''"
                            v-model="v.text"
                            placeholder="请输入规格值"
                          />
                          <div class="has-error">
                            <div v-if="!v.text" class="ant-form-explain">规格值不为空</div>
                            <div v-if="v.agin" class="ant-form-explain">规格值不能重复</div>
                          </div>
                          <div v-if="v.picture && form.skuPic && key == 0" class="m-t-xs picture-upload-list">
                            <div v-if="v.picture[0].url">
                              <div class="picture-upload-item" v-for="(pic, index) in v.picture" :key="index">
                                <template v-if="pic.url">
                                  <img :src="pic.url | setImgUrl('template', 300)" />
                                  <div class="picture-upload-list-cover">
                                    <a-icon type="eye-o" @click.native="viewSkuPic(pic)"></a-icon>
                                    <a-icon type="delete" @click.native="removeSkuPic(pic, k)"></a-icon>
                                  </div>
                                </template>
                              </div>
                            </div>
                            <s-upload
                              @uploadListDataRes="(value) => {SkuPicSuccess(value, k)}"
                              :isShowList="true"
                              :uploadListData="[{ url: v.picture[0].url }]"
                              :limitNum="1"
                              v-if="!v.picture[0].url"
                            />
                          </div>
                          <a-icon @click.native="RemoveItem(key, k)" class="remove" type="close-circle"></a-icon>
                        </div>
                        <a-button
                          style="margin-top: 4px"
                          @click="addItem(key)"
                          type="dashed"
                          icon="plus"
                        >添加规格值</a-button
                        >
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="sku-group-add">
                <a-button type="dashed" :disabled="form.skuGorup.length >= '3'" @click="addGroup">
                  <a-icon type="plus" />添加规格项目
                </a-button>
                <font v-if="form.skuGorup.length >= '3'" class="text-xs m-l-xs">最多添加三组规格</font>
              </div>
              <div class="describe-text1">如有颜色、尺码等多种规格，请添加商品规格</div>
            </div>
          </a-form-model-item>
          <template v-if="form.skuGorup[0]">
            <a-form-model-item label="规格明细" class="m-t-md">
              <div class="sku-list">
                <div class="title">
                  <font v-for="(item, index) in showSkuGroup" :key="index">{{ item.text }}</font>
                  <font>价格</font>
                  <font>库存</font>
                  <font>规格编码</font>
                  <font>划线价</font>
                  <font>成本价</font>
                  <!-- <font v-if="form.logisticWeight.showLogis">重量(kg)</font> -->
                  <font>销量</font>
                </div>
                <div class="skus" v-for="(val, key) in form.skuList" :key="key">
                  <div class="field sku" v-for="(v, k) in val.skus" :key="k">{{ v.value }}</div>
                  <div class="field">
                    <a-form-model-item :prop="'skuList.' + key + '.price'" :rules="ruleInline.price">
                      <a-input size="small" v-model="val.price" />
                    </a-form-model-item>
                  </div>
                  <div class="field">
                    <a-form-model-item
                      :prop="'skuList.' + key + '.stock'"
                      :rules="{ required: true, pattern: /^[0-9]+$/, trigger: 'blur', message: '请填写正确的库存' }"
                    >
                      <a-input size="small" number v-model="val.stock" />
                    </a-form-model-item>
                  </div>
                  <div class="field">
                    <a-input size="small" number v-model="val.code" />
                  </div>
                  <div class="field">
                    <a-form-model-item
                      :prop="'skuList.' + key + '.original_price'"
                      :rules="{
                        required: true,
                        type: 'number',
                        pattern: /^-?\d+\.?\d{0,2}$/,
                        trigger: 'blur',
                        message: '请填写正确的价格',
                      }"
                    >
                      <a-input size="small" number v-model="val.original_price" />
                    </a-form-model-item>
                  </div>
                  <div class="field">
                    <a-form-model-item
                      :prop="'skuList.' + key + '.cost_price'"
                      :rules="{
                        required: true,
                        type: 'number',
                        pattern: /^-?\d+\.?\d{0,2}$/,
                        trigger: 'blur',
                        message: '请填写正确的价格',
                      }"
                    >
                      <a-input size="small" number v-model="val.cost_price" />
                    </a-form-model-item>
                  </div>
                  <!-- <div class="field" v-if="form.logisticWeight.showLogis">
                    <a-form-model-item
                      :prop="'skuList.' + key+'.weight'"
                      :rules="{required: true, type:'number',pattern:/^(\d+)(.\d{0,2})?$/,trigger: 'blur',message: '请填写正确的重量'}"
                    >
                      <a-input size="small" number v-model="val.weight" />
                    </a-form-model-item>
                  </div> -->
                  <div class="field">{{ val.sales_volume }}</div>
                </div>
                <div class="footer" v-if="form.skuList.length > 0">
                  <font class="m-l-md">批量设置：</font>
                  <a-button
                    class="m-l-xs text-blue"
                    @click="SetAllPrice('1')"
                    type="dashed"
                    size="small"
                  >价格</a-button
                  >
                  <a-button
                    class="m-l-xs text-blue"
                    @click="SetAllPrice('2')"
                    type="dashed"
                    size="small"
                  >库存</a-button
                  >
                  <a-button
                    class="m-l-xs text-blue"
                    @click="SetAllPrice('3')"
                    type="dashed"
                    size="small"
                  >划线价</a-button
                  >
                  <a-button
                    class="m-l-xs text-blue"
                    @click="SetAllPrice('4')"
                    type="dashed"
                    size="small"
                  >成本价</a-button
                  >
                </div>
              </div>
            </a-form-model-item>
          </template>
          <div v-if="form.skuGorup.length == 0">
            <a-form-model-item label="价格" prop="price" class="small m-t-md">
              <a-input
                v-model="form.price"
                placeholder="商品销售价"
                :disabled="form.skuGorup.length != '0'"
                style="width: 200px"
              />
            </a-form-model-item>
            <a-form-model-item label="划线价" prop="original_price" class="small m-t-md">
              <a-input
                v-model="form.original_price"
                :disabled="form.skuGorup.length != '0'"
                placeholder="可填写原价/市场价"
                style="width: 200px"
              />
            </a-form-model-item>
            <a-form-model-item label="原价" class="small">
              <a-input v-model="form.cost_price" placeholder="商品原价" style="width: 200px" />
            </a-form-model-item>
            <a-form-model-item label="库存" prop="stock" class="small">
              <a-input v-model="form.stock" placeholder="库存数量" style="width: 200px" />
              <p class="describe-text">
                库存为 0 时，会放到『已售罄』的商品列表里，保存后买家看到的商品可售库存同步更新
              </p>
            </a-form-model-item>
          </div>
          <a-form-model-item label="库存展示" class="small">
            <a-switch v-model="form.is_show_stock"></a-switch>
            <font class="text-grey">（是否在商品详情页面展示库存）</font>
          </a-form-model-item>
          <h4 class="title">其他信息</h4>
          <a-form-model-item label="运费设置" prop="goods_shippings.logistics_types">
            <div v-if="form.goods_shippings.logistics_types.indexOf(1) > -1">
              <a-radio-group v-model="form.goods_shippings.shipping_type">
                <a-space direction="vertical">
                  <a-radio :value="1" :style="radioStyle">
                    <span style="margin-right: 10px">统一运费</span>
                    <a-input
                      v-model="form.goods_shippings.shipping_price"
                      placeholder="输入运费价格"
                      style="width: 200px"
                    />
                    <span class="m-l-xs">元</span>
                  </a-radio>
                  <a-radio :value="2">
                    <span style="margin-right: 10px">运费模版</span>
                    <a-select
                      class="select"
                      v-model="form.goods_shippings.shipping_template_id"
                      label-in-value
                      style="width: 200px"
                    >
                      <a-select-option
                        v-for="(item, index) in templateList"
                        :key="index"
                        :label="item.charge_model == 1 ? '按件数:' + item.name : '按重量:' + item.name"
                        value="Number(item.id)"
                      ></a-select-option>
                    </a-select>
                    <a @click="getTemplateList()" class="m-l-xs">刷新</a>
                    <router-link
                      :to="{ path: '/logistics/freight', query: { id: 0 } }"
                      target="_blank"
                      class="m-l-xs b-l b-dark"
                      style="padding-left: 5px"
                    >创建运费模版</router-link
                    >
                  </a-radio>
                </a-space>
              </a-radio-group>
            </div>
          </a-form-model-item>
          <a-form-model-item label="上架时间" class="small">
            <a-radio-group v-model="form.goods_status">
              <a-radio :value="1">立即上架</a-radio>
              <a-radio :value="2">放入仓库</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </div>
        <div v-show="step == '1'">
          <h4 class="title">商品详情</h4>
          <div class="m-l-md m-t-md goods-detail">
            <quill-editor @change="editorChange" v-model="form.desc" style="width: 375px; height: 600px"></quill-editor>
          </div>
        </div>
      </a-form-model>
      <div class="m-t-md tools-bar">
        <a-button v-show="step == 1" @click="prev" class="m-l-md">上一步</a-button>
        <a-button @click="handleSubmit('form')" type="primary" class="m-l-md">保存</a-button>
        <a-button v-show="step == 0" @click="next" class="m-l-md">下一步</a-button>
      </div>
      <!-- 批量设置弹框 -->
      <a-modal :visible="visibleInput" :closable="false" @ok="batchModalOk" @cancel="visibleInput = false">
        <a-input v-model="batchValue" :placeholder="placeholder" />
      </a-modal>
    </a-card>
  </div>
</template>
<script>
import { SUpload, QuillEditor } from '@/components'
import { IsDefine } from '@/utils/tools'
import { getCategoryList, getGoodsDetail, apiGoods } from '@/api/goods'
import { getFreightList } from '@/api/logistics'
export default {
  components: {
    SUpload,
    QuillEditor
  },
  data () {
    // 商品划线价
    var originalPriceValida = (rule, value, callback) => {
      if (this.form.price > this.form.original_price && this.form.original_price) {
        return callback(new Error('划线价不能小于售价'))
      } else {
        return callback()
      }
    }
    // 商品价格
    var validatePrice = (rule, value, callback) => {
      if (!IsDefine(value) || parseFloat(value) < 0.01) {
        return callback(new Error('价格必须大于等于0.01元'))
      } else if (!/^-?\d+\.?\d{0,2}$/.test(value)) {
        return callback(new Error('价格最多支持两位小数'))
      } else {
        return callback()
      }
    }
    // 规格名不能重复;规格值不能重复n
    var validateSkuGroup = function (rule, value, callback) {
      if (value.length > 1) {
        const len = value.length
        for (let arr = 0; arr < len; arr++) {
          if (value[arr].text === '') {
            return callback(new Error('规格名不能为空'))
          } else if (value[arr].text !== '') {
            for (let arr2 = arr + 1; arr2 < len; arr2++) {
              if (value[arr].text === value[arr2].text) {
                return callback(new Error('规格名重复'))
              } else {
                callback()
              }
            }
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    // 重量验证
    var validateLogi = function (rule, value, callback) {
      if (value.showLogis && !value.weight) {
        return callback(new Error('输入重量'))
      } else if (value.showLogis && !Number(value.weight) > 0) {
        return callback(new Error('重量需大于0'))
      } else {
        callback()
      }
    }
    // 配送方式验证
    var validateLogisticsType = (rule, value, callback) => {
      const _this = this
      if (value.length === 0) {
        return callback(new Error('请选择配送方式'))
      } else if (value.indexOf(1) > -1) {
        const shippingType = _this.form.goods_shippings.shipping_type
        if (shippingType === 1) {
          if (!IsDefine(_this.form.goods_shippings.shipping_price)) {
            return callback(new Error('请输入运费价格'))
          } else if (!/^-?\d+\.?\d{0,2}$/.test(_this.form.goods_shippings.shipping_price)) {
            return callback(new Error('运费价格最多支持两位小数'))
          } else {
            return callback()
          }
        } else if (shippingType === 2 && !_this.form.goods_shippings.shipping_template_id) {
          return callback(new Error('请选择运费模版'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const pictureValidate = (rule, value, callback) => {
      setTimeout(() => {
        if (this.form.pictureList.length === 0) {
          return callback(new Error('至少上传一张商品图片!'))
        } else {
          return callback()
        }
      }, 500)
    }
    return {
      step: 0,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      skuName: ['尺寸', '尺码', '规格', '款式', '净含量', '种类'],
      form: {
        goods_type: 1, // 商品类型
        title: '', // 商品标题
        cover: '', // 商品主图
        share_content: '', // 分享描述
        pictureList: [], // 商品照片
        goods_category_id: [], // 商品分类
        super_title: '', // 商品卖点
        sort: 99, // 排序
        skuGorup: [],
        skuPic: false,
        skuList: [],
        stock: null, // 商品库存
        price: null, // 商品售价
        original_price: null, // 商品划线价
        cost_price: null, // 原价
        is_sku: false, // 是否有sku
        is_show_stock: true, // 是否显示库存
        goods_shippings: {
          logistics_types: [1],
          shipping_type: 1,
          shipping_price: null,
          shipping_template_id: 0
        },
        desc: '', // 商品详情描述
        goods_status: 1 // 商品状态：上架、下架
      },
      ruleInline: {
        title: [
          {
            required: true,
            message: '必须输入商品名称！',
            trigger: 'blur'
          }
        ],
        pictureList: [
          {
            required: true,
            validator: pictureValidate,
            // message: "至少上传一张商品图片!",
            trigger: 'change'
            // type: "array",
          }
        ],
        goods_category_id: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'change',
            type: 'array'
          }
        ],
        original_price: [{ required: true, validator: originalPriceValida, trigger: 'blur' }],
        stock: [
          {
            required: true,
            message: '请填写库存数量!',
            trigger: 'blur'
          },
          {
            required: true,
            message: '库存数量必须是整数',
            trigger: 'blur',
            pattern: /^[0-9]+$/
          }
        ],
        price: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePrice
          }
        ],
        skuGorup: [
          {
            required: true,
            trigger: 'change',
            validator: validateSkuGroup
          }
        ],
        logisticWeight: [
          {
            validator: validateLogi,
            required: true,
            trigger: 'blur'
          }
        ],
        'goods_shippings.logistics_types': [
          {
            validator: validateLogisticsType,
            required: true,
            trigger: 'change'
          }
        ]
      },
      categoriesList: [], // 商品分类
      repeatBool: true,
      visible: false, // 大图弹框
      img: '', // 显示大图
      templateList: [], // 运费模板列表
      visibleInput: false,
      batchValue: null,
      batchType: '',
      placeholder: ''
    }
  },
  computed: {
    showSkuGroup () {
      return this.form.skuGorup.filter((item) => item.leaf && item.leaf.length > 0 && item.text)
    }
  },
  watch: {
    'form.skuGorup': {
      handler (cur, old) {
        this.count++
        var skus = this.flatten(this.showSkuGroup)
        skus.forEach((val, key) => {
          const name = []
          val.skus.forEach((v) => {
            name.push(v.key + v.value)
          })
          val.name = name.join('.')
          const skuItem = this.form.skuList.find((c) => c.name === val.name)
          if (skuItem) {
            val.id = skuItem.id
            val.code = skuItem.code
            val.price = skuItem.price
            val.stock = skuItem.stock
            val.cost_price = skuItem.cost_price
            val.original_price = skuItem.original_price
            val.sales_volume = skuItem.sales_volume
            val.weight = skuItem.weight
            val.picture = skuItem.picture
            val.sku_sort = skuItem.sku_sort || 0
            val.integral = skuItem.integral
            val.integral_price = skuItem.integral_price
          } else {
            val.id = 0
            val.code = 0
            val.price = 0
            val.stock = 0
            val.cost_price = 0
            val.original_price = 0
            val.sales_volume = 0
            val.weight = 0
            val.picture = ''
            val.sku_sort = 0
            val.integral = 0
            val.integral_price = 0
          }
        })
        // 标记改变次数
        if (this.count !== 1) {
          this.form.skuList = skus
        }
      },
      deep: true
    }
  },
  async created () {
    await this.getCategoryList()
    if (this.$route.query.id) {
      this.form.id = this.$route.query.id
      this.getDetail()
    }
  },
  mounted () {
    this.getTemplateList()
  },
  methods: {
    getDetail () {
      const self = this
      getGoodsDetail({
        id: self.$route.query.id
      }).then((res) => {
        if (res.code === 200) {
          console.log(res, 'goodsDetail')
          self.form.title = res.response.title
          self.form.super_title = res.response.super_title
          self.form.is_sku = res.response.is_sku
          self.form.is_show_stock = res.response.is_show_stock
          self.form.goods_status = res.response.goods_status
          self.form.goods_category_id = res.response.goods_category_id
          self.form.sort = res.response.sort
          self.form.share_content = res.response.share_content
          self.form.goods_shippings = res.response.goods_shippings
          self.form.goods_shippings.logistics_types = [1]
          self.form.desc = res.response.desc.replace(/style=""/g, ' ')
          var list = []
          res.response.pictures.forEach((item, index) => {
            if (index < 5 && item) {
              list.push({
                url: item,
                check_code: ''
              })
            }
          })
          self.$nextTick(() => {
            self.form.pictureList = list
          })
          // sku数据组合
          if (res.response.is_sku) {
            self.form.price = 0
            self.form.original_price = 0
            self.form.cost_price = 0
            self.form.integral = 0
            self.form.integral_price = 0
            self.form.stock = 0
            self.form.weight = 0
            self.form.skuList = self.listChangeKey(res.response.good_skus, [
              {
                old: 'specs',
                new: 'skus'
              }
            ])
            const skuList = []
            self.form.skuList.forEach((item) => {
              item.skus.forEach((val) => {
                skuList.push(val)
              })
            })
            const result = []
            const keys = []
            for (var index in self.form.skuList[0].skus) {
              keys.push(self.form.skuList[0].skus[index].key)
            }
            for (var t in keys) {
              var obj = {}
              obj.text = keys[t]
              obj['leaf'] = []
              for (var e in skuList) {
                if (keys[t] === skuList[e].key) {
                  var item = {}
                  if (skuList[e].picture) {
                    item['picture'] = []
                    item['picture'].push({ url: skuList[e].picture })
                    self.form.skuPic = true
                  }
                  if (self.form.skuPic && !skuList[e].picture) {
                    item['picture'] = [
                      {
                        url: ''
                      }
                    ]
                  }

                  item['text'] = skuList[e].value
                  obj['leaf'].push(item)
                }
              }
              result.push(obj)
            }
            for (const index in result) {
              let len = result[index].leaf.length
              for (let i = 0; i < len; i++) {
                for (let j = i + 1; j < len; j++) {
                  if (result[index].leaf[i].text === result[index].leaf[j].text) {
                    result[index].leaf.splice(j, 1)
                    len--
                    j--
                  }
                }
              }
            }
            self.form.skuGorup = result
            self.form.skuGorup.splice()
          } else {
            const goodInfo = res.response.good_skus[0]
            self.form.price = goodInfo.price
            self.form.original_price = goodInfo.original_price
            self.form.cost_price = goodInfo.cost_price
            self.form.integral = goodInfo.integral
            self.form.integral_price = goodInfo.integral_price
            self.form.stock = goodInfo.stock
            self.form.skuList = []
          }
        } else {
          self.$message.error(res.msg)
        }
      }).catch(() => {
        self.$notification.error({
          message: '错误',
          description: '数据获取失败，请刷新重试！'
        })
      })
    },
    editorChange (value) {
      this.form.desc = value
    },
    handleSubmit () {
      console.log(this.form, 'this.form')
      const self = this
      if (!self.repeatBool) {
        return false
      }
      self.$refs.form.validate((valid) => {
        if (valid) {
          if (self.form.desc.trim() === '') {
            self.step = 1
            self.$message.info('请填写详情信息')
          } else {
            self.step = 0
            for (let i = 0; i < self.form.skuGorup.length; i++) {
              if (self.form.skuGorup[i].leaf.find((c) => c.text === '')) {
                self.$message.warning('请将商品规格的信息填写完整')
                return false
              }
            }
            // 参数赋值
            const params = JSON.parse(JSON.stringify(self.form))
            // 图片
            params.pictures = []
            self.form.pictureList.map((item) => {
              if (item.url) {
                params.pictures.push(item.url)
              }
            })
            params.cover = params.pictures[0]
            const array = [].concat(JSON.parse(JSON.stringify(self.form.skuList)))
            const skulist = self.listChangeKey(array, [
              {
                old: 'skus',
                new: 'specs'
              }
            ])
            params.good_skus = skulist
            params.is_sku = self.form.is_sku
            if (self.form.skuGorup.length !== 0) {
              params.is_sku = true
            }
            if (!params.is_sku) {
              const skuObj = {
                stock: self.form.stock,
                price: self.form.price,
                original_price: self.form.original_price,
                cost_price: self.form.cost_price ? self.form.cost_price : 0
              }
              params.good_skus.push(skuObj)
            }
            if (params.goods_shippings.shipping_type === 2) {
              params.goods_shippings.shipping_price = 0
            }
            console.log(params, 'params')
            delete params.logisticWeight
            delete params.pictureList
            delete params.skuGorup
            delete params.skuPic
            delete params.skuList
            delete params.original_price
            delete params.price
            delete params.stock
            delete params.cost_price
            console.log(params, 'newparams')
            self.repeatBool = false
            let cmd = 'add'
            if (self.$route.query.id) {
              cmd = 'edit'
            }
            apiGoods(cmd, params)
              .then((res) => {
                console.log(res, 'res')
                if (res.code === 200) {
                  self.$message.success('保存成功')
                  this.$router.replace({
                    path: '/goods/list'
                  })
                }
                self.repeatBool = true
              })
              .catch(() => {
                self.$message.error('保存失败，请稍后重试！')
                self.repeatBool = true
              })
          }
        } else {
          self.$message.error('信息填写不完整')
        }
      })
    },
    // 添加规格
    addGroup () {
      if (this.form.skuGorup.length === 0) {
        // 去除库存价格验证
        this.$refs['form'].fields.forEach(function (e) {
          if (e.prop === 'stock' || e.prop === 'price') {
            e.resetField()
          }
        })
      }
      var id = this.form.skuGorup.length + 1
      this.form.skuGorup.push({
        id: id,
        text: '',
        leaf: []
      })
    },
    removeGroup (index) {
      const self = this
      self.$confirm({
        title: '提示',
        content: '确定要删除该组规格吗,删除后将无法恢复？',
        onOk () {
          if (index === 0) {
            self.form.skuPic = false
          }
          self.form.skuGorup.splice(index, 1)
          self.$message.success('删除成功')
        }
      })
    },
    // 点击添加规格值
    addItem (index) {
      var id = this.form.skuGorup[index].leaf.length + 1
      if (index === 0) {
        this.form.skuGorup[index].leaf.push({
          id: id,
          picture: [{ url: '' }],
          text: ''
        })
      } else {
        this.form.skuGorup[index].leaf.push({
          id: id,
          text: ''
        })
      }
    },
    RemoveItem (key, k) {
      this.form.skuGorup[key].leaf.splice(k, 1)
    },
    // 点击规格图片显示大图
    viewSkuPic (file) {
      this.img = file.url
      this.visible = true
    },
    // sku图片删除
    removeSkuPic (file, index) {
      this.form.skuGorup[0].leaf[index].picture = [
        {
          url: ''
        }
      ]
      this.$forceUpdate()
    },
    // 规格图片上传成功
    SkuPicSuccess (value, index) {
      const a = JSON.stringify(value)
      if (a !== '[]') {
        this.form.skuGorup[0]['leaf'][index].picture = [{ url: value[0].url }]
        this.form.skuGorup.splice()
      }
    },
    // 批量设置
    SetAllPrice (type) {
      this.visibleInput = true
      this.placeholder = type === '2' ? '请输入库存' : type === '6' ? '请输入金豆数量' : '请输入价格'
      this.batchType = type
    },
    batchModalOk () {
      const self = this
      if ((self.batchType === '2' || self.batchType === '6') && !/^[0-9]+$/.test(self.batchValue)) {
        self.$message.error('请输入正确的库存')
        return false
      }
      if (self.batchType !== '2' && self.batchType !== '6' && !/^-?\d+\.?\d{0,2}$/.test(self.batchValue)) {
        self.$message.error('价格最多支持两位小数')
        return false
      }
      self.form.skuList.forEach((val) => {
        if (self.batchType === '1') {
          val.price = Number(self.batchValue)
        } else if (self.batchType === '2') {
          val.stock = Number(self.batchValue)
        } else if (self.batchType === '3') {
          val.original_price = Number(self.batchValue)
        } else if (self.batchType === '4') {
          val.cost_price = Number(self.batchValue)
        }
      })
      self.form.skuList.splice()
      self.visibleInput = false
      self.batchValue = null
      self.$forceUpdate()
    },
    // 选中添加图片触发
    changeSkuPic (data) {
      if (this.form.skuGorup.length > 0) {
        this.form.skuGorup[0]['leaf'].forEach((item) => {
          item['picture'] = [
            {
              url: ''
            }
          ]
        })
      }
    },
    // 获取商品分类
    getCategoryList () {
      getCategoryList().then((res) => {
        if (res.code === 200) {
          res.response.unshift({ id: -1, name: '全部' })
          this.categoriesList = res.response
        }
      })
    },
    // 获取运费模板列表
    getTemplateList () {
      const self = this
      // TODO
      getFreightList().then((res) => {
        if (res.code === 200) {
          self.templateList = res.response.data
        } else {
          self.$message.error(res.msg)
        }
      })
    },
    // 上一步
    prev () {
      this.step = 0
    },
    // 下一步
    next () {
      this.step = 1
    },
    // 拖动图片
    draggaEnd () {
      this.form.pictureList = this.form.pictureList.slice(0)
    },
    // 点击显示大图片
    handleView (data) {
      this.img = data.url
      this.visible = true
    },
    // 点击删除图片
    handleRemove (item, index) {
      this.form.pictureList.splice(index, 1)
    }
  }
}
</script>
<style scoped lang='less'>
.flex {
  display: flex;
}
.more-set {
  cursor: pointer;
}
.tools-bar {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0px;
  left: 256px;
  height: 50px;
  padding: 10px 0;
  background-color: #fff;
  box-shadow: 0 0px 5px rgba(0, 0, 0, 0.1);
  z-index: 999;
}
.ant-layout-footer {
  display: none !important;
}
h4 {
  font-weight: 700;
}
</style>
