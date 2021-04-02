<template>
  <div class="demo-upload">
    <div v-if="isShowList">
      <div
        class="demo-upload-list"
        v-for="(item,index) in showImgList"
        :style="uploadStyle"
        :key="index"
      >
        <template>
          <img
            style="object-fit:cover"
            :src="item.url | setImgUrl('',300 )"
            @load="handleImgLoad($event, item)"
          />
          <div class="demo-upload-list-cover" :style="uploadStyle">
            <a-space>
              <a-icon type="eye-o" @click.native="handleViewImg(item)"></a-icon>
              <a-icon type="delete" @click.native="handleRemoveShowImgList(item,index)"></a-icon>
            </a-space>
          </div>
        </template>
      </div>
    </div>
    <a-upload
      v-show="canUploadNum>0"
      ref="upload"
      list-type="picture-card"
      :show-upload-list="false"
      :before-upload="handleBeforeUpload"
      :multiple="true"
      :data="{token:getImageData.token}"
      :action="action"
      :style="uploadStyle"
      @change="handleChange"
    >
      <div
        style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;"
        :style="uploadStyle"
      >
        <a-icon type="plus" />
      </div>
    </a-upload>
    <a-modal
      :title="visImgInfo.imgName"
      v-model="visImgInfo.visible"
      @ok="visImgInfo.visible = false"
      :styles="{width:'fit-content'}"
    >
      <div class="visImgModalBox">
        <img
          style="object-fit:contain"
          :src="visImgInfo.visImgUrl+'?imageMogr2/auto-orient'"
          :width="488"
          :height="488"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getToken } from '@/api/api'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    uploadStyle: {
      type: String,
      default: 'width:80px;height:80px'
    },
    isShowList: {
      type: Boolean,
      default: true
    },
    uploadListData: {
      type: Array,
      default: () => []
    },
    maxSize: {
      type: Number,
      default: 1024 * 5
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limitNum: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      showImgList: [],
      uploadList: [],
      visImgInfo: {
        imgName: '',
        visible: false,
        visImgUrl: '',
        modalWidth: 600,
        modalHeight: 800
      },
      timeout: 0,
      getImageData: {},
      action: 'http://up-z2.qiniup.com'
    }
  },
  computed: {
    canUploadNum () {
      console.log(this.limitNum - this.showImgList.length)
      return this.limitNum - this.showImgList.length
    },
    isMultiple () {
      if (!this.multiple || this.canUploadNum === 1) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    showImgList: {
      handler (value, oldValue) {
        if (value !== oldValue) {
          if (value.length > this.limitNum) {
            this.$message.error(`最多只能上传${this.limitNum}张图片`)
            this.$emit(
              'uploadListDataRes',
              value.splice(-1, value.length - this.limitNum)
            )
            this.$emit(
              'update:uploadListData',
              value.splice(-1, value.length - this.limitNum)
            )
          } else {
            this.$emit('uploadListDataRes', value)
            this.$emit('update:uploadListData', value)
          }
        }
      },
      deep: true
    },
    uploadListData: {
      handler (value) {
        console.log(value, 'handlervalue')
        if (value.some((v) => v.hasOwnProperty('check_code'))) {
          this.showImgList = value
        }
      },
      deep: true
    }
  },
  mounted () {
    if (process.env.NODE_ENV === 'development') {
      this.action = 'http://up-z0.qiniup.com'
    } else {
      this.action = 'http://up-z2.qiniup.com'
    }
    const newList = this.uploadListData.filter((item) => {
      return item.url !== undefined || ''
    })
    this.showImgList = this.handleCurrentList(newList)
    // 有空链接
    const res = this.uploadListData.some((v) => v.url === '')
    if (res) {
      this.showImgList = []
    }
  },
  methods: {
    handleImgLoad (event, file) {
      const width = event.path[0].naturalWidth
      const height = event.path[0].naturalHeight
      this.$set(file, 'width', width)
      this.$set(file, 'height', height)
    },
    // 查看图片
    handleViewImg (file) {
      this.visImgInfo = {
        visImgUrl: file.url,
        imgName: file.title,
        visible: false,
        width: 600,
        height: 800
      }
      const imgLoad = new Image()
      imgLoad.src = this.visImgInfo.visImgUrl
      imgLoad.onerror = () => {
        this.$message.error('图片加载失败')
      }
      imgLoad.onload = () => {
        // 等背景图片加载成功后 去除loading
        this.visImgInfo.visible = true
      }
    },
    // 删除图片
    handleRemoveShowImgList (file, index) {
      this.showImgList.splice(index, 1)
      this.$emit('uploadListDataRes', this.showImgList)
      this.$emit('update:uploadListData', this.showImgList)
    },
    // 上传之前
    handleBeforeUpload (file) {
      console.log(file, 'handleBeforeUpload')
      if (this.canUploadNum <= 0) {
        return false
      }
      return new Promise((resolve) => {
        var reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => {
          getToken()
            .then((res) => {
              if (res.code === 200) {
                this.getImageData = res.response
                const obj = {
                  url: res.response.path,
                  title: file.name,
                  isSelected: false,
                  selectedIndex: 1,
                  thumbnail_300: file.url,
                  check_code: '',
                  showProgress: false,
                  status: 'myuploading',
                  lastModified: file.lastModified
                }
                this.uploadList.push(obj)
                resolve()
              } else {
                this.$message.warning(res.msg)
              }
            })
            .catch(() => {
              this.$message.error('图片上传失败，请重新上传！')
            })
        }
      })
    },
    handleChange ({ file }) {
      console.log(file)
      if (file.status === 'done') {
        this.showImgList = [...this.showImgList, ...this.uploadList]
        this.uploadList = []
      }
    },
    handleCurrentList (list) {
      return list.map((item) => {
        return {
          ...item,
          status: 'finished',
          isSelected: false,
          selectedIndex: 1,
          title: item.hasOwnProperty('title') ? item.title : '查看图片',
          thumbnail_300: item.url
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.css";
.show-upload-cover {
  display: inline-block;
  width: 58px;
  height: 58px;
  line-height: 58px;
}
.show-upload-title {
  position: absolute;
  left: 0;
  width: 100px;
  bottom: -22px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.image-item .opts-seprate {
  padding: 0 3px;
  color: #a9a9a9;
}
.upload-image-modal {
  .ivu-tabs-content {
    height: 644px;
    overflow: hidden;
  }
}
.uploadTabs {
  .ivu-upload {
    display: inline-block;
  }
}
</style>
