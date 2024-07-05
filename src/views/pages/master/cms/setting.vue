<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "@/views/layouts/main";
  import PageHeader from "@/components/page-header";
  import appConfig from "@/app.config";
  import EditSetting from "@/views/pages/master/cms/setting/edit_setting";
  import $ from 'jquery'
  import Base from "@/Utils/base";
  import imageBase from 'image-to-base64'

  const base = new Base()

  export default {
    page: {
      title: "Setting",
      meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader, EditSetting, },
    data() {
      return {
        base: null,
        title: "Setting",
        items: [
          {
            text: "Content Management",
            href: "/",
          },
          {
            text: "Setting",
            active: true,
          },
        ],
        id: '',
        data: {},
        key: '',
        value: '',
        progress: 0,
      };
    },
    async created() {
      this.base = new Base()
      
      base.save_current_page('Setting', true)
      this.get_data()
    },
    watch: {
      key(val){
        $('#editSetting').modal('show')
      }
    },
    methods: {
      async get_data() {
        $('#please_wait_modal').modal('show')
        var response = await base.request(base.url_api + '/setting')
    
        setTimeout(() => {
          $('#please_wait_modal').modal('hide')
        }, 500)
        
        if (response != null) {
          if (response.status == "success") {
            var data = {}
            for(let setting of response.data)
              data[setting.key] = setting.value
            this.data = data
          }
          else
            base.show_error(response.message)
        }
        else
          base.show_error('Server Error')
      },
      onEdit(index){
        this.key = index
        this.value = this.data[index]
      },
      onClose(){
        this.key = ""
        this.value = ""
      },
    },
  };
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="">
      <div class="row">
        <div v-for="(value, index) in data" :key="index" class="col-3">
          <div class="card">
            <div class="card-title d-flex align-items-center justify-content-between p-3">
              {{ base.capitalizeFirstLetter(index) }}
              <button class="btn btn-primary" @click="onEdit(index)">Edit</button>
            </div>
            <div class="card-body">
              {{ value }}
            </div>
          </div>
        </div>
      </div>
      
      <EditSetting :keyValue="key" :value="value" @onClose="onClose"/>
    </div>
  </Layout>
</template>
