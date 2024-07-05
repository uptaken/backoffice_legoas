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

import GeneralInfo from "@/views/pages/content/event/component/general_info";
import EventDate from "@/views/pages/content/event/component/schedule";

const base = new Base()

import {
    required,

} from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Edit Event component
 */
export default {
    page: {
        title: "Edit Event",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { 
        Layout, 
        PageHeader, 
        CustomEditor,
        GeneralInfo,
        EventDate,
        // ckeditor: CKEditor.component 
    },
    data() {
        return {
            tableData: [],
            title: "Edit Event",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Edit Event",
                    active: true
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
                tab: 'Schedule Event',
                component: 'event-date',
              },
            ],
            is_submit: false,
            selected_tab: 0,
            from_tab: -1,
            before_click: '',
            data: {},
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
    async mounted() {
        // Set the initial number of items

        if (this.$route.params.id != null) {
          base.save_current_page('Edit Event')
            this.is_view_only = true
            this.get_data()
        }
        else
          base.save_current_page('Add Event')
    },
    methods: {
        async get_data() {
          $('#please_wait_modal').modal('show')
            var url = base.url_api + '/event?id=' + this.$route.params.id
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
              if (response.status == "success") {
                response.data.arr_selected_category = response.data.category_sport
                response.data.start_date_moment = momentTZ.tz(response.data.start_date, base.locale_timezone)
                response.data.end_date_moment = momentTZ.tz(response.data.end_date, base.locale_timezone)
                response.data.start_school_registration_moment = momentTZ.tz(response.data.start_school_registration, base.locale_timezone)
                response.data.end_school_registration_moment = momentTZ.tz(response.data.end_school_registration, base.locale_timezone)
                response.data.start_registration_team_moment = momentTZ.tz(response.data.start_registration_team, base.locale_timezone)
                response.data.end_registration_team_moment = momentTZ.tz(response.data.end_registration_team, base.locale_timezone)
                response.data.start_payment_registration_moment = momentTZ.tz(response.data.start_payment_registration, base.locale_timezone)
                response.data.end_payment_registration_moment = momentTZ.tz(response.data.end_payment_registration, base.locale_timezone)
                response.data.coach_meeting_moment = momentTZ.tz(response.data.coach_meeting, base.locale_timezone)
                response.data.medal_ceremony_moment = momentTZ.tz(response.data.medal_ceremony, base.locale_timezone)

                this.data = response.data
              }
            }
        },
        async onNextClicked(){
          this.before_click = 'next'
          if(this.selected_tab < this.arr_tabs.length - 1){
            var selected_tab = this.selected_tab
            this.selected_tab++
            this.from_tab = selected_tab
          }
          else{
            this.is_submit = true
            this.from_tab = this.selected_tab
          }
        },
        onPreviousClicked(){
          this.before_click = 'prev'
          if(this.selected_tab > 0){
            var selected_tab = this.selected_tab
            this.selected_tab--
            this.from_tab = selected_tab
          }
        },
        async onValidate(message, data){
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

          if(this.from_tab == this.selected_tab){
            this.is_submit = false
            $('#please_wait_modal').modal('show')
            var response = await base.request(base.url_api + '/event' + (data_obj.id != null ? '/edit' : ''), 'post', data_obj);

            $('#please_wait_modal').modal('hide')
            if (response != null) {
              if (response.status == "success") {
                base.back_page()
              }
            }
          }
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