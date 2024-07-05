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
 * Coordinator component
 */
export default {
    page: {
        title: "Coordinator",
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
            title: "Coordinator",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Coordinator",
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

        // Set the initial number of items
        if (this.$route.params.id != null) {
            base.save_current_page('Edit Coordinator')
            this.is_view_only = true
            this.get_data()
        }
        else
            base.save_current_page('Add Coordinator')
    },
    methods: {
        async get_data() {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/coordinator?id=' + this.$route.params.id
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
            var url = base.url_api + '/coordinator'
            var data = this.form
            if (type === 'edit') {
                if (this.is_view_only) {
                    this.is_view_only = false
                }
                else {
                  if(data.name == '')
                    base.show_error('Name is Empty')
                  else if(data.phone == '')
                    base.show_error('Phone is Empty')
                  else if(data.email == '')
                    base.show_error('Email is Empty')
                  else if(!base.validate_email(data.email))
                    base.show_error('Email is not in Email Format')
                  else{

                    // this.submitted = true;
                    // this.$v.$touch();

                    // if (this.$v.$invalid) {
                    //     return;
                    // }
                    // else {
                    $('#please_wait_modal').modal('show')
                        var method = 'post'

                        if (this.$route.params.id != null) {
                            url += '/edit'
                        }

                        var response = await base.request(url, method, data);

                        setTimeout(() => {
                          $('#please_wait_modal').modal('hide')
                        }, 500)
                        if (response != null) {
                            if (response.status == "success") {
                                window.location.href = '/coordinator'
                            }
                            else
                              base.show_error(response.message)
                          }
                          else
                            base.show_error('Server Error')
                    // }
                  }

                }
            }
            else if (type === 'delete') {
                var flag_delete = 1

                if (confirm('Are you sure want to delete this data?') == true) {
                    flag_delete = 1
                }
                else {
                    flag_delete = 0
                }

                if (flag_delete) {
                    response = await base.request(url, 'delete', data);

                    if (response != null) {
                        if (response.status == "success") {
                            window.location.replace('/coordinator')
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
                                <label>Name</label>
                                <input v-model="form.name" type="text" class="form-control" placeholder="Name" :readonly="is_view_only" />
                              </div>
                            </div>

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
                              <div class="form-group">
                                <label>Email</label>
                                <input v-model="form.email" type="email" class="form-control" placeholder="Email" :readonly="is_view_only" />
                              </div>
                            </div>

                            <div class="col-12 mt-3">
                                <button class="btn btn-primary mr-1" @click="action_btn('edit')">{{ is_view_only ? 'Edit' : 'Save' }} Coordinator</button>
                                <button class="btn btn-danger ml-1" @click="action_btn('delete')" v-if="this.$route.params.id != null">Delete Coordinator</button>

                                <button class="btn btn-warning ml-1" @click="action_btn('back')">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>