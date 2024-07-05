<script>
// import CKEditor from "ckeditor4-vue";

import Layout from "../../../layouts/main";
import CustomPleaseWait from "../../../layouts/CustomPleaseWait";
import CustomEditor from "../../../layouts/CustomEditor";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import $ from "jquery";
import Base from "@/Utils/base";
import imageBase from "image-to-base64";

const base = new Base();

export default {
  page: {
    title: "Pengertian Lelang",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    CustomEditor,
    CustomPleaseWait,
    // ckeditor: CKEditor.component,
    // ckeditor_section: CKEditor.component,
  },
  data() {
    return {
      title: "Pengertian Lelang",
      items: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Pengertian Lelang",
          active: true,
        },
      ],
      content: "",
      data_id: "",
      editorDisabled: true,
      image_data: { image_display: "", data_image: "" },
      is_view_only: true,
      is_view_image_only: true,
      definition_data: {
        id: "",
        content: "",
        type: "",
      },
      definition_section_data: {
        id: "",
        content: "",
        type: "",
      },
      is_view_only_section: true,
      editorConfig: base.editorConfig,
      progress: 0,
      image_error: false,
    };
  },
  watch: {
    definition_data(value) {
      if (value.content != "" && this.editor != null) {
        this.editor.setData(value.content);
      }
    },
    is_view_only(value) {
      if (this.editor != null) {
        if (value) this.editor.enableReadOnlyMode("editor");
        else this.editor.disableReadOnlyMode("editor");
      }
    },
  },
  async mounted() {
    this.editor = await base.init_editor();
    this.get_data();
    this.get_data("section");
  },
  methods: {
    async get_data(type = "") {
      var url =
        base.url_api +
        "/info?type=definition" +
        (type === "section" ? "_" + type : "");

      var response = await base.request(url);

      if (response != null) {
        if (response.status == "success") {
          var data = response.data;

          if (type === "") {
            if (data.id != null) {
              this.definition_data = data;
              this.image_data.image_display = base.img_500x300;
              if (data.file_name != null) {
                this.image_data.image_display = base.url_photo(
                  "info",
                  data.file_name
                );
              }
            }
          } else {
            if (data.id !== null) {
              this.definition_section_data = data;
            }
          }
        }
      }
    },
    async edit_content() {
      if (this.is_view_only) {
        this.is_view_only = false;
      } else {
        var url = base.url_api + "/info";

        var data = this.definition_data;

        if (this.image_data.data_image !== "") {
          data.file = {
            file: this.image_data.data_image,
          };
        }

        data.content = this.editor.getData()

        var method = "post";

        if (data.id != "") {
          method = "put";
        }

        var context = this
        await base.request_chunk(url, method, data, (progress) => {
          context.progress = progress
        }, 'reload')
        // var response = await base.request(url, method, data);

        // if (response != null) {
        //   if (response.status == "success") {
        //     window.location.reload();
        //   }
        // }
      }
    },
    edit_image() {
      if (this.is_view_image_only) {
        this.is_view_image_only = false;
      }
    },
    choose_image() {
      $("#input_image").trigger("click");
    },
    async change_image(event) {
      var flag = 1;

      const image = new Image();
      image.src = URL.createObjectURL(event.target.files[0]);
      image.onload = async () => {
        const { height, width } = image;
        if (height !== 300 || width !== 500) {
          flag = 0;
          this.image_error = true;
          alert("Ukuran Gambar Harus 500x300px");
        } else {
          this.image_error = "";
          this.image_data = {
            image_display: URL.createObjectURL(event.target.files[0]),
            data_image: await imageBase(
              URL.createObjectURL(event.target.files[0])
            ),
          };
        }
      };
    },
    async edit_content_section() {
      if (this.is_view_only_section) {
        this.is_view_only_section = false;
      } else {
        var url = base.url_api + "/info";

        var data = this.definition_section_data;

        var method = "post";

        if (data.id != "") {
          method = "put";
        }

        var context = this
        await base.request_chunk(url, method, data, (progress) => {
          context.progress = progress
        }, 'reload')
        // var response = await base.request(url, method, data);

        // if (response != null) {
        //   if (response.status == "success") {
        //     window.location.reload();
        //   }
        // }
      }
    },
  },
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
            <h4 class="card-title">Content</h4>
            <div class="row">
              <div class="col-12">
                <CustomEditor id="content" :readOnly="is_view_only" :value="definition_data.content" :contentType="definition_data.content_type" @onContentTypeChanged="(val) => definition_data.content_type = val" @onDataChanged="(val) => definition_data.content = val"/>
                <!-- <ckeditor v-model="definition_data.content" :editor="editor" :disabled="is_view_only"></ckeditor> -->
                <!-- <ckeditor v-model="definition_data.content" :readOnly="is_view_only" :config="{
                  height: '400px',
                  extraPlugins: 'font, colorbutton, colordialog, easyimage',
                  colorButton_enableAutomatic: false,
                  colorButton_enableMore: 'Automatic',
                  resize_enabled: false,
                  removePlugins: 'elementspath, wsc,scayt, blockquote',
                  removeButtons: 'Anchor',
                  easyimage_uploadUrl: '/upload-image',
                  easyimage_jsonp: true,
                  basePath : '/public/',
                  contentsCss: ['/css/app.css'],
                  font_names : 'Arial; Times New Roman; Comic Sans MS; Courier New; Georgia; Tahoma; Verdana; Overpass; Poppins-Regular; Poppins-Italic; Poppins-Thin; Poppins-ThinItalic; Poppins-ExtraLight; Poppins-ExtraLightItalic; Poppins-Light; Poppins-LightItalic; Poppins-Medium; Poppins-MediumItalic; Poppins-SemiBold; Poppins-SemiBoldItalic; Poppins-Bold; Poppins-BoldItalic; Poppins-ExtraBold; Poppins-ExtraBoldItalic; Poppins-Black; Poppins-BlackItalic; impact; GothamBold; GothamBoldItalic; GothamBook; GothamBookItalic; GothamLight; GothamLightItalic; GothamMedium; GothamMediumItalic',
                }" /> -->
              </div>
            </div>
          </div>
          <div class="card-body">
            <h4 class="card-title mt-3">
              1 IMAGE DI HALAMAN PENGERTIAN LELANG
            </h4>
            <label><small>Ukuran Gambar Harus 500x300px</small></label>
            <div class="row">
              <div
                class="col-6 col-lg-3"
                v-if="image_data.image_display !== ''"
              >
                <div class="row">
                  <div class="col-12">
                    <img
                      class="rounded mr-2"
                      alt="200x200"
                      width="100%"
                      :src="image_data.image_display"
                      data-holder-rendered="true"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12 mt-2" v-if="!is_view_only">
                <input
                  type="file"
                  class="d-none"
                  accept="image/*"
                  id="input_image"
                  v-on:change="change_image($event)"
                />
                <button class="btn btn-primary" v-on:click="choose_image">
                  Choose Image
                </button>
              </div>

              <div class="col-12 mt-3">
                <button class="btn btn-primary" v-on:click="edit_content">
                  {{ is_view_only ? "Edit" : "Save" }} Content
                </button>
              </div>
            </div>
          </div>

          <div class="card-body mt-3">
            <h4 class="card-title">Section Content</h4>
            <div class="row">
              <div class="col-12">
                <CustomEditor id="section_content" :readOnly="is_view_only_section" :value="definition_section_data.content" :contentType="definition_section_data.content_type" @onContentTypeChanged="(val) => definition_section_data.content_type = val" @onDataChanged="(val) => definition_section_data.content = val"/>
                <!-- <ckeditor
                  v-model="definition_section_data.content"
                  :readOnly="is_view_only_section"
                  :config="{
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
                    font_names:
                      'Arial; Times New Roman; Comic Sans MS; Courier New; Georgia; Tahoma; Verdana; Overpass; Poppins-Regular; Poppins-Italic; Poppins-Thin; Poppins-ThinItalic; Poppins-ExtraLight; Poppins-ExtraLightItalic; Poppins-Light; Poppins-LightItalic; Poppins-Medium; Poppins-MediumItalic; Poppins-SemiBold; Poppins-SemiBoldItalic; Poppins-Bold; Poppins-BoldItalic; Poppins-ExtraBold; Poppins-ExtraBoldItalic; Poppins-Black; Poppins-BlackItalic; impact; GothamBold; GothamBoldItalic; GothamBook; GothamBookItalic; GothamLight; GothamLightItalic; GothamMedium; GothamMediumItalic',
                  }"
                /> -->
              </div>
              <div class="col-12 mt-3">
                <button
                  class="btn btn-primary"
                  v-on:click="edit_content_section"
                >
                  {{ is_view_only_section ? "Edit" : "Save" }} Content Section
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
