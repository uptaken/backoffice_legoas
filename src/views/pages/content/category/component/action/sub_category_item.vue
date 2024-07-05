<template>
  <div >
    <div class="mb-3" v-for="(data, index) in arr_temp" :key="index">
      <div class="">
        <div class="d-flex mb-3">
          <p class="m-0">{{ index + 1 }}.</p>
          <div class="flex-fill ml-3">
            <div class="d-flex align-items-center mb-3">
              <div class="row flex-fill">
                <div class="col-6">
                  <label>Name</label>
                  <input v-model="data.name" type="text" class="form-control mr-3" />
                </div>
                <div class="col-6">
                  <label>Custom ID</label>
                  <input v-model="data.id_modif" type="text" class="form-control mr-3" />
                </div>
              </div>
              <button class="btn btn-danger ml-3" @click="onRemove(index)">Remove</button>
            </div>
            <sub-category-item
              v-if="level + 1 <= max_level"
              :arr="data.arr"
              :level="level + 1"
              @onArrChanged="(val) => onArrChanged(val, index)"/>
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <button class="btn btn-primary w-100" @click="onAdd">Add Sub Category Level {{ level }}</button>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";

import SubCategoryItem from "@/views/pages/content/category/component/action/sub_category_item";

export default {
  name: 'SubCategoryItem',
  props: ["arr", 'level', ],
  components: { SubCategoryItem, },
  data() {
    return {
      base: null,
      arr_temp: [],
      max_level: 4,
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
      },
      deep: true
    },
  },
  mounted() {
    this.base = new Base()
    
    if(this.arr.length > 0)
      this.arr_temp = JSON.parse(JSON.stringify(this.arr))
  },
  methods: {
    onArrChanged(arr, index){
      var temp = this.arr_temp[index]
      temp.arr = arr
      this.$set(this.arr_temp, index, temp)
    },
    onAdd(){
      this.arr_temp.push({
        name: '',
        level: this.level,
        arr: [],
      })
    },
    onRemove(index){
      this.arr_temp.splice(index)
    },
  },
};
</script>