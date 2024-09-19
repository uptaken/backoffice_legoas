<template>
  <div>

    <div class="table-responsive mb-0 mt-3">
			<div class="d-flex justify-content-between">

				<div class="d-flex align-items-center">
					<button class="btn btn-primary" @click="onAdvancedSearchClicked">Advanced Search</button>
					<div class="d-flex align-items-center ml-3">
						<label class="m-0">Search</label>
						<input type="text" class="form-control ml-1" v-model="search"/>
					</div>
				</div>

				<div class="">
					<div class="d-flex align-items-center">
						<label class="m-0">Action</label>
						<select class="form-control ml-1" v-model="action">
							<option value="">Choose Action</option>
							<option value="add">Add</option>
							<option value="edit">Edit</option>
							<option value="delete">Delete</option>
							<option value="export">Export Excel</option>
						</select>
					</div>
				</div>

			</div>

      <table class="table w-100 my-3" ref="table">

        <thead>
          <tr>
						<th style="width: 1%"><input type="checkbox"  @change="onSelectAllClicked" :checked="is_checked_all"/></th>

            <th v-for="(field, index) in fields" :key="index">
							<div class="d-flex justify-content-between align-items-center" style="cursor: pointer;" @click="onSortClicked(index)">
								{{ field.text }}
								<i class="fa-solid " :class="{'fa-sort': arr_sort[field.id] == 'none', 'fa-sort-up': arr_sort[field.id] == 'asc', 'fa-sort-down': arr_sort[field.id] == 'desc',}"></i>
							</div>
						</th>
          </tr>
        </thead>

				<tbody v-if="arr.length > 0">
					<tr v-for="(data, index1) in arr" :key="index1">
						<td><input type="checkbox" class="" @change="onSelectClicked(index1)" :checked="data.is_checked"/></td>

						<td v-for="(field, index2) in fields" :key="index2">{{ field.max_char != null ? data[field.id].substring(0, field.max_char) + (data[field.id].length > field.max_char ? '...' : '') : data[field.id] }}</td>
					</tr>
				</tbody>

				<tbody v-else>
					<tr>
						<td :colspan="fields.length + 1" class="text-center">No Data</td>
					</tr>
				</tbody>

      </table>

			<div class="d-flex justify-content-between">

				<div class="d-flex align-items-center">
					<label class="m-0">Page</label>
					<select class="form-control ml-1" v-model="perPage">
						<option v-for="(page, index) in pageOptions" :key="index" :value="page">{{ page }}</option>
					</select>
				</div>

				<div class="">
					<b-pagination
						v-model="currentPage"
						:total-rows="totalRows"
						:per-page="perPage"/>
				</div>

			</div>
    </div>

		<ModalAdvancedSearch
			:fields="fields"
			@onSubmit="onAdvancedSearchSubmit"/>

		<ModalAddEdit
			:fields="fields"
			:data="data_edit"
			@onSubmit="onAddEditSubmit"/>
  </div>
</template>

<script>
import Base from "@/Utils/base";
import ModalAdvancedSearch from "@/views/layouts/modal_advanced_search";
import ModalAddEdit from "@/views/layouts/modal_add_edit";
import $ from 'jquery'

