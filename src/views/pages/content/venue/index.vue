<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTextareaArray from "@/views/layouts/CustomTextareaArray";
import CustomPleaseWait from "@/views/layouts/CustomPleaseWait";
import CustomTable from "@/views/layouts/CustomTable";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Venue component
 */
export default {
    page: {
        title: "Venue",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTextareaArray, CustomTable, },
    data() {
        return {
          base: null,
            tableData: [],
            title: "Venue",
            fields: [
              { data: "id", name: "scoring_type.id", text: 'ID', },
              { data: "name", name: "scoring_type.name", text: 'Name', },
              { data: "created_at_format", name: "created_at_format", text: 'Created Date', },
              { text: "Action", orderable: false, },
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
            arr_top_button: [
              {
                id: 'add',
                class_button: 'btn btn-sm btn-primary',
                text: 'Add Venue',
                url: '/venue/action/add',
              },
            ],
            arr_sort: [[0, "asc"]],
          force_reload: false,
        };
    },
    async created() {
      this.base = new Base()
      base.save_current_page('Venue', true)
      // Set the initial number of items
      // await this.get_data()
    },
    methods: {
      async get_data() {
        $('#please_wait_modal').modal('show')
          var url = base.url_api + '/venue'
          var response = await base.request(url);

          setTimeout(() => {
            $('#please_wait_modal').modal('hide')
          }, 500)
          if (response != null) {
            if (response.status == "success") {
              var response_data = response.data
              var arr = []
              for(var x in response_data)
                arr.push({
                  'ID' : response_data[x].id,
                  'Name' : response_data[x].name,
                  'Created Date' : moment(response_data[x].created_at).format('DD MMM YYYY'),
                  'Status Publish' : (response_data[x].is_publish ? 'Published' : 'Not Publish'),
                  'action' : ''
                })

              this.tableData = arr
            }
          }
        },
        async onActionClicked(row, action_button_index){
          var action_button = this.arr_action_button[action_button_index]
          var data = row

          if(action_button.id == "edit")
            window.location.href = '/venue/action/edit/' + data.id
          else if (action_button.id === 'delete') {
            if (confirm('Are you sure want to delete this data?')) {
              $('#please_wait_modal').modal('show')
              var url = base.url_api + '/venue/delete'
              var response = await base.request(url, "get", {
                id: data.ID,
              });

              setTimeout(() => {
                $('#please_wait_modal').modal('hide')
              }, 500)
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
    }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <CustomPleaseWait :progress="progress"/>

    <div class="card">
      <div class="card-body">
        <CustomTable
          :arr_action_button="arr_action_button"
          :arr_top_button="arr_top_button"
          :arr="tableData"
          :arr_sort="arr_sort"
          :fields="fields"
          @onActionClicked="onActionClicked"
          :url="base.url_api + '/venue'"/>
      </div>
    </div>
  </Layout>
</template>