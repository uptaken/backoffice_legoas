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
      arr_scoring_type: [
        {
          id: 'round',
          name: 'Round',
        },
      ],
      selected_scoring_type: {},
      name: '',
      start_date: '',
      end_date: '',
      arr_venue_field: [],
      arr_venue: [
        
      ],
      total_team_per_group: '0',
      is_first_time: true,
    };
  },
  watch: {
    tab(val){
      if(this.index < val && !this.is_view_only)
        this.validate()
    },
    total_team_per_group(val){
      base.to_currency_format(val)
    },
  },
  created(){
    this.fill_content()
    this.get_venue()
    this.onScoringTypeSearch('')
  },
  methods: {
    fill_content(){
      this.name = this.data.category_sport.name
      this.start_date = momentTZ.tz(this.data.start_date, base.locale_timezone).toDate()
      this.end_date = momentTZ.tz(this.data.end_date, base.locale_timezone).toDate()
      this.selected_scoring_type = this.data.scoring_type != null ? this.data.scoring_type : {}
      this.total_team_per_group = this.data.total_team_per_group != null ? this.data.total_team_per_group.toLocaleString(base.locale_string) : '0'
      
      var arr = []
      for(let venue of this.data.venue){
        var counter = 0
        var index = -1
        for(let x in arr){
          if(arr[x].venue.id == venue.venue.id){
            index = x
            break
          }
          counter++
        }
      
        if(counter == arr.length){
          arr.push({
            venue: venue.venue,
            venue_id: venue.venue.id,
            arr_field: [],
          })
          index = arr.length - 1
        }
      
        arr[index].arr_field.push(venue)
      }
      
      this.arr_venue_field = arr
    },
    async get_venue() {
      var url = base.url_api + '/venue/all'
      var response = await base.request(url);
      this.$emit('onSetArrFactor', 1)
      
      if (response != null) {
        if (response.status == "success") {
          this.arr_venue = response.data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error('Server Error')
    },
    async onScoringTypeSearch(search) {
      var response = await base.request(base.url_api + '/scoring-type/all?search=' + search)
      this.$emit('onSetArrFactor', 2)
      
      if (response != null) {
        if (response.status == "success") {
          for(let data of response.data){
            data.label = data.name
          }
          this.arr_scoring_type = response.data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error('Server Error')
    },
    disableStartDate(date){
      return (this.end_date == "" && momentTZ(date).isSameOrBefore(momentTZ())) || (this.end_date != "" && momentTZ(date).isSameOrAfter(momentTZ(this.end_date)))
    },
    disableEndDate(date){
      return this.start_date != "" && momentTZ(date).isSameOrBefore(momentTZ(this.start_date))
    },
    disableCompetitionDate(date){
      return momentTZ(date).isSameOrBefore(momentTZ())
    },
    validate(){
      var venue_field_message = ''
      for(let x in this.arr_venue_field){
        if(this.arr_venue_field[x].venue_id == ""){
          venue_field_message = "Venue " + (parseInt(x) + 1) + " is empty"
          break
        }

        for(let y in this.arr_venue_field[x].arr_field){
          if(this.arr_venue_field[x].arr_field[y].court == ""){
            venue_field_message = "Field " + (parseInt(y) + 1) + " in Venue " + (parseInt(x) + 1) + " is empty"
            break
          }
        }
      }

      var message = ''
      if(this.name == "")
        message = 'Tipe olahraga is empty'
      else if(this.competition_date == "")
        message = 'Tanggal kompetisi is empty'
      else if(this.selected_scoring_type.id == null)
        message = 'Scoring Type not selected yet'
      else if(this.total_team_per_group == '0')
        message = 'Total Team per Group is empty'
      else if(venue_field_message != '')
        message = venue_field_message

      this.$emit('onValidate', message, {
        name: this.name,
        // scoring_type: this.selected_scoring_type,
        start_date: momentTZ.tz(this.start_date, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        start_date_moment: momentTZ.tz(this.start_date, base.locale_timezone),
        end_date: momentTZ.tz(this.end_date, base.locale_timezone).format('YYYY-MM-DD HH:mm:ss'),
        end_date_moment: momentTZ.tz(this.end_date, base.locale_timezone),
        total_team_per_group: base.str_to_double(this.total_team_per_group),
        arr_venue: this.arr_venue_field,
      })
    },
    onRemoveField(index, index1){
      var arr = JSON.parse(JSON.stringify(this.arr_venue_field))
      arr[index].arr_field.splice(index1, 1)
      this.arr_venue_field = arr
    },
    onRemoveVenueField(index){
      this.arr_venue_field.splice(index, 1)
    },
    onAddField(index){
      var arr = JSON.parse(JSON.stringify(this.arr_venue_field))
      arr[index].arr_field.push({
        court: '',
      })
      this.arr_venue_field = arr
    },
    onAddVenueField(){
      this.arr_venue_field.push({
        arr_field: [],
        venue_id: '',
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
            <label>Tipe Olahraga</label>
            <input :value="name" type="text" class="form-control" :readonly="true" />
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

        <div class="col-6">
          <div class="form-group">
            <label>Scoring Type</label>
            <input :value="selected_scoring_type.label" type="text" class="form-control" :readonly="true" />
            <!-- <v-select @search="onScoringTypeSearch" :disabled="true" v-model="selected_scoring_type" :options="arr_scoring_type" /> -->
          </div>
        </div>

        <div class="col-6">
          <div class="form-group">
            <label>Total Team per Group</label>
            <input v-model="total_team_per_group" type="text" class="form-control" :readonly="is_view_only" />
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label>List Venue</label>
            <div>
              <div v-for="(venue_field, index) in arr_venue_field" :key="index">
                <div class="d-flex align-items-start">
                  <div class="form-group flex-fill">
                    <select class="form-control" v-model="venue_field.venue_id" :disabled="is_view_only">
                      <option v-for="(venue, index1) in arr_venue" :key="index1" :value="venue.id">{{ venue.name }}</option>
                    </select>
                  </div>
                  <button class="btn btn-sm btn-danger rounded-circle ml-3" v-show="!is_view_only" @click="onRemoveVenueField(index)"><i class="mdi mdi-trash-can"></i></button>
                </div>
                <div class="mx-0 mx-md-3 mb-3">
                  <label>Field Name</label>
                  <div class="row">
                    <div class="col-12 col-md-6" v-for="(field, index1) in venue_field.arr_field" :key="index1">
                      <div class="d-flex align-items-start">
                        <div class="form-group flex-fill">
                          <input v-model="field.court" type="text" class="form-control" :readonly="is_view_only" />
                        </div>
                        <button class="btn btn-sm btn-danger rounded-circle ml-3" v-show="!is_view_only" @click="onRemoveField(index, index1)"><i class="mdi mdi-trash-can"></i></button>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary w-100" v-show="!is_view_only" @click="onAddField(index)">Add Field</button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button class="btn btn-primary w-100" v-show="!is_view_only" @click="onAddVenueField">Add Venue Field</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>