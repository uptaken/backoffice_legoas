<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Detail Order component
 */
export default {
  page: {
    title: "Detail Order",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, CustomTable, },
  data() {
    return {
      base: null,
      title: "Detail Order",
      items: [
        {
          text: "Tables",
          href: "/",
        },
        {
          text: "Detail Order",
          active: true,
        }
      ],
      data: {},
      event_category_sport_arr: [],
      fields: [
        { key: "ID", sortable: true },
        { key: "Name", sortable: true },
        { key: "Created Date", sortable: true },
        { key: "Total Registered", sortable: true },
        { key: "Action", sortable: false },
      ],
      arr_action_button: [
        {
          id: 'edit',
          class_button: 'btn-primary',
          icon: 'mdi mdi-pencil',
        },
        {
          id: 'detail',
          class_button: 'btn-primary',
          icon: 'mdi mdi-eye',
        },
      ],
    };
  },
  async mounted() {
    // Set the initial number of items
    this.base = new Base()
    base.save_current_page('Detail Order')

    this.get_data()
  },
  methods: {
    async get_data() {
      $('#please_wait_modal').modal('show')
      var url = base.url_api + '/order?id=' + this.$route.params.id
      var response = await base.request(url);

      setTimeout(() => {
        $('#please_wait_modal').modal('hide')
      }, 500)
      if (response != null) {
        if (response.status == "success") {
          response.data.created_at_moment = momentTZ.tz(response.data.created_at, base.locale_timezone)
          if(response.data.paid_at != null)
            response.data.paid_at_moment = momentTZ.tz(response.data.paid_at, base.locale_timezone)
          this.data = response.data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error("Server Error")
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

    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label>ID</label>
              <input :value="data.id" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Created Date</label>
              <input :value="data.created_at_moment != null ? data.created_at_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6" v-if="data.paid_at_moment != null">
            <div class="form-group">
              <label>Paid Date</label>
              <input :value="data.paid_at_moment.format(base.date_format)" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Status</label>
              <input :value="data.status_format" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Category Sport</label>
              <input :value="data.event_category_sport_category.event_category_sport.category_sport.name" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Team Name</label>
              <input :value="data.registration_event.team_name" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Event</label>
              <input :value="data.event.name" type="text" class="form-control" disabled />
            </div>

            <div class="form-group">
              <label>School / Club Name</label>
              <input :value="data.user.name" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="card">
              <div class="card-body">
                <div class="mt-4" v-if="data.detail != null && data.detail.length > 0">
                  <p class="m-0 font-weight-bold">Detail Order</p>
                  <div class="d-flex justify-content-between" v-for="(detail, index) in data.detail" :key="index">
                    <p class="m-0">{{ detail.amount + ' ' + detail.detail }}</p>
                    <p class="m-0">Rp. {{ (detail.amount * detail.price).toLocaleString(base.locale_string) }}</p>
                  </div>
                </div>

                <div class="mt-4">
                  <div class="d-flex justify-content-between">
                    <p class="m-0">Subtotal</p>
                    <p class="m-0">Rp. {{ data.subtotal.toLocaleString(base.locale_string) }}</p>
                  </div>

                  <div class="d-flex justify-content-between">
                    <p class="m-0">Service Charge</p>
                    <p class="m-0">Rp. {{ data.admin_fee.toLocaleString(base.locale_string) }}</p>
                  </div>

                  <div class="d-flex justify-content-between">
                    <p class="m-0 font-weight-bold">Total</p>
                    <p class="m-0">Rp. {{ data.total_price.toLocaleString(base.locale_string) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div>
      <a class="btn btn-primary" @click="onBackPressed">Back</a>
    </div>
  </Layout>
</template>