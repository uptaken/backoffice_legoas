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
 * Partner component
 */
export default {
    page: {
      title: "Partner",
      meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTable, },
    data() {
      return {
        base: null,
        title: "",
        fields: [
          { id: "_id", text: 'ID', allow_add_edit: false, },
          { id: "partner_code", text: 'Code', },
					{ id: "partner_name", text: 'Name', },
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
				remove_column_text: ['_id', 'partner_name'],
      };
    },
    async created() {
      this.base = new Base()
			// var menu = window.localStorage.getItem('menu')
			// if(menu != null)
			// 	menu = JSON.parse(menu)
			//
			// this.title = menu.menuName
      base.save_current_page('Partner', true)
    },
    methods: {
			async onAdd(form){
				// form.city_name = form.regencies
				// form.province_name = form.province_foreign.province
				// form.id = form.province_id
				// form.id = moment().format('DDMMYYHHmmssSSS')
				// delete form.province_id
				// $('#please_wait_modal').modal('show')

				var temp = form
				var response = await this.base.request(this.base.url_api1 + '/admin/partner', 'post', temp)
				// setTimeout(() => {
				// 	$('#please_wait_modal').modal('hide')
				// }, 500)

				if (response != null) {
					if (response.data.code != 200)
						this.base.show_error(response.data.message)
				}
				else
					this.base.show_error("Server Error")
			},
			async onEdit(form){
				// form.city_name = form.regencies
				// form.province_name = form.province_foreign.province
				// form.id = form.province_id
				// $('#please_wait_modal').modal('show')

				var temp = form
				var response = await this.base.request(this.base.url_api1 + '/admin/partner/' + form._id, 'put', temp)
				// setTimeout(() => {
				// 	$('#please_wait_modal').modal('hide')
				// }, 500)

				if (response != null) {
					if (response.data.code != 200)
						this.base.show_error(response.data.message)
				}
				else
					this.base.show_error("Server Error")
			},
			async onRemove(id){
				// var temp = {}
				// temp['id'] = []
				// temp['id'].push(id)

				var response = await this.base.request(this.base.url_api1 + '/admin/partner/' + id, 'delete')

				if (response != null) {
					if (response.data.code != 200)
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
													db="access"
													collection="partners"
													@onAdd="onAdd"
													@onEdit="onEdit"
													@onRemove="onRemove"/>
                    </div>
                </div>
            </div>
        </div>
</Layout></template>