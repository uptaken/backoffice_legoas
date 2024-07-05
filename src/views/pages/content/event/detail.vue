<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import Base from "@/Utils/base";
import $ from 'jquery'
import CustomTable from "@/views/layouts/CustomTable";

import GeneralInfo from "@/views/pages/content/event/component/detail/general_info";
import ListRegistration from "@/views/pages/content/event/component/detail/list_registration";
import ListRegistrationDraft from "@/views/pages/content/event/component/detail/list_registration_draft";
import ListSchool from "@/views/pages/content/event/component/detail/list_school";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Detail Event component
 */
export default {
  page: {
    title: "Detail Event",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, CustomTable, GeneralInfo, ListRegistration, ListRegistrationDraft, ListSchool, },
  data() {
    return {
      base: null,
      title: "Detail Event",
      arr_factor: [false, false, false, false,],
      items: [
        {
          text: "Tables",
          href: "/",
        },
        {
          text: "Detail Event",
          active: true,
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
          id: 'list_team_registration',
          icon: 'far fa-user',
          tab: 'List Team Registration',
          component: 'list-registration',
        },
        {
          id: 'list_team_registration_draft',
          icon: 'far fa-user',
          tab: 'List Team Registration Draft',
          component: 'list-registration-draft',
        },
        {
          id: 'list_school',
          icon: 'far fa-user',
          tab: 'List School/Club',
          component: 'list-school',
        },
      ],
      selected_tab: 0,
      from_tab: -1,
      before_click: '',
    };
  },
  watch:{
    selected_tab(val){
      base.save_tab('Detail Event', this.arr_tabs[val])
    },
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
  },
  async mounted() {
    this.base = new Base()
    base.save_current_page('Detail Event')

    $('#please_wait_modal').modal('show')

    var index = await base.get_tab('Detail Event', this.arr_tabs)
    this.selected_tab = index
  },
  methods: {
    onBackPressed(){
      base.back_page()
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

    <b-tabs pills justified content-class="p-3 text-muted" v-model="selected_tab">
      <b-tab v-for="(tab, index) of arr_tabs" :key="index">
        <template v-slot:title>
          <span class="d-inline-block d-sm-none">
            <i :class="tab.icon"></i>
          </span>
          <span class="d-none d-sm-inline-block">{{ tab.tab }}</span>
        </template>
        <component :is="tab.component" @onSetArrFactor="onSetArrFactor" :selected_tab="selected_tab"/>
      </b-tab>
    </b-tabs>

    <div>
      <a class="btn btn-primary" @click="onBackPressed">Back</a>
    </div>
  </Layout>
</template>