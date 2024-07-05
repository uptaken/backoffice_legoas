<script>

// import CKEditor from 'ckeditor4-vue'

import Layout from "../../../layouts/main";
import CustomEditor from "../../../layouts/CustomEditor";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import imageBase from 'image-to-base64'
import Base from "@/Utils/base";

import GeneralInfo from "@/views/pages/content/product/component/action/general_info";
import ListImage from "@/views/pages/content/product/component/action/list_image";
import ListDetail from "@/views/pages/content/product/component/action/list_detail";

const base = new Base()

import {
    required,

} from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Action Product component
 */
export default {
  page: {
    title: "Action Product",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { 
    Layout, 
    PageHeader, 
    CustomEditor,
    GeneralInfo,
    ListImage,
    ListDetail,
  },
  data() {
    return {
      tableData: [],
      arr_factor: [false,],
      title: "Action Product",
      items: [
        {
          text: "Tables",
          href: "/"
        },
        {
          text: "Action Event",
          href: "/"
        },
        {
          text: "Action Product",
          active: true
        }
      ],
      arr_tabs: [
        {
          id: 'general_info',
          icon: 'far fa-user',
          tab: 'General Info',
          component: 'general-info',
        },
        {
          id: 'list_detail',
          icon: 'far fa-user',
          tab: 'List Detail',
          component: 'list-detail',
        },
        {
          id: 'list_image',
          icon: 'far fa-user',
          tab: 'List Image',
          component: 'list-image',
        },
        
      ],
      is_submit: false,
      first_time: true,
      selected_tab: 0,
      before_click: '',
      data: {},
    };
  },
  watch:{
    data(val){
      if(this.is_submit){
        var context = this
        setTimeout(() => {
          context.post_action()
        }, 500)
      }
    }
  },
  async mounted() {
    base.save_current_page(this.$route.params.id != null ? 'Edit Product' : 'Add Product')
    this.title = this.$route.params.id != null ? 'Edit Product' : 'Add Product'
    
    if(this.$route.params.id != null)
      this.get_data()
  },
  methods: {
    async get_data() {
      $('#please_wait_modal').modal('show')
      var response = await base.request(base.url_api + '/product?id=' + this.$route.params.id)
      setTimeout(() => {
        $('#please_wait_modal').modal('hide')
      }, 500)
      

      if (response != null) {
        if (response.status == "success") {
          this.data = response.data
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    onBackPressed(){
      base.back_page()
    },
    async onNextClicked(){
      this.before_click = 'next'
    
      if(this.selected_tab < this.arr_tabs.length - 1)
        this.selected_tab++
      else
        this.is_submit = true
    },
    onPreviousClicked(){
      this.before_click = 'prev'
      if(this.selected_tab > 0)
        this.selected_tab--
    },
    onValidate(message, data){
      if(message != ''){
        base.show_error(message)
        if(this.is_submit)
          this.is_submit = false
        else if(this.before_click == 'next')
          this.selected_tab--
        return
      }
      var data_obj = JSON.parse(JSON.stringify(this.data))
      for(let x in data)
        data_obj[x] = data[x]
      this.data = data_obj
    },
    async post_action(){
      // console.log(base.url_api + '/product' + (this.$route.params.id != null ? '/edit' : ''))
      // console.log(JSON.stringify(this.data))
      $('#please_wait_modal').modal('show')
      var response = await base.request(base.url_api + '/product' + (this.$route.params.id != null ? '/edit' : ''), 'post', this.data);
      
      setTimeout(() => {
        $('#please_wait_modal').modal('hide')  
      }, 500)
      this.is_submit = false
      if (response != null) {
        if (response.status == "success") {
          base.back_page()
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <b-tabs pills justified content-class="p-3 text-muted" v-model="selected_tab">
      <b-tab v-for="(tab, index) of arr_tabs" :key="index">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i :class="tab.icon"></i>
          </span>
          <span class="d-none d-sm-inline-block">{{ tab.tab }}</span>
        </template>
        <component :is="tab.component" :index="index" :tab="selected_tab" :is_submit="is_submit" :data="data" @onValidate="onValidate"/>
      </b-tab>
    </b-tabs>

    <div class="d-flex justify-content-between">
      <div>
        <a class="btn btn-primary" @click="onBackPressed">Cancel</a>
        <button class="btn btn-primary ml-3" :disabled="selected_tab == 0" @click="onPreviousClicked">Previous</button>
      </div>
      <button class="btn btn-primary" @click="onNextClicked">{{ this.selected_tab < this.arr_tabs.length - 1 ? 'Next' : 'Submit' }}</button>
    </div>
  </Layout>
</template>