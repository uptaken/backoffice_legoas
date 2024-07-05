<script>

// import CKEditor from 'ckeditor4-vue'

import Layout from "../../../layouts/main";
import CustomEditor from "../../../layouts/CustomEditor";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
// import moment from 'moment'
import $ from 'jquery'
import imageBase from 'image-to-base64'
import Base from "@/Utils/base";

const base = new Base()

import {
    required,

} from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * WA Number component
 */
export default {
    page: {
        title: "WA Number",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { 
        Layout, 
        PageHeader, 
        CustomEditor
        // ckeditor: CKEditor.component 
    },
    data() {
        return {
            tableData: [],
            title: "WA Number",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "WA Number",
                    active: true
                }
            ],
            form: {
              name: '',
              phone: '',
              email: '',
            },
            submitted: false,
            submitform: false,
            submit: false,
            typesubmit: false,
            editorData: "",
            editorDisabled: false,
            is_view_only: false,
            image_data: { image_display: '', data_image: '' },
            editorConfig: base.editorConfig
        };
    },
    watch: {
      form: {
        handler: function(val) {
          if(val.phone != null && val.phone != '')
            this.$set(this.form, 'phone', base.phone_validation(val.phone))
        },
        deep: true,
      }
    },
    validations: {
        form: {
            subtitle: { required },
        },
    },
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.tableData.length;
        }
    },
    async mounted() {
      if (this.$route.params.id != null) {
        base.save_current_page('Edit WA Number')
        this.is_view_only = true
        this.get_data()
      }
      else
        base.save_current_page('Add WA Number')
    },
    methods: {
      async get_data() {
        $('#please_wait_modal').modal('show')
        var url = base.url_api + '/wa-number?id=' + this.$route.params.id
        var response = await base.request(url);

        setTimeout(() => {
          $('#please_wait_modal').modal('hide')
        }, 500)
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            this.form = response_data
          }
        }
      },
      async action_btn(type) {
        var url = base.url_api + '/wa-number'
        var data = this.form
        if (type === 'edit') {
          if (this.is_view_only) {
              this.is_view_only = false
          }
          else {
            if(data.phone == '')
              base.show_error('Phone is Empty')
            else{
              $('#please_wait_modal').modal('show')

              if (this.$route.params.id != null) {
                  url += '/edit'
              }

              var response = await base.request(url, 'post', data);

              setTimeout(() => {
                $('#please_wait_modal').modal('hide')
              }, 500)
              
              if (response != null) {
                if (response.status == "success") {
                  window.location.href = '/wa-number'
                }
                else
                  base.show_error(response.message)
              }
              else
                base.show_error('Server Error')
            }

          }
        }
        else if (type === 'delete') {
          if (confirm('Are you sure want to delete this data?')) {
            response = await base.request(url, 'delete', data);

            if (response != null) {
              if (response.status == "success") {
                window.location.replace('/wa-number')
              }
              else
                base.show_error(response.message)
            }
            else
              base.show_error('Server Error')
          }
        }
        else if (type === 'back') {
          window.history.back()
        }
      },
    }
};
</script>

<template>
    <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-12 mt-3">
                <div class="form-group">
                  <label>Phone</label>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">+62</span>
                    </div>
                    <input v-model="form.phone" type="text" class="form-control" placeholder="Phone" :readonly="is_view_only" />
                  </div>
                </div>
              </div>

              <div class="col-12 mt-3">
                <button class="btn btn-primary mr-1" @click="action_btn('edit')">{{ is_view_only ? 'Edit' : 'Save' }} WA Number</button>
                <button class="btn btn-danger ml-1" @click="action_btn('delete')" v-if="this.$route.params.id != null">Delete WA Number</button>

                <button class="btn btn-warning ml-1" @click="action_btn('back')">Cancel</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
</template>