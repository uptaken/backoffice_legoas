<script>
import Layout from "@/views/layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable1";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Dictionary component
 */
export default {
    page: {
      title: "Dictionary",
      meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTable, },
    data() {
      return {
        base: null,
        title: "",
        fields: [
          { id: "_id", text: 'ID', allow_add_edit: false, },
          { id: "group", text: 'Group', },
					{ id: "key", text: 'Key', required: true, },
					{ id: "value", text: 'Value', required: true, },
					{ id: "parent", text: 'Parent', },
					{ id: "attribute", text: 'Attribute', max_char: 100, type: 'json', },
					{ id: "status", text: 'Status', type: 'select', options: [
						{
							id: 'ACTIVE',
							name: 'Active',
						},
						{
							id: 'NOT_ACTIVE',
							name: 'Not Active',
						},
					] },
        ],
				remove_column_text: ['key', 'value'],
      };
    },
    async created() {
      this.base = new Base()
			// var menu = window.localStorage.getItem('menu')
			// if(menu != null)
			// 	menu = JSON.parse(menu)
			//
			// this.title = menu.menuName
      base.save_current_page('Dictionaries', true)
    },
    methods: {
			async onAdd(form){
				$('#please_wait_modal').modal('show')
				var temp = {}
				temp['dictionaries'] = []
				temp['dictionaries'].push(form)
				var response = await this.base.request(this.base.url_api1 + '/dictionary', 'post', temp)
				setTimeout(() => {
					$('#please_wait_modal').modal('hide')
				}, 500)

				if (response != null) {
					if (response.data.code != 200)
						this.base.show_error(response.data.message)
				}
				else
					this.base.show_error("Server Error")
			},
			async onEdit(form){
				$('#please_wait_modal').modal('show')
				var temp = {}
				temp['dictionaries'] = []
				temp['dictionaries'].push(form)
				var response = await this.base.request(this.base.url_api1 + '/dictionary', 'put', temp)
				setTimeout(() => {
					$('#please_wait_modal').modal('hide')
				}, 500)

				if (response != null) {
					if (response.data.code != 200)
						this.base.show_error(response.data.message)
				}
				else
					this.base.show_error("Server Error")
			},
			async onRemove(id){
				var response = await this.base.request(this.base.url_api1 + '/dictionary/' + id, 'delete')

				if (response != null) {
					if (response.data.code != 0)
						this.base.show_error(response.data.message)
				}
				else
					this.base.show_error("Server Error")
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
                          :fields="fields"
													:remove_column_text="remove_column_text"
													db="master"
													collection="dictionaries"
													@onAdd="onAdd"
													@onEdit="onEdit"
													@onRemove="onRemove"/>
                    </div>
                </div>
            </div>
        </div>
</Layout></template>