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
 * Official Partner component
 */
export default {
    page: {
        title: "Official Partner",
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
            title: "Official Partner",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Official Partner",
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
            base.save_current_page('Edit Official Partner')
            this.is_view_only = true
            this.get_data()
        }
        else
            base.save_current_page('Add Official Partner')
    },
    methods: {
        async get_data() {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/official-partner?id=' + this.$route.params.id
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
                if (response.status == "success") {
                    var response_data = response.data
                    this.form = response_data

                    this.image_data = {
                        image_display: base.url_photo('official-partner', response_data.file_name),
                        data_image: ''
                    }
                }
            }
        },
        async action_btn(type) {
            var url = base.url_api + '/official-partner'
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

                        data.content = data.subtitle

                        if (this.image_data.data_image !== '') {
                            data.file = {
                                file: this.image_data.data_image
                            }
                        }

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
                                window.location.href = '/official-partner'
                            }
                        }
                    // }

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
                    $('#please_wait_modal').modal('show')
                    response = await base.request(url, 'delete', data);

                    setTimeout(() => {
                      $('#please_wait_modal').modal('hide')
                    }, 500)
                    if (response != null) {
                        if (response.status == "success") {
                            window.location.replace('/official-partner')
                        }
                    }
                }
            }
            else if (type === 'back') {
                window.history.back()
            }
        },
        choose_image() {
            $('#input_image').trigger('click')
        },
        async change_image(event) {
            const image = new Image()
            image.src = URL.createObjectURL(event.target.files[0])
            image.onload = async () => {
                const {
                    height, width
                } = image
                
                // if (width/height !== 4/3) {
                //     this.image_error = true
                //     alert('Ukuran Ratio Gambar Harus 4:3')
                // }
                // else {
                    this.image_data = {
                        image_display: URL.createObjectURL(event.target.files[0]),
                        data_image: await imageBase(URL.createObjectURL(event.target.files[0])),
                    }
                // }
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
                                <label class="m-0">Official Partner Image</label>
                            </div>

                            <!-- <div class="col-12">
                                <p>Ukuran Ratio Gambar Harus 4:3</p>
                            </div> -->


                            <div class="col-6 col-lg-3 mt-3" v-if="image_data.image_display !== ''">
                                <div class="row">
                                    <div class="col-12">
                                        <img class="rounded mr-2" width="100%" :src="image_data.image_display"
                                            data-holder-rendered="true" />
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 mt-2" v-if="!is_view_only">
                                <input type="file" class="d-none" accept="image/*" id="input_image"
                                    v-on:change="change_image($event)" />
                                <button class="btn btn-primary" v-on:click="choose_image">Choose Image</button>
                            </div>

                            <div class="col-12 mt-3">
                                <button class="btn btn-primary mr-1" v-on:click="action_btn('edit')">{{ is_view_only ?
                                    'Edit'
                                    : 'Save' }} Official Partner</button>
                                <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')"
                                    v-if="this.$route.params.id != null">Delete
                                    Official Partner</button>

                                <button class="btn btn-warning ml-1" v-on:click="action_btn('back')">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>