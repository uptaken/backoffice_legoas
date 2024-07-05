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
  props: ['data', ],
  components: {DatePicker, },
  data() {
    return {
      id: '',
      name: '',
      requirement: '',
      min_player: '0',
      max_player: '0',
      fee_registration: '0',
      fee_per_match: '0',
      max_total_team_per_school: '0',
      max_total_team_per_club: '0',
      display_team: '',
      arr_display_team: [
        {
          id: 'team',
          name: 'Team Name',
        },
        {
          id: 'player',
          name: 'Player Name',
        },
      ],
    };
  },
  watch: {
    data(val){
      if(val != null){
        this.id = val.id
        this.name = val.name
        this.requirement = val.requirement
        this.min_player = val.min_player.toLocaleString(base.locale_string)
        this.max_player = val.max_player.toLocaleString(base.locale_string)
        this.fee_registration = val.fee_registration.toLocaleString(base.locale_string)
        this.fee_per_match = val.fee_per_match.toLocaleString(base.locale_string)
        this.max_total_team_per_school = val.max_total_team_per_school.toLocaleString(base.locale_string)
        this.max_total_team_per_club = val.max_total_team_per_club.toLocaleString(base.locale_string)
        this.display_team = val.display_team
      }
      else{
        this.id = ''
        this.name = ''
        this.requirement = ''
        this.min_player = '0'
        this.max_player = '0'
        this.fee_registration = '0'
        this.fee_per_match = '0'
        this.max_total_team_per_school = '0'
        this.max_total_team_per_club = '0'
      }
    },
    tab(val){
      if(this.index < val)
        this.validate()
    },
    is_submit(val){
      if(val)
        this.validate()
    },
    min_player(val){
      this.min_player = base.to_currency_format(val)
    },
    max_player(val){
      this.max_player = base.to_currency_format(val)
    },
    fee_registration(val){
      this.fee_registration = base.to_currency_format(val)
    },
    fee_per_match(val){
      this.fee_per_match = base.to_currency_format(val)
    },
    max_total_team_per_school(val){
      this.max_total_team_per_school = base.to_currency_format(val)
    },
    max_total_team_per_club(val){
      this.max_total_team_per_club = base.to_currency_format(val)
    },
  },
  mounted(){
  },
  methods: {
    onSubmit(){
      if(this.name == "")
        base.show_error('Name is empty')
      else if(this.requirement == "")
        base.show_error('Requirement is empty')
      else if(this.min_player == "0")
        base.show_error('Minimum Player is empty')
      else if(this.max_player == "0")
        base.show_error('Maximum Player is empty')
      else if(this.fee_registration == "0")
        base.show_error('Fee Registration is empty')
      // else if(this.fee_per_match == "0")
      //   base.show_error('Fee per Match is empty')
      else if(this.max_total_team_per_school == "0")
        base.show_error('Maximum Total Team per School is empty')
      // else if(this.max_total_team_per_club == "0")
      //   base.show_error('Maximum Total Team per Club is empty')
      else if(this.display_team == "")
        base.show_error('Display Team is not choosen')
      else{
        this.$emit('onSubmit', {
          id: this.id,
          name: this.name,
          requirement: this.requirement,
          min_player: base.str_to_double(this.min_player),
          max_player: base.str_to_double(this.max_player),
          fee_registration: base.str_to_double(this.fee_registration),
          fee_per_match: base.str_to_double(this.fee_per_match),
          max_total_team_per_school: base.str_to_double(this.max_total_team_per_school),
          max_total_team_per_club: base.str_to_double(this.max_total_team_per_club),
          display_team: this.display_team,
        })
        $('#editCategorySport').modal('hide')
      }
    },
  }
};
</script>

<template>
  <div class="modal fade" id="editCategorySport" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ this.data != null ? 'Edit' : 'Add' }} Category Sport</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-control" v-model="name" />
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Requirement</label>
                <textarea v-model="requirement" class="form-control"></textarea>
              </div>
            </div>

            <div class="col-6">
              <div class="form-group">
                <label>Minimum Total Player</label>
                <input type="text" v-model="min_player" class="form-control"/>
              </div>
            </div>

            <div class="col-6">
              <div class="form-group">
                <label>Maximum Total Player</label>
                <input type="text" v-model="max_player" class="form-control"/>
              </div>
            </div>

            <div class="col-6">
              <div class="form-group">
                <label>Fee Registration</label>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Rp.</span>
                  </div>
                  <input type="text" v-model="fee_registration" class="form-control"/>
                </div>
              </div>
            </div>

            <div class="col-6">
              <div class="form-group">
                <label>Fee per Match</label>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Rp.</span>
                  </div>
                  <input type="text" v-model="fee_per_match" class="form-control"/>
                </div>
              </div>
            </div>

            <div class="col-6">
              <div class="form-group">
                <label>Maximum Total Team per School</label>
                <input type="text" v-model="max_total_team_per_school" class="form-control"/>
              </div>
            </div>

            <div class="col-6">
              <div class="form-group">
                <label>Maximum Total Team per Club</label>
                <input type="text" v-model="max_total_team_per_club" class="form-control"/>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Display Team</label>
                <select v-model="display_team" class="form-control">
                  <option value="">Choose Display Team</option>
                  <option v-for="(display_team, index) in arr_display_team" :key="index" :value="display_team.id">{{ display_team.name }}</option>
                </select>
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