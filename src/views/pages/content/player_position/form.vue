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
 * Player Position component
 */
export default {
    page: {
        title: "Player Position",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { 
        Layout, 
        PageHeader, 
        CustomEditor,
        // ckeditor: CKEditor.component 
    },
    data() {
        return {
            tableData: [],
            title: "Player Position",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Player Position",
                    active: true
                }
            ],
            form: {
                subtitle: "",
            },
            arr_category_sport: [],
            arr_selected_category: [],
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
    watch: {
      arr_category_sport(val){
        if(this.is_first_time && val.length > 0 && this.arr_selected_category.length > 0)
          this.manage_selected_category()
      },
      arr_selected_category(val){
        if(this.is_first_time && val.length > 0 && this.arr_category_sport.length > 0)
          this.manage_selected_category()
      },
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
      this.get_category_sport()
        // Set the initial number of items
        if (this.$route.params.id != null) {
          base.save_current_page('Edit Player Position')
            this.is_view_only = true
            this.get_data()
        }
        else
          base.save_current_page('Add Player Position')
      
    },
    methods: {
      async get_category_sport() {
        var url = base.url_api + '/category-sport'
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            this.arr_category_sport = response_data
          }
          else
            base.show_error(response.message)
        }
        else
          base.show_error('Server Error')
      },
      manage_selected_category(){
        var arr = JSON.parse(JSON.stringify(this.arr_category_sport))
        for(let data of arr){
          var flag = false
          for(let selected_category of this.arr_selected_category){
            if(selected_category.category_sport.id == data.id){
              flag = true
              break
            }
          }
          data.selected = flag
        }
        this.is_first_time = false
        this.arr_category_sport = arr
      },
      onCategorySportClicked(index){
        var category = this.arr_category_sport[index]
        category.selected = !category.selected
        this.$set(this.arr_category_sport, index, category)
      },
        async get_data() {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/player-position?id=' + this.$route.params.id
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
              if (response.status == "success") {
                var response_data = response.data
                this.arr_selected_category = response_data.category_sport
                this.form = response_data
              }
            }
        },
        async action_btn(type) {
            var url = base.url_api + '/player-position'
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

                    var selected_category = []
                    for(let category of this.arr_category_sport){
                      if(category.selected){
                        var id = null
                        for(let selected_category of this.arr_selected_category){
                          if(selected_category.category_sport.id == category.id){
                            id = selected_category.id
                            break
                          }
                        }

                        selected_category.push({
                          id: id,
                          category_sport: category,
                        })
                      }
                    }
                        data.is_publish = 1
                        data.arr_category_sport = selected_category

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
                                <label>Name</label>
                                <input v-model="form.name" type="text" class="form-control" placeholder="Name" :readonly="is_view_only" />
                              </div>
                            </div>

                            <div class="col-12">
                              <div class="form-group">
                                <label>Category Sport</label>
                                <div>
                                  <div v-for="(category_sport, index) in arr_category_sport" :key="index">
                                    <div class="form-check mb-3">
                                      <input class="form-check-input" type="checkbox" :checked="category_sport.selected" :disabled="is_view_only" @click="onCategorySportClicked(index)" :id="'categorySport' + index" />
                                      <label class="form-check-label" :for="'categorySport' + index">{{ category_sport.name }}</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="col-12 mt-3">
                                <button class="btn btn-primary mr-1" v-on:click="action_btn('edit')">{{ is_view_only ?
                                    'Edit'
                                    : 'Save' }} Player Position</button>
                                <button class="btn btn-danger ml-1" v-on:click="action_btn('delete')"
                                    v-if="this.$route.params.id != null">Delete
                                    Player Position</button>

                                <button class="btn btn-warning ml-1" v-on:click="action_btn('back')">Cancel</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>