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
      title: "Edit Setting",
      meta: [{ name: "description", content: appConfig.description }],
    },
    props: ["keyValue", "value", ],
    components: { Layout, PageHeader, },
    data() {
      return {
        base: null,
        title: "Edit Setting",
        items: [
          {
            text: "Content Management",
            href: "/",
          },
          {
            text: "Edit Setting",
            active: true,
          },
        ],
        id: '',
        temp: '',
        progress: 0,
      };
    },
    watch: {
      value(val){
        this.temp = val
      },
    },
    async created() {
      this.base = new Base()
      
    },
    methods: {
      async onSubmit() {
        if(this.temp == '')
          base.show_error(this.keyValue + ' is Empty')
        else{
          $('#please_wait_modal').modal('show')
          
          var response = await base.request(base.url_api + '/setting/edit', 'post', {
            key: this.keyValue,
            value: this.temp,
          })
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
    },
  };
</script>

<template>

    <div class="modal fade" id="editSetting" tabindex="-1" aria-labelledby="editSettingLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editSettingLabel">Edit {{ base.capitalizeFirstLetter(keyValue) }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="() => $emit('onClose')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label>{{ base.capitalizeFirstLetter(keyValue) }}</label>
              <div class="input-group" v-if="keyValue == 'phone' || keyValue == 'wa_phone'">
                <div class="input-group-prepend">
                  <span class="input-group-text">+62</span>
                </div>
                <input type="text" class="form-control" v-model="temp"/>
              </div>
              <textarea class="form-control" v-model="temp" v-else-if="keyValue == 'address' || keyValue == 'description'"></textarea>
              <input type="text" class="form-control" v-model="temp" v-else/>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="() => $emit('onClose')">Close</button>
            <button type="button" class="btn btn-primary" @click="onSubmit">Save changes</button>
          </div>
        </div>
      </div>
    </div>
</template>
