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

import GeneralInfo from "@/views/pages/content/category_sport/component/general_info";
import Coordinator from "@/views/pages/content/category_sport/component/coordinator";
import Category from "@/views/pages/content/category_sport/component/category";

const base = new Base()

import {
    required,

} from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Edit Category Sport component
 */
export default {
  page: {
    title: "Edit Category Sport",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { 
    Layout, 
    PageHeader, 
    CustomEditor,
    GeneralInfo,
    Coordinator,
    Category,
  },
  data() {
    return {
      tableData: [],
      title: "Edit Category Sport",
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
          text: "Edit Category Sport",
          active: true
        }
      ],
      arr_tabs: [],
      is_submit: false,
      selected_tab: 0,
      before_click: '',
      data: {},
    };
  },
  watch: {
    async data(val){
      if(this.is_submit)
        this.edit_action()
    },
  },
  async mounted() {
    base.save_current_page('Edit Category Sport')
    this.get_data()
  },
  methods: {
    async get_data() {
      $('#please_wait_modal').modal('show')
      var url = base.url_api + '/event/category-sport?id=' + this.$route.params.id
      var response = await base.request(url);

      setTimeout(() => {
        $('#please_wait_modal').modal('hide')
      }, 500)
      if (response != null) {
        if (response.status == "success") {
          // response.data.date_moment = momentTZ.tz(response.data.date, base.locale_timezone)
          response.data.start_date_moment = momentTZ.tz(response.data.start_date, base.locale_timezone)
          response.data.end_date_moment = momentTZ.tz(response.data.end_date, base.locale_timezone)
          response.data.arr_category = response.data.category
          response.data.arr_coordinator = response.data.coordinator
          if(response.data.scoring_type != null)
            response.data.scoring_type.label = response.data.scoring_type.name
          this.data = response.data
          
          this.arr_tabs = [
            {
              icon: 'far fa-user',
              tab: 'General Info',
              component: 'general-info',
            },
            {
              icon: 'far fa-user',
              tab: 'Category',
              component: 'category',
            },
            {
              icon: 'far fa-user',
              tab: 'Coordinator',
              component: 'coordinator',
            },
            // {
            //   icon: 'far fa-user',
            //   tab: 'List Registration',
            //   component: 'general-info',
            // },
          ]
        }
        else
            this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
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
      }
      var data_obj = this.data
      for(let x in data)
        data_obj[x] = data[x]
      this.data = data_obj

      if(this.is_submit){
        var context = this
        setTimeout(() => {
          context.edit_action()
        }, 500)
      }
    },
    async edit_action(){
      this.is_submit = false
      $('#please_wait_modal').modal('show')
      var response = await base.request(base.url_api + '/event/category-sport/edit', 'post', this.data);

      $('#please_wait_modal').modal('hide')
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
    onBackPressed(){
      base.back_page()
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