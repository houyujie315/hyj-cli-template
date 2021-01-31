<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="/" target="_blank">{{ company }} Copyright &copy; {{ year }} 版权所有</a>
    </template>
    <template v-slot:copyright>

    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  },
  data () {
    return {
       company: process.env.VUE_APP_WEBMGR_COMPANY,
       year: new Date().getFullYear()
    }
  }
}
</script>
