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

import GeneralInfo from "@/views/pages/content/product/component/general_info";
import ListImage from "@/views/pages/content/product/component/list_image";

const base = new Base()

import {
    required,

} from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Detail Product component
 */
export default {
  page: {
    title: "Detail Product",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { 
    Layout, 
    PageHeader, 
    CustomEditor,
    GeneralInfo,
    ListImage,
  },
  data() {
    return {
      tableData: [],
      arr_factor: [false,],
      title: "Detail Product",
      items: [
        {
          text: "Tables",
          href: "/"
        },
        {
          text: "Detail Event",
          href: "/"
        },
        {
          text: "Detail Product",
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
    arr_factor(val){
      var counter = 0
      for(let factor of val){
        if(!factor)
          break
        counter++
      }
      
      if(counter == val.length)
        $('#please_wait_modal').modal('hide')
    },
    selected_tab(val){
      if(!this.first_time)
        this.save_tab()
    },
    async data(val){
      
    },
  },
  async mounted() {
    base.save_current_page('Detail Product')
    
    this.get_tab()
    $('#please_wait_modal').modal('show')
    this.get_data()
  },
  methods: {
    async get_tab(){
      if(this.data.id != null && this.arr_tabs.length > 0){
        this.first_time = false
        
        var index = await base.get_tab(this.data.category_sport.name, this.arr_tabs)
        this.selected_tab = index
      }
    },
    save_tab(){
      if(this.data.id != null)
        base.save_tab(this.data.category_sport.name, this.arr_tabs[this.selected_tab])
    },
    async get_data() {
      var url = base.url_api + '/product?id=' + this.$route.params.id
      var response = await base.request(url);

      this.$set(this.arr_factor, 0, true)
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
    onEditPressed(){
      window.location.href = "/product/action/edit/" + this.data.id
    },
    onSetArrFactor(index){
      this.$set(this.arr_factor, index, true)
    },
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="mb-3">
      <a class="btn btn-primary" @click="onEditPressed">Edit</a>
    </div>

    <b-tabs pills justified content-class="p-3 text-muted" v-model="selected_tab">
      <b-tab v-for="(tab, index) of arr_tabs" :key="index">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i :class="tab.icon"></i>
          </span>
          <span class="d-none d-sm-inline-block">{{ tab.tab }}</span>
        </template>
        <component :is="tab.component" 
          :index="index" 
          :tab="selected_tab" 
          :is_view_only="true" 
          :is_submit="is_submit" 
          :data="data" 
          :selected_tab="selected_tab"
          @onValidate="onValidate"
          @onSetArrFactor="onSetArrFactor"/>
      </b-tab>
    </b-tabs>

    <div>
      <a class="btn btn-primary" @click="onBackPressed">Back</a>
    </div>
  </Layout>
</template>