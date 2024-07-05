<template>
  <div class="card">
    <div class="card-body">
      <sub-category-item
        :arr="arr"
        :level="1"
        @onArrChanged="onArrChanged"/>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";

import SubCategoryItem from "@/views/pages/content/category/component/action/sub_category_item";

export default {
  props: ["data", 'tab', 'index', 'is_submit', ],
  components: { SubCategoryItem, },
  data() {
    return {
      base: null,
      arr: [],
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
        this.arr = val.sub_category
      }
    },
  },
  mounted() {
    this.base = new Base()
  },
  methods: {
    onArrChanged(arr){
      this.arr = arr
    },
    checkArr(arr, level = 1){
      var message = ''
      for(let x in arr){
        if(arr[x].name == ''){
          message = `#${parseInt(x) + 1} Sub Category Name on Level ${level} is Empty`
          break
        }
        
        if(arr[x].arr != null && arr[x].arr.length > 0){
          message = this.checkArr(arr[x].arr, level + 1)
          if(message != '')
            break
        }
      }
      return message
    },
    async validate(){
      var message = ''
      
      message = this.checkArr(this.arr)
        
      this.$emit('onValidate', message, {
        arr_sub_category: this.arr,
      })
    },
    onAdd(){
      this.arr.push({
        name: '',
        arr: [],
      })
    },
    onRemove(index){
      this.arr.splice(index)
    },
  },
};
</script>