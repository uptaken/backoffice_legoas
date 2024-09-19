<script>
import Layout from "@/views/layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";
import * as Realm from "realm-web"

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Banner component
 */
export default {
		page: {
			title: "",
			meta: [{ name: "description", content: appConfig.description }]
		},
		components: { Layout, PageHeader, CustomTable, },
		data() {
			return {
				base: null,
				tableData: [
				],
				fields: [
					{ data: "partnerName", name: "role.partner", text: 'Partner', },
					{ data: "officeName", name: "role.office", text: 'Kantor', },
					{ data: "roleName", name: "role.role", text: 'Peran', },
					{ text: "Tindakan", orderable: false, },
				],
				arr_action_button: [
					{
						id: 'choose',
						class_button: 'btn-primary',
						text: 'Pilih',
					},
				],
				arr_top_button: [
				],
			};
		},
		async created() {
			this.base = new Base()
			
			var user_data = window.localStorage.getItem('user_data')
			
			// this.connect_mongodb()
			if(user_data == null)
				this.get_profile()
			this.get_role()
		},
		methods: {
			async get_profile(){
				var response = await base.request(base.url_api + '/admin/profile')
			
				if (response != null) {
					window.localStorage.setItem('user_data', JSON.stringify(response.data))
					console.log(JSON.stringify(response.data))
				}
				else
					base.show_error("Server Error")
				
			},
			async get_role(){
				var response = await base.request(base.url_api + '/admin/user/role')
			
				if (response != null) {
					this.tableData = response.data.userRoles
					console.log(JSON.stringify(response.data))
				}
				else
					base.show_error("Server Error")
				
			},
			async connect_mongodb(){
				var mongo = await this.base.connect_mongodb()
				const collection = mongo.db("master").collection("dictionaries");
				console.log(await collection.find())
			},
			async connect_mongodb_joshua(){
				var mongo = await this.base.connect_mongodb()
				const collection = mongo.db("sample_mflix").collection("movies");
				console.log(await collection.aggregate([
					{
						"$match": {
							"runtime": {
								"$gte": 1000,
							},
							"plot": /documentary/,
						},
					},
					{
						"$sort": {
							"runtime": 1,
						}
					},
				]))
				
				for await (const change of collection.watch()) {
					let breakAsyncIterator = false; // Later used to exit async iterator
					switch (change.operationType) {
						case "insert": {
							const { documentKey, fullDocument } = change;
							console.log(`new document: ${documentKey}`, fullDocument);
							breakAsyncIterator = true;
							break;
						}
						case "update": {
							const { documentKey, fullDocument } = change;
							console.log(`updated document: ${documentKey}`, fullDocument);
							breakAsyncIterator = true;
							break;
						}
						case "replace": {
							const { documentKey, fullDocument } = change;
							console.log(`replaced document: ${documentKey}`, fullDocument);
							breakAsyncIterator = true;
							break;
						}
						case "delete": {
							const { documentKey } = change;
							console.log(`deleted document: ${documentKey}`);
							breakAsyncIterator = true;
							break;
						}
					}
					// if (breakAsyncIterator) break; // Exit async iterator
				}
			},
			async onActionClicked(row, action_button_index){
				var action_button = this.arr_action_button[action_button_index]
				var data = row

				if(action_button.id == "choose"){
					$('#please_wait_modal').modal('show')
					var response = await base.request(base.url_api + '/admin/session/role', 'post', data)
					
					setTimeout(() => {
						$('#please_wait_modal').modal('hide')
					}, 500)
					if (response != null) {
						if (response.data.code == 200) {
							
							window.localStorage.setItem('role', JSON.stringify(data))
							window.location.href = '/'
						}
						else
							base.show_error(response.data.message)
					}
					else
						base.show_error("Server Error")
				}
// 				else if (action_button.id === 'delete') {
// 					if (confirm('Are you sure want to delete this data?')) {
// 						$('#please_wait_modal').modal('show')
// 						var url = base.url_api + '/banner/delete'
// 						var response = await base.request(url, "get", {
// 							id: data.id,
// 						});
// 
// 						setTimeout(() => {
// 							$('#please_wait_modal').modal('hide')
// 						}, 500)
// 						if (response != null) {
// 							if (response.status == "success") {
// 								window.location.reload()
// 							}
// 							else
// 								this.base.show_error(response.message)
// 						}
// 						else
// 							console.log('Server Error')
// 					}
// 				}
			},
		}
};
</script>

<template>
	<div class="container">
		
		<div class="authentication-page-content d-flex align-items-center">
			<div class="card w-100">
				<div class="card-header">
					<p class="m-0 text-center">Pilih akses peran dan kantor anda</p>
				</div>
				<div class="card-body">
					<CustomTable
						id="chooseRole"
						:arr_action_button="arr_action_button"
						:arr_top_button="arr_top_button"
						:arr="tableData"
						:fields="fields"
						:with_ajax="false"
						@onActionClicked="onActionClicked"/>
				</div>
			</div>
		</div>
		
	</div>
</template>