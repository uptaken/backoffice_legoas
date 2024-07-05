<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import momentTZ from 'moment-timezone';
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTextareaArray from "@/views/layouts/CustomTextareaArray";
import CustomTable from "@/views/layouts/CustomTable";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Order component
 */
export default {
    page: {
        title: "Order",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTextareaArray, CustomTable, DatePicker, },
    data() {
        return {
          base: null,
            tableData: [],
            title: "Order",
            fields: [
              { data: "id", name: "order.id", text: 'ID', },
              { data: "user_name", name: "user.name", text: 'User Name', },
              { data: "category_sport_name", name: "category_sport.name", text: 'Category Sport Name', },
              { data: "team_name", name: "registration_event.team_name", text: 'Team Name', },
              { data: "event_name", name: "event.name", text: 'Event Name', },
              { data: "total_price_format", name: "order.total_price", text: 'Total Price', },
              { data: "status_format", name: "order.status", text: 'Status', },
              { data: "created_at_format", name: "created_at_format", text: 'Created Date', },
              { text: "Action", orderable: false, },
            ],
            arr_action_button: [
              {
                id: 'detail',
                class_button: 'btn-primary',
                icon: 'mdi mdi-eye',
              },
              {
                id: 'remove',
                class_button: 'btn-danger',
                // icon: 'mdi mdi-trash-can',
                text: 'Change to Cancel',
              },
            ],
            arr_action_condition: [
              {
                id: 'status',
                condition: 'not_same',
                value: 'success',
                arr_action_button: ['remove',],
              },
            ],
            arr_top_button: [
            ],
            arr_sort: [[0, "desc"]],
          force_reload: false,
          filter_month: null,
          momentNow: momentTZ(),
          total_revenue: 0,
        };
    },
    watch: {
      filter_month(val){
        this.get_total_revenue()
      },
    },
    async created() {
      this.base = new Base()
      base.save_current_page('Order', true)
      // Set the initial number of items
      this.get_total_revenue()
    },
    methods: {
      async get_total_revenue() {
        $('#please_wait_modal').modal('show')
        var url = base.url_api + '/order/total-revenue?month=' + (this.filter_month != null ? this.filter_month : '')
        var response = await base.request(url);

        setTimeout(() => {
          $('#please_wait_modal').modal('hide')
        }, 500)
        if (response != null) {
          if (response.status == "success") {
            this.total_revenue = response.data[0].total_price != null ? response.data[0].total_price : 0
          }
        }
      },
      async onActionClicked(row, action_button_index){
        var action_button = this.arr_action_button[action_button_index]
        var data = row

        if(action_button.id == "detail")
          window.location.href = '/order/detail/' + data.id
        else if(action_button.id == "remove"){
          if(confirm('Are You Sure to Delete this data?')){
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/order/delete?id=' + data.id
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            if (response != null) {
              if (response.status == "success") {
                window.location.reload()
              }
            }
          }
        }
      },
      disableBirthDate(date){
        return momentTZ(date).isSameOrAfter(momentTZ())
      },
    }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="card">
      <div class="card-body">
        <h5>Filter</h5>

        <div class="d-flex justify-content-between align-items-center">
          <div>
            <label>Month</label>
            <date-picker v-model="filter_month" type="month" :default-value="momentNow.toDate()" value-type="format" input-class="form-control mb-3" :format="base.month_format" :disabled-date="disableBirthDate"/>
          </div>
          <div class="text-right">
            <label>Total Revenue {{ filter_month != null ? 'This Month' : '' }}</label>
            <p class="m-0">Rp. {{ total_revenue.toLocaleString(base.locale_string) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <CustomTable
          :arr_action_button="arr_action_button"
          :arr_top_button="arr_top_button"
          :arr_action_condition="arr_action_condition"
          :arr="tableData"
          :arr_sort="arr_sort"
          :fields="fields"
          @onActionClicked="onActionClicked"
          :url="base.url_api + '/order?month=' + (filter_month != null ? filter_month : '')"/>
      </div>
    </div>
  </Layout>
</template>