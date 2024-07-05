<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "@/views/layouts/main";
  import CustomEditor from "@/views/layouts/CustomEditor";
  import CustomTextarea from "@/views/layouts/CustomTextarea";
  import PageHeader from "@/components/page-header";
  import appConfig from "@/app.config";
  import $ from 'jquery'
  import Base from "@/Utils/base";
  import imageBase from 'image-to-base64'

  const base = new Base()

  export default {
    page: {
      title: "About Us",
      meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader, CustomEditor, CustomTextarea, },
    data() {
      return {
        base: null,
        title: "About Us",
        items: [
          {
            text: "Content Management",
            href: "/",
          },
          {
            text: "About Us",
            active: true,
          },
        ],
        data: {},
        progress: 0,
      };
    },
    async created() {
      this.base = new Base()
      base.save_current_page('About Us', true)
      this.get_data()
    },
    methods: {
      async get_data() {
        $('#please_wait_modal').modal('show')
        var response = await base.request(base.url_api + '/info/about-us')
      
        setTimeout(() => {
          $('#please_wait_modal').modal('hide')
        }, 500)
        
        if (response != null) {
          if (response.status == "success") {
            this.data = response.data[0]
          }
          else
            base.show_error(response.message)
        }
        else
          base.show_error('Server Error')
      },
      async onSubmit() {
        if(this.data_title == '')
          base.show_error('Title is Empty')
        else if(this.data_subtitle == '')
          base.show_error('SubTitle is Empty')
        else if(this.data_content == '')
          base.show_error('Content is Empty')
        else{
          $('#please_wait_modal').modal('show')
          var response = await base.request(base.url_api + '/info/edit', 'post', this.data)
          setTimeout(() => {
            $('#please_wait_modal').modal('hide')
          }, 500)
          
          if (response != null) {
            if (response.status == "success") {
              window.location.reload()
            }
            else
              base.show_error(response.message)
          }
          else
            base.show_error('Server Error')
        }
      },
    }
  };
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <!-- <CustomPleaseWait :progress="progress"/> -->

    <div class="row">
      <div class="col-12">
        <div class="form-group">
          <label>Title</label>
          <input type="text" class="form-control" v-model="data.title" />
        </div>
        
        <div class="form-group" v-for="(lang, index) in base.arr_lang_manual" :key="index">
          <label>Title (Language {{ lang }})</label>
          <input type="text" class="form-control" v-model="data['title_' + lang]" />
        </div>
        
        <div class="form-group">
          <label>SubTitle</label>
          <input type="text" class="form-control" v-model="data.subtitle" />
        </div>
        
        <div class="form-group" v-for="(lang, index) in base.arr_lang_manual" :key="index">
          <label>SubTitle (Language {{ lang }})</label>
          <input type="text" class="form-control" v-model="data['subtitle_' + lang]" />
        </div>
        
        <div class="form-group">
          <label>Content</label>
          <textarea class="form-control" v-model="data.content"></textarea>
        </div>
        
        <div class="form-group" v-for="(lang, index) in base.arr_lang_manual" :key="index">
          <label>Content (Language {{ lang }})</label>
          <textarea class="form-control" v-model="data['content_' + lang]"></textarea>
        </div>
        
        <div class="form-group">
          <button class="btn btn-primary" @click="onSubmit">Submit</button>
        </div>
      </div>
    </div>
  </Layout>
</template>
