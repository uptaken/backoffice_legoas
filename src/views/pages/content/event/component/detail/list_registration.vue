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
        { data: "user_name", name: "user.name", text: 'User Name', },
        { data: "team_name", name: "registration_event.team_name", text: 'Team Name', },
        { data: "created_at_format", name: "created_at_format", text: 'Created Date', },
        { data: "status_format", name: "registration_event.status", text: 'Status', },
        { data: "total_player", name: "total_player", text: 'Total Player', },
        { data: "total_coach", name: "total_coach", text: 'Total Coach', },
        { text: "Action", sortable: false },
      ],
      arr_action_button: [
        {
          id: 'detail',
          class_button: 'btn-primary',
          icon: 'mdi mdi-eye',
        },
        {
          id: 'delete',
          class_button: 'btn-danger',
          icon: 'mdi mdi-trash-can',
        },
        {
          id: 'contact_wa',
          class_button: 'btn-primary',
          icon: 'mdi mdi-whatsapp',
        },
      ],
      arr_top_button: [
        {
          id: 'download_excel',
          class_button: 'btn btn-sm btn-primary',
          text: 'Export Excel',
          type: 'custom',
        },
      ],
      arr_sort: [[0, "asc"]],
      force_reload: false,
      arr: [],
      url: '',
    };
  },
  watch: {
    selected_tab(val){
      if(val == 1)
        this.force_reload = true
    }
  },
  created(){
    this.base = new Base()

    // this.get_data()
    this.url = this.base.url_api + '/event/registration?type=live&rel_type=simple&event_id=' + this.$route.params.id
    this.$emit('onSetArrFactor', 2)
  },
  methods: {
    async onActionClicked(row, action_button_index){
      var action_button = this.arr_action_button[action_button_index]
      var data = row

      this.get_data(data, action_button)
    },
    async get_data(data, action_button) {
      $('#please_wait_modal').modal('show')
      var response = await base.request(this.url + '&id=' + data.id)
      $('#please_wait_modal').modal('hide')
      
      if (response != null) {
        if (response.status == "success") {
          if(action_button.id == "detail")
            window.location.href = '/registration/detail/' + response.data.id
          else if(action_button.id == "contact_wa")
            window.open('https://wa.me/' + response.data.user.phone, '_blank')
          else if (action_button.id === 'delete') {
            if (confirm('Are you sure want to delete this data?')) {
              $('#please_wait_modal').modal('show')
              var response1 = await base.request(base.url_api + '/event/registration/delete', "get", {
                id: response.data.id,
              });
          
              $('#please_wait_modal').modal('hide')
              if (response1 != null) {
                if (response1.status == "success") {
                  window.location.reload()
                }
                else
                  this.base.show_error(response1.message)
              }
              else
                console.log('Server Error')
            }
          }
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    onTopButtonClicked(index){
      var top_button = this.arr_top_button[index]

      if(top_button.id == 'download_excel')
        window.open(base.host + '/export/registration/excel?event_id=' + this.$route.params.id, '_blank')
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
          id="registration"
          :arr_action_button="arr_action_button"
          :arr_top_button="arr_top_button"
          :arr="arr"
          :arr_sort="arr_sort"
          :fields="fields"
          :force_reload="force_reload"
          :url="url"
          @onActionClicked="onActionClicked"
          @onTopButtonClicked="onTopButtonClicked"
          @onLoadComplete="onLoadComplete"/>
      </div>
    </div>
  </div>
</template>