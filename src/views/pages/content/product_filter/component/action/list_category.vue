<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-6" v-for="(category, index) in arr_category" :key="index">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" @click="onCategoryClicked(index)" v-model="category.selected" :id="'checkCategory'+category.id.replace('_', '')">
            <label class="form-check-label" :for="'checkCategory'+category.id.replace('_', '')">
              {{ category.name }}
            </label>
          </div>
          
          <div class="ml-3">
            <sub-category-item
              v-if="category.arr.length > 0"
              :arr="category.arr"
              @onArrChanged="(val) => onArrChanged(val, index)"
              @onNotSelected="onNotSelected"
              @onSelected="onSelected"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";

import SubCategoryItem from "@/views/pages/content/product_filter/component/action/sub_category_item";

export default {
  props: ["data", 'tab', 'index', 'is_submit', ],
  components: { SubCategoryItem, },
  data() {
    return {
      base: null,
      arr_category: [],
      selected_data: {},
      selected_index: -1,
    }
  },
  watch: {
    tab(val){
      if(this.index < val)
        this.validate()
    },
    is_submit(val){
      if(val)
        this.validate()
    },
    data(val){
      if(val.id != null){
        this.get_data()
      }
    },
  },
  mounted() {
    this.base = new Base()
    
    if(this.$route.params.id == null)
      this.get_data()
  },
  methods: {
    manage_selected_sub_category(arr){
      for(let data of arr){
        if(this.$route.params.id == null)
          data.selected = false
        else{
          var flag = false
          for(let category of this.data.category){
            if(category.sub_category != null && category.sub_category.id == data.id){
              flag = true
              break
            }
          }
          data.selected = flag
        }
        if(data.arr != null && data.arr.length > 0){
          this.manage_selected_sub_category(data.arr)
        }
      }
    },
    async get_data() {
      // $('#please_wait_modal').modal('show')
      var response = await this.base.request(this.base.url_api + '/category/all')
      // $('#please_wait_modal').modal('hide')
    
      if (response != null) {
        if (response.status == "success") {
          this.manage_selected_sub_category(response.data)
          this.arr_category = response.data
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    onArrChanged(arr, index){
      var temp = this.arr_category[index]
      temp.arr = arr
      this.$set(this.arr_category, index, temp)
    },
    checkArrForChanged(arr, selected){
      for(let data of arr){
        if(data.selected != selected)
          data.selected = selected
        if(data.arr.length > 0)
          this.checkArrForChanged(data.arr, selected)
      }
    },
    onCategoryClicked(index){
      var temp = this.arr_category[index]
      temp.selected = !temp.selected
      this.checkArrForChanged(temp.arr, temp.selected)
      this.$set(this.arr_category, index, temp)
    },
    onNotSelected(data){
      for(let category of this.arr_category){
        var flag = false
        for(let category1 of category.arr){
          if(category1.id == data.id){
            flag = true
            break
          }
        }
        if(flag){
          category.selected = false
          break
        }
      }
    },
    onSelected(data){
      for(let category of this.arr_category){
        var flag = false
        for(let category1 of category.arr){
          if(category1.id == data.id){
            flag = true
            break
          }
        }
        
        if(flag){
          var flag1 = true
          for(let category1 of category.arr){
            if(!category1.selected){
              flag1 = false
              break
            }
          }
          category.selected = flag1
          break
        }
      }
    },
    manage_selected_category(arr_selected_category, arr){
      for(let category of arr){
        if(category.arr.length > 0)
          arr_selected_category = this.manage_selected_category(arr_selected_category, category.arr)
        else if(category.selected){
          var index1 = -1
          if(this.data.id != null){
            for(let x in this.data.category){
              if(this.data.category[x].sub_category != null && this.data.category[x].sub_category.id == category.id){
                index1 = x
                break
              }
            }
          }
          
          arr_selected_category.push({
            id: index1 < 0 ? null : this.data.category[index1].id,
            category: category,
          })
        }
      }
      return arr_selected_category
    },
    async validate(){
      var message = ''
      var arr_selected_category = []
      arr_selected_category = this.manage_selected_category(arr_selected_category, this.arr_category)
      
      this.$emit('onValidate', message, {
        arr_category: arr_selected_category,
      })
    },
  },
};
</script>