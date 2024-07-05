<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "../../../layouts/main";
  import CustomPleaseWait from "../../../layouts/CustomPleaseWait";
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
 * Navbar Content component
 */
  export default {
    page: {
      title: "Navbar Content",
      meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomEditor, CustomPleaseWait, },
    data() {
      return {
        base: new Base(),
        tableData: [],
        title: "Navbar Content",
        items: [
        {
          text: "Tables",
          href: "/"
        },
        {
          text: "Navbar Content",
          active: true
        }
        ],
        form: {
          title: "",
          content: "",
          publish_date: "",
          created_at: moment().format('DD MMM YYYY'),
          is_publish: ""
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
        editorConfig: base.editorConfig,
        arr_level1: [],
        arr_level2: [],
        arr_level3: [],
        selected_level1: '',
        selected_level2: '',
        selected_level3: '',
        arr_other_content: [],
      };
    },
    watch: {
      selected_level1(val){
        if(val != null)
          this.get_level2()
      },
      selected_level2(val){
        if(val != null)
          this.get_level3()
      },
      arr_other_content(val){
        // if(val.length > 0)
          this.get_level1()

      },
    },
    validations: {
      form: {
        title: { required },
        content: { required },
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
    async mounted() {
        // Set the initial number of items
      if (this.$route.params.id != null) {
        this.is_view_only = true
        this.get_data()
      }
      this.get_all_data()
    },
    methods: {
      async get_data() {
        var url = base.url_api + '/navbar-content?id=' + this.$route.params.id
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            if (response_data != null) {
              response_data.created_at = moment(response_data.created_at).format('DD MMM YYYY')
              response_data.publish_date = (response_data.publish_at != null ? new Date(response_data.publish_at) : '')
              response_data.content = (response_data.content == null ? '' : response_data.content)

              this.selected_level1 = response_data.navbar_level1 != null ? response_data.navbar_level1.id : (response_data.navbar_level2 != null ? response_data.navbar_level2.navbar_level1.id : (response_data.navbar_level3 != null ? response_data.navbar_level3.navbar_level2.navbar_level1.id : ''))
              this.selected_level2 = response_data.navbar_level2 != null ? response_data.navbar_level2.id : (response_data.navbar_level3 != null ? response_data.navbar_level3.navbar_level2.id : '')
              this.selected_level3 = response_data.navbar_level3 != null ? response_data.navbar_level3.id : ''
              this.form = response_data

              this.image_data = {
                image_display: base.url_photo('navbar-content', response_data.file_name),
                data_image: ''
              }
            }
            else {
              window.history.back()
            }
          }
        }
      },
      async get_all_data() {
        var url = base.url_api + '/navbar-content/all'
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            this.arr_other_content = response.data
          }
        }
      },
      async get_level1() {
        var url = base.url_api + '/navbar/level1'
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var arr = []
            for(let data of response.data){
              if((this.$route.params.id == null && ((data.total_navbar == 0 && data.navbar_content.length == 0) || (data.total_navbar > 0 && data.navbar_content.length < data.total_navbar))) || this.$route.params.id != null)
                arr.push(data)
            }
            this.arr_level1 = arr
          }
        }
      },
      async get_level2() {
        var url = base.url_api + '/navbar/level2?navbar_level1_id=' + this.selected_level1
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var arr = []
            for(let data of response.data){
              if((this.$route.params.id == null && ((data.navbar_level3.length == 0 && data.navbar_content.length == 0) || (data.navbar_level3.length > 0 && data.navbar_content.length < data.navbar_level3.length))) || this.$route.params.id != null)
                arr.push(data)
            }
            this.arr_level2 = arr
          }
        }
      },
      async get_level3() {
        var url = base.url_api + '/navbar/level3?navbar_level2_id=' + this.selected_level2
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var arr = []
            for(let data of response.data){
              if((this.$route.params.id == null && data.navbar_content.length == 0) || this.$route.params.id != null)
                arr.push(data)
            }
            this.arr_level3 = arr
          }
        }
      },
      async action_btn(type) {
        var url = base.url_api + '/navbar-content'
        var data = this.form
        var response = {}
        if (type === 'edit') {
          if (this.is_view_only) {
            this.is_view_only = false
          }
          else {
            if(this.selected_level3 == "" && this.arr_level3.length > 0)
              this.base.show_error("Navbar Level 3 not Choosen")
            else if(this.selected_level2 == "" && this.arr_level2.length > 0)
              this.base.show_error("Navbar Level 2 not Choosen")
            else if(this.selected_level1 == "" && this.arr_level1.length > 0)
              this.base.show_error("Navbar Level 1 not Choosen")
            else if(this.title == "")
              this.base.show_error("Judul is Empty")
            else if(this.content == "")
              this.base.show_error("Content is Empty")
            else if(this.publish_date == "")
              this.base.show_error("Published Date is Empty")
            else{
              if(this.selected_level2 == "" && this.selected_level3 == "")
                data.navbar_level1_id = this.selected_level1
              else if(this.selected_level3 == "")
                data.navbar_level2_id = this.selected_level2
              else
                data.navbar_level3_id = this.selected_level3

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

              var context = this
              await base.request_chunk(url, method, data, (progress) => {
                context.progress = progress
              }, 'redirect', '/navbar-content')
              // response = await base.request(url, method, data);

              // if (response != null) {
              //   if (response.status == "success") {
              //     window.location.href = '/navbar-content'
              //   }
              // }
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
                window.location.replace('/navbar-content')
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
                  <label>Navbar Level 1</label>
                  <select class="form-control" :disabled="$route.params.id != null" v-model="selected_level1">
                    <option value="">Choose Level 1</option>
                    <option v-for="(level1, index) in arr_level1" :key="'level1_' + index" :value="level1.id">{{ level1.name }}</option>
                  </select>
                </div>
              </div>
              
              <div class="col-12" v-show="arr_level2.length > 0">
                <div class="form-group">
                  <label>Navbar Level 2</label>
                  <select class="form-control" :disabled="$route.params.id != null" v-model="selected_level2">
                    <option value="">Choose Level 2</option>
                    <option v-for="(level2, index) in arr_level2" :key="'level2_' + index" :value="level2.id">{{ level2.name }}</option>
                  </select>
                </div>
              </div>
              
              <div class="col-12" v-show="arr_level3.length > 0">
                <div class="form-group">
                  <label>Navbar Level 3</label>
                  <select class="form-control" :disabled="$route.params.id != null" v-model="selected_level3">
                    <option value="">Choose Level 3</option>
                    <option v-for="(level3, index) in arr_level3" :key="'level3_' + index" :value="level3.id">{{ level3.name }}</option>
                  </select>
                </div>
              </div>

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
                            <div v-if="submitted && $v.form.content.$error"
                            style="font-size: 80%; color: #ff3d60; margin-top: .25rem;">
                            <span v-if="!$v.form.content.required">This value is required.</span>
                          </div>
                        </div>
                      </div>

                      <div class="col-12 col-lg-4">
                        <div class="form-group">
                          <label>Published Date</label>
                          <b-form-group>
                            <b-form-datepicker v-model="form.publish_date" :disabled="is_view_only"
                            @input="changeInput($event, 'publish_date')"></b-form-datepicker>
                            <div v-if="submitted && $v.form.publish_date.$error"
                            style="font-size: 80%; color: #ff3d60; margin-top: .25rem;">
                            <span v-if="!$v.form.publish_date.required">This value is required.</span>
                          </div>
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

                  <div class="col-12">
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
                  : 'Save' }} Navbar Content</button>
                  <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')"
                  v-if="this.$route.params.id != null">Delete
                Navbar Content</button>
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