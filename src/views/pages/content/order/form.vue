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
 * Scoring Type component
 */
export default {
    page: {
        title: "Scoring Type",
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
            title: "Scoring Type",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Scoring Type",
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
            editorConfig: base.editorConfig
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
    async mounted() {
      
        // Set the initial number of items
        if (this.$route.params.id != null) {
          base.save_current_page('Edit Scoring Type')
            this.is_view_only = true
            this.get_data()
        }
        else
          base.save_current_page('Add Scoring Type')
    },
    methods: {
        async get_data() {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/scoring-type?id=' + this.$route.params.id
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
            var url = base.url_api + '/scoring-type'
            var data = this.form
            if (type === 'edit') {
                if (this.is_view_only) {
                    this.is_view_only = false
                }
                else {

                    // this.submitted = true;
                    // this.$v.$touch();

                    // if (this.$v.$invalid) {
                    //     return;
                    // }
                    // else {
                    $('#please_wait_modal').modal('show')
                        data.is_publish = 1

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
                              base.back_page()
                            }
                        }
                    // }

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
                    }
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
                              <div class="form-group">
                                <label>Name</label>
                                <input v-model="form.name" type="text" class="form-control" placeholder="Name" :readonly="is_view_only" />
                              </div>
                            </div>

                            <div class="col-12 mt-3">
                                <button class="btn btn-primary mr-1" v-on:click="action_btn('edit')">{{ is_view_only ?
                                    'Edit'
                                    : 'Save' }} Scoring Type</button>
                                <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')"
                                    v-if="this.$route.params.id != null">Delete
                                    Scoring Type</button>

                                <button class="btn btn-warning ml-1" v-on:click="action_btn('back')">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>