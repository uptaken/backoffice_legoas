<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import Base from "@/Utils/base";
import $ from 'jquery'
import CustomTable from "@/views/layouts/CustomTable";

import GeneralInfo from "@/views/pages/content/registration_event/component/detail/general_info";
import ListPlayer from "@/views/pages/content/registration_event/component/detail/list_player";
import ListCoach from "@/views/pages/content/registration_event/component/detail/list_coach";
import ModalEditTeam from "@/views/pages/content/registration_event/component/detail/modal_edit_team";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Detail Registration component
 */
export default {
  page: {
    title: "Detail Registration",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, CustomTable, GeneralInfo, ListPlayer, ListCoach, ModalEditTeam, },
  data() {
    return {
      base: null,
      title: "Detail Registration",
      arr_factor: [false, false, false, false,],
      items: [
        {
          text: "Tables",
          href: "/",
        },
        {
          text: "Detail Registration",
          active: true,
        }
      ],
      arr_tabs: [
        {
          icon: 'far fa-user',
          tab: 'General Info',
          component: 'general-info',
        },
        {
          icon: 'far fa-user',
          tab: 'List Player',
          component: 'list-player',
        },
        {
          icon: 'far fa-user',
          tab: 'List Coach',
          component: 'list-coach',
        },
      ],
      selected_tab: 0,
      from_tab: -1,
      before_click: '',
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
  },
  async mounted() {
    this.base = new Base()
    base.save_current_page('Detail Registration')

    $('#please_wait_modal').modal('show')
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