<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";
import NoImage from "@/assets/no_image.png";

import ModalEditTeam from "@/views/pages/content/registration_event/component/detail/modal_edit_team";

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['selected_tab', ],
  components: {CustomTable, ModalEditTeam, },
  data() {
    return {
      base: null,
      fields: [
        { data: "id", text: 'ID', },
        { data: "category_sport_name", name: "event.name", text: 'Name', },
        { data: "created_at_format", name: "created_at_format", text: 'Created Date', },
        { data: "total_registered", name: "total_registered", text: 'All Status Registered', },
        { text: "Action", orderable: false, },
      ],
      arr_action_button: [
        {
          id: 'detail',
          class_button: 'btn-primary',
          icon: 'mdi mdi-eye',
        },
        {
          id: 'edit',
          class_button: 'btn-primary',
          icon: 'mdi mdi-pencil',
        },
        
      ],
      data: {},
      event_category_sport_arr: [],
      arr_sort: [[0, "asc"]],
      force_reload: false,
      arr_match: [],
    };
  },
  watch: {
    selected_tab(val){
      if(val == 0)
        this.force_reload = true
    }
  },
  created(){
    this.base = new Base()

    this.get_data()
    // this.get_event_category_sport_data()
    this.$emit('onSetArrFactor', 1)
  },
  methods: {
    async onActionClicked(row, action_button_index){
      var action_button = this.arr_action_button[action_button_index]
      var data = row

      if(action_button.id == "edit")
        window.location.href = '/event/category-sport/action/edit/' + data.id
      else if(action_button.id == "detail")
        window.location.href = '/event/category-sport/detail/' + data.id
    },
    async get_data() {
      var url = base.url_api + '/event/registration?id=' + this.$route.params.id
      var response = await base.request(url);

      this.$emit('onSetArrFactor', 0)
      if (response != null) {
        if (response.status == "success") {
          response.data.url_image = response.data.file_name != null ? this.base.host + '/media/registration/team?file_name=' + response.data.file_name : NoImage
          response.data.event_category_sport_category.event_category_sport.start_date_moment = momentTZ.tz(response.data.event_category_sport_category.event_category_sport.start_date, this.base.locale_timezone)
          response.data.event_category_sport_category.event_category_sport.end_date_moment = momentTZ.tz(response.data.event_category_sport_category.event_category_sport.end_date, this.base.locale_timezone)

          var arr_match = []
          if(response.data.urgent_order != null){
            for(let detail of response.data.urgent_order.detail){
              if(detail.detail != "Registration Team")
                arr_match.push(detail)
            }
          }
          this.arr_match = arr_match
          this.data = response.data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error("Server Error")
    },
    onLoadComplete(){
      this.force_reload = false
    },
  }
};
</script>

<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-12 col-md-8">
            <div class="form-group">
              <label for="exampleInputPassword1">Team Name</label>
              <input type="text" disabled :value="data.team_name" class="form-control" id="exampleInputPassword1">
            </div>

            <div class="form-group">
              <label for="exampleInputPassword1">Team Category</label>
              <input type="text" disabled :value="data.event_category_sport_category != null ? data.event_category_sport_category.name : ''" class="form-control" id="exampleInputPassword1">
            </div>

            <div class="form-group">
              <label for="exampleInputPassword1">Jersey Team</label>
              <input type="text" disabled :value="data.jersey_team" class="form-control" id="exampleInputPassword1">
            </div>

            <div class="form-group">
              <label for="exampleInputPassword1">Other Jersey Team</label>
              <input type="text" disabled :value="data.other_jersey_team" class="form-control" id="exampleInputPassword1">
            </div>
          </div>
          <div class="col-12 col-md-4 text-center">
            <img :src="data.event_category_sport_category != null ? (base.host + '/media/category-sport?file_name=' + data.event_category_sport_category.event_category_sport.category_sport.file_name) : ''" style="width: 10rem" />
            <div class="ml-3">
              <h4>{{ data.event_category_sport_category != null ? data.event_category_sport_category.event_category_sport.category_sport.name : '' }}</h4>
              <div class="bg-primary text-white rounded px-3 py-1">{{ data.event_category_sport_category != null ? data.event_category_sport_category.event_category_sport.start_date_moment.format('DD MMMM YYYY') : '' }} - {{ data.event_category_sport_category != null ? data.event_category_sport_category.event_category_sport.end_date_moment.format('DD MMMM YYYY') : '' }}</div>
            </div>

            <div class="mt-3">
              <p class="m-0">Image</p>
              <img :src="data.url_image" style="width: 10rem" />
            </div>
          </div>
          <div class="col-12">
            <button class="btn btn-outline-primary" data-toggle="modal" data-target="#editTeamModal">Edit</button>
          </div>
          <div class="col-12 my-3">
            <hr/>
          </div>
          <div class="col-12 col-md-6">
            <div class="d-flex flex-column">
              <label>Payment Status</label>
              <div class="rounded w-auto px-3 py-3 text-white" :class="data.urgent_order != null && data.urgent_order.status_payment == 'unpaid' ? 'bg-warning' : 'bg-success'">{{ data.urgent_order != null && data.urgent_order.status_payment == 'unpaid' ? 'Wait for Payment' : 'Paid' }}</div>
            </div>

            <div class="form-group mt-3">
              <label for="exampleInputPassword1">Amount to be Paid</label>
              <input type="text" disabled :value="(data.urgent_order != null ? data.urgent_order.total_price : 0).toLocaleString(base.locale_string)" class="form-control" id="exampleInputPassword1">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="mt-4" v-if="data.urgent_order != null && data.urgent_order.detail.length > 0">
                  <p class="m-0 font-weight-bold">Registered Team</p>
                  <div class="d-flex justify-content-between">
                    <p class="m-0">{{ data.urgent_order.detail[0].amount + ' ' + data.urgent_order.detail[0].detail }}</p>
                    <p class="m-0">Rp. {{ (data.urgent_order.detail[0].amount * data.urgent_order.detail[0].price).toLocaleString(base.locale_string) }}</p>
                  </div>
                </div>

                <div class="mt-4" v-if="data.urgent_order != null && data.urgent_order.detail.length > 1">
                  <p class="m-0 font-weight-bold">Registered Match</p>
                  <div class="d-flex justify-content-between" v-for="(match, index) in arr_match" :key="index">
                    <p class="m-0">{{ match.amount + ' ' + match.detail }}</p>
                    <p class="m-0">Rp. {{ (match.amount * match.price).toLocaleString(base.locale_string) }}</p>
                  </div>
                </div>

                <div class="mt-4">
                  <div class="d-flex justify-content-between">
                    <p class="m-0">Subtotal</p>
                    <p class="m-0">Rp. {{ (data.urgent_order != null ? data.urgent_order.subtotal : 0).toLocaleString(base.locale_string) }}</p>
                  </div>

                  <div class="d-flex justify-content-between">
                    <p class="m-0">Service Charge</p>
                    <p class="m-0">Rp. {{ (data.urgent_order != null ? data.urgent_order.admin_fee : 0).toLocaleString(base.locale_string) }}</p>
                  </div>

                  <div class="d-flex justify-content-between">
                    <p class="m-0 font-weight-bold">Total</p>
                    <p class="m-0 text-primary">Rp. {{ (data.urgent_order != null ? data.urgent_order.total_price : 0).toLocaleString(base.locale_string) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    
    <ModalEditTeam :team_data="data"/>
  </div>
</template>