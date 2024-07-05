<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";

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
        { data: "best_player_id_format", name: 'best_player.id', text: 'ID', },
        { data: "event_category_sport_category_name", name: "event_category_sport_category.name", text: 'Category', },
        { data: "group_name", name: "group.name", text: 'Group Name', },
        { data: "best_player_back_number", name: "best_player.back_number", text: 'Back Number', },
        { data: "best_player_name", name: "best_player.name", text: 'Name', },
        { data: "best_player_position_name", name: "best_player_position.name", text: 'Position', },
        { data: "best_player_user_name", name: "best_player_user.name", text: 'User Name', },
        { data: "best_player_total_yellow_card", name: "best_player_total_yellow_card", text: 'Total Yellow Card', },
        { data: "best_player_total_red_card", name: "best_player_total_red_card", text: 'Total Red Card', },
        { data: "best_player_total_score", name: "best_player_total_score", text: 'Total Score', },
        { data: "best_player_total", name: "best_player_total", text: 'Total Best Player', },
      ],
      arr_action_button: [
      ],
      arr: [],
      arr_sort: [[10, "desc"]],
      arr_top_button: [
        {
          id: 'download_excel',
          class_button: 'btn btn-sm btn-primary text-white',
          text: 'Export Excel',
          type: 'custom',
        },
      ],
      force_reload: false,
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

    // this.get_data()
    this.$emit('onSetArrFactor', 7)
    this.url = base.url_api + '/group/all?event_category_sport_id=' + this.$route.params.id
  },
  methods: {
    async onActionClicked(row, action_button_index){
      var action_button = this.arr_action_button[action_button_index]
      // var data = this.arr[data_index]
    },
    onTopButtonClicked(index){
      var top_button = this.arr_top_button[index]

      if(top_button.id == 'download_excel')
        window.open(base.host + '/export/best-player/excel?event_category_sport_id=' + this.$route.params.id, '_blank')
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

        <CustomTable
          :arr_action_button="arr_action_button"
          :arr_top_button="arr_top_button"
          :arr="arr"
          :arr_sort="arr_sort"
          :fields="fields"
          :force_reload="force_reload"
          :url="url"
          :with_preloader="false"
          @onActionClicked="onActionClicked"
          @onTopButtonClicked="onTopButtonClicked"
          @onLoadComplete="onLoadComplete"/>
      </div>
    </div>
  </div>
</template>