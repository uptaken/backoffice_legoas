<template>
  <div>
    <div class="" v-for="(sub_category, index) in arr_temp" :key="index">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" @click="onSubCategoryClicked(index)" v-model="sub_category.selected" :id="'checkSubCategory'+sub_category.id.replace('_', '')">
        <label class="form-check-label" :for="'checkSubCategory'+sub_category.id.replace('_', '')">
          {{ sub_category.name }}
        </label>
      </div>
      
      <div class="ml-3">
        <sub-category-item
          v-if="sub_category.arr.length > 0"
          :arr="sub_category.arr"
          @onArrChanged="(val) => onArrChanged(val, index)"
          @onNotSelected="onNotSelected"
          @onSelected="onSelected"/>
      </div>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";

import SubCategoryItem from "@/views/pages/content/product_filter/component/action/sub_category_item";

export default {
  name: 'SubCategoryItem',
  props: ["arr", ],
  components: { SubCategoryItem, },
  data() {
    return {
      base: null,
      arr_temp: [],
    }
  },
  watch: {
    arr(val){
      if(JSON.stringify(this.arr_temp) != JSON.stringify(val))
        this.arr_temp = JSON.parse(JSON.stringify(val))
    },
    arr_temp: {
      handler(newValue, oldValue) {
        this.$emit('onArrChanged', newValue)
        for(let temp of newValue){
          if(temp.selected && temp.arr.length == 0){
            this.$emit('onSelected', temp)
          }
        }
      },
      deep: true
    },
  },
  mounted() {
    this.base = new Base()
    
    this.arr_temp = JSON.parse(JSON.stringify(this.arr))
  },
  methods: {
    onArrChanged(arr, index){
      var temp = this.arr_temp[index]
      temp.arr = arr
      this.$set(this.arr_temp, index, temp)
    },
    checkArrForChanged(data1){
      for(let data of data1.arr){
        if(data.selected != data1.selected)
          data.selected = data1.selected
        if(data.arr.length > 0)
          this.checkArrForChanged(data)
      }
      if(data1.selected)
        this.$emit('onSelected', data1)
      else
        this.$emit('onNotSelected', data1)
    },
    onNotSelected(data){
      for(let temp of this.arr_temp){
        var flag = false
        for(let temp1 of temp.arr){
          if(temp1.id == data.id){
            flag = true
            break
          }
        }
        if(flag){
          temp.selected = false
          this.$emit('onNotSelected', temp)
          break
        }
      }
    },
    onSelected(data){
      for(let temp of this.arr_temp){
        var flag = false
        for(let temp1 of temp.arr){
          if(temp1.id == data.id){
            flag = true
            break
          }
        }
        
        if(flag){
          var flag1 = true
          for(let temp1 of temp.arr){
            if(!temp1.selected){
              flag1 = false
              break
            }
          }
          temp.selected = flag1
          this.$emit('onSelected', temp)
          break
        }
      }
    },
    onSubCategoryClicked(index){
      var temp = this.arr_temp[index]
      temp.selected = !temp.selected
      this.checkArrForChanged(temp)
      
      this.$set(this.arr_temp, index, temp)
    },
  },
};
</script>