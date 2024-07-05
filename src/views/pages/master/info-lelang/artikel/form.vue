<script>
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { Base64UploadAdapter, } from '@ckeditor/ckeditor5-upload';

  import Layout from "../../../../layouts/main";
  import CustomPleaseWait from "../../../../layouts/CustomPleaseWait";
  import CustomEditor from "../../../../layouts/CustomEditor";
  import PageHeader from "@/components/page-header";
  import appConfig from "@/app.config";
  import moment from 'moment'
  import $ from 'jquery'
  import imageBase from 'image-to-base64'
  import Base from "@/Utils/base";

  import {
    required,

  } from "vuelidate/lib/validators";

  const base = new Base()

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Artikel Lelang component
 */
  export default {
    page: {
      title: "Artikel Lelang",
      meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomEditor, CustomPleaseWait, },
    data() {
      return {
        base: new Base(),
        editor: null,
        tableData: [],
        title: "Artikel Lelang",
        items: [
        {
          text: "Tables",
          href: "/"
        },
        {
          text: "Artikel Lelang",
          active: true
        }
        ],
        form: {
          title: "",
          content: "",
          publish_date: "",
          publish_time: "",
          created_at: moment().format('DD MMM YYYY'),
          is_publish: "",
          is_primary: 0,
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
            // editorConfig: base.editorConfig,
      };
    },
    validations: {
      form: {
        title: { required },
        content: { required },
      },
    },
    watch: {
      progress(value){
        console.log(value)
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
        this.is_view_only = true
        this.get_data()
      }

    },
    methods: {
      async get_data() {
        var url = base.url_api + '/article?id=' + this.$route.params.id
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            response_data.created_at = moment(response_data.created_at).format('DD MMM YYYY')
            response_data.publish_date = (response_data.publish_at != null ? new Date(response_data.publish_at) : '')
            response_data.publish_time = (response_data.publish_at != null ? moment(response_data.publish_at).format('HH:mm:ss') : '')
            response_data.content = (response_data.content == null ? '' : response_data.content)
            this.form = response_data

            this.image_data = {
              image_display: base.url_photo('article', response_data.file_name),
              data_image: ''
            }
          }
        }
      },
      async action_btn(type) {
        var url = base.url_api + '/article'
        var data = this.form
        var response = {}
        if (type === 'edit') {
          if (this.is_view_only) {
            this.is_view_only = false
          }
          else {

            // this.submitted = true;
            // this.$v.$touch();

            // if (this.$v.$invalid) {
            //   return;
            // }
            // else {
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
              }

              if (data.publish_time !== '') {
                data.is_publish = null
              }

              // data.publish_at = moment(data.publish_date).format('YYYY-MM-DD HH:MM:ss')
              data.publish_at = moment(data.publish_date).format('YYYY-MM-DD') + ' ' + data.publish_time

              var method = 'post'

              if (this.$route.params.id != null) {
                data.id = this.form.id
                method = 'put'
              }

              var context = this
              await base.request_chunk(url, method, data, (progress) => {
                context.progress = progress
              },'redirect', '/info-lelang/artikel-lelang')

              
              // setInterval(() => {
              //   context.progress = moment().format('SS')
              // }, 1000)
              // response = await base.request(url, method, data);

              // if (response != null) {
              //   if (response.status == "success") {
              //     window.location.href = '/info-lelang/artikel-lelang'
              //   }
              // }
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
            response = await base.request(url, 'delete', data);

            if (response != null) {
              if (response.status == "success") {
                window.location.replace('/info-lelang/artikel-lelang')
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
      },
      async setPrimary() {
        this.form.is_primary = 1
        this.is_view_only = false
        await this.action_btn('edit')
      }
    }
  };
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <CustomPleaseWait :progress="progress"/>

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
                  <CustomEditor :readOnly="is_view_only" :value="form.content" :contentType="form.content_type" @onContentTypeChanged="(val) => form.content_type = val" @onDataChanged="(val) => form.content = val"/>
                    <!-- <ckeditor :editor="editor" v-model="form.content" :config="editorConfig"/> -->
                        <!-- <ckeditor v-model="form.content" :readOnly="is_view_only" :config="{
                            height: '400px',
                            extraPlugins: 'font, colorbutton, colordialog, easyimage,',
                            colorButton_enableAutomatic: false,
                            colorButton_enableMore: 'Automatic',
                            resize_enabled: false,
                            removePlugins: 'elementspath, wsc,scayt, blockquote',
                            removeButtons: 'Anchor',
                            cloudServices_uploadUrl: 'https://legoasapi.legoas.co.id/upload-image',
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
                                <b-form-datepicker v-model="form.publish_date"
                                @input="changeInput($event, 'publish_date')"
                                :disabled="is_view_only"></b-form-datepicker>
                                <!-- <b-form-input v-model="form.publish_date" type="date"></b-form-input> -->
                              </b-form-group>
                              <b-form-timepicker v-model="form.publish_time" locale="id-ID" :hour12="false" :hour-cycle="'23'" :disabled="is_view_only"></b-form-timepicker>
                            </div>
                          </div>
                          <div class="col-12 col-lg-4" v-if="this.$route.params.id != null">
                            <div class="form-group">
                              <label>Created Date</label>
                              <input v-model="form.created_at" type="text" class="form-control"
                              placeholder="Created Date" readonly />
                              <div v-if="submitted && $v.form.created_at.$error" class="invalid-feedback">
                                <span v-if="!$v.form.created_at.required">This value is required.</span>
                              </div>
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
                                <!-- <input v-model="form.is_publish" type="text" class="form-control"
                                placeholder="Status"
                                :class="{ 'is-invalid': submitted && $v.form.is_publish.$error }" /> -->
                            <div v-if="submitted && $v.form.is_publish.$error" class="invalid-feedback">
                              <span v-if="!$v.form.is_publish.required">This value is required.</span>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 col-lg-4"
                        v-if="!this.form.is_primary && this.$route.params.id != null">
                        <button class="btn btn-outline-primary mr-1" v-on:click="setPrimary()">Set as
                        Primary</button>
                      </div>
                    </div>
                  </div>

                  <div class="col-12 mt-3">
                    <div class="row">
                      <div class="col-12 col-lg-4" v-if="image_data.image_display !== ''">
                        <img class="rounded mr-2" alt="200x200" width="200" :src="image_data.image_display"
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
                  : 'Save' }} Article</button>
                  <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')"
                  v-if="this.$route.params.id != null">Delete
                Article</button>
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