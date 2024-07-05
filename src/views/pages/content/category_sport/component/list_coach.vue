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
        { data: "id", text: 'ID', },
        { data: "image_format", name: "image", text: 'Image', },
        { data: "coach_position_name", name: "coach_position.name", text: 'Position', },
        { data: "name", name: "name", text: 'Name', },
        { data: "gender_format", name: "gender", text: 'Gender', },
        { data: "birth_date_format", name: "birth_date", text: 'Birth Date', },
        { text: "Action", sortable: false },
      ],
      arr_action_button: [
        {
          id: 'edit',
          class_button: 'btn-primary',
          icon: 'mdi mdi-pencil',
        },
        {
          id: 'delete',
          class_button: 'btn-danger',
          icon: 'mdi mdi-trash-can',
        },
      ],
      arr: [],
      arr_sort: [[0, "desc"]],
      arr_top_button: [
        {
          id: 'download_excel',
          class_button: 'btn btn-sm btn-primary text-white',
          text: 'Export Excel',
          type: 'custom',
        },
      ],
      force_reload: false,
      arr_coach_position: [],
      selected_coach_position: '',
      url: '',
    };
  },
  watch: {
    selected_tab(val){
      if(val == 2)
        this.force_reload = true
    },
    selected_coach_position(val){
      this.url = this.base.url_api + '/event/registration/coach?coach_position_id=' + val + '&event_category_sport_id=' + this.$route.params.id
    },
  },
  created(){
    this.base = new Base()

    this.get_coach_position()
    this.$emit('onSetArrFactor', 4)
    // this.get_data()
    this.url = base.url_api + '/event/registration/coach?coach_position_id=' + this.selected_coach_position + '&event_category_sport_id=' + this.$route.params.id
  },
  methods: {
    async get_coach_position() {
      var url = base.url_api + '/coach-position/all?category_sport_id=' + this.data.category_sport.id
      var response = await base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data
          this.arr_coach_position = response_data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error('Server Error')
    },
    async onActionClicked(row, action_button_index){
      var action_button = this.arr_action_button[action_button_index]
      // var data = this.arr[data_index]

      if(action_button.id == "edit")
        window.location.href = '/registration/coach/' + row.id
      else if (action_button.id === 'delete') {
        if (confirm('Are you sure want to delete this data?')) {
          $('#please_wait_modal').modal('show')
          var response = await base.request(base.url_api + '/event/registration/coach/delete', "get", {
            id: row.id,
          });

          $('#please_wait_modal').modal('hide')
          if (response != null) {
            if (response.status == "success") {
              window.location.reload()
            }
            else
              this.base.show_error(response.message)
          }
          else
            console.log('Server Error')
        }
      }
    },
    onTopButtonClicked(index){
      var top_button = this.arr_top_button[index]

      if(top_button.id == 'download_excel')
        window.open(base.host + '/export/registration/coach/excel?coach_position_id=' + this.selected_coach_position + '&event_category_sport_id=' + this.$route.params.id, '_blank')
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
        <div>
          <label>Filter</label>

          <div class="form-group">
            <label>Coach Position</label>
            <select class="form-control" v-model="selected_coach_position">
              <option value="">Choose Coach Position</option>
              <option v-for="(coach_position, index) in arr_coach_position" :key="index" :value="coach_position.id">{{ coach_position.name }}</option>
            </select>
          </div>
        </div>

        <CustomTable
          :arr_action_button="arr_action_button"
          :arr_top_button="arr_top_button"
          :arr="arr"
          :arr_sort="arr_sort"
          :fields="fields"
          :force_reload="force_reload"
          :url="url"
          id="coach"
          :with_preloader="false"
          @onActionClicked="onActionClicked"
          @onTopButtonClicked="onTopButtonClicked"
          @onLoadComplete="onLoadComplete"/>
      </div>
    </div>
  </div>
</template>