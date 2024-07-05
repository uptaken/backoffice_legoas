<template>
	<div class="modal fade" id="editTeamModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel">Edit Team</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<table class="w-100">
						<tr>
							<td><p class="m-0 mb-3">Team Name</p></td>
							<td>
								<input type="text" v-model="team_name" :disabled="team_data.arr_player.length <= 2" class="form-control">
								<p class="m-0" v-show="team_data.arr_player.length <= 2">To edit team name, you can edit player name directly</p>
							</td>
						</tr>
						<tr>
							<td class="pt-3"><p class="m-0 mb-3">Image</p></td>
							<td class="pt-3">
								<div>
									<div class="col-6 col-lg-3" v-if="image_data.image_display !== ''">
										<div class="row">
											<div class="col-12">
												<img class="rounded mr-2" width="100%" :src="image_data.image_display" data-holder-rendered="true" />
											</div>
										</div>
									</div>
									
									<div class="col-12 mt-2">
										<input type="file" class="d-none" accept="image/*" id="input_image" @change="change_image($event)" />
										<button class="btn btn-primary" @click="choose_image">Choose Image</button>
									</div>
								</div>
							</td>
						</tr>
					</table>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary w-100" @click="onSubmit">Submit</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import Base from "@/Utils/base";
import DatePicker from 'vue2-datepicker';
import momentTZ from 'moment-timezone';
import 'vue2-datepicker/index.css';
// import moment from 'moment';

import CustomImagePicker from '@/views/layouts/CustomUploadImage';

export default {
	components: {
		'CustomImagePicker': CustomImagePicker,
	},
	props: ['team_data', ],
	data() {
		return {
			base: null,
			id: '',
			team_name: '',
			image_data: {},
		}
	},
	watch: {
		team_data(val){
			this.id = val.id != null ? val.id : ''
			this.team_name = val.id != null ? val.team_name : ''
			this.image_data = val.id != null ? {
				image_display: val.url_image,
				image_data: null,
			} : {}
		},
	},
	created() {
		this.base = new Base()
	},
	methods: {
		onImageResponse(image_data){
			this.image_data = image_data
		},
		choose_image() {
			$('#input_image').trigger('click')
		},
		async change_image(event) {
			const image = new Image()
			image.src = URL.createObjectURL(event.target.files[0])
			image.onload = async () => {
				const {height, width} = image
					
				this.image_data = {
					image_display: URL.createObjectURL(event.target.files[0]),
					data_image: await this.base.imageBase(URL.createObjectURL(event.target.files[0])),
				}
			}
		},
		async onSubmit(){
			if(this.team_name == "")
				this.base.show_error('Team Name is Empty')
			else{
				var url = this.base.url_api + "/event/registration"
				var method = "post"
				var data = {}

				data = {
					image_data: this.image_data,
					team_name: this.team_name,
				}

				if(this.id != ''){
					data.id = this.id
					url += "/edit"
				}

				// console.log(JSON.stringify(data))
				$('#please_wait_modal').modal('show')
				var response = await this.base.request(url, method, data)

				$('#please_wait_modal').modal('hide')
				if(response != null){
					if(response.status === "success"){
						window.location.reload()
					}
					else
						this.base.show_error(response.message)
				}
				else
					console.log(this.$t('server_error'))
			}
		},
	}
}
</script>

<style lang="scss">
</style>
