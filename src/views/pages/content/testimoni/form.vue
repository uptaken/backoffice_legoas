<script>

// import CKEditor from 'ckeditor4-vue'

import Layout from "../../../layouts/main";
import CustomEditor from "../../../layouts/CustomEditor";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import $ from 'jquery'
import imageBase from 'image-to-base64'
import Base from "@/Utils/base";


const base = new Base()

import {
    required,

} from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Testimoni component
 */
export default {
    page: {
        title: "Testimoni",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomEditor, },
    data() {
        return {
            tableData: [],
            title: "Testimoni",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Testimoni",
                    active: true
                }
            ],
            form: {
                title: "",
                content: "",
                publish_date: "",
                created_at: moment().format('DD MMM YYYY'),
                is_publish: "",
                user_name: '',
                user_description: ''
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
            title: { required },
            content: { required },
            user_name: { required },
            user_description: { required },
            publish_date: { required },
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
    mounted() {
        // Set the initial number of items
        console.log(this.$route.params)
        if (this.$route.params.id != null) {
            this.is_view_only = true
            this.get_data()
        }
    },
    methods: {
        async get_data() {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/testimony?id=' + this.$route.params.id
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
                if (response.status == "success") {
                    var response_data = response.data
                    response_data.created_at = moment(response_data.created_at).format('DD MMM YYYY')
                    response_data.publish_date = new Date(response_data.publish_at)
                    response_data.content = (response_data.content == null ? '' : response_data.content)
                    this.form = response_data

                    this.image_data = {
                        image_display: base.url_photo('testimony', response_data.file_name),
                        data_image: ''
                    }
                }
            }
        },
        async action_btn(type) {
            var url = base.url_api + '/testimony'
            var data = this.form
            if (type === 'edit') {
                if (this.is_view_only) {
                    this.is_view_only = false
                }
                else {
                    this.submitted = true;
                    this.$v.$touch();

                    if (this.$v.$invalid) {
                        return;
                    }
                    else {
                        if (this.image_data.data_image !== '') {
                            data.file = {
                                file: this.image_data.data_image
                            }
                        }

                        data.publish_at = null
                        if (!data.is_publish) {
                            data.publish_at = moment(data.publish_date).format('YYYY-MM-DD HH:MM:ss')
                        }

                        if (data.publish_date !== '') {
                            data.is_publish = null
                            data.publish_at = moment(data.publish_date).format('YYYY-MM-DD HH:MM:ss')
                        }

                        var method = 'post'

                        if (this.$route.params.id != null) {
                            data.id = this.form.id
                            method = 'put'
                        }

                        var response = await base.request(url, method, data);

                        if (response != null) {
                            if (response.status == "success") {
                                window.location.href = '/testimoni'
                            }
                        }
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
                            window.location.replace('/testimoni')
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
            this.image_data = {
                image_display: URL.createObjectURL(event.target.files[0]),
                data_image: await imageBase(URL.createObjectURL(event.target.files[0])),
            }
        },
        async changeInput(event, type) {
            if (type === 'status') {
                if (event.target.value == 1) {
                    this.form.publish_date = new Date()
                }
                else {
                    this.form.publish_date = ''
                }
            }
            else if (type === 'publish_date') {
                var today = moment().format()
                var selected_date = moment(event)
                if (selected_date.isSameOrBefore(today)) {
                    this.form.is_publish = 1
                }
                else {
                    this.form.is_publish = 0
                }
            }
        }
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
                                    <label>Judul</label>
                                    <input v-model="form.title" type="text" class="form-control" placeholder="Judul"
                                        :class="{ 'is-invalid': submitted && $v.form.title.$error }"
                                        :readonly="is_view_only" />
                                    <div v-if="submitted && $v.form.title.$error" class="invalid-feedback">
                                        <span v-if="!$v.form.title.required">This value is required.</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label>Content</label>
                                    <CustomEditor :readOnly="is_view_only" :value="form.content" @onDataChanged="(val) => form.content = val"/>
                                    <!-- <ckeditor v-model="form.content" :readOnly="is_view_only" :config="{
                                        height: '400px',
                                        extraPlugins: 'font, colorbutton, colordialog, easyimage',
                                        colorButton_enableAutomatic: false,
                                        colorButton_enableMore: 'Automatic',
                                        resize_enabled: false,
                                        removePlugins: 'elementspath, wsc,scayt, blockquote',
                                        removeButtons: 'Anchor',
                                        easyimage_uploadUrl: '/upload-image',
                                        easyimage_jsonp: true,
                                        basePath: '/public/',
                                        contentsCss: ['/css/app.css'],
                                        font_names: 'Arial; Times New Roman; Comic Sans MS; Courier New; Georgia; Tahoma; Verdana; Overpass; Poppins-Regular; Poppins-Italic; Poppins-Thin; Poppins-ThinItalic; Poppins-ExtraLight; Poppins-ExtraLightItalic; Poppins-Light; Poppins-LightItalic; Poppins-Medium; Poppins-MediumItalic; Poppins-SemiBold; Poppins-SemiBoldItalic; Poppins-Bold; Poppins-BoldItalic; Poppins-ExtraBold; Poppins-ExtraBoldItalic; Poppins-Black; Poppins-BlackItalic; impact; GothamBold; GothamBoldItalic; GothamBook; GothamBookItalic; GothamLight; GothamLightItalic; GothamMedium; GothamMediumItalic',
                                    }" /> -->
                                    <div v-if="submitted && $v.form.content.$error" class="invalid-feedback">
                                        <span v-if="!$v.form.content.required">This value is required.</span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="row">
                                    <div class="col-12 col-lg-4">
                                        <div class="form-group">
                                            <label>Published Date</label>
                                            <b-form-group>
                                                <b-form-datepicker v-model="form.publish_date" :disabled="is_view_only"
                                                    @input="changeInput($event, 'publish_date')"></b-form-datepicker>
                                            </b-form-group>
                                        </div>
                                    </div>
                                    <div class="col-12 col-lg-4" v-if="this.$route.params.id != null">
                                        <div class="form-group">
                                            <label>Created Date</label>
                                            <input v-model="form.created_at" type="text" class="form-control"
                                                placeholder="Created Date" readonly />
                                        </div>
                                    </div>
                                    <div class="col-12 col-lg-4" v-if="this.$route.params.id != null">
                                        <div class="form-group">
                                            <label>Status</label>
                                            <select class="custom-select" v-model="form.is_publish" :disabled="is_view_only"
                                                v-on:change="changeInput($event, 'status')">
                                                <option :value="0">Not Publish</option>
                                                <option :value="1">Publish</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="row">
                                    <div class="col-12 col-lg-4">
                                        <div class="row">
                                            <div class="col-12" v-if="image_data.image_display !== ''">
                                                <img class="rounded mr-2" alt="200x200" width="200"
                                                    :src="image_data.image_display" data-holder-rendered="true" />
                                            </div>
                                            <div class="col-12 mt-2" v-if="!is_view_only">
                                                <input type="file" class="d-none" accept="image/*" id="input_image"
                                                    v-on:change="change_image($event)" />
                                                <button class="btn btn-primary" v-on:click="choose_image">Choose
                                                    Image</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 col-lg-4">
                                        <div class="form-group">
                                            <label>Nama Client</label>
                                            <input v-model="form.user_name" type="text" class="form-control"
                                                placeholder="Nama Client"
                                                :class="{ 'is-invalid': submitted && $v.form.user_name.$error }"
                                                :readonly="is_view_only" />
                                            <div v-if="submitted && $v.form.user_name.$error" class="invalid-feedback">
                                                <span v-if="!$v.form.user_name.required">This value is required.</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-lg-4">
                                        <div class="form-group">
                                            <label>Lokasi (bawah Nama Client)</label>
                                            <input v-model="form.user_description" type="text" class="form-control"
                                                placeholder="Lokasi"
                                                :class="{ 'is-invalid': submitted && $v.form.user_description.$error }"
                                                :readonly="is_view_only" />
                                            <div v-if="submitted && $v.form.user_description.$error"
                                                class="invalid-feedback">
                                                <span v-if="!$v.form.user_description.required">This value is
                                                    required.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div class="col-12 mt-3">
                                <button class="btn btn-primary mr-1" v-on:click="action_btn('edit')">{{ is_view_only ?
                                    'Edit'
                                    : 'Save' }} Testimoni</button>
                                <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')"
                                    v-if="this.$route.params.id != null">Delete
                                    Testimoni</button>
                                <button class="btn btn-warning ml-1" v-on:click="action_btn('back')"
                                    v-if="this.$route.params.id != null">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>