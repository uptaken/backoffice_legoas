<template>
  <div>
    <!-- <div class="row mt-4">
      <div class="col-sm-12 col-md-6">
          <div id="tickets-table_filter" class="dataTables_filter">
              <label class="d-inline-flex align-items-center">
                  Search:
                  <b-form-input v-model="filter" type="search" placeholder="Search..." class="form-control form-control-sm ml-2"/>
              </label>
          </div>
      </div>

      <div class="col-sm-12 col-md-6" v-if="arr_top_button != null">
        <div class="text-md-right">
          <div v-for="(top_button, index) in arr_top_button" :key="index">
            <div v-if="top_button.type == 'custom'">
              <a href="#" :class="top_button.class_button" @click="$emit('onTopButtonClicked', index)">{{ top_button.text }}</a>
            </div>
            <div v-else>
              <a :href="top_button.url" :class="top_button.class_button">{{ top_button.text }}</a>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="table-responsive mb-0 mt-3">
      <table class="table w-100" ref="table">
        <thead>
          <tr>
            <th v-for="(field, index) in fields" :key="index">{{ field.text }}</th>
          </tr>
        </thead>
      </table>
      <!-- <b-table 
        :items="tableData" 
        :fields="fields"  
        :per-page="perPage"
        :current-page="currentPage" 
        :sort-by.sync="sortBy" 
        :sort-desc.sync="sortDesc"
        :filter="filter" 
        :filter-included-fields="filterOn" 
        @filtered="onFiltered">
        <template #cell(action)="row">
          <div v-if="arr_action_button != null">
            <button v-for="(button, index1) in arr_action_button" :key="index1" class="btn btn-sm rounded-circle mr-2" :class="button.class_button" @click="onActionClicked(row, index1)">
              <i :class="button.icon"></i>
            </button>
          </div>
          <div v-else>
            <button class="btn btn-sm btn-primary rounded-circle mr-2" @click="table_action_btn('edit', row)">
              <i class="mdi mdi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger rounded-circle mr-2" @click="table_action_btn('delete', row)">
              <i class="mdi mdi-trash-can"></i>
            </button>
          </div>
        </template>
      </b-table> -->
    </div>
    <!-- <div class="row">
      <div class="col">
        <div class="dataTables_paginate paging_simple_numbers float-right">
          <ul class="pagination pagination-rounded mb-0">
            <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
          </ul>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import Base from "@/Utils/base";
import DataTable from 'datatables.net-buttons-dt'
import $ from 'jquery'

export default {
  props: ["fields", "url", "arr", "arr_action_button", "arr_top_button", "force_reload", "arr_sort", "arr_action_condition", "id", "with_preloader", "with_ajax",],
  components: { },
  data() {
    return {
      base: null,
      tableData: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
      dataTable: null,
    };
  },
  watch: {
    url(val){
      this.init_datatable()
    },
    async arr(val){
      this.tableData = val

			if(this.with_ajax != null && !this.with_ajax)
				this.init_datatable()
    },
    async fields(){
      this.init_datatable()
    },
    async arr_top_button(){
      this.init_datatable()
    },
    force_reload(val){
      if(val)
        this.init_datatable()
    },
  },
  computed: {
    rows() {
      return this.tableData.length;
    },
    
  },
  mounted() {
    this.base = new Base()
    // console.log(this.$refs.table)
    // this.dataTable = new DataTable(this.$refs.table)

		// if(this.with_ajax == null || (this.with_ajax != null && this.with_ajax))
			this.init_datatable()
  },
  methods: {
    async init_datatable(){
      if(this.fields.length > 0){
        // $('#please_wait_modal').modal('show')
        if(this.dataTable != null){
          // console.log(this.dataTable)
          this.dataTable.destroy()
        }
        var context = this
        var token = await window.localStorage.getItem('token')

        var arr_button = []
        for(let x in this.arr_top_button){
          arr_button.push({
            className: this.arr_top_button[x].class_button,
            text : this.arr_top_button[x].text,
            action: function ( e, dt, node, config ) {
              if(context.arr_top_button[x].type == 'custom')
                context.$emit('onTopButtonClicked', x)
              else
                location.href = context.arr_top_button[x].url
            },
            init: function(api, node, config) {
              $(node).removeClass('dt-button')
            },
          })
        }

        var arr_column_def = []
        if(context.arr_action_button.length > 0)
          arr_column_def.push({
            targets: -1,
            data: null,
            sorting: false,
            render: function(data, type, row, meta) {
              var str = ""
              str += '<div class="d-flex align-items-center">'
                for(let index in context.arr_action_button){
                  var flag = false
                  if(context.arr_action_condition != null){
                    for(let action_condition of context.arr_action_condition){
                      var flag1 = false
                      for(let action_button of action_condition.arr_action_button){
                        if(action_button == context.arr_action_button[index].id){
                          flag1 = true
                          break
                        }
                      }

                      if(flag1){
                        if(action_condition.condition == 'not_same' && row[action_condition.id] != action_condition.value){
                          flag = true
                          break
                        }
                        else if(action_condition.condition == 'same' && row[action_condition.id] == action_condition.value){
                          flag = true
                          break
                        }
                      }
                      else{
                        flag = true
                        break
                      }
                    }
                  }
                  else
                    flag = true
                  
                  if(flag){
                    var temp = row
                    str += `
                      <button key="${index}" row='${JSON.stringify(temp)}' class="${context.arr_action_button[index].icon != null ? 'rounded-circle' : 'btn d-inline-block'} mr-2 action-button${context.id} ${context.arr_action_button[index].class_button}">`
                    if(context.arr_action_button[index].icon != null)
                      str += `<i class="${context.arr_action_button[index].icon}"></i>`
                    else if(context.arr_action_button[index].text != null)
                      str += context.arr_action_button[index].text
                    str += `</button>`
                  }
                }
              str += '</div>'
              return str
            },
          })

				var options = {
					"processing" : true,
					
					bLengthChange: false,
					responsive: true,
					dom: 'Bfrtip',
					buttons: arr_button,
					language: {
						searchPlaceholder: 'Search...',
						sSearch: '',
					},
					"order" : this.arr_sort,
					// deferLoading: 2,
					"columns" : this.fields,
					"columnDefs" : arr_column_def
				}
				if(this.with_ajax == null || (this.with_ajax != null && this.with_ajax)){
					options["serverSide"] = true
					options.ajax = {
						url : this.url,
						type : "GET",
						dataType : "json",
						headers : {
							"content-type": "application/json",
							"accept": "application/json",
							"Authorization": token,
						},
						dataSrc: function ( json ) {
							setTimeout(() => {
								if(context.with_preloader == null || (context.with_preloader != null && context.with_preloader))
									$('#please_wait_modal').modal('hide')
					
								$('.action-button' + context.id).click(function() {
									var row = JSON.parse($(this).attr('row'))
									
									context.onActionClicked(row, $(this).attr('key'))
								})
							}, 500)
					
							return json.data;
						}
					}
				}
				else{
					options.data = this.arr
					setTimeout(() => {
						$('.action-button' + context.id).click(function() {
							var row = JSON.parse($(this).attr('row'))
							
							context.onActionClicked(row, $(this).attr('key'))
						})
					}, 500)
				}
					
        this.dataTable = $(this.$refs.table).DataTable(options)

        this.$emit('onLoadComplete')
      }
    },
    onTopButtonClicked(index){},
    onActionClicked(row, action_button_index){
      // var data_index = -1
      // for(let x in this.tableData){
      //   if(row.item.id == this.tableData[x].id){
      //     data_index = x
      //     break
      //   }
      // }

      this.$emit('onActionClicked', row, action_button_index,)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async table_action_btn(type, row) {
      var data_index = -1
      for(let x in this.tableData){
        if(row.item.id == this.tableData[x].id){
          data_index = x
          break
        }
      }

      if(type == 'edit')
        window.location.href = this.url + '/action/edit/' + row.item.id
      else if (type == 'delete') {
        if (confirm('Are you sure want to delete this data?')) {
          var response = await this.base.request(this.base.url_api + this.url + '/delete', "get", {
            id: row.item.id,
          });
          if (response != null) {
            if (response.status == "success") {
              this.tableData.splice(data_index, 1);
            }
            else
              this.base.show_error(response.message)
          }
          else
            console.log('Server Error')
        }
      }
    },
  },
};
</script>