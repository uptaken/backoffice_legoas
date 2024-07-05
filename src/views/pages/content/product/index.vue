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
 * Product component
 */
export default {
    page: {
        title: "Product",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTextareaArray, CustomTable, },
    data() {
        return {
          base: null,
            tableData: [],
            title: "Product",
            fields: [
              { data: "id", name: "product.id", text: 'ID', },
              { data: "name", name: "product.name", text: 'Name', },
              { data: "price_format", name: "product.price", text: 'Price', },
              { data: "quantity_format", name: "product.quantity", text: 'Qty', },
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
                text: 'Add Product',
                url: '/product/action/add',
              },
            ],
            arr_sort: [[0, "asc"]],
          force_reload: false,
        };
    },
    async created() {
      this.base = new Base()
      base.save_current_page('Product', true)
      // Set the initial number of items
      // await this.get_data()
    },
    methods: {
      async onActionClicked(row, action_button_index){
        var action_button = this.arr_action_button[action_button_index]
        var data = row

        if(action_button.id == "edit")
          window.location.href = '/product/action/edit/' + data.id
        else if (action_button.id === 'delete') {
          if (confirm('Are you sure want to delete this data?')) {
            $('#please_wait_modal').modal('show')
            var url = base.url_api + '/product/delete'
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
          :url="base.url_api + '/product'"/>
      </div>
    </div>
  </Layout>
</template>