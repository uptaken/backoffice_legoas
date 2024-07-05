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
  props: ['selected_tab', ],
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
    };
  },
  watch: {
    selected_tab(val){
      if(val == 2)
        this.force_reload = true
    }
  },
  created(){
    this.base = new Base()

    this.$emit('onSetArrFactor', 3)
    // this.get_data()
  },
  methods: {
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
        window.open(base.host + '/export/registration/coach/excel?registration_event_id=' + this.$route.params.id, '_blank')
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
          :url="base.url_api + '/event/registration/coach?registration_event_id=' + this.$route.params.id"
          @onActionClicked="onActionClicked"
          @onTopButtonClicked="onTopButtonClicked"
          @onLoadComplete="onLoadComplete"/>
      </div>
    </div>
  </div>
</template>