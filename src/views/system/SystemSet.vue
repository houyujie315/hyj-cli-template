<template>
  <div class="system">
    <a-card>
      <a-form-model :model="systemData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="App名称" class="index-one">
          <div class="flex">
            <p v-if="appnameIsEidt==false">{{ systemData.appname?systemData.appname:'-' }}</p>
            <a-input v-if="appnameIsEidt==true" v-model="appname" class="index-five"></a-input>
            <a-button
              v-if="appnameIsEidt==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="appnameIsEidt=true;appname=systemData.appname"
            >修改</a-button>
            <span v-if="appnameIsEidt==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.appname=appname;EditSystem();appnameIsEidt=false"
              >确定</a-button>
              <a-button size="small" class="index-two" type="dashed" @click="appnameIsEidt=false;">取消</a-button>
            </span>
          </div>
        </a-form-model-item>

        <a-form-model-item label="logo图标" class="picture-upload-list index-one">
          <div class="flex" style="align-items: center">
            <div class="picture-upload-item" v-if="systemData.logo">
              <template>
                <img :src="systemData.logo | setImgUrl('',1)" />
                <div class="picture-upload-list-cover">
                  <a-icon type="eye-o" @click="Img_logo=systemData.logo;logoVisible=true;"></a-icon>
                  <a-icon type="delete" @click.native="logoRemove(systemData.logo)"></a-icon>
                </div>
              </template>
            </div>
            <s-upload
              @uploadListDataRes="(value)=>{logoSuccess(value)}"
              :limitNum="1"
              :isShowList="false"
              uploadStyle="width: 60px;height: 60px;line-height: 60px;"
              :uploadListData="[{url:systemData.logo}]"
              v-if="systemData.logo==''"
            ></s-upload>
          </div>
          <a-modal title="预览图片" v-model="logoVisible">
            <img style="width:100%" :src="Img_logo" v-if="logoVisible" />
            <div slot="footer"></div>
          </a-modal>
        </a-form-model-item>

        <a-form-model-item label="公司名称" class="index-one">
          <div class="flex">
            <p v-if="companyIsEdit==false">{{ systemData.company?systemData.company:'-' }}</p>
            <a-input v-if="companyIsEdit==true" v-model="company" class="index-five"></a-input>
            <a-button
              v-if="companyIsEdit==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="companyIsEdit=true;company=systemData.company"
            >修改</a-button>
            <span v-if="companyIsEdit==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.company=company;EditSystem();companyIsEdit=false;"
              >确定</a-button>
              <a-button size="small" class="index-two" type="dashed" @click="companyIsEdit=false;">取消</a-button>
            </span>
          </div>
        </a-form-model-item>

        <a-form-model-item label="宣传语" class="index-one">
          <div class="flex">
            <p v-if="sloganIsEdit==false">{{ systemData.slogan?systemData.slogan:'-' }}</p>
            <a-input v-if="sloganIsEdit==true" type="textarea" v-model="slogan" class="index-five"></a-input>
            <a-button
              v-if="sloganIsEdit==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="sloganIsEdit=true;slogan=systemData.slogan"
            >修改</a-button>
            <span v-if="sloganIsEdit==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.slogan=slogan;EditSystem();sloganIsEdit=false"
              >确定</a-button>
              <a-button size="small" class="index-two" type="dashed" @click="sloganIsEdit=false;">取消</a-button>
            </span>
          </div>
        </a-form-model-item>

        <a-form-model-item label="官网地址" class="index-one">
          <div class="flex">
            <p v-if="weburlIsEdit==false">{{ systemData.weburl?systemData.weburl:'-' }}</p>
            <a-input v-if="weburlIsEdit==true" v-model="weburl" class="index-five"></a-input>
            <a-button
              v-if="weburlIsEdit==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="weburlIsEdit=true;weburl=systemData.weburl"
            >修改</a-button>
            <span v-if="weburlIsEdit==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.weburl=weburl;EditSystem();weburlIsEdit=false"
              >确定</a-button>
              <a-button size="small" class="index-two" type="dashed" @click="weburlIsEdit=false;">取消</a-button>
            </span>
          </div>
        </a-form-model-item>

        <a-form-model-item label="联系电话" class="index-one">
          <div class="flex">
            <p v-if="telIsEdit==false">{{ systemData.tel?systemData.tel:'-' }}</p>
            <a-input v-if="telIsEdit==true" v-model="tel" class="index-five"></a-input>
            <a-button
              v-if="telIsEdit==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="telIsEdit=true;tel=systemData.tel"
            >修改</a-button>
            <span v-if="telIsEdit==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.tel=tel;EditSystem();telIsEdit=false"
              >确定</a-button>
              <a-button size="small" class="index-two" type="dashed" @click="telIsEdit=false;">取消</a-button>
            </span>
          </div>
        </a-form-model-item>

        <a-form-model-item label="联系传真" class="index-one">
          <div class="flex">
            <p v-if="faxIsEdit==false">{{ systemData.fax?systemData.fax:'-' }}</p>
            <a-input v-if="faxIsEdit==true" v-model="systemData.fax" class="index-five"></a-input>
            <a-button
              v-if="faxIsEdit==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="faxIsEdit=true;fax=systemData.fax"
            >修改</a-button>
            <span v-if="faxIsEdit==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.fax=fax;EditSystem();faxIsEdit=false"
              >确定</a-button>
              <a-button size="small" class="index-two" type="dashed" @click="faxIsEdit=false;">取消</a-button>
            </span>
          </div>
        </a-form-model-item>

        <a-form-model-item label="联系Q Q" class="index-one">
          <div class="flex">
            <p v-if="qqIsEdit==false">{{ systemData.qq?systemData.qq:'-' }}</p>
            <a-input v-if="qqIsEdit==true" v-model="qq" class="index-five"></a-input>
            <a-button
              v-if="qqIsEdit==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="qqIsEdit=true;qq=systemData.qq"
            >修改</a-button>
            <span v-if="qqIsEdit==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.qq=qq;EditSystem();qqIsEdit=false"
              >确定</a-button>
              <a-button size="small" class="index-two" type="dashed" @click="qqIsEdit=false;">取消</a-button>
            </span>
          </div>
        </a-form-model-item>

        <a-form-model-item label="联系邮箱" class="index-one">
          <div class="flex">
            <p v-if="mailIsEdit==false">{{ systemData.mail?systemData.mail:'-' }}</p>
            <a-input v-if="mailIsEdit==true" v-model="mail" class="index-five"></a-input>
            <a-button
              v-if="mailIsEdit==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="mailIsEdit=true;mail=systemData.mail"
            >修改</a-button>
            <span v-if="mailIsEdit==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.mail=mail;EditSystem();mailIsEdit=false"
              >确定</a-button>
              <a-button size="small" class="index-two" type="dashed" @click="mailIsEdit=false;">取消</a-button>
            </span>
          </div>
        </a-form-model-item>

        <a-form-model-item label="微信账号" class="index-one">
          <div class="flex">
            <p v-if="wechat_idIsEdit==false">{{ systemData.wechat_id?systemData.wechat_id:'-' }}</p>
            <a-input v-if="wechat_idIsEdit==true" v-model="wechat_id" class="index-five"></a-input>
            <a-button
              v-if="wechat_idIsEdit==false"
              size="small"
              class="index-two"
              type="dashed"
              @click="wechat_idIsEdit=true;wechat_id=systemData.wechat_id"
            >修改</a-button>
            <span v-if="wechat_idIsEdit==true">
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="systemData.wechat_id=wechat_id;EditSystem();wechat_idIsEdit=false"
              >确定</a-button>
              <a-button
                size="small"
                class="index-two"
                type="dashed"
                @click="wechat_idIsEdit=false;"
              >取消</a-button>
            </span>
          </div>
        </a-form-model-item>
        <a-form-model-item label="微信图片" class="picture-upload-list">
          <div class="flex" style="align-items: center">
            <div class="picture-upload-item" v-if="systemData.wechat_img">
              <template>
                <img :src="systemData.wechat_img | setImgUrl('',1)" />
                <div class="picture-upload-list-cover">
                  <a-icon
                    type="eye-o"
                    @click="Img_wechat_img=systemData.wechat_img;wechat_imgVisible=true;"
                  ></a-icon>
                  <a-icon
                    type="delete"
                    @click.native="wechat_imgRemove(systemData.wechat_img)"
                  ></a-icon>
                </div>
              </template>
            </div>
            <s-upload
              @uploadListDataRes="(value)=>{wechat_imgSuccess(value)}"
              :limitNum="1"
              :isShowList="false"
              uploadStyle="width: 60px;height: 60px;line-height: 60px;"
              :uploadListData="[{url:systemData.wechat_img}]"
              v-if="systemData.wechat_img==''"
            ></s-upload>
          </div>
          <a-modal title="预览图片" v-model="wechat_imgVisible">
            <img style="width:100%" :src="Img_wechat_img" v-if="wechat_imgVisible" />
            <div slot="footer"></div>
          </a-modal>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>
