<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "@/views/layouts/main";
  import PageHeader from "@/components/page-header";
  import appConfig from "@/app.config";
  import $ from 'jquery'
  import Base from "@/Utils/base";
  import imageBase from 'image-to-base64'

  const base = new Base()

  export default {
    page: {
      title: "Image Logo",
      meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader, },
    data() {
      return {
        base: null,
        title: "Image Logo",
        items: [
          {
            text: "Content Management",
            href: "/",
          },
          {
            text: "Image Logo",
            active: true,
          },
        ],
        id: '',
        form: {
            subtitle: "",
        },
        submitted: false,
        submitform: false,
        submit: false,
        typesubmit: false,
        editorData: "",
        editorDisabled: false,
        is_view_only: false,
        image_data: { image_display: '', data_image: '' },
        progress: 0,
      };
    },
    async created() {
      this.base = new Base()
      
      base.save_current_page('Image Logo', true)
      this.get_data()
    },
    methods: {
      async get_data() {
        $('#please_wait_modal').modal('show')
        var url = base.url_api + '/info/logo'
        var response = await base.request(url);
    
        setTimeout(() => {
          $('#please_wait_modal').modal('hide')
        }, 500)
        
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            this.form = response_data[0]

            this.image_data = {
              image_display: response_data[0].url_image,
              data_image: '',
            }
          }
        }
      },
      async onSubmit() {
        if(this.image_data.data_image == '')
          base.show_error('Image is Empty')
        else{
          $('#please_wait_modal').modal('show')
          
          var form = JSON.parse(JSON.stringify(this.form))
          if (this.image_data.data_image !== '')
            form.image_logo = this.image_data.data_image
          
          var response = await base.request(base.url_api + '/info/edit', 'post', form)
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
      choose_image() {
        $('#input_image').trigger('click')
      },
      async change_image(event) {
        const image = new Image()
        image.src = URL.createObjectURL(event.target.files[0])
        image.onload = async () => {
          const { height, width } = image
          
          this.image_data = {
            image_display: URL.createObjectURL(event.target.files[0]),
            data_image: await imageBase(URL.createObjectURL(event.target.files[0])),
          }
        }
      },
    },
  };
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="col-6 col-lg-3 mt-3" v-if="image_data.image_display !== ''">
          <div class="row">
            <div class="col-12">
              <img class="rounded mr-2" width="100%" :src="image_data.image_display" data-holder-rendered="true" />
            </div>
          </div>
        </div>
        
        <div class="col-12 mt-2" v-if="!is_view_only">
          <input type="file" class="d-none" accept="image/*" id="input_image" @change="change_image($event)" />
          <button class="btn btn-primary" @click="choose_image">Choose Image</button>
        </div>
        
        <div class="form-group mt-3">
          <button class="btn btn-primary" @click="onSubmit">Submit</button>
        </div>
      </div>
    </div>
  </Layout>
</template>
