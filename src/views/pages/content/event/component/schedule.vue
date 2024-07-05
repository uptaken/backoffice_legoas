<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import imageBase from 'image-to-base64'
import Base from "@/Utils/base";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit',],
  components: {DatePicker, },
  data() {
    return {
      start_school_registration: null,
      end_school_registration: null,
      start_registration: null,
      end_registration: null,
      start_payment: null,
      end_payment: null,
      coach_meeting: null,
      medal_ceremony: null,
    };
  },
  watch: {
    tab(val){
      if(this.index < val)
        this.validate()
    },
    is_submit(val){
      if(val)
        this.validate()
    },
    data(val){
      if(val.start_school_registration_moment != null){
        this.start_school_registration = val.start_school_registration_moment.toDate()
        this.end_school_registration = val.end_school_registration_moment.toDate()
        this.start_registration = val.start_registration_team_moment.toDate()
        this.end_registration = val.end_registration_team_moment.toDate()
        this.start_payment = val.start_payment_registration_moment.toDate()
        this.end_payment = val.end_payment_registration_moment.toDate()
        this.coach_meeting = val.coach_meeting_moment.toDate()
        this.medal_ceremony = val.medal_ceremony_moment.toDate()
      }
    },
  },
  mounted(){
  },
  methods: {
    disableStartDateSchoolRegistration(date){
      return this.end_school_registration != null && momentTZ(date).isSameOrAfter(momentTZ(this.end_school_registration))
    },
    disableEndDateSchoolRegistration(date){
      return this.start_school_registration != null && momentTZ(date).isSameOrBefore(momentTZ(this.start_school_registration))
    },
    disableStartDateRegistration(date){
      return this.end_registration != null && momentTZ(date).isSameOrAfter(momentTZ(this.end_registration))
    },
    disableEndDateRegistration(date){
      return this.start_registration != null && momentTZ(date).isSameOrBefore(momentTZ(this.start_registration))
    },
    disableStartDatePayment(date){
      return this.end_payment != null && momentTZ(date).isSameOrAfter(momentTZ(this.end_payment))
    },
    disableEndDatePayment(date){
      return this.start_payment != null && momentTZ(date).isSameOrBefore(momentTZ(this.start_payment))
    },
    disableDate(date){
      return momentTZ(date).isSameOrBefore(momentTZ())
    },
    validate(){
      var message = ''
      if(this.school_registration == "")
        message = 'School registration is empty'
      else if(this.registration == "")
        message = 'Registration Team & Player is empty'
      else if(this.payment == "")
        message = 'Payment Registration is empty'
      else if(this.coach_meeting == "")
        message = 'Coach Meeting is empty'
      else if(this.medal_ceremony == "")
        message = 'Medal Ceremony is empty'

      this.$emit('onValidate', message, {
        start_school_registration: momentTZ.tz(this.start_school_registration, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        end_school_registration: momentTZ.tz(this.end_school_registration, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        start_registration_team: momentTZ.tz(this.start_registration, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        end_registration_team: momentTZ.tz(this.end_registration, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        start_payment_registration: momentTZ.tz(this.start_payment, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        end_payment_registration: momentTZ.tz(this.end_payment, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        coach_meeting: momentTZ.tz(this.coach_meeting, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        medal_ceremony: momentTZ.tz(this.medal_ceremony, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
      })
    },
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-6">
          <div class="form-group">
            <label>Start School Registration</label>
            <date-picker v-model="start_school_registration" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableStartDateSchoolRegistration"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>End School Registration</label>
            <date-picker v-model="end_school_registration" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableEndDateSchoolRegistration"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Start Registration Team & Player</label>
            <date-picker v-model="start_registration" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableStartDateRegistration"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>End Registration Team & Player</label>
            <date-picker v-model="end_registration" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableEndDateRegistration"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Start Payment Registration</label>
            <date-picker v-model="start_payment" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableStartDatePayment"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>End Payment Registration</label>
            <date-picker v-model="end_payment" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableEndDatePayment"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Coach Meeting</label>
            <date-picker v-model="coach_meeting" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableDate"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Medal Ceremony</label>
            <date-picker v-model="medal_ceremony" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableDate"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>