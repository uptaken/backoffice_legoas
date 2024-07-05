<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Registration by Category component
 */
export default {
    page: {
        title: "Registration by Category",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTable, },
    data() {
        return {
          base: null,
          tableData: [],
          title: "Registration by Category",
          items: [
              {
                  text: "Tables",
                  href: "/"
              },
              {
                  text: "Registration by Category",
                  active: true
              }
          ],
          fields: [
            { data: "id", text: 'ID', },
            { data: "user_name", name: "user.name", text: 'School / Club Name', },
            { data: "team_name", name: "registration_event.team_name", text: 'Team Name', },
            { data: "type_name", name: "type.name", text: 'School / Club', },
            { data: "event_category_sport_category_name", name: "event_category_sport_category.name", text: 'Category Name', },
            { data: "created_at_format", name: "created_at_format", text: 'Created Date', },
            { data: "status_format", name: "registration_event.status", text: 'Status', },
            { data: "total_player", name: "total_player", text: 'Total Player', },
            { data: "total_coach", name: "total_coach", text: 'Total Coach', },
            { text: "Action", orderable: false, },
          ],
          arr_action_button: [
            {
              id: 'detail',
              class_button: 'btn-primary',
              icon: 'mdi mdi-eye',
            },
            {
              id: 'contact_wa',
              class_button: 'btn-primary',
              icon: 'mdi mdi-whatsapp',
            },
          ],
          arr_top_button: [
            {
              id: 'download_excel',
              class_button: 'btn btn-sm btn-primary text-white',
              text: 'Export Excel',
              type: 'custom',
            },
          ],
          arr: [],
          arr_sort: [[0, "desc"]],
          force_reload: false,
        };
    },
    watch: {
      tab(val){
        if(this.index < val)
          this.validate()
      },
      selected_tab(val){
        if(val == 3)
          this.force_reload = true
      }
    },
    async created() {
      this.base = new Base()
        // Set the initial number of items
      // base.save_current_page('Registration by Category')
      await this.get_data()
    },
    methods: {
      async get_data() {
        var url = this.base.url_api + '/event/category-sport/category?id=' + this.$route.params.id
        var response = await base.request(url);

        if (response != null) {
          if (response.status == "success") {
            this.event_category_sport_category = response.data

            this.title = 'Registration by Category ' + response.data.name
            base.save_current_page('Registration by Category ' + response.data.name)
          }
          else
              this.base.show_error(response.message)
        }
        else
          console.log('Server Error')
      },
      async onActionClicked(row, action_button_index){
        var action_button = this.arr_action_button[action_button_index]
        var data = row

        // if(action_button.id == "edit")
        //   window.location.href = '/event/category-sport/action/edit/' + data.ID
        if(action_button.id == "detail")
          window.location.href = '/registration/detail/' + data.id
        else if(action_button.id == "contact_wa")
          window.open('https://wa.me/' + data.user.phone, '_blank')
      },
      onTopButtonClicked(index){
        var top_button = this.arr_top_button[index]

        if(top_button.id == 'download_excel')
          window.open(base.host + '/export/registration/excel?event_category_sport_id=' + this.$route.params.id, '_blank')
      },
      onLoadComplete(){
        this.force_reload = false
      },
      onBackPressed(){
        this.base.back_page()
      },
    }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div>
      <a class="btn btn-primary" @click="onBackPressed">Back</a>
    </div>

    <div class="card mt-3">
      <div class="card-body">
        <CustomTable
          :arr_action_button="arr_action_button"
          :arr_top_button="arr_top_button"
          :arr="arr"
          :arr_sort="arr_sort"
          :force_reload="force_reload"
          :fields="fields"
          :url="base.url_api + '/event/registration?type=live&rel_type=simple&payment_status=not_canceled&event_category_sport_category_id=' + $route.params.id"
          @onActionClicked="onActionClicked"
          @onTopButtonClicked="onTopButtonClicked"
          @onLoadComplete="onLoadComplete"/>
      </div>
    </div>
  </Layout>
</template>