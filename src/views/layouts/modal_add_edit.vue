<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import CustomTextInput from "@/views/layouts/CustomTextInput";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import imageBase from 'image-to-base64'
import Base from "@/Utils/base";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['fields', 'data', ],
  components: {DatePicker, CustomTextInput, },
  data() {
    return {
      base: null,
      arr_form: {},
    };
  },
  watch: {
    arr_form: {
			handler(newValue, oldValue) {

				var arr = newValue
				for(let x in arr){
					var field_data = {}
					for(let field of this.fields){
						if(field.id == x){
							field_data = field
							break
						}
					}

					if(field_data.type == 'currency')
						arr[x] = this.base.to_currency_format(arr[x])
					else if(field_data.type == 'phone')
						arr[x] = this.base.phone_validation(arr[x])
				}

				// this.arr_form = arr
			},
			deep: true,
		},
		data(val){
			var arr_form = this.arr_form
			for(let x in arr_form){
				if(this.data._id != null){
					for(let y in this.data){
						var field_data = {}
						for(let field of this.fields){
							if(field.id == y){
								field_data = field
								break
							}
						}


						if(x == y){
							arr_form[x] = field_data.type == 'json_breakdown' ? JSON.parse(this.data[y]) : this.data[y]
							break
						}
					}
				}
				else
					arr_form[x] = ''
			}

			this.arr_form = arr_form
		},
  },
  mounted(){
    this.base = new Base()

		var arr = {}
		for(let data of this.fields){
			if(data.type == 'foreign_key')
				arr[data.id + '_data'] = {}
			arr[data.id] = data.type == 'json_breakdown' ? this.init_arr_form(data.arr) : ''
		}
		this.arr_form = arr
  },
  methods: {
		init_arr_form(arr_field){
			var arr = {}

			for(let data of arr_field){
				arr[data.id] = data.type == 'json_breakdown' ? this.init_arr_form(data.arr) : ''
			}
			return arr
		},
    async onSubmit(){
			var message = ''
			for(let x in this.arr_form){
				if(this.arr_form[x] == ''){
					var field_data = {}
					for(let field of this.fields){
						if(field.id == x){
							field_data = field
							break
						}
					}

					if((field_data.allow_add_edit == null || field_data.allow_add_edit) && field_data.required){
						message = field_data.text + ' is Empty'
						break
					}
				}
			}

			if(message != '')
				this.base.show_error(message)
			else{
				$('#modalAddEdit').modal('hide')

				this.$emit('onSubmit', JSON.parse(JSON.stringify(this.arr_form)))
			}
    },
		onFormChanged(arr_form){
			console.log(arr_form)
			this.arr_form = arr_form
		},
  }
};
</script>

<template>
  <div class="modal fade" id="modalAddEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ data._id != null ? 'Edit' : 'Add' }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">

          <div  v-for="(field, index) in fields" :key="index">
						<div class="form-group" v-if="field.allow_add_edit == null || field.allow_add_edit">
							<label>{{ field.text }}</label>
							<CustomTextInput
								:arr_form="arr_form"
								:field="field"
								type="primary"
								@onFormChanged="onFormChanged"/>
						</div>
					</div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="onSubmit">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>