<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "../../../layouts/main";
  import CustomPleaseWait from "../../../layouts/CustomPleaseWait";
  import CustomEditor from "../../../layouts/CustomEditor";
  import PageHeader from "@/components/page-header";
  import appConfig from "@/app.config";

  import Base from "@/Utils/base";
  import $ from 'jquery'
  import imageBase from 'image-to-base64'

// import { icons } from "../icons/materialdesign/data";

  const base = new Base()

  export default {
    page: {
      title: "Peraturan Lelang",
      meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader, CustomEditor, CustomPleaseWait, },
    data() {
      return {
        title: "Peraturan Lelang",
        items: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Peraturan Lelang",
          active: true,
        },
        ],
        btn_action_arr: [
          { icon: 'mdi mdi-pencil', type: 'edit' },
          { icon: 'mdi mdi-trash-can', type: 'delete' },
          ],
        editorDisabled: true,
        rules_arr: [],
        progress: 0,
      };
    },
    async created() {
      await this.get_data()
    },
    methods: {
      async get_data() {
        var url = base.url_api + "/rules"

        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            for (var x in response_data) {
              response_data[x].is_view_only = true
              response_data[x].title = response_data[x].name
              response_data[x].content = response_data[x].content.replace(/<(.|\n)*?>/, '').replace(/<\/(.|\n)*?>/, '')

              response_data[x].image_display = base.url_photo('rules', response_data[x].file_name)
            }
            this.rules_arr = response_data;
          }
        }
      },
      add_rules() {
        var arr = [];
        arr = this.rules_arr;
        arr.push({ content: "", title: "" });
        this.rules_arr = arr;
      },
      async action_btn(index_data, btn_type) {
        var url = base.url_api + "/rules";
        var method = "";
        var response = null;
        var rules = this.rules_arr
        for (var x in rules) {
          rules[x].is_view_only = true
        }
        this.rules_arr = rules

        var data = this.rules_arr[index_data];

        if (btn_type === "edit") {
          data.is_view_only = false
        }
        else if (btn_type === "save") {
          var flag = 1;
          method = "post";

          if (data.id != null) {
            method = "put";
          }

          if (data.title === "") {
            flag = 0;
          } else if (data.content === "") {
            flag = 0;
          }

          data.name = data.title
          data.is_publish = 1

          if (flag) {
            var context = this
            await base.request_chunk(url, method, data, (progress) => {
              context.progress = progress
            },'reload')
            // response = await base.request(url, method, data);
            // if (response != null) {
            //   if (response.status == "success") {
            //                 // console.log(response.status)
            //     window.location.reload()
            //   }
            // }
          }
        }
        else if (btn_type === "delete") {
          var flag_delete = 1

          if (data.id == null) {
            this.rules_arr.splice(index_data, 1);
          }
          else {
            if (confirm('Are you sure want to delete this data?') == true) {
              flag_delete = 1
            }
            else {
              flag_delete = 0
            }

            if (flag_delete) {
              response = await base.request(url, "delete", {
                id: this.rules_arr[index_data].id,
              });
              if (response != null) {
                if (response.status == "success") {
                  this.rules_arr.splice(index_data, 1);
                  window.location.reload()
                }
              }
            }

          }

        }
      },
      choose_image(index) {
        $('#input_image' + index).trigger('click')
      },
      async change_image(event, index) {
        var rules = this.rules_arr[index]
        rules.file = {
          file: await imageBase(URL.createObjectURL(event.target.files[0]))
        }
        rules.image_display = URL.createObjectURL(event.target.files[0])
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
              <div class="col-12 mb-3" v-for="(data, index_data) in rules_arr" :key="index_data">
                <div class="row">
                  <div class="col-lg-1">
                    <h5 class="bg-primary text-center text-white"
                    style="border-radius: 4px; padding: 1rem">
                    {{ index_data + 1 }}
                  </h5>
                </div>
                <div class="col-lg-1">
                  <img class="rounded mr-2" width="100%" :src="data.image_display"
                  data-holder-rendered="true" />
                  <input type="file" accept="image/*" class="d-none" :id="'input_image' + index_data"
                  v-on:change="change_image($event, index_data)" />
                  <button type="button" class="btn btn-sm btn-primary mt-2" v-if="!data.is_view_only"
                  v-on:click="choose_image(index_data)">Choose
                Image</button>
              </div>
              <div class="col-lg-8 mt-3 mt-lg-0">
                <div class="row">
                  <div class="col-12">
                    <input for="text" v-model="data.title" class="form-control"
                    :readonly="data.is_view_only" />
                  </div>
                  <div class="col-12 mt-3">
                    <CustomEditor :id="'arr' + index_data" :readOnly="data.is_view_only" :value="data.content" :contentType="data.content_type" @onContentTypeChanged="(val) => data.content_type = val" @onDataChanged="(val) => data.content = val"/>
                                                <!-- <ckeditor v-model="data.content" :readOnly="data.is_view_only" :config="{
                                                    height: '100px',
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
                                                </div>
                                              </div>
                                            </div>
                                            <div class="col-lg-2 mt-3 mt-lg-0">
                                              <button class="btn btn-primary rounded-circle mr-1 "
                                              v-on:click="action_btn(index_data, (data.is_view_only ? 'edit' : 'save'))"><i
                                              :class="(data.is_view_only ? 'mdi mdi-pencil' : 'mdi mdi-content-save')"></i></button>

                                              <button v-if="data.id != null" class="btn rounded-circle ml-1 "
                                              :class="(data.is_view_only ? 'btn-danger' : 'btn-warning')"
                                              v-on:click="action_btn(index_data, data.is_view_only ? 'delete' : 'cancel')"><i
                                              class="mdi "
                                              :class="(data.is_view_only ? 'mdi-trash-can' : 'mdi-close')"></i></button>
                                              <button v-else class="btn rounded-circle ml-1 "
                                              :class="(data.is_view_only ? 'btn-danger' : 'btn-warning')"
                                              v-on:click="action_btn(index_data, 'delete')"><i class="mdi "
                                              :class="(data.is_view_only ? 'mdi-trash-can' : 'mdi-close')"></i></button>
                                            </div>
                                          </div>
                                        </div>

                                        <div class="col-12 mt-2">
                                          <button class="btn btn-outline-primary w-100" style="border-style: dashed;"
                                          v-on:click="add_rules()">Add
                                        New</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </Layout>
                        </template>
