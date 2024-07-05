<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
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
        { data: "type_name", name: "type.name", text: 'Type', },
        { data: "name", name: "user.name", text: 'User Name', },
        { data: "phone", name: "phone", text: 'Phone', },
        { data: "address", name: "address", text: 'Address', },
        // { data: "Action", sortable: false },
      ],
      arr_action_button: [
      ],
      arr: [],
      arr_sort: [[0, "asc"]],
      arr_top_button: [
        {
          id: 'download_excel',
          class_button: 'btn btn-sm btn-primary',
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
    async onActionClicked(data_index, action_button_index){
      var action_button = this.arr_action_button[action_button_index]
      var data = this.arr[data_index]

      // if(action_button.id == "edit")
      //   window.location.href = '/event/category-sport/action/edit/' + data.ID
      // else if(action_button.id == "detail")
      //   window.location.href = '/event/category-sport/detail/' + data.ID
    },
    async get_data() {
      var url = base.url_api + '/user/all?event_id=' + this.$route.params.id
      var response = await base.request(url);

      this.$emit('onSetArrFactor', 3)
      if (response != null) {
        if (response.status == "success") {
          var arr = []
          for(let data of response.data){
            arr.push({
              'ID': data.id,
              'Type': data.type.name,
              'User Name': data.name,
              'Phone': data.phone,
              'Address': data.address,
              'Action': '',
            })
          }
          this.arr = arr
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error("Server Error")
    },
    onTopButtonClicked(index){
      var top_button = this.arr_top_button[index]

      if(top_button.id == 'download_excel')
        window.open(base.host + '/export/user/excel?event_id=' + this.$route.params.id, '_blank')
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
          :url="base.url_api + '/user?event_id=' + this.$route.params.id"
          @onActionClicked="onActionClicked"
          @onTopButtonClicked="onTopButtonClicked"
          @onLoadComplete="onLoadComplete"/>
      </div>
    </div>
  </div>
</template>