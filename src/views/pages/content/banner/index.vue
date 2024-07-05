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
 * Banner component
 */
export default {
    page: {
      title: "Banner",
      meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTable, },
    data() {
      return {
        base: null,
        tableData: [],
        title: "Banner",
        fields: [
          { data: "id", name: "product.id", text: 'ID', },
          { data: "image_format", name: "banner.file_name", text: 'Image', },
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
            text: 'Add Banner',
            url: '/banner/action/add',
          },
        ],
      };
    },
    async created() {
      this.base = new Base()
      base.save_current_page('Banner', true)
    },
    methods: {
      async get_data() {
        var url = base.url_api + '/banner'
        var response = await base.request(url);
        if (response != null) {
          if (response.status == "success") {
            var response_data = response.data
            var arr = []
            for(var x in response_data){
              arr.push({
                'ID' : response_data[x].id,
                // 'Title' : response_data[x].title,
                'Created Date' : moment(response_data[x].created_at).format('DD MMM YYYY'),
                'Status Publish' : (response_data[x].is_publish ? 'Published' : 'Not Publish'),
                'action' : ''
              })
            }

            this.tableData = arr
            if(arr.length > 0)
              this.arr_top_button = []
          }
        }
      },
      async onActionClicked(row, action_button_index){
        var action_button = this.arr_action_button[action_button_index]
        var data = row

        if(action_button.id == "edit")
          window.location.href = '/banner/action/edit/' + data.id
        else if (action_button.id === 'delete') {
          if (confirm('Are you sure want to delete this data?')) {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/banner/delete'
            var response = await base.request(url, "get", {
              id: data.id,
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

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <CustomTable
                          :arr_action_button="arr_action_button"
                          :arr_top_button="arr_top_button"
                          :arr="tableData"
                          :fields="fields"
                          @onActionClicked="onActionClicked"
                          :url="base.url_api + '/banner'"/>
                    </div>
                </div>
            </div>
        </div>
</Layout></template>