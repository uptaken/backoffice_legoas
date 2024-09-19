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
  props: ['fields', ],
  components: {DatePicker, CustomTextInput, },
  data() {
    return {
      base: null,
      arr_search: {},
    };
  },
  watch: {
    arr_search: {
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
				this.arr_search = arr
			},
			deep: true,
		},
  },
  mounted(){
    this.base = new Base()
		
		var arr = {}
		for(let data of this.fields){
			arr[data.id] = ''
		}
		
		this.arr_search = arr
  },
  methods: {
    async onSubmit(){
			$('#modalAdvancedSearch').modal('hide')
			
			this.$emit('onSubmit', JSON.parse(JSON.stringify(this.arr_search)))
    },
		onFormChanged(arr_search){
			this.arr_search = arr_search
		},
  }
};
</script>

<template>
  <div class="modal fade" id="modalAdvancedSearch" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Advanced Search</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
					
          <div class="form-group" v-for="(field, index) in fields" :key="index">
						<label>{{ field.text }}</label>
						<CustomTextInput
							:arr_form="arr_search"
							:field="field"
							@onFormChanged="onFormChanged"/>
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