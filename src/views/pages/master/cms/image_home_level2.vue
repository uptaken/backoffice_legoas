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
      title: "Image Home Level 2",
      meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader, },
    data() {
      return {
        base: null,
        title: "Image Home Level 2",
        items: [
          {
            text: "Content Management",
            href: "/",
          },
          {
            text: "Image Home Level 2",
            active: true,
          },
        ],
        id: '',
        form: {
            subtitle: "",
        },
        arr_data: [],
        submitted: false,
        submitform: false,
        submit: false,
        typesubmit: false,
        editorData: "",
        editorDisabled: false,
        is_view_only: false,
        image_data: { image_display: '', data_image: '' },
        arr_image_data: [],
        progress: 0,
      };
    },
    async created() {
      this.base = new Base()
      
      base.save_current_page('Image Home Level 2', true)
      this.get_data()
    },
    methods: {
      async get_data() {
        $('#please_wait_modal').modal('show')
        var url = base.url_api + '/info/home/banner-level2'
        var response = await base.request(url);
    
        setTimeout(() => {
          $('#please_wait_modal').modal('hide')
        }, 500)
        
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            this.arr_data = response_data

            for(let data of response_data)
              this.arr_image_data.push({
                image_display: data.url_image,
                data_image: '',
              })
          }
        }
      },
      async onSubmit(){
        var flag = false
        for(let x in this.arr_image_data){
          if(this.arr_image_data[x].data_image == ''){
            base.show_error('Image ' + (parseInt(x) + 1) + ' is Empty')
            flag = true
            break
          }
        }
        
        if(!flag){
          $('#please_wait_modal').modal('show')
          
          for(let x in this.arr_data)
            await this.onSubmitAction(x)
            
          $('#please_wait_modal').modal('hide')
        }
      },
      async onSubmitAction(index) {
        var form = JSON.parse(JSON.stringify(this.arr_data[index]))
        if (this.arr_image_data[index].data_image !== '')
          form.image_banner_home_level2 = this.arr_image_data[index].data_image
        
        var response = await base.request(base.url_api + '/info/edit', 'post', form)
        
        if (response != null) {
          if (response.status != "success")
            base.show_error(response.message)
        }
        else
          base.show_error('Server Error')
      },
      choose_image(index) {
        $('#input_image' + index).trigger('click')
      },
      async change_image(event, index) {
        const image = new Image()
        image.src = URL.createObjectURL(event.target.files[0])
        image.onload = async () => {
          const { height, width } = image
          
          this.$set(this.arr_image_data, index, {
            image_display: URL.createObjectURL(event.target.files[0]),
            data_image: await imageBase(URL.createObjectURL(event.target.files[0])),
          })
        }
      },
    },
  };
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row" >
      <div class="col-12" v-for="(data, index) in arr_data" :key="index">
        <div class="col-6 col-lg-3 mt-3" v-if="arr_image_data[index].image_display !== ''">
          <div class="row">
            <div class="col-12">
              <img class="rounded mr-2" width="100%" :src="arr_image_data[index].image_display" data-holder-rendered="true" />
            </div>
          </div>
        </div>
        
        <div class="col-12 mt-2">
          <input type="file" class="d-none" accept="image/*" :id="'input_image' + index" @change="change_image($event, index)" />
          <button class="btn btn-primary" @click="choose_image(index)">Choose Image</button>
        </div>
      </div>
      
      <div class="col-12">
        <div class="form-group mt-3">
          <button class="btn btn-primary" @click="onSubmit">Submit</button>
        </div>
      </div>
    </div>
  </Layout>
</template>
