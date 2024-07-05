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

import Group from "@/views/pages/content/category_sport/component/group_match/group";
import Match from "@/views/pages/content/category_sport/component/group_match/match";
import Ladder from "@/views/pages/content/category_sport/component/group_match/ladder";
import ListBestPlayer from "@/views/pages/content/category_sport/component/group_match/list_best_player";
import ListTopScorer from "@/views/pages/content/category_sport/component/group_match/list_top_scorer";

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit',],
  components: {DatePicker, CustomGroup, Group, Match, ListBestPlayer, ListTopScorer, Ladder, },
  data() {
    return {
      base: null,
      arr_tabs: [
        {
          id: 'group',
          icon: 'far fa-user',
          tab: 'Group',
          component: 'group',
        },
        {
          id: 'match',
          icon: 'far fa-user',
          tab: 'Match',
          component: 'match',
        },
        {
          id: 'list_best_player',
          icon: 'far fa-user',
          tab: 'List Best Player',
          component: 'list-best-player',
        },
        {
          id: 'list_top_scorer',
          icon: 'far fa-user',
          tab: 'List Top Scorer',
          component: 'list-top-scorer',
        },
        {
          id: 'ladder',
          icon: 'far fa-user',
          tab: 'Ladder',
          component: 'ladder',
        },
      ],
      selected_tab: 0,
      before_click: '',
      arr_group: [],
    };
  },
  watch: {
    selected_tab(val){
      base.save_tab(this.data.category_sport.name, this.arr_tabs[val], 1)
    },
    async arr_group(val){
      if(val.length > 0){
        var index = await base.get_tab(this.data.category_sport.name, this.arr_tabs, 1)
        this.selected_tab = index
      }
    },
  },
  async mounted(){
    this.base = new Base()

    this.get_data()
    
  },
  methods: {
    async get_data() {
      var url = this.base.url_api + '/group/all?rel_type=simple&event_category_sport_id=' + this.$route.params.id
      var response = await this.base.request(url);
      this.$emit('onSetArrFactor', 5)

      if (response != null) {
        if (response.status == "success") {
          for(let group of response.data){
            for(let member of group.member){
              member.date = momentTZ.tz(member.match_date, this.base.locale_timezone)
              member.url_image = member.registration_event.url_image != null ? member.registration_event.url_image : NoImage
              for(let opponent of member.arr_opponent){
                opponent.date = momentTZ.tz(opponent.match_date, this.base.locale_timezone)
                opponent.url_image = opponent.registration_event.url_image != null ? opponent.registration_event.url_image : NoImage
              }
            }
          }
          this.arr_group = response.data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error("Server Error")
    },
  }
};
</script>

<template>
  <div>
    <div class="card" v-if="arr_group.length == 0">
      <div class="card-body">
        <h4>League Group & Match</h4>
        <p class="">Kategori Olahraga ini belum memiliki Match. Apakah ingin melakukan Generate Match ?</p>
        <a :href="'/group-match/generate/' + $route.params.id" class="btn btn-primary">Generate Match</a>
      </div>
    </div>

    <div class="card" v-else>
      <div class="card-body">
        <b-tabs pills justified content-class="p-3 text-muted" v-model="selected_tab">
          <b-tab v-for="(tab, index) of arr_tabs" :key="index">
            <template v-slot:title>
              <span class="d-inline-block d-sm-none">
                <i :class="tab.icon"></i>
              </span>
              <span class="d-none d-sm-inline-block">{{ tab.tab }}</span>
            </template>
            <component :is="tab.component" 
              :index="index" 
              :tab="selected_tab" 
              :is_view_only="true" 
              :data="data" 
              :arr_group="arr_group"
              :selected_tab="selected_tab"
              @onSetArrFactor="(index) => $emit('onSetArrFactor', index)"/>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>