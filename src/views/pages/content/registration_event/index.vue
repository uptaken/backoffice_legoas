<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Event component
 */
export default {
    page: {
        title: "Event",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTable, },
    data() {
        return {
          base: null,
          tableData: [],
          title: "Event",
          items: [
              {
                  text: "Tables",
                  href: "/"
              },
              {
                  text: "Event",
                  active: true
              }
          ],
          fields: [
            { data: "id", text: 'ID', },
            { data: "name", name: "event.name", text: 'Name', },
            { data: "created_at_format", name: "created_at_format", text: 'Created Date', },
            { data: "status_publish_format", name: "event.status_publish", text: 'Status Publish', },
            { text: "Action", orderable: false, },
          ],
          arr_action_button: [
            {
              id: 'detail',
              class_button: 'btn-primary',
              icon: 'mdi mdi-eye',
            },
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
              text: 'Add Event',
              url: '/event/action/add',
            },
          ],
          arr_sort: [[0, "asc"]],
          force_reload: false,
        };
    },
    async created() {
      this.base = new Base()
        // Set the initial number of items
      base.save_current_page('Event', true)
        // await this.get_data()
    },
    methods: {
        async get_data() {
          $('#please_wait_modal').modal('show')
            var url = base.url_api + '/event/all'
            var response = await base.request(url);

            setTimeout(() => {
              $('#please_wait_modal').modal('hide')
            }, 500)
            
            if (response != null) {
                if (response.status == "success") {
                    var response_data = response.data
                    var arr = []
                    for(var x in response_data){
                        arr.push({
                            'ID' : response_data[x].id,
                            'Name' : response_data[x].name,
                            'Created Date' : moment(response_data[x].created_at).format('DD MMM YYYY'),
                            'Status Publish' : (response_data[x].is_publish ? 'Published' : 'Not Publish'),
                        })
                    }

                    this.tableData = arr
                    this.totalRows = arr.length;
                }
            }
        },
        async onActionClicked(row, action_button_index){
          var action_button = this.arr_action_button[action_button_index]
          var data = row

          if(action_button.id == "detail")
            window.location.href = '/event/detail/' + data.id
          else if(action_button.id == "edit")
            window.location.href = '/event/action/edit/' + data.id
          else if (action_button.id === 'delete') {
            if (confirm('Are you sure want to delete this data?')) {
              $('#please_wait_modal').modal('show')
              var url = base.url_api + '/event/delete'
              var response = await base.request(url, "get", {
                id: data.id,
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
    }
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <CustomTable
                          :arr_action_button="arr_action_button"
                          :arr_top_button="arr_top_button"
                          :arr="tableData"
                          :arr_sort="arr_sort"
                          :fields="fields"
                          @onActionClicked="onActionClicked"
                          :url="base.url_api + '/event'"/>
                    </div>
                </div>
            </div>
        </div>
</Layout></template>