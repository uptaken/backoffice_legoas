<template>
  <div id="app">
    <router-view />

    <CustomPleaseWait :progress="0"/>
  </div>
</template>

<script>
import momentTZ from 'moment-timezone'
import moment from 'moment'

import appConfig from "@/app.config";
import Base from "@/Utils/base";
import CustomPleaseWait from "@/views/layouts/CustomPleaseWait";

export default {
  name: "app",
  components: {
    'CustomPleaseWait': CustomPleaseWait,
  },
	data(){
		return {
			base: null,
		}
	},
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === "function" ? title(this.$store) : title;
      return title ? `${title} | ${appConfig.title}` : appConfig.title;
    }
  },
  async created(){
		this.base = new Base()

		if(process.env.VUE_APP_BACKEND_URL == null){
			this.base.show_error("env doesn't exist")
		}

    // }
  },
  async mounted(){


		var token_expired = await window.localStorage.getItem('token_expired')
		if(token_expired != null)
			token_expired = moment(token_expired, 'YYYY-MM-DD HH:mm:ss')


		if(token_expired != null && token_expired.isBefore(moment())){
			this.base.show_error("Token Expired! Please login again")
			window.localStorage.removeItem('token')
			window.localStorage.removeItem('token_expired')

			window.location.href = "/login"
			return
		}

		const last_version = localStorage.getItem('version')
		if (last_version == null || (last_version != null && last_version !== this.base.app_version)) {
			localStorage.setItem('version', this.base.app_version)
			window.location.reload(true);
		}

    var arr = [
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
      'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js',
    ]

    this.addScript(arr)


    // setTimeout(() => {
    //   window.$('#please_wait_modal').modal('show')
    // }, 1000)
  },
  methods: {
    addScript(arr, index = 0){
      var scriptTag = document.createElement("script");
      scriptTag.src = arr[index];
      document.getElementsByTagName('head')[0].appendChild(scriptTag);

      if(arr[index + 1] != null){
        var context = this
        setTimeout(() => {
          context.addScript(arr, index + 1)
        }, 100)
      }
      // else
      //   window.$('#please_wait_modal').modal('hide')
    },
  },
};
</script>

<style type="text/css">
  .dt-buttons{
    display: inline-block;
  }
</style>