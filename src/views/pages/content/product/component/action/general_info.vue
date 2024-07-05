<template>
  <div class="card">
    <div class="card-body">
      <div class="form-group">
        <label>Category</label>
        <v-select @search="onCategorySearch" v-model="selected_category" :options="arr_category"/>
      </div>
      
      <div v-for="(base_sub_category, index) in arr_base_sub_category" :key="index">
        <div class="form-group" v-if="base_sub_category.length > 0 && selected_sub_category[index] != null">
          <label>Sub Category Level {{ index + 1 }}</label>
          <v-select @search="(search, loading) => onSubCategorySearch(search, loading, index)" v-model="selected_sub_category[index].selected" @option:selected="onChangeSubCategory(index)" :options="arr_sub_category[index].arr"/>
        </div>
      </div>
      
      <div class="form-group">
        <label>Name</label>
        <input v-model="name" type="text" class="form-control" />
      </div>
      
      <div class="form-group">
        <label>Price</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="addon-wrapping">Rp.</span>
          </div>
          <input type="text" v-model="price" class="form-control" />
        </div>
      </div>
      
      <div class="form-group">
        <label>Quantity</label>
        <div class="input-group">
          <input type="text" v-model="quantity" class="form-control" />
          <div class="input-group-append">
            <span class="input-group-text" id="addon-wrapping">Pcs</span>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="description" class="form-control"></textarea>
      </div>
      
      
      
      <!-- <div class="form-group">
        <label>Name</label>
        <input v-model="name" type="text" class="form-control" />
      </div> -->
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";
import $ from 'jquery'

