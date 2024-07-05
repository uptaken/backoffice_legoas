<script>
// import CKEditor from "@ckeditor/ckeditor5-vue";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

import Layout from "../../../layouts/main";
import CustomPleaseWait from "../../../layouts/CustomPleaseWait";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Base from "@/Utils/base";

import InputContent from "../../../../components/input_content.vue";
// import { icons } from "../icons/materialdesign/data";

const base = new Base();

import {
  required,
  url
} from "vuelidate/lib/validators";

export default {
  page: {
    title: "Tata Cara Lelang",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader, InputContent, CustomPleaseWait, },
  data() {
    return {
      title: "Tata Cara Lelang",
      items: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Tata Cara Lelang",
          active: true,
        },
      ],
      penjual_arr: [],
      peserta_arr: [],
      tab_active: "participant",
      // editor: ClassicEditor,
      editorDisabled: true,
      form: {
        url_video: ''
      },
      submitted: false,
      enable_video: true,
      progress: 0,
      is_video_view_only: true
    };
  },
  validations: {
    form: {
      url_video: { url },
    },
  },
  async created() {
    if (this.$route.query.tab != null) {
      this.tab_active = this.$route.query.tab
    }
    await this.get_data_video();
    await this.get_data();
  },
  methods: {
    async get_data_video() {
      var active_tab = this.tab_active;
      var url = base.url_api + "/info?type=how_to";

      var response = await base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data
          this.form = response_data
          this.enable_video = response_data.is_publish
        }
      }
    },
    async get_data() {
      var active_tab = this.tab_active;
      var url = base.url_api + "/section/how-to/all?type=" + active_tab;

      var response = await base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data
          for (var x in response_data) {
            response_data[x].is_view_only = true
            response_data[x].content = response_data[x].content.replace(/<(.|\n)*?>/, '').replace(/<\/(.|\n)*?>/, '')
          }

          if (active_tab === 'participant') {
            this.peserta_arr = response_data
          }
          else {
            this.penjual_arr = response_data;
          }
        }
      }
    },
    add_new(type) {
      var arr = [];

      if (type === 'peserta') {
        arr = this.peserta_arr
        arr.push({ content: "", title: "", is_publish: 1 });
        this.peserta_arr = arr;
      }
      else {
        arr = this.penjual_arr;
        arr.push({ content: "", title: "", is_publish: 1 });
        this.penjual_arr = arr;
      }
    },
    async action_btn(type, index_data, btn_type) {
      var url = base.url_api + "/section/how-to";
      var method = "";
      var response = null;
      var data = [];
      if (type === 'peserta') {
        var peserta = this.peserta_arr
        for (var x in peserta) {
          peserta[x].is_view_only = true
        }
        this.peserta_arr = peserta
        data = this.peserta_arr[index_data]
      }
      else {
        var penjual = this.penjual_arr
        for (var y in penjual) {
          penjual[y].is_view_only = true
        }
        this.penjual_arr = penjual
        data = this.penjual_arr[index_data]
      }

      if (btn_type === "edit") {
        data.is_view_only = false
      }
      else if (btn_type === "save") {
        var section_type = "participant";
        var flag = 1;
        method = "post";
        if (type === "penjual") {
          section_type = "seller";
        }

        if (data.id != null) {
          method = "put";
        }

        if (data.title === "") {
          flag = 0;
        } else if (data.content === "") {
          flag = 0;
        }
        data.type = section_type;
        data.is_publish = 1

        if (flag) {
          var context = this
          await base.request_chunk(url, method, data, (progress) => {
            context.progress = progress
          },'reload')
          // response = await base.request(url, method, data);
          // if (response != null) {
          //   if (response.status == "success") {
          //     window.location.reload()
          //   }
          // }
        }
      }
      else if (btn_type === "delete") {
        var flag_delete = 1

        var delete_id = ''
        if (type === "penjual") {
          delete_id = this.penjual_arr[index_data].id
        }
        else if (type === 'peserta') {
          delete_id = this.peserta_arr[index_data].id
        }

        if (delete_id == null) {
          if (type === "penjual") {
            this.penjual_arr.splice(index_data, 1);
          }
          else if (type === 'peserta') {
            this.peserta_arr.splice(index_data, 1);
          }
        }
        else {
          if (confirm('Are you sure want to delete this data?') == true) {
            flag_delete = 1
          }
          else {
            flag = 0
          }

          if (flag_delete) {
            response = await base.request(url, "delete", {
              id: delete_id
            });
            if (response != null) {
              if (response.status == "success") {
                if (type === "penjual") {
                  this.penjual_arr.splice(index_data, 1);
                }
                else if (type === 'peserta') {
                  this.peserta_arr.splice(index_data, 1);
                }
              }
            }
          }
        }

      }
    },
    async changeTab(type) {
      if (type === "peserta") {
        this.penjual_arr = [];
        this.tab_active = "participant";
      } else if (type === "penjual") {
        this.peserta_arr = [];
        this.tab_active = "seller";
      }

      window.history.pushState({}, null, '/info-lelang/tata-cara?tab=' + this.tab_active)
      await this.get_data();
    },
    async save_url_video() {
      if (this.is_video_view_only) {
        this.is_video_view_only = false
      }
      else {
        this.submitted = true;
        this.$v.$touch();

        if (this.$v.$invalid) {
          return;
        }
        else {
          var url = base.url_api + "/info";

          var data = this.form
          data.is_publish = this.enable_video

          var response = await base.request(url, 'put', data);
          if (response != null) {
            if (response.status == "success") {
              window.location.reload()
            }
          }
        }
      }
    },
    async changeVideoEnable() {
      this.enable_video = !this.enable_video
    }
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
            <div class="row">
              <div class="col-12">
                <div class="row">
                  <div class="col-12 col-lg-6">
                    <h4 class="card-title">Video Tata Cara Lelang</h4>
                  </div>
                  <div class="col-12 col-lg-6 text-right">
                    <div class="custom-control custom-switch">
                      <input type="checkbox" class="custom-control-input" id="customSwitch1" :checked="enable_video"
                        v-on:change="changeVideoEnable()" :disabled="is_video_view_only" />
                      <label class="custom-control-label" for="customSwitch1">{{ (enable_video ? 'Munculkan' :
                        'Sembunyikan') }} Video di Frontend</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <input for="text" type="url" v-model="form.url_video" class="form-control"
                  :readonly="is_video_view_only || (!is_video_view_only && !enable_video)" />
                <div v-if="submitted && $v.form.url_video.$error"
                  style="font-size: 80%; color: #ff3d60; margin-top: .25rem;">
                  <span v-if="!$v.form.url_video.required">This value is required.</span>
                  <span v-if="!$v.form.url_video.url">This value should be a valid url.</span>
                </div>
              </div>
              <div class="col-12 mt-2 text-right">
                <button class="btn btn-primary" v-on:click="save_url_video()">{{ (is_video_view_only ? 'Edit Video Url' :
                  'Save') }}</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title">{{ tab_active === 'participant' ? 'Peserta' : 'Penjual' }} Lelang</h4>

            <b-tabs justified nav-class="nav-tabs-custom" content-class="p-3 text-muted">
              <b-tab :active="(tab_active === 'participant' ? true : false)" v-on:click="changeTab('peserta')">
                <template v-slot:title>
                  <span class="d-inline-block d-sm-none">
                    <i class="fas fa-home"></i>
                  </span>
                  <span class="d-none d-sm-inline-block">Peserta</span>
                </template>

                <InputContent id="peserta" v-if="peserta_arr.length > 0" :data_arr="peserta_arr" :action_btn="
                  (index_data, btn_type) =>
                    action_btn('peserta', index_data, btn_type)
                " :add_new_btn="() => add_new('peserta')" />
              </b-tab>
              <b-tab :active="(tab_active === 'seller' ? true : false)" v-on:click="changeTab('penjual')">
                <template v-slot:title>
                  <span class="d-inline-block d-sm-none">
                    <i class="far fa-user"></i>
                  </span>
                  <span class="d-none d-sm-inline-block">Penjual</span>
                </template>
                <InputContent id="penjual" v-if="penjual_arr.length > 0" :data_arr="penjual_arr" :action_btn="
                  (index_data, btn_type) =>
                    action_btn('penjual', index_data, btn_type)
                " :add_new_btn="() => add_new('penjual')" />
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
