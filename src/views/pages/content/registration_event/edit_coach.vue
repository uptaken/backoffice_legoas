<script>

// import CKEditor from 'ckeditor4-vue'

import Layout from "../../../layouts/main";
import CustomEditor from "../../../layouts/CustomEditor";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
// import moment from 'moment'
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import imageBase from 'image-to-base64'
import Base from "@/Utils/base";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

const base = new Base()

import {
    required,

} from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Coach component
 */
export default {
    page: {
        title: "Coach",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { 
        Layout, 
        PageHeader, 
        CustomEditor,
        DatePicker,
        // ckeditor: CKEditor.component 
    },
    data() {
        return {
            tableData: [],
            title: "Coach",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Coach",
                    active: true
                }
            ],
            form: {
            },
            arr_coach_position: [],
            submitted: false,
            submitform: false,
            submit: false,
            typesubmit: false,
            editorData: "",
            editorDisabled: false,
            is_view_only: false,
            is_first_time: true,
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
    watch: {
      form(val){
        if(val.id != null)
          this.get_coach_position()
      }
    },
    async mounted() {
      
        // Set the initial number of items
        if (this.$route.params.id != null) {
          base.save_current_page('Edit Coach')
            this.is_view_only = true
            this.get_data()
        }
        else
          base.save_current_page('Add Coach')
      
    },
    methods: {
      disableBirthDate(date){
        return momentTZ(date).isAfter(momentTZ())
      },
      async get_coach_position() {
        var url = base.url_api + '/coach-position/all?category_sport_id=' + this.form.registration_event.event_category_sport_category.event_category_sport.category_sport.id
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            this.arr_coach_position = response_data
          }
          else
            base.show_error(response.message)
        }
        else
          base.show_error('Server Error')
      },
      onCategorySportClicked(index){
        var category = this.arr_category_sport[index]
        category.selected = !category.selected
        this.$set(this.arr_category_sport, index, category)
      },
        async get_data() {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/event/registration/coach?id=' + this.$route.params.id
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
              if (response.status == "success") {
                var response_data = response.data
                response_data.birth_date = momentTZ.tz(response_data.birth_date, base.locale_timezone).toDate()
                this.image_data = {
                  image_display: response_data.url_image,
                }
                this.form = response_data
              }
            }
        },
        async action_btn(type) {
            var url = base.url_api + '/event/registration/coach'
            var data = this.form
            var response = null
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

                    var selected_coach_position = []
                    for(let coach_position of this.arr_coach_position){
                      if(coach_position.id == this.form.coach_position_id){
                        selected_coach_position = coach_position
                        break
                      }
                    }
                        data.is_publish = 1
                        data.coach_position = selected_coach_position
                        if(this.image_data.data_image != null)
                          data.image = {
                            file: this.image_data.data_image,
                          }

                        var method = 'post'

                        if (this.$route.params.id != null) {
                            url += '/edit'
                        }

                        response = await base.request(url, method, data);

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
                            <div class="form-group">
                              <label>Coach Position</label>
                              <select class="form-control" v-model="form.coach_position_id" :disabled="is_view_only">
                                <option value="">Choose Coach Position</option>
                                <option v-for="(coach_position, index) in arr_coach_position" :key="index" :value="coach_position.id">{{ coach_position.name }}</option>
                              </select>
                            </div>
                          </div>

                          <div class="col-12">
                            <div class="form-group">
                              <label>Name</label>
                              <input v-model="form.name" type="text" class="form-control" placeholder="Name" :readonly="is_view_only" />
                            </div>
                          </div>

                          <div class="col-12">
                            <div class="form-group">
                              <label>Gender</label>
                              <select class="form-control" v-model="form.gender" :disabled="is_view_only">
                                <option value="">Choose Gender</option>
                                <option value="1">Male</option>
                                <option value="0">Female</option>
                              </select>
                            </div>
                          </div>

                          <div class="col-12">
                            <div class="form-group">
                              <label>Birth Date</label>
                              <date-picker v-model="form.birth_date" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableBirthDate"/>
                            </div>
                          </div>

                          <div class="col-12">
                            <label>Image</label>
                          </div>

                          <div class="col-6 col-lg-3 mt-3" v-if="image_data.image_display !== ''">
                            <div class="row">
                              <div class="col-12">
                                <img class="rounded mr-2" width="100%" :src="image_data.image_display" data-holder-rendered="true" />
                              </div>
                            </div>
                          </div>

                          <div class="col-12 mt-2" v-if="!is_view_only">
                            <input type="file" class="d-none" accept="image/*" id="input_image" v-on:change="change_image($event)" />
                            <button class="btn btn-primary" v-on:click="choose_image">Choose Image</button>
                          </div>

                            <div class="col-12 mt-3">
                                <button class="btn btn-primary mr-1" v-on:click="action_btn('edit')">{{ is_view_only ?
                                    'Edit'
                                    : 'Save' }} Coach</button>
                                <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')"
                                    v-if="this.$route.params.id != null">Delete
                                    Coach</button>

                                <button class="btn btn-warning ml-1" v-on:click="action_btn('back')">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>