export default {
  props: ["data", 'tab', 'index', ],
  components: { },
  data() {
    return {
      base: null,
      name: '',
      selected_category: {},
      arr_category: [],
      selected_sub_category: [],
      arr_sub_category: [],
      arr_base_sub_category: [],
      sub_category_index: -1,
      price: 0,
      quantity: 0,
      description: 0,
    }
  },
  watch: {
    tab(val){
      if(this.index < val)
        this.validate()
    },
    price(val){
      this.price = this.base.to_currency_format(val)
    },
    quantity(val){
      this.quantity = this.base.to_currency_format(val)
    },
    data(val){
      if(val.id != null){
        var context = this
        this.name = val.name
        this.price = val.price.toLocaleString(this.base.locale_string)
        this.quantity = val.quantity.toLocaleString(this.base.locale_string)
        this.description = val.description
        this.selected_category = val.category
        var selected_sub_category = []
        selected_sub_category = this.set_selected_sub_category(val.sub_category, selected_sub_category)
        this.loop_selected_sub_category(selected_sub_category)
      }
    },
    // arr_sub_category(val){
    //   console.log(val)
    // },
    selected_category(val){
      var arr_base_sub_category = JSON.parse(JSON.stringify(this.arr_base_sub_category))
      var selected_sub_category = JSON.parse(JSON.stringify(this.selected_sub_category))
      var arr_sub_category = JSON.parse(JSON.stringify(this.arr_sub_category))
      // if(arr_base_sub_category[0] == null)
      //   arr_base_sub_category[0] = []
      // if(this.data.id == null && selected_sub_category[0] == null)
      //   selected_sub_category[0] = {}
      // if(arr_sub_category[0] == null)
      //   arr_sub_category[0] = []
      for(let x in arr_base_sub_category){
        arr_base_sub_category[x] = []
        selected_sub_category[x] = []
        arr_sub_category[x] = []
      }
      arr_base_sub_category[0] = val.arr
      if(this.data.id == null)
        selected_sub_category[0] = {}
      arr_sub_category[0] = []
      this.arr_base_sub_category = arr_base_sub_category
      this.selected_sub_category = selected_sub_category
      this.arr_sub_category = arr_sub_category
      
      this.onSubCategorySearch("", null, -1)
    },
    sub_category_index(val){
      this.after_selected_sub_category()
    },
    selected_sub_category(val){
      this.after_selected_sub_category()
    },
  },
  mounted() {
    this.base = new Base()
    this.onCategorySearch("", null)
  },
  methods: {
    loop_selected_sub_category(arr1, index = 0){
      var context = this
      if(arr1.length > index){
        setTimeout(() => {
          context.sub_category_index = index
          var arr = JSON.parse(JSON.stringify(this.selected_sub_category))
          arr[index] = arr1[index]
          arr[index + 1] = {}
          this.selected_sub_category = arr
          this.loop_selected_sub_category(arr1, index + 1)
        }, 1000) 
      }
    },
    set_selected_sub_category(sub_category, selected_sub_category){
      selected_sub_category[sub_category.level - 1] = {selected: sub_category}
      if(sub_category.sub_category != null)
        this.set_selected_sub_category(sub_category.sub_category, selected_sub_category)
      return selected_sub_category
    },
    async after_selected_sub_category(){
      if(this.sub_category_index >= 0 && this.selected_sub_category[this.sub_category_index].selected.id != null){
        var arr_base_sub_category = JSON.parse(JSON.stringify(this.arr_base_sub_category))
        var selected_sub_category = JSON.parse(JSON.stringify(this.selected_sub_category))
        var arr_sub_category = JSON.parse(JSON.stringify(this.arr_sub_category))
        // if(arr_base_sub_category[this.sub_category_index + 1] == null)
        //   arr_base_sub_category[this.sub_category_index + 1] = []
        // if(selected_sub_category[this.sub_category_index + 1] == null)
        //   selected_sub_category[this.sub_category_index + 1] = {}
        // if(arr_sub_category[this.sub_category_index + 1] == null)
        //   arr_sub_category[this.sub_category_index + 1] = []
        for(let x in arr_base_sub_category){
          if(x > this.sub_category_index){
            arr_base_sub_category[x] = []
            selected_sub_category[x] = []
            arr_sub_category[x] = []
          }
        }
        arr_base_sub_category[this.sub_category_index + 1] = this.selected_sub_category[this.sub_category_index].selected.arr
        if(this.data.id == null)
          selected_sub_category[this.sub_category_index + 1] = {}
        arr_sub_category[this.sub_category_index + 1] = []
        
        await this.onSubCategorySearch("", null, this.sub_category_index)
        
        this.sub_category_index = -1
        this.arr_base_sub_category = arr_base_sub_category
        this.selected_sub_category = selected_sub_category
      }
    },
    async onCategorySearch(search, loading){
      var response = await this.base.request(this.base.url_api + '/category?search=' + search)
      
      if (response != null) {
        if (response.status == "success") {
          for(let category of response.data){
            category.label = category.name
            category.code = category.id
          }
          this.arr_category = response.data
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    async onSubCategorySearch(search, loading, index = null){
      // $('#please_wait_modal').modal('show')
      var index1 = index != null ? index : this.sub_category_index 
      var response = await this.base.request(this.base.url_api + '/sub-category?' + (index1 < 0 ? 'category_id=' + this.selected_category.id : 'sub_category_id=' + this.selected_sub_category[index1].selected.id) + '&search=' + search)
      // setTimeout(() => {
      //   $('#please_wait_modal').modal('hide')
      // }, 500)
      
      
      if (response != null) {
        if (response.status == "success") {
          var arr_sub_category = JSON.parse(JSON.stringify(this.arr_sub_category))
          for(let sub_category of response.data){
            sub_category.label = sub_category.name
            sub_category.code = sub_category.id
          }
          arr_sub_category[index1 + 1] = {}
          arr_sub_category[index1 + 1].arr = response.data
          this.arr_sub_category = arr_sub_category
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    onChangeSubCategory(index){
      this.sub_category_index = index
    },
    async validate(){
      var message = ''
      
      var selected_sub_category = this.selected_sub_category.length - 2 >= 0 ? this.selected_sub_category[this.selected_sub_category.length - 2].selected : {}
      
      if(this.name == '')
        message = 'Name is Empty'
      else if(this.price == '0')
        message = 'Price is Empty'
      else if(this.quantity == '0')
        message = 'Quantity is Empty'
      else if(this.description == '')
        message = 'Description is Empty'
        
      this.$emit('onValidate', message, {
        name: this.name,
        price: this.price,
        quantity: this.quantity,
        description: this.description,
        category: this.selected_category,
        sub_category: selected_sub_category,
      })
    }
  },
};
</script>