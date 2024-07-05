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
import ListRegistration from "@/views/pages/content/category_sport/component/list_registration";
import ListRegistrationDraft from "@/views/pages/content/category_sport/component/list_registration_draft";
import ListPlayer from "@/views/pages/content/category_sport/component/list_player";
import ListCoach from "@/views/pages/content/category_sport/component/list_coach";
import GroupMatch from "@/views/pages/content/category_sport/component/group_match";

const base = new Base()

import {
    required,

} from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Detail Category Sport component
 */
export default {
  page: {
    title: "Detail Category Sport",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { 
    Layout, 
    PageHeader, 
    CustomEditor,
    GeneralInfo,
    Coordinator,
    Category,
    ListRegistration,
    ListRegistrationDraft,
    ListPlayer,
    ListCoach,
    GroupMatch,
  },
  data() {
    return {
      tableData: [],
      arr_factor: [false, false, false, false, false, false, false, false, false,],
      title: "Detail Category Sport",
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
          text: "Detail Category Sport",
          active: true
        }
      ],
      arr_tabs: [],
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
      
      if(val.id != null){
        this.arr_tabs = [
          {
            id: 'general_info',
            icon: 'far fa-user',
            tab: 'General Info',
            component: 'general-info',
          },
          {
            id: 'category',
            icon: 'far fa-user',
            tab: 'Category',
            component: 'category',
          },
          {
            id: 'coordinator',
            icon: 'far fa-user',
            tab: 'Coordinator',
            component: 'coordinator',
          },
          {
            id: 'list_registration',
            icon: 'far fa-user',
            tab: 'List Registration',
            component: 'list-registration',
          },
          {
            id: 'list_registration_draft',
            icon: 'far fa-user',
            tab: 'List Registration Draft',
            component: 'list-registration-draft',
          },
          {
            id: 'list_player',
            icon: 'far fa-user',
            tab: 'List Player',
            component: 'list-player',
          },
          {
            id: 'list_coach',
            icon: 'far fa-user',
            tab: 'List Coach',
            component: 'list-coach',
          },
          
          {
            id: 'group_match',
            icon: 'far fa-user',
            tab: 'Group & Match',
            component: 'group-match',
          },
        ]
        
        // this.get_tab()
      }
    },
    arr_tabs(){
      var context = this
      setTimeout(() => {
        context.get_tab()
      }, 500)
    },
  },
  async mounted() {
    // base.save_current_page('Detail Category Sport')
    var event_category_sport = window.localStorage.getItem('event_category_sport')
    event_category_sport = JSON.parse(event_category_sport)
    

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
      
      var url = base.url_api + '/event/category-sport?id=' + this.$route.params.id
      var response = await base.request(url);

      // this.$set(this.arr_factor, 0, true)
      if (response != null) {
        if (response.status == "success") {
          response.data.start_date_moment = momentTZ.tz(response.data.start_date, base.locale_timezone)
          response.data.end_date_moment = momentTZ.tz(response.data.end_date, base.locale_timezone)
          response.data.arr_category = response.data.category
          response.data.arr_coordinator = response.data.coordinator
          response.data.scoring_type.label = response.data.scoring_type.name
          await base.save_current_page(response.data.category_sport.name)
          this.data = response.data
          
          if(response.data.is_match_generated)
            this.arr_factor = [true, false, false, false, false, false, false, false, false, false,]
          else
            this.arr_factor = [true, false, false, false, false, false, ]
          
          this.title = response.data.category_sport.name
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
      var data_obj = JSON.parse(JSON.stringify(this.data))
      for(let x in data)
        data_obj[x] = data[x]
      this.data = data_obj
    },
    onBackPressed(){
      base.back_page()
    },
    onEditPressed(){
      window.location.href = "/event/category-sport/action/edit/" + this.data.id
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