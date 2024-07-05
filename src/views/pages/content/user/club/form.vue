<script>

// import CKEditor from 'ckeditor4-vue'

import Layout from "@/views/layouts/main";
import CustomEditor from "@/views/layouts/CustomEditor";
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
 * Club component
 */
export default {
    page: {
        title: "Club",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { 
        Layout, 
        PageHeader, 
        CustomEditor,
        // ckeditor: CKEditor.component 
    },
    data() {
        return {
            tableData: [],
            title: "Club",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Club",
                    active: true
                }
            ],
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
            editorConfig: base.editorConfig,
            arr_category_sport: [],
        };
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
    async created() {
      
        // Set the initial number of items
        if (this.$route.params.id != null) {
          base.save_current_page('Edit Club')
            this.is_view_only = true
            this.get_data()
        }
        else
          base.save_current_page('Add Club')
        this.get_category_sport()
    },
    methods: {
        async get_data() {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/user/club?id=' + this.$route.params.id
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
                if (response.status == "success") {
                    var response_data = response.data
                    response_data.phone = response_data.phone.substring(3)
                    this.form = response_data
                }
            }
        },
        async change_type() {
          if(confirm('Are you sure to change this club user to school?')){
            $('#please_wait_modal').modal('show')
            var response = await base.request(base.url_api + '/user/change-type', 'post', {
              id: this.form.id,
              to_type: 'school',
            });
        
            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
              if (response.status == "success") {
                window.location.reload()
              }
            }
          }
        },
        async get_category_sport() {
          $('#please_wait_modal').modal('show')
          var url = base.url_api + '/category-sport/all'
          var response = await base.request(url);

          setTimeout(() => {
            $('#please_wait_modal').modal('hide')
          }, 500)
          if (response != null) {
            if (response.status == "success") {
              this.arr_category_sport = response.data
            }
          }
        },
        async action_btn(type) {
          var url = base.url_api + '/user/club'
          var data = this.form
          if (type === 'edit') {
            if (this.is_view_only)
              this.is_view_only = false
            else {

              if(this.form.name == '')
                base.show_error('Name is Empty')
              else if (this.form.email == '')
                base.show_error('Email is Empty')
              else if (this.form.phone == '')
                base.show_error('Phone is Empty')
              else if (this.form.address == '')
                base.show_error('Address is Empty')
              else {
                $('#please_wait_modal').modal('show')

                var method = 'post'

                if (this.$route.params.id != null)
                    url += '/edit'

                var response = await base.request(url, method, data);

                setTimeout(() => {
                  $('#please_wait_modal').modal('hide')
                }, 500)
                if (response != null) {
                  if (response.status == "success") {
                    base.back_page()
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
              $('#please_wait_modal').modal('show')
              response = await base.request(url + '/delete', 'get', data);

              setTimeout(() => {
                $('#please_wait_modal').modal('hide')
              }, 500)
              if (response != null) {
                if (response.status == "success") {
                  base.back_page()
                }
                else
                  base.show_error(response.message)
              }
              else
                base.show_error('Server Error')
            }
          }
          else if (type === 'back') {
            base.back_page()
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
                <div class="col-12">
                  <button class="btn btn-primary" v-on:click="change_type" v-if="this.$route.params.id != null">Change to School</button>
                </div>
                
                <div class="col-12">
                  <div class="form-group">
                    <label>Name</label>
                    <input v-model="form.name" type="text" class="form-control" placeholder="Name" :readonly="is_view_only" />
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group">
                    <label>Category Sport</label>
                    <select v-model="form.category_sport_id" class="form-control" :disabled="is_view_only">
                      <option value="">Choose Category Sport</option>
                      <option v-for="(category_sport, index) in arr_category_sport" :key="index" :value="category_sport.id">{{ category_sport.name }}</option>
                    </select>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-group">
                    <label>Address</label>
                    <textarea v-model="form.address" class="form-control" placeholder="Address" :readonly="is_view_only"></textarea>
                  </div>
                </div>

                <div class="col-12">
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

                <div class="col-12">
                  <div class="form-group">
                    <label>Email</label>
                    <input v-model="form.email" type="email" class="form-control" placeholder="Email" :readonly="is_view_only" />
                  </div>
                </div>

                <div class="col-12 mt-3">
                  <button class="btn btn-primary mr-1" v-on:click="action_btn('edit')">{{ is_view_only ? 'Edit' : 'Save' }} Club</button>
                  <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')" v-if="this.$route.params.id != null">Delete Club</button>

                  <button class="btn btn-warning ml-1" v-on:click="action_btn('back')">Cancel</button>
                </div>

              </div>
            </div>
        </div>
      </div>
    </div>
  </Layout>
</template>