<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['selected_tab', ],
  components: {CustomTable, },
  data() {
    return {
      base: null,
      fields: [
        { data: "id", text: 'ID', },
        { data: "category_sport_name", name: "event.name", text: 'Name', },
        { data: "created_at_format", name: "created_at_format", text: 'Created Date', },
        { data: "total_registered_not_canceled", name: "total_registered", text: 'Not Canceled Status Registered', },
        { data: "match_generated_format", name: "total_registered", text: 'Status Match Generated', },
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
      window.localStorage.setItem('event_category_sport', JSON.stringify(row))

      if(action_button.id == "edit")
        window.location.href = '/event/category-sport/action/edit/' + data.id
      else if(action_button.id == "detail")
        window.location.href = '/event/category-sport/detail/' + data.id
    },
    async get_data() {
      var url = base.url_api + '/event?id=' + this.$route.params.id
      var response = await base.request(url);

      this.$emit('onSetArrFactor', 0)
      if (response != null) {
        if (response.status == "success") {
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
        else
          base.show_error(response.message)
      }
      else
        base.show_error("Server Error")
    },
    async get_event_category_sport_data() {
      var url = base.url_api + '/event/category-sport/all?event_id=' + this.$route.params.id
      var response = await base.request(url);

      this.$emit('onSetArrFactor', 1)
      if (response != null) {
        if (response.status == "success") {
          var arr = []
          for(let data of response.data){
            arr.push({
              'ID': data.id,
              'Name': data.category_sport.name,
              'Created Date': momentTZ.tz(data.created_at, base.locale_timezone).format('DD MMM YYYY'),
              'Total Registered': data.total_registered,
              'Action': ''
            })
          }
          this.event_category_sport_arr = arr
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
          <div class="col-12">
            <div class="form-group">
              <label>Name</label>
              <input :value="data.name" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Start Date</label>
              <input :value="data.start_date_moment != null ? data.start_date_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>End Date</label>
              <input :value="data.end_date_moment != null ? data.end_date_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-12">
            <h4 class="m-0">Schedule Event</h4>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Start School Registration</label>
              <input :value="data.start_school_registration_moment != null ? data.start_school_registration_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>End School Registration</label>
              <input :value="data.end_school_registration_moment != null ? data.end_school_registration_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Start Registration Team</label>
              <input :value="data.start_registration_team_moment != null ? data.start_registration_team_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>End Registration Team</label>
              <input :value="data.end_registration_team_moment != null ? data.end_registration_team_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Start Payment Registration</label>
              <input :value="data.start_payment_registration_moment != null ? data.start_payment_registration_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>End Payment Registration</label>
              <input :value="data.end_payment_registration_moment != null ? data.end_payment_registration_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Coach Meeting</label>
              <input :value="data.coach_meeting_moment != null ? data.coach_meeting_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

          <div class="col-6">
            <div class="form-group">
              <label>Medal Ceremony</label>
              <input :value="data.medal_ceremony_moment != null ? data.medal_ceremony_moment.format(base.date_format) : '-'" type="text" class="form-control" disabled />
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <h4 class="m-0">Category Sport</h4>

        <CustomTable
          id="general_info"
          :arr_action_button="arr_action_button"
          :arr="event_category_sport_arr"
          :arr_sort="arr_sort"
          :force_reload="force_reload"
          :fields="fields"
          :url="base.url_api + '/event/category-sport'"
          @onActionClicked="onActionClicked"
          @onLoadComplete="onLoadComplete"/>
      </div>
    </div>
  </div>
</template>