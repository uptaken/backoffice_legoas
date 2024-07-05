<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "../../layouts/main";
  import CustomPleaseWait from "../../layouts/CustomPleaseWait";
  import CustomEditor from "../../layouts/CustomEditor";
  import PageHeader from "@/components/page-header";
  import appConfig from "@/app.config";
  import $ from 'jquery'
  import Base from "@/Utils/base";
  import imageBase from 'image-to-base64'

  const base = new Base()

  export default {
    page: {
      title: "Tentang Kami",
      meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader, CustomEditor, CustomPleaseWait, },
    data() {
      return {
        title: "Tentang Kami",
        items: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Tentang Kami",
          active: true,
        },
        ],
        content: "",
        content_type: "editor",
        id: '',
        trust_id: '',
        trust_content: "",
        trust_content_type: "editor",
        editorDisabled: true,
        is_view_only: true,
        is_view_only_trust: true,
        is_team_view_only: true,
        team_arr: [],
        trust_arr: [],
        editorOption: base.editorOption,
        editorConfig: base.editorConfig,
        progress: 0,
        editorConfig_trust_content: base.editorConfig
      };
    },
    async created() {
      await this.get_data('about_us_section')
      await this.get_data('trust')
      await this.get_data_team()
      await this.get_data_trust()
    },
    methods: {
      async get_data(type) {
        var url = base.url_api + '/info?type=' + type
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data

            if (type === 'about_us_section') {
              this.id = response_data.id
              this.content = response_data.content
              this.content_type = response_data.content_type
            }
            else if (type === 'trust') {
              this.trust_id = response_data.id
              this.trust_content = response_data.content
              this.trust_content_type = response_data.content_type
            }
          }
        }
      },
      async get_data_team() {
        var url = base.url_api + '/section/our-team/all'
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data

            for (var x in response_data) {
              response_data[x].image_display = base.url_photo('section/our-team', response_data[x].file_name)
            }
            this.team_arr = response_data
          }
        }
      },
      async get_data_trust() {
        var url = base.url_api + '/section/trust/all'
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data

            for (var x in response_data) {
              response_data[x].is_view_only = true
              response_data[x].image_display = base.url_photo('section/trust', response_data[x].file_name)
            }
            this.trust_arr = response_data
          }
        }
      },
      async edit_content() {
        if (this.is_view_only) {
          this.is_view_only = false
        }
        else {
          var url = base.url_api + '/info'
          var method = 'post'
          var data = {
            content: this.content,
            is_publish: 1,
            type: 'about_us_section'
          }
          if (this.id !== '') {
            data.id = this.id
            method = 'put'
          }

          await base.request_chunk(url, method, data, 'reload')
          // var response = await base.request(url, method, data);

          // if (response != null) {
          //   if (response.status == "success") {
          //     window.location.reload()
          //   }
          // }
        }
      },
      async edit_content_trust() {
        if (this.is_view_only_trust) {
          this.is_view_only_trust = false
        }
        else {
          var url = base.url_api + '/info'
          var method = 'post'
          var data = {
            content: this.trust_content,
            is_publish: 1,
            type: 'trust'
          }
          if (this.trust_id !== '') {
            data.id = this.trust_id
            method = 'put'
          }

          var context = this
          await base.request_chunk(url, method, data, (progress) => {
            context.progress = progress
          }, 'reload')
          // var response = await base.request(url, method, data);

          // if (response != null) {
          //   if (response.status == "success") {
          //     window.location.reload()
          //   }
          // }
        }
      },
      async edit_team() {
        if (this.is_team_view_only) {
          this.is_team_view_only = false
        }
        else {
          var url = base.url_api + '/section/our-team'
          var method = 'post'

          var arr_team = this.team_arr

          for (var x in arr_team) {
            arr_team[x].is_publish = 1
            arr_team[x].file = {
              file: arr_team[x].data_image
            }
          }

          var data = { arr_our_team: arr_team }

          var response = await base.request(url, method, data);

          if (response != null) {
            if (response.status == "success") {
              window.location.reload()
            }
          }
        }
      },
      choose_image() {
        $('#input_image').trigger('click')
      },
      async change_image(event) {
        for (var x in event.target.files) {
          if (x < 4) {
            if (this.team_arr.length < 4) {
              this.team_arr.push({
                image_display: URL.createObjectURL(event.target.files[x]),
                data_image: await imageBase(URL.createObjectURL(event.target.files[x])),
                title: '',
                roles: '',
              })
            }
          }
        }
      },
      async remove_image(index) {
        var flag_delete = 1

        if (confirm('Are you sure want to delete this data?') == true) {
          flag_delete = 1
        }
        else {
          flag_delete = 0
        }

        if (flag_delete) {
          var url = base.url_api + '/section/our-team'
          var response = await base.request(url, "delete", {
            id: this.team_arr[index].id,
          });
          if (response != null) {
            if (response.status == "success") {
              this.team_arr.splice(index, 1)
            }
          }
        }
      },
      changeInputTeam(index, value, type) {
        this.team_arr[index][type] = value
      },
      choose_image_trust(index) {
        $('#input_image_trust' + index).trigger('click')
      },
      async change_image_trust(event, index) {
        var trust = this.trust_arr[index]
        trust.file = {
          file: await imageBase(URL.createObjectURL(event.target.files[0]))
        }
        trust.image_display = URL.createObjectURL(event.target.files[0])
      },
      async action_btn_trust(index, type) {
        var trust = this.trust_arr

        if (type === 'edit') {
          for (var x in trust) {
            trust[x].is_view_only = true
          }

          trust[index].is_view_only = false
        }
        else if (type === 'cancel') {
          for (var y in trust) {
            trust[y].is_view_only = true
          }
          this.trust_arr = trust
        }
        else {
          var url = base.url_api + '/section/trust'
          var data = trust[index]
          var response = await base.request(url, 'put', data);
          if (response != null) {
            if (response.status == "success") {
              window.location.reload()
            }
          }
        }

        this.trust_arr = trust
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
            <h4 class="card-title">Content</h4>
            <div class="row">
              <div class="col-12">
                <!-- <ckeditor v-model="content" :editor="editor" :disabled="is_view_only"></ckeditor> -->
                <!-- <quill-editor v-model="content" :options="editorOption" :disabled="is_view_only" /> -->
                <CustomEditor id="content" :readOnly="is_view_only" :value="content" :contentType="content_type" @onContentTypeChanged="(val) => content_type = val" @onDataChanged="(val) => content = val"/>

                                <!-- <ckeditor v-model="content" :readOnly="is_view_only" :config="{
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
                                </div>
                                <div class="col-12 mt-3">
                                  <button type="button" class="btn btn-primary" v-on:click="edit_content">{{ is_view_only ?
                                  'Edit' : 'Save'
                                }}
                              Content</button>
                            </div>
                          </div>
                        </div>

                        <div class="card-body">
                          <h4 class="card-title">Kepercayaan Legoas</h4>
                          <div class="row">
                            <div class="col-12">
                              <CustomEditor id="trust" :readOnly="is_view_only_trust" :value="trust_content" :contentType="trust_content_type" @onContentTypeChanged="(val) => trust_content_type = val" @onDataChanged="(val) => trust_content = val"/>
                                <!-- <ckeditor v-model="trust_content" :readOnly="is_view_only_trust" :config="{
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
                                </div>
                                <div class="col-12 mt-3">
                                  <button type="button" class="btn btn-primary" v-on:click="edit_content_trust">{{
                                    is_view_only_trust ?
                                    'Edit' : 'Save'
                                  }}
                                Kepercayaan Legoas</button>
                              </div>
                            </div>
                          </div>

                          <div class="card-body">
                            <form class="needs-validation">
                              <div class="row">
                                <div class="col-12">
                                  <label>Image Team</label>

                                  <div class="row">
                                    <div class="col-6 col-lg-3" v-for="(data, index) in team_arr" :key="index">
                                      <div class="row">
                                        <div class="col-12">
                                          <img class="rounded mr-2" alt="200x200" width="100%"
                                          :src="data.image_display" data-holder-rendered="true" />
                                        </div>
                                        <div class="col-12 mt-2 text-center" v-if="!is_team_view_only">
                                          <input v-model="data.title" type="text" class="form-control"
                                          placeholder="Nama Team"
                                          v-on:keyup="changeInputTeam(index, $event.target.value, 'title')"
                                          :readonly="is_team_view_only" />
                                          <input v-model="data.roles" type="text" class="form-control mt-2"
                                          placeholder="Roles"
                                          v-on:keyup="changeInputTeam(index, $event.target.value, 'roles')"
                                          :readonly="is_team_view_only" />
                                        </div>
                                        <div class="col-12 mt-2 text-center" v-else>
                                          <p class="m-0">{{ data.title }}</p>
                                          <p class="m-0">{{ data.roles }}</p>
                                        </div>

                                        <div class="col-12 mt-2 text-center" v-if="!is_team_view_only">
                                          <button type="button" class="btn btn-danger"
                                          v-on:click="remove_image(index)">Remove</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-12 mt-3" v-if="!is_team_view_only && team_arr.length < 4">
                                  <input type="file" accept="image/*" multiple class="d-none" id="input_image"
                                  v-on:change="change_image($event)" />
                                  <button class="btn btn-primary" type="button" v-on:click="choose_image">Choose
                                  Image</button>
                                </div>
                                <div class="col-12 mt-3">
                                  <button class="btn btn-primary" type="button" v-on:click="edit_team()">{{
                                    is_team_view_only ? 'Edit' : 'Save' }}
                                  Team</button>
                                </div>
                              </div>

                            </form>
                          </div>

                          <div class="card-body">
                            <form class="needs-validation">

                              <label>Icon & Points</label>
                              <div class="row">

                                <div class="col-12" v-for="(data, index) in trust_arr" :key="index">
                                  <div class="row">
                                    <div class="col-lg-1">
                                      <h5 class="bg-primary text-center text-white"
                                      style="border-radius: 4px; padding: 1rem">
                                      {{ index + 1 }}
                                    </h5>
                                  </div>
                                  <div class="col-lg-1">
                                    <img class="rounded mr-2" width="100%" :src="data.image_display"
                                    data-holder-rendered="true" />
                                    <input type="file" accept="image/*" class="d-none"
                                    :id="'input_image_trust' + index"
                                    v-on:change="change_image_trust($event, index)" />
                                    <button type="button" class="btn btn-sm btn-primary mt-2"
                                    v-if="!data.is_view_only" v-on:click="choose_image_trust(index)">Choose
                                  Image</button>
                                </div>
                                <div class="col-lg-8 mt-3 mt-lg-0">
                                  <div class="row">
                                    <div class="col-12 mt-3">
                                      <CustomEditor :id="'iconPoint' + index" :readOnly="data.is_view_only" :value="data.title" :contentType="data.content_type" @onContentTypeChanged="(val) => data.content_type = val" @onDataChanged="(val) => data.title = val"/>
                                                    <!-- <ckeditor v-model="data.title" :readOnly="data.is_view_only" :config="{
                                                        height: '150px',
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
                                                      }" :key="index" /> -->
                                                    </div>
                                                  </div>
                                                </div>
                                                <div class="col-lg-2 mt-3 mt-lg-0">
                                                  <button class="btn btn-primary rounded-circle mr-1" type="button"
                                                  v-on:click="action_btn_trust(index, (data.is_view_only ? 'edit' : 'save'))"><i
                                                  :class="(data.is_view_only ? 'mdi mdi-pencil' : 'mdi mdi-content-save')"></i></button>
                                                  <button v-if="!data.is_view_only" class="btn rounded-circle ml-1 btn-warning"
                                                  v-on:click="action_btn_trust(index, 'cancel')"><i
                                                  class="mdi mdi-close"></i></button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Layout>
                            </template>
