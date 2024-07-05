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
  props: ['match', 'data', 'onShow', ],
  components: {DatePicker, },
  data() {
    return {
      base: null,
      id: '',
      date: '',
      time: '',
      referee: '',
      judge1: '',
      judge2: '',
      selected_venue: '',
      selected_court: '',
      arr_venue: [],
      arr_court: [],
    };
  },
  watch: {
    match(val){
      if(val.id != null){
        this.id = val.id
        this.date = val.date.format('DD/MM/YYYY')
        this.time = val.date.format('HH:mm')
        this.selected_venue = val.event_category_sport_venue.venue.id
        this.selected_court = val.event_category_sport_venue.id
        this.referee = val.referee
        this.judge1 = val.judge1
        this.judge2 = val.judge2
      }
    },
    onShow(val){

      if(val){
        this.onVenueSearch('')
      }
    },
    selected_venue(val){
      this.onCourtSearch('')
    },
    date(val){
      this.onCourtSearch('')
    },
    time(val){
      this.onCourtSearch('')
    },
    id(val){
      this.onCourtSearch('')
    },
  },
  mounted(){
    this.base = new Base()
  },
  methods: {
    reset(){
      this.date = ''
      this.time = ''
      this.selected_venue = ''
      this.selected_court = ''
    },
    disableMatchDate(date){
      return this.data != null && (momentTZ(date).isSameOrBefore(momentTZ(this.data.start_date)) || momentTZ(date).isSameOrAfter(momentTZ(this.data.end_date)))
    },
    async onVenueSearch(search){
      if(this.data.id != null){
        var response = await this.base.request(this.base.url_api + "/venue?event_category_sport_id=" + this.data.id + "&search=" + search)

        if(response != null){
          if(response.status == "success"){
            for(let venue of response.data){
              venue.label = venue.name
            }
            this.arr_venue = response.data
          }
          else
            this.base.show_error(response.message)
        }
        else
          this.base.show_error(this.$t('server_error'))
      }
    },
    async onCourtSearch(search){
      if(this.data.id != null && this.selected_venue != ''){
        var date = momentTZ(this.date + " " + this.time, 'DD/MM/YYYY HH:mm')
        var response = await this.base.request(this.base.url_api + "/event/category-sport/venue?not_id=" + this.id + "&date=" + date.format('YYYY-MM-DD HH:mm:ss') + "&event_category_sport_id=" + this.data.id + "&venue_id=" + this.selected_venue + "&court=" + search)

        if(response != null){
          if(response.status == "success"){
            for(let venue of response.data){
              venue.label = venue.court
            }
            this.arr_court = response.data
          }
          else
            this.base.show_error(response.message)
        }
        else
          this.base.show_error(this.$t('server_error'))
      }
    },
    async onSubmit(){
      if(this.date == "")
        base.show_error('Date is empty')
      else if(this.time == "")
        base.show_error('Time is empty')
      else if(this.selected_venue == '')
        base.show_error('Venue is empty')
      else if(this.selected_court == '')
        base.show_error('Court is empty')
      else{
        $('#please_wait_modal').modal('show')
        var date = momentTZ(this.date + " " + this.time, 'DD/MM/YYYY HH:mm')

        var response = await base.request(base.url_api + '/match/edit', 'post', {
          id: this.id,
          date: date.format('YYYY-MM-DD HH:mm:ss'),
          event_category_sport_venue_id: this.selected_court,
          referee: this.referee,
          judge1: this.judge1,
          judge2: this.judge2,
        });

        setTimeout(() => {
          $('#please_wait_modal').modal('hide')
        }, 500)
        
        if (response != null) {
          if (response.status == "success") {
            this.reset()
            this.$emit('onForceReload')
            $('#editMatch').modal('hide')
          }
          else
            this.base.show_error(response.message)
        }
        else
          console.log('Server Error')
        
      }
    },
  }
};
</script>

<template>
  <div class="modal fade" id="editMatch" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Match</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12" v-if="match.id != null">
              <div class="d-flex">
                <div>
                  <p class="m-0">{{ match.name }}</p>
                  <p class="m-0">{{ match.group.event_category_sport_category.name }} / {{ match.group.name }}</p>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="d-flex align-items-center">
                  <img :src="match.member1.registration_event.user.url_image" style="width: 5rem" />
                  <div class="ml-3">
                    <p class="m-0">{{ match.member1.registration_event.user.name }}</p>
                    <p class="m-0">{{ match.member1.registration_event.team_name }}</p>
                    <p class="m-0">{{ match.member1.registration_event.jersey_team }}</p>
                  </div>
                </div>
                <div class="d-flex">
                  <h4>{{ match.group_member1_score }}</h4>
                  <h4 class="mx-3">-</h4>
                  <h4>{{ match.group_member2_score }}</h4>
                </div>
                <div class="d-flex align-items-center justify-content-end">
                  <div class="text-right mr-3">
                    <p class="m-0">{{ match.member2.registration_event.user.name }}</p>
                    <p class="m-0">{{ match.member2.registration_event.team_name }}</p>
                    <p class="m-0">{{ match.member2.registration_event.jersey_team }}</p>
                  </div>
                  <img :src="match.member2.registration_event.user.url_image" style="width: 5rem"/>
                </div>
              </div>
            </div>
            <div class="col-12 mt-3">
              <div class="form-group">
                <label>Date Match</label>
                <date-picker v-model="date" type="date" input-class="form-control" format="DD/MM/YYYY" value-type="format" :disabled-date="disableMatchDate"/>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Time Match</label>
                <date-picker v-model="time" type="time" input-class="form-control" format="HH:mm" value-type="format"/>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Venue</label>
                <select class="form-control" v-model="selected_venue">
                  <option value="" disabled >Choose Venue</option>
                  <option v-for="(venue, index) in arr_venue" :key="index" :value="venue.id">{{ venue.name }}</option>
                </select>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Court</label>
                <select class="form-control" v-model="selected_court">
                  <option value="" disabled >Choose Court</option>
                  <option v-for="(court, index) in arr_court" :key="index" :value="court.id">{{ court.court }}</option>
                </select>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Referee</label>
                <input type="text" class="form-control" v-model="referee">
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Judge 1</label>
                <input type="text" class="form-control" v-model="judge1">
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Judge 2</label>
                <input type="text" class="form-control" v-model="judge2">
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="onSubmit">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>