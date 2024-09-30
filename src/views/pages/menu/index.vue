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
 * Menu component
 */
export default {
    page: {
      title: "Menu",
      meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTable, },
    data() {
      return {
        base: null,
        title: "",
        fields: [
          { id: "_id", text: 'ID', allow_add_edit: false, },
					{ id: 'menu_icon', text: 'Icon', },
					{ id: 'menu_name', text: 'Name', },
					{ id: 'menu_url', text: 'URL', },
        ],
				remove_column_text: ['_id', 'menu_name'],
      };
    },
    async created() {
      this.base = new Base()
			// var menu = window.localStorage.getItem('menu')
			// if(menu != null)
			// 	menu = JSON.parse(menu)
			//
			// this.title = menu.menuName
      base.save_current_page('Menu', true)
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
													collection="menus"
													@onAdd="onAdd"
													@onEdit="onEdit"
													@onRemove="onRemove"/>
                    </div>
                </div>
            </div>
        </div>
</Layout></template>