export default {
  props: ["fields", "url", "arr_action_button", "arr_top_button", "force_reload", "arr_action_condition", "id", "with_preloader", "with_ajax", 'db', 'collection', 'remove_column_text', ],
  components: { ModalAdvancedSearch, ModalAddEdit, },
  data() {
    return {
      base: null,
      arr: [],
			arr_sort: [],
			arrAdvancedSearch: [],
			search: '',
			action: '',
			is_checked_all: false,
			data_edit: {},
			index_edit: -1,
			arr_index_delete: [],
      totalRows: 1000,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
			collectionObj: null,
    };
  },
  watch: {
		// when choose action triggered
		async action(val){
			if(val == 'add'){
				this.data_edit = {}

				$('#modalAddEdit').modal('show')
			}
			else if(val == 'edit' || val == 'delete'){
				var counter = 0
				// check data selected
				for(let x in this.arr){
					if(this.arr[x].is_checked){
						this.data_edit = this.arr[x]
						this.index_edit = x
						break
					}
					counter++
				}

				if(counter == this.arr.length){
					this.base.show_error('Please select a data')
					this.action = ''
				}
				else{
					if(val == 'edit')
						$('#modalAddEdit').modal('show')
					else if(val == 'delete'){
						var arr_index_delete = []
						var string = 'Konfirmasi data berikut ini:\n'
						for(let x in this.arr){
							if(this.arr[x].is_checked){
								arr_index_delete.push(x)
								string += '*'
								for(let y in this.remove_column_text){
									string += this.arr[x][this.remove_column_text[y]]
									if(y < this.remove_column_text.length - 1)
										string += ' - '
								}
								string += '\n'
							}
						}
						string += 'akan dihapus'

						if (confirm(string)) {
							this.arr_index_delete = arr_index_delete
							this.onRemoveSubmit()
						}
					}
				}
			}
			this.action = ''
		},
		// when per page changed
		perPage(){
			this.get_data()
		},
		// when page changed
		currentPage(){
			this.get_data()
		},
		// when search typed
		search(){
			this.get_data()
		},
		// when advanced search triggered
		arrAdvancedSearch: {
			handler(newValue, oldValue) {
				this.get_data()
			},
			deep: true
		},
		// when sort triggered
		arr_sort: {
			handler(newValue, oldValue) {
				this.get_data()
			},
			deep: true
		},
		// when realm web collection set
		async collectionObj(val){
			if(val != null){
				var context = this
				var index = -1

				for await (const change of val.watch()) {
					switch (change.operationType) {
						case "insert": {
							const { documentKey, fullDocument } = change;
							context.arr.splice(0, 0, fullDocument)
							console.log(`new document: ${documentKey}`, fullDocument);
							break;
						}
						case "update": {
							const { documentKey, fullDocument } = change;
							var arr = context.arr
							index = -1
							for(let x in context.arr){
								if(context.arr[x]._id == documentKey){
									index = x
									// context.arr[x] = fullDocument
									break
								}
							}
							context.$set(context.arr, index, fullDocument)
							// context.arr = arr

							console.log(`updated document: ${documentKey}`, fullDocument);
							break;
						}
						case "delete": {
							const { documentKey } = change;
							index = -1
							for(let x in context.arr){
								if(context.arr[x]._id == documentKey){
									index = x
									break
								}
							}
							context.arr.splice(index, 1)
							context.get_data()
							console.log(`deleted document: ${documentKey}`);
							break;
						}
					}
					if (this.collectionObj == null) break; // Exit async iterator
				}
			}
		},
  },
  async mounted() {
		var context = this
    this.base = new Base()

		await this.connect_mongodb()
		this.get_data()

		var arr_sort = {}
		for(let field of this.fields){
			arr_sort[field.id] = "none"
		}
		this.arr_sort = arr_sort

  },
  methods: {
		async connect_mongodb(){
			var mongo = await this.base.connect_mongodb()
			this.collectionObj = mongo.db(this.db).collection(this.collection)
		},
		onSortClicked(index){
			var field = this.fields[index]
			this.page
			var arr_sort = this.arr_sort
			for(let x in arr_sort){
				if(x != field.id)
					arr_sort[x] = 'none'
			}

			arr_sort[field.id] = arr_sort[field.id] == 'none' ? 'asc' : arr_sort[field.id] == 'asc' ? 'desc' : 'none'
			this.arr_sort = arr_sort
		},
		onAdvancedSearchClicked(){
			$('#modalAdvancedSearch').modal('show')
		},
		onSelectAllClicked(){
			var arr = this.arr
			for(let data of arr)
				data.is_checked = true
			this.arr = arr
		},
		onSelectClicked(index){
			var arr = this.arr
			var counter = 0
			arr[index].is_checked = !arr[index].is_checked
			for(let data of arr){
				if(!data.is_checked)
					break
				counter++
			}
			this.is_checked_all = counter == arr.length
		},
		onAdvancedSearchSubmit(arr_search){
			this.currentPage = 1
			this.arrAdvancedSearch = arr_search
		},
		async onRemoveSubmit(){
			if(this.arr_index_delete.length >= 0 && this.action == 'delete'){
				$('#please_wait_modal').modal('show')
				for(let index of this.arr_index_delete){
					this.$emit('onRemove', this.arr[index]._id)
				}
				setTimeout(() => {
					$('#please_wait_modal').modal('hide')
				}, 500)

				this.action = ''
				this.arr_index_delete = []
			}
		},
		async onAddEditSubmit(arr_form){
			var arr = this.arr
			if(this.index_edit >= 0)
				arr[this.index_edit].is_checked = false

			if(arr_form._id == null || arr_form._id == ""){
				delete arr_form._id
				for(let field of this.fields){
					if(field.type == 'json')
						arr_form[field.id] = JSON.parse(arr_form[field.id])
				}

				this.$emit('onAdd', arr_form)
			}
			else{
				var arr1 = JSON.parse(JSON.stringify(arr_form))
				for(let field of this.fields){
					if(field.type == 'json')
						arr1[field.id] = JSON.parse(arr1[field.id])
				}

				this.$emit('onEdit', arr1)
			}

			this.arr = arr
			this.action = ''
			this.index_edit = -1
		},
		async get_data(){
			var query = {}
			var arr_global_search = []
			var arr_advanced_search = []
			var arr_sort = {}
			var sort_flag = false

			// check for search
			if(this.search != ''){
				for(let field of this.fields){
					var global_search = {}
					global_search[field.id] = new RegExp(this.search, "i");
					arr_global_search.push(global_search)
				}
				query.$or = arr_global_search
			}

			// check for sort data
			for(let x in this.arr_sort){
				if(this.arr_sort[x] != 'none'){
					arr_sort[x] = this.arr_sort[x] == 'asc' ? 1 : -1
					sort_flag = true
				}
			}

			// check for advanced search
			for(let x in this.arrAdvancedSearch){
				if(this.arrAdvancedSearch[x] != ''){
					var advanced_search = {}
					advanced_search[x] = this.arrAdvancedSearch[x]
					arr_advanced_search.push(advanced_search)

					query[x] = this.arrAdvancedSearch[x]
				}
			}

			// prepare for query, sort, and pagination for realm sdk
			var pipeline = [
				{ $match: query, },
				{ $skip: (this.currentPage - 1) * this.perPage, },
				{ $limit: this.perPage, },
			]
			if(sort_flag)
				pipeline.push({ $sort: arr_sort },)
			var arr = await this.collectionObj.aggregate(pipeline)

			// get total data queried
			var totalRows = await this.collectionObj.aggregate([
				{ $match: query, },
				{ $count: "Total" },
			])
			this.totalRows = totalRows.length > 0 ? totalRows[0].Total : 0


			// manage data generated
			for(let data of arr){
				for(let field of this.fields){
					if(field.type == 'json')
						data[field.id] = JSON.stringify(data[field.id])
					else if(field.type == 'foreign_key'){
						var mongo = await this.base.connect_mongodb()
						var foreignCollectionObj = mongo.db(field.db).collection(field.collection)

						var arr_foreign = await foreignCollectionObj.aggregate([
							{ $match: { _id: data[field.id], }, },
						])
						data[field.id] = arr_foreign[0][field.foreign_column_name]
					}
				}
				data.is_checked = false
			}
			this.arr = arr
		},
  },
};
</script>