<script>
import { SUpload } from '@/components'
export default {
  components: {
    SUpload
  },
  data () {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      systemData: {
        appname: '', // APP名称
        slogan: '', // 宣传语
        weburl: '', // 官网地址
        logo: '', // logo图标
        company: '', // 公司信息
        qq: '', // qq
        tel: '', // 联系电话
        fax: '', // 传真
        mail: '', // 邮箱
        wechat_id: '', // 微信号
        wechat_img: '' // 微信图片
      },
      appname: '', // APP名称
      slogan: '', // 宣传语
      weburl: '', // 官网地址
      logo: '', // logo图标
      company: '', // 公司信息
      qq: '', // qq
      tel: '', // 联系电话
      fax: '', // 传真
      mail: '', // 邮箱
      wechat_id: '', // 微信号
      wechat_img: '', // 微信图片

      appnameIsEidt: false, // APP名称修改
      logoVisible: false, // logo预览
      companyIsEdit: false, // 公司信息修改
      sloganIsEdit: false, // 宣传语
      weburlIsEdit: false, // 官网地址
      qqIsEdit: false, // qq
      telIsEdit: false, // 联系电话
      faxIsEdit: false, // 传真
      mailIsEdit: false, // 邮箱
      wechat_idIsEdit: false, // 微信号
      wechat_imgVisible: false // 微信图片
    }
  },
  created () {
  },
  methods: {
    // 删除微信图片
    wechat_imgRemove () {
      this.systemData.wechat_img = ''
      this.EditSystem()
    },
    // 删除logo图片
    logoRemove () {
      this.systemData.logo = ''
      this.EditSystem()
    },
    // 选择图片赋值 logo
    logoSuccess (value) {
      this.systemData.logo = value.length > 0 ? value[0].url : ''
      if (value.length > 0) {
        this.EditSystem()
      }
    },
    wechat_imgSuccess (value) {
      this.systemData.wechat_img = value.length > 0 ? value[0].url : ''
      if (value.length > 0) {
        this.EditSystem()
      }
    },
    // 保存设置
    EditSystem () {},
    // 获取系统设置
    systemInfo () {}
  }
}
</script>

<style lang="less" scoped>
.system {
  .index-one {
    margin: 0px !important;
  }
  .index-two {
    margin-left: 20px;
    height: 30px;
  }
  .index-five {
    width: 300px !important;
  }
}
.flex {
  display: flex;
  align-items: center;
}
</style>
