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
 * Category Sport component
 */
export default {
    page: {
        title: "Category Sport",
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
            title: "Category Sport",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Category Sport",
                    active: true
                }
            ],
            form: {
                name: "",
            },
            arr_scoring_type: [],
            arr_selected_scoring: [],
            win_point: '0',
            draw_point: '0',
            lost_point: '0',
            submitted: false,
            submitform: false,
            submit: false,
            typesubmit: false,
            editorData: "",
            editorDisabled: false,
            is_view_only: false,
            image_data: { image_display: '', data_image: '' },
            editorConfig: base.editorConfig,
            is_first_time: true,
        };
    },
    watch: {
        win_point(val){
            this.win_point = base.to_currency_format(val)
        },
        draw_point(val){
            this.draw_point = base.to_currency_format(val)
        },
        lost_point(val){
            this.lost_point = base.to_currency_format(val)
        },
        arr_scoring_type(val){
        if(this.is_first_time && val.length > 0 && this.arr_selected_scoring.length > 0)
          this.manage_selected_scoring()
      },
      arr_selected_scoring(val){
        if(this.is_first_time && val.length > 0 && this.arr_scoring_type.length > 0)
          this.manage_selected_scoring()
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
          base.save_current_page('Edit Category Sport')
            this.is_view_only = true
            this.get_data()
        }
        else
          base.save_current_page('Save Category Sport')
        this.get_scoring_type()
    },
    methods: {
      async get_scoring_type() {
        var url = base.url_api + '/scoring-type'
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            for(let scoring_type of response.data)
              scoring_type.selected = false
            this.arr_scoring_type = response_data
          }
          else
            base.show_error(response.message)
        }
        else
          base.show_error('Server Error')
      },
      manage_selected_scoring(){
        var arr = JSON.parse(JSON.stringify(this.arr_scoring_type))
        for(let data of arr){
          var flag = false
          for(let selected_scoring of this.arr_selected_scoring){
            if(selected_scoring.scoring_type.id == data.id){

              flag = true
              break
            }
          }
          data.selected = flag
        }
        this.is_first_time = false
        this.arr_scoring_type = arr
      },
      onScoringTypeClicked(index){
        var arr_scoring_type = JSON.parse(JSON.stringify(this.arr_scoring_type))
        for(let scoring_type of arr_scoring_type)
          scoring_type.selected = false

        var scoring_type = arr_scoring_type[index]
        scoring_type.selected = !scoring_type.selected
        this.arr_scoring_type = arr_scoring_type
      },
        async get_data() {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/category-sport?id=' + this.$route.params.id
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
                if (response.status == "success") {
                    var response_data = response.data
                    this.form = response_data
                    this.win_point = response_data.win_point.toLocaleString(base.locale_string)
                    this.draw_point = response_data.draw_point.toLocaleString(base.locale_string)
                    this.lost_point = response_data.lost_point.toLocaleString(base.locale_string)
                    this.arr_selected_scoring = response_data.scoring_type

                    this.image_data = {
                        image_display: base.url_photo('category-sport', response_data.file_name),
                        data_image: ''
                    }
                }
            }
        },
        async action_btn(type) {
            var url = base.url_api + '/category-sport'
            var data = this.form
            if (type === 'edit') {
                if (this.is_view_only) {
                    this.is_view_only = false
                }
                else {

                    this.submitted = true;
                    // this.$v.$touch();

                    // if (this.$v.$invalid) {
                    //     return;
                    // }
                    // else {
                        data.is_publish = 1

                        // var selected_scoring_type = {}
                        // for(let scoring_type of this.arr_scoring_type){
                        //   if(scoring_type.selected){
                        //     selected_scoring_type = scoring_type
                        //   }
                        // }
                        // data.scoring_type = selected_scoring_type

                        data.win_point = this.win_point
                        data.draw_point = this.draw_point
                        data.lost_point = this.lost_point

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
                    response = await base.request(url, 'delete', data);

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
                                <label class="m-0">Category Sport Image</label>
                            </div>

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
                              <div class="form-group">
                                <label>Name</label>
                                <input v-model="form.name" type="text" class="form-control" placeholder="Name" :readonly="is_view_only" />
                              </div>
                            </div>

                            <div class="col-12 mt-3">
                              <div class="form-group">
                                <label>Win Point</label>
                                <input v-model="win_point" type="text" class="form-control" placeholder="Win Point" :readonly="is_view_only" />
                              </div>
                            </div>

                            <div class="col-12 mt-3">
                              <div class="form-group">
                                <label>Draw Point</label>
                                <input v-model="draw_point" type="text" class="form-control" placeholder="Draw Point" :readonly="is_view_only" />
                              </div>
                            </div>

                            <div class="col-12 mt-3">
                              <div class="form-group">
                                <label>Lose Point</label>
                                <input v-model="lost_point" type="text" class="form-control" placeholder="Lose Point" :readonly="is_view_only" />
                              </div>
                            </div>

                            <!-- <div class="col-12">
                              <div class="form-group">
                                <label>Scoring Type</label>
                                <div>
                                  <div v-for="(scoring_type, index) in arr_scoring_type" :key="index">
                                    <div class="form-check mb-3">
                                      <input class="form-check-input" type="radio" :checked="scoring_type.selected" :disabled="is_view_only" @click="onScoringTypeClicked(index)" :id="'categorySport' + index" />
                                      <label class="form-check-label" :for="'categorySport' + index">{{ scoring_type.name }}</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div> -->

                            <div class="col-12 mt-3">
                                <button class="btn btn-primary mr-1" v-on:click="action_btn('edit')">{{ is_view_only ?
                                    'Edit'
                                    : 'Save' }} Category Sport</button>
                                <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')"
                                    v-if="this.$route.params.id != null">Delete
                                    Category Sport</button>

                                <button class="btn btn-warning ml-1" v-on:click="action_btn('back')">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>