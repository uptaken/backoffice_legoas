<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";
import NoImage from '@/assets/no_image.png'

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['selected_tab', 'data', ],
  components: {CustomTable, },
  data() {
    return {
      base: null,
      fields: [
        { data: "user_name", name: "user.name", text: 'School / Team', },
        { data: "played", name: "group_member.played", text: 'P', },
        { data: "won", name: "group_member.won", text: 'W', },
        { data: "draw", name: "group_member.draw", text: 'D', },
        { data: "lost", name: "group_member.lost", text: 'L', },
        { data: "goal_for", name: "group_member.goal_for", text: 'SF', },
        { data: "goal_away", name: "group_member.goal_away", text: 'SA', },
        { data: "goal_difference", name: "group_member.goal_difference", text: 'SD', },
        { data: "point", name: "group_member.point", text: 'Pts', },
        // { data: "form", text: 'Form', orderable: false, },
      ],
      arr_action_button: [
      ],
      arr: [],
      arr_sort: [[0, "asc"]],
      arr_top_button: [
        {
          id: 'download_excel',
          class_button: 'btn btn-sm btn-primary text-white',
          text: 'Export Excel',
          type: 'custom',
        },
      ],
      force_reload: false,
      arr_group: [],
      url: '',
    };
  },
  watch: {
    selected_tab(val){
      if(val == 2)
        this.force_reload = true
    },
  },
  created(){
    this.base = new Base()

    this.get_data()
  },
  methods: {
    async get_data() {
      var url = base.url_api + '/group/all?event_category_sport_id=' + this.$route.params.id
      var response = await base.request(url);
      this.$emit('onSetArrFactor', 9)

      // this.$set(this.arr_factor, 0, true)
      if (response != null) {
        if (response.status == "success") {
          for(let group of response.data){
            for(let member of group.member){
              member.date = momentTZ.tz(member.match_date, this.base.locale_timezone)
              member.url_image = member.registration_event.url_image != null ? member.registration_event.url_image : NoImage
              for(let form of member.arr_form){
                if(form.status == 'finished'){
                  if(form.group_member1_id == member.id)
                    form.status_match = form.group_member1_score > form.group_member2_score ? 'win' : (form.group_member1_score < form.group_member2_score ? 'lose' : 'draw')
                  else if(form.group_member2_id == member.id)
                    form.status_match = form.group_member1_score < form.group_member2_score ? 'win' : (form.group_member1_score > form.group_member2_score ? 'lose' : 'draw')
                }
                else
                  form.status_match = 'not_started'
              }
              for(let opponent of member.arr_opponent){
                opponent.date = momentTZ.tz(opponent.match_date, this.base.locale_timezone)
                opponent.url_image = opponent.user.file_name != null ? this.base.host + '/media/user?file_name=' + opponent.user.file_name : NoImage
              }
            }
          }
          this.arr_group = response.data
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    async onActionClicked(row, action_button_index){
      var action_button = this.arr_action_button[action_button_index]
      // var data = this.arr[data_index]
    },
    onExportClicked(index){
      window.open(base.host + '/export/ladder/excel?id=' + this.arr_group[index].id, '_blank')
    },
    onLoadComplete(){
      this.force_reload = false
    },
  }
};
</script>

<template>
  <div>
    <div class="" v-for="(group, index) in arr_group" :key="index">
      <div class="">
        <h4>{{ group.type.name }} / {{ group.event_category_sport_category.name }} / {{ group.name }}</h4>

        <div>
          <button class="btn btn-primary" @click="onExportClicked(index)">Export Excel</button>
        </div>

        <table class="table ladder-table mt-3">
          <thead>
            <tr>
              <th>School / Team</th>
              <th class="text-center">P</th>
              <th class="text-center">W</th>
              <th class="text-center">D</th>
              <th class="text-center">L</th>
              <th class="text-center">SF</th>
              <th class="text-center">SA</th>
              <th class="text-center">SD</th>
              <th class="text-center">Pts</th>
              <th class="text-center">Form</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index1) in group.member" :key="index1">
              <td>
                <div class="d-flex align-items-center h-100">
                  <div class="d-flex align-items-center justify-content-center" style="height: 5rem;">
                    <img :src="member.url_image" style="width: 5rem" />
                  </div>
                  <div class="ml-3">
                    <p class="m-0 font-weight-bold">{{ member.registration_event.team_name }}</p>
                    <p class="m-0">{{ member.user.name }}</p>
                  </div>
                </div>
              </td>
              <td class="text-center">{{ member.played }}</td>
              <td class="text-center">{{ member.won }}</td>
              <td class="text-center">{{ member.draw }}</td>
              <td class="text-center">{{ member.lost }}</td>
              <td class="text-center">{{ member.goal_for }}</td>
              <td class="text-center">{{ member.goal_away }}</td>
              <td class="text-center">{{ member.goal_difference }}</td>
              <td class="text-center">{{ member.point }}</td>
              <td class="text-center">
                <div class="d-flex">
                  <div v-for="(form, index) in member.arr_form" :key="index">
                    <p class="m-0">M{{ index + 1 }}</p>
                    <div class="rounded-circle d-flex align-items-center justify-content-center mr-1" 
                      :class="{
                        'bg-success text-white': form.status_match == 'win', 
                        'bg-danger text-white': form.status_match == 'lose', 
                        'bg-warning text-white': form.status_match == 'draw', 
                        'bg-secondary text-white': form.status_match == 'not_started',
                      }" 
                      style="aspect-ratio: 1; width: 2rem;">
                      <p class="m-0" v-show="form.status_match != 'not_started'">{{ form.status_match == 'win' ? 'W' : (form.status_match == 'lose' ? 'L' : 'D') }}</p>
                      <p class="m-0" v-show="form.status_match == 'not_started'">?</p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>