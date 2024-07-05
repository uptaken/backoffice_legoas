<script>
import Layout from "@/views/layouts/main";
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
			title: "",
			meta: [{ name: "description", content: appConfig.description }]
		},
		components: { Layout, PageHeader, CustomTable, },
		data() {
			return {
				base: null,
				tableData: [
					{
						partner: 'LEGO01',
						office: 'HRD',
						role: 'ADMIN',
					},
					{
						partner: 'LEGO02',
						office: 'JAKARTA',
						role: 'ADMIN',
					},
				],
				fields: [
					{ data: "partner", name: "role.partner", text: 'Partner', },
					{ data: "office", name: "role.office", text: 'Kantor', },
					{ data: "role", name: "role.role", text: 'Peran', },
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
		},
		methods: {
			async onActionClicked(row, action_button_index){
				var action_button = this.arr_action_button[action_button_index]
				var data = row

				console.log(action_button.id)
				if(action_button.id == "choose"){
					window.localStorage.setItem('role', JSON.stringify(data))
					window.location.href = '/'
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