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
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit', ],
  components: {CustomTable, },
  data() {
    return {
      base: null,
      fields: [
        { data: "id", text: 'ID', },
        { data: "user_name", name: "user.name", text: 'User Name', },
        { data: "team_name", name: "registration_event.team_name", text: 'Team Name', },
        { data: "created_at_format", name: "created_at_format", text: 'Created Date', },
        { data: "status_format", name: "registration_event.status", text: 'Status', },
        { data: "jersey_team", name: "registration_event.jersey_team", text: 'Jersey', },
        { data: "total_player", name: "total_player", text: 'Total Player', },
        { data: "total_coach", name: "total_coach", text: 'Total Coach', },
        // { data: "Action", sortable: false },
      ],
      arr_action_button: [
      ],
      arr_top_button: [
      ],
      arr: [],
      arr_sort: [[0, "desc"]],
      force_reload: false,
      payment_status: 'paid',
      url: ''
    };
  },
  watch: {
    selected_tab(val){
      if(val == 3)
        this.force_reload = true
    },
    payment_status(val){
      this.url = this.base.url_api + '/event/registration?rel_type=simple&event_category_sport_id=' + this.$route.params.id + '&payment_status=' + val
    },
    tab(val){
      if(this.index < val)
        this.validate()
    },
  },
  mounted(){
    this.base = new Base()
    this.url = this.base.url_api + '/event/registration?rel_type=simple&event_category_sport_id=' + this.$route.params.id
  },
  methods: {
    onTopButtonClicked(){},
    onActionClicked(){},
    onLoadComplete(){
    },
    validate(){
      var message = ''
      if(this.payment_status == '0')
        message = 'Payment Status is not choosen'

      this.$emit('onValidate', message, {
        payment_status: this.payment_status,
        event_category_sport_id: this.$route.params.id,
      })
    },
  }
};
</script>

<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="form-group">
          <label>Payment Status for Group Member</label>
          <div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="inlineRadio1" v-model="payment_status" value="paid">
              <label class="form-check-label" for="inlineRadio1">Paid</label>
            </div>

            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="inlineRadio2" v-model="payment_status" value="all">
              <label class="form-check-label" for="inlineRadio2">All</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" v-if="tab == index">
      <div class="card-body">
        <CustomTable
          :arr_action_button="arr_action_button"
          :arr_top_button="arr_top_button"
          :arr="arr"
          :arr_sort="arr_sort"
          :force_reload="force_reload"
          :fields="fields"
          :url="url"
          @onActionClicked="onActionClicked"
          @onTopButtonClicked="onTopButtonClicked"
          @onLoadComplete="onLoadComplete"/>
      </div>
    </div>
  </div>
</template>