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
      name: '',
      arr_category_sport: [],
      arr_selected_category: [],
      arr_scoring_type: [],
      start_date: '',
      end_date: '',
      is_publish: '0',
      is_first_time: true,
    };
  },
  watch: {
    data(val){
      if(val.start_date != null){
        this.is_publish = val.is_publish
        this.name = val.name
        
        this.start_date = val.start_date_moment.toDate()
        this.end_date = val.end_date_moment.toDate()
      }
    },
    tab(val){
      if(this.index < val)
        this.validate()
    },
    // is_submit(val){
    //   if(val)
    //     this.validate()
    // },
  },
  mounted(){
  },
  methods: {
    disableStartDate(date){
      return (this.end_date == "" && momentTZ(date).isSameOrBefore(momentTZ())) || (this.end_date != "" && momentTZ(date).isSameOrAfter(momentTZ(this.end_date)))
    },
    disableEndDate(date){
      return this.start_date != "" && momentTZ(date).isSameOrBefore(momentTZ(this.start_date))
    },
    validate(){
      var message = ''
      if(this.name == "")
        message = 'Name is empty'
      else if(this.start_date == "")
        message = 'Start date is empty'
      else if(this.end_date == "")
        message = 'End date is empty'

      this.$emit('onValidate', message, {
        is_publish: this.is_publish,
        name: this.name,
        start_date: momentTZ.tz(this.start_date, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        end_date: momentTZ.tz(this.end_date, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
      })
    },
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Status Publish</label>
            <div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="exampleRadios" id="radioNotPublish" value="0" v-model="is_publish">
                <label class="form-check-label" for="radioNotPublish">
                  Not Publish
                </label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="radio" name="exampleRadios" id="radioPublish" value="1" v-model="is_publish">
                <label class="form-check-label" for="radioPublish">
                  Publish
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>Name</label>
            <input v-model="name" type="text" class="form-control" placeholder="Name" :readonly="is_view_only" />
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Start Date</label>
            <date-picker v-model="start_date" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableStartDate"/>
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>End Date</label>
            <date-picker v-model="end_date" type="date" input-class="form-control" :disabled="is_view_only" format="DD/MM/YYYY" :disabled-date="disableEndDate"/>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>