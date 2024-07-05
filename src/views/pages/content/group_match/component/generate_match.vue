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
import NoImage from '@/assets/no_image.png';

import CustomGroup from "@/views/layouts/CustomGroup";
import CustomEditGroup from "@/views/layouts/CustomEditGroup";

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit',],
  components: {DatePicker, CustomGroup, CustomEditGroup, },
  data() {
    return {
      base: null,
      arr_group: [],
      arr_match: [],
      selected_data: null,
      arr_index: -1,
      isEdit: false,
    };
  },
  watch: {
    tab(val){
      if(this.index < val)
        this.validate()
      else if(this.index == val)
        this.get_data()
      else
        this.isEdit = false
    },
    is_submit(val){
      if(val)
        this.validate()
    },
  },
  mounted(){
    this.base = new Base()
  },
  methods: {
    async get_data() {
      $('#please_wait_modal').modal('show')
      var url = base.url_api + '/event/registration/generate-match?rel_type=simple&condition=' + JSON.stringify(this.data)
      var response = await base.request(url);

      setTimeout(() => {
        $('#please_wait_modal').modal('hide')
      }, 500)
      if (response != null) {
        if (response.status == "success") {
          for(let group of response.arr_group){
            for(let member of group){
              member.date = momentTZ.tz(member.match_date, this.base.locale_timezone)
              member.date_format = momentTZ.tz(member.match_date, this.base.locale_timezone).format('YYYY-MM-DD HH:mm:ss')
              member.url_image = member.url_image != null ? member.url_image : NoImage
              for(let opponent of member.arr_opponent){
                opponent.date = momentTZ.tz(opponent.match_date, this.base.locale_timezone)
                opponent.date_format = momentTZ.tz(opponent.match_date, this.base.locale_timezone).format('YYYY-MM-DD HH:mm:ss')
                opponent.url_image = opponent.url_image != null ? opponent.url_image : NoImage
              }
            }
          }
          for(let group_match of response.arr_group_match){
            for(let match of group_match){
              match.date = momentTZ.tz(match.date, this.base.locale_timezone)
              match.date_format = momentTZ.tz(match.date, this.base.locale_timezone).format('YYYY-MM-DD HH:mm:ss')
            }
          }
          this.arr_group = response.arr_group
          this.arr_match = response.arr_group_match
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    async validate(){
      $('#please_wait_modal').modal('show')

      var response = await base.request(base.url_api + '/group-match', 'post', {
        arr_group: this.arr_group,
        arr_match: this.arr_match,
        total_max_team: this.data.total_max_team,
        payment_status: this.data.payment_status,
      });

      setTimeout(() => {
        $('#please_wait_modal').modal('hide')
      }, 500)
      
      if (response != null) {
        if (response.status == "success") {
          this.$emit('onNextClicked')
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    onEditClicked(){
      this.isEdit = true
    },
    onEditSaveClicked(arr_group, arr_match){
      for(let group of arr_group){
        for(let member of group){
          for(let opponent of member.arr_opponent){
            opponent.date = momentTZ.tz(opponent.match_date, this.base.locale_timezone)
            opponent.date_format = momentTZ.tz(opponent.match_date, this.base.locale_timezone).format('YYYY-MM-DD HH:mm:ss')
            opponent.url_image = opponent.url_image != null ? opponent.url_image : NoImage
          }
        }
      }

      this.arr_group = arr_group
      this.arr_match = arr_match
      this.isEdit = false
    },
  }
};
</script>

<template>
  <div>
    <div v-if="isEdit">
      <CustomEditGroup :arr="arr_group" :match="arr_match" @onSaveClicked="onEditSaveClicked"/>
      
    </div>

    <div v-else>
      <div class="card">
        <div class="card-body">
          <h4>Hasil Generated Club / Match</h4>
          <p>Berikut dibawah adalah hasil Generate Club & Match.  Apakah Anda ingin melakukan edit hasil generate nya?</p>
          <div class="d-flex">
            <button class="btn btn-outline-primary" @click="onEditClicked">Ya</button>
            <button class="btn btn-primary ml-3" @click="validate">Tidak, Sudah Cukup</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <CustomGroup :arr="arr_group"/>
        </div>
      </div>
    </div>

    
  </div>
</template>