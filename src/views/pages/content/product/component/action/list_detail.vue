<template>
  <div class="card">
    <div class="card-body">
      <div v-for="(filter, index) in arr" :key="index" class="form-group">
        <label>{{ filter.name }}</label>
        <v-select @search="(search, loading) => onFilterContentSearch(search, loading, index)" v-model="selected_filter[index].selected" :options="arr_content[index]"/>
      </div>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";
import $ from 'jquery'

export default {
  props: ["data", 'tab', 'index', 'is_submit', ],
  components: { },
  data() {
    return {
      base: null,
      arr: [],
      arr_detail: [],
      arr_content: [],
      selected_filter: [],
      selected_index: -1,
    }
  },
  watch: {
    tab(val){
      if(this.index < val)
        this.validate()
    },
    data(val){
      if(val.id != null){
        this.arr_detail = val.detail
      }
      
      if(this.arr.length == 0)
        this.get_filter()
    },
    selected_filter(val){
      // console.log(val)
    },
    is_submit(val){
      if(val)
        this.validate()
    },
  },
  mounted() {
    this.base = new Base()
  },
  methods: {
    async get_filter(){
      $('#please_wait_modal').modal('show')
      var response = await this.base.request(this.base.url_api + '/product-filter?' + (this.data.sub_category.id != null ? 'sub_category_id=' + this.data.sub_category.id : 'category_id=' + this.data.category.id))
      setTimeout(() => {
        $('#please_wait_modal').modal('hide')
      }, 500)
      
      if (response != null) {
        if (response.status == "success") {
          var selected_filter = []
          var arr_content = []
          for(let data of response.data){
            var selected = {}
            var id = null
            for(let detail of this.arr_detail){
              if(detail.product_filter.id == data.id){
                id = detail.id
                selected = detail.product_filter_content
                break
              }
            }
            selected_filter.push({
              id: id,
              selected: selected,
            })
            
            for(let temp of data.content){
              temp.label = temp.name
              temp.code = temp.id
            }
            arr_content.push(data.content)
          }
          this.arr = response.data
          this.selected_filter = selected_filter
          this.arr_content = arr_content
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    async onFilterContentSearch(search, loading, index){
      var response = await this.base.request(this.base.url_api + '/product-filter/content?product_filter_id=' + this.arr[index].id + '&search=' + search)
      
      if (response != null) {
        if (response.status == "success") {
          for(let temp of response.data){
            temp.label = temp.name
            temp.code = temp.id
          }
          this.$set(this.arr_content, index, response.data)
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    async validate(){
      var message = ''
      var arr_detail = []
      for(let x in this.arr){
        arr_detail.push({
          id: this.selected_filter[x].id,
          product_filter: this.arr[x],
          product_filter_content: this.selected_filter[x].selected,
        })
      }
      
      if(arr_detail.length == 0)
        message = 'Detail is Empty'
        
      this.$emit('onValidate', message, {
        arr_detail: arr_detail
      })
    },
  },
};
</script>