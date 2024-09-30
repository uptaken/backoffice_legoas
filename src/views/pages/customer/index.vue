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
 * Customer component
 */
export default {
    page: {
      title: "Customer",
      meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTable, },
    data() {
      return {
        base: null,
        title: "",
        fields: [
          { id: "_id", text: 'ID', allow_add_edit: false, },
          { id: "agunan_tax", text: 'Agunan Tax', type: 'json_breakdown', arr: [
						{ id: 'bank_name', text: 'Bank Name', },
						{ id: 'bank_branch', text: 'Bank Branch', },
						{ id: 'rekening_number', text: 'Account Number', },
						{ id: 'account_name', text: 'Account Name', },
					]},
					{ id: "banking_data", text: 'Banking Data', type: 'json_breakdown', arr: [
						{ id: 'bank_name', text: 'Bank Name', },
						{ id: 'bank_branch', text: 'Bank Branch', },
						{ id: 'rekening_number', text: 'Account Number', },
						{ id: 'account_name', text: 'Account Name', },
					]},
					{ id: 'office_code', text: 'Customer Code', },
					{ id: 'name', text: 'Name', },
					{ id: 'address', text: 'Address', },
					{ id: 'handphone_number', text: 'Handphone Number', },
					{ id: 'telephone_number', text: 'Telephone Number', },
					{ id: 'identity_number', text: 'Identity No', },
					{ id: 'identity_type', text: 'Identity Type', },
					{ id: 'npwp_number', text: 'NPWP No', },
					{ id: 'postal_code', text: 'Postal Code', },
					{ id: 'residence_address', text: 'Resident Address', },
					{ id: 'residence_city', text: 'Resident City', },
					{ id: 'residence_postal_code', text: 'Resident Postal Code', },
					{ id: 'residence_province', text: 'Resident Province', },
					{ id: 'residence_rt', text: 'Resident RT', },
					{ id: 'residence_rw', text: 'Resident RW', },
					{ id: 'rt', text: 'RT', },
					{ id: 'rw', text: 'RW', },
					{ id: "ppn_tax_banking_data", text: 'PPN Banking Data', type: 'json_breakdown', arr: [
						{ id: 'bank_name', text: 'Bank Name', },
						{ id: 'bank_branch', text: 'Bank Branch', },
						{ id: 'rekening_number', text: 'Account Number', },
						{ id: 'account_name', text: 'Account Name', },
					]},
        ],
				remove_column_text: ['_id', 'name'],
      };
    },
    async created() {
      this.base = new Base()
			// var menu = window.localStorage.getItem('menu')
			// if(menu != null)
			// 	menu = JSON.parse(menu)
			//
			// this.title = menu.menuName
      base.save_current_page('Customer', true)
    },
    methods: {
			async onAdd(form){
				// form.province_name = form.province
				// form.city_name = form.city
				// form.id = moment().format('DDMMYYHHmmssSSS')
				// delete form.province
				// $('#please_wait_modal').modal('show')

				var temp = {}
				temp['user_roles'] = []
				temp['user_roles'].push(form)
				var response = await this.base.request(this.base.url_api1 + '/admin/user/role', 'post', temp)
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
				// form.province_name = form.province
				// form.city_name = form.city
				// form.id = form._id
				// delete form.province
				// $('#please_wait_modal').modal('show')

				var temp = form
				var response = await this.base.request(this.base.url_api1 + '/admin/user/role/' + form._id, 'put', temp)
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
				var temp = {}
				temp['id'] = []
				temp['id'].push(id)

				var response = await this.base.request(this.base.url_api1 + '/admin/user/role/delete', 'post', temp)

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
													collection="customers"
													@onAdd="onAdd"
													@onEdit="onEdit"
													@onRemove="onRemove"/>
                    </div>
                </div>
            </div>
        </div>
</Layout></template>