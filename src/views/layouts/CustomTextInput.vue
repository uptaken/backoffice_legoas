<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
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
	name: 'CustomTextInput',
  props: ['arr_form', 'field', 'type', ],
  components: {DatePicker, },
  data() {
    return {
      base: null,
			arr_form1: [],
			arr_foreign: [],
			collectionObj: null,
    };
  },
	watch: {
		arr_form1: {
			handler(newValue, oldValue) {
				if(this.field.type == 'foreign_key'){
					for(let foreign of this.arr_foreign){
						if(foreign._id == newValue[this.field.id]){
							newValue[this.field.foreign_column_name + '_foreign'] = foreign
							break
						}
					}

				}

				this.$emit('onFormChanged', newValue)
			},
			deep: true,
		},
		arr_form: {
			handler(newValue, oldValue) {
				// if(this.type == 'second'){
				// 	console.log(newValue)
				// }

				if(newValue != null)
					this.arr_form1 = newValue
			},
			deep: true,
		},
		field(val){

			if(val.type == 'foreign_key'){
				this.connect_foreign_mongodb()
			}
		},
		collectionObj(val){
			if(val != null){
				this.get_foreign_data()
			}
		},
	},
  mounted(){
    this.base = new Base()

		if(this.field.type == 'foreign_key'){
			this.connect_foreign_mongodb()
		}



		// if(this.type == 'second'){
		// 	console.log(this.arr_form[this.field.id])
		// 	this.arr_form1 = JSON.parse(JSON.stringify(this.arr_form))
		// }
  },
  methods: {
		async connect_foreign_mongodb(){
			var mongo = await this.base.connect_mongodb()
			this.collectionObj = mongo.db(this.field.db).collection(this.field.collection)
		},
		async get_foreign_data(){
			var pipeline = []
			var arr = await this.collectionObj.aggregate(pipeline)

			var totalRows = await this.collectionObj.aggregate([
				{ $count: "Total" },
			])
			this.totalRows = totalRows.length > 0 ? totalRows[0].Total : 0

			for(let data of arr){
				data.is_checked = false

			}
			this.arr_foreign = arr
		},
  },
};
</script>

<template>
	<div>
		<date-picker v-model="arr_form1[field.id]" type="date" input-class="form-control" format="DD/MM/YYYY" value-type="format" v-if="field.type == 'date'"/>

		<textarea v-model="arr_form1[field.id]" class="form-control" v-else-if="field.type == 'textarea'"></textarea>

		<select v-model="arr_form1[field.id]" class="form-control" v-else-if="field.type == 'select'">
			<option v-for="(option, index) in field.options" :key="index" :value="option.id">{{ option.name }}</option>
		</select>

		<select v-model="arr_form1[field.id]" class="form-control" v-else-if="field.type == 'foreign_key'">
			<option v-for="(foreign, index) in arr_foreign" :key="index" :value="foreign._id">{{ foreign[field.foreign_column_name] }}</option>
		</select>

		<div class="input-group" v-else-if="field.type == 'currency' || field.type == 'phone'">
			<div class="input-group-prepend">
				<span class="input-group-text" id="basic-addon1">{{ field.type == 'currency' ? 'Rp.' : '+62' }}</span>
			</div>
			<input type="text" class="form-control" v-model="arr_form1[field.id]">
		</div>

		<div v-else-if="field.type == 'json_breakdown'">
			<div v-for="(field1, index) in field.arr" :key="index" class="form-group ml-3">
				<label>{{ field1.text }}</label>
				<CustomTextInput
					:arr_form="arr_form1[field.id]"
					:field="field1"
					type="second"
					@onFormChanged="(arr) => $set(arr_form1, field.id, arr)"/>
			</div>
		</div>

		<input type="text" v-model="arr_form1[field.id]" class="form-control" v-else/>
	</div>
</template>