<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-4">
          <add-list-content
            :data="selected_data"
            @onSubmit="onSubmit"/>
        </div>
        <div class="col-8">
          <table-list-content
            :arr="arr"
            @onEditClicked="onEditClicked"
            @onRemoveClicked="onRemoveClicked"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";

import AddListContent from "@/views/pages/content/product_filter/component/action/list_content/add";
import TableListContent from "@/views/pages/content/product_filter/component/action/list_content/table";

export default {
  props: ["data", 'tab', 'index', 'is_submit', ],
  components: { AddListContent, TableListContent, },
  data() {
    return {
      base: null,
      arr: [],
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
        this.arr = val.content
      }
    },
  },
  mounted() {
    this.base = new Base()
  },
  methods: {
    onEditClicked(index){
      this.selected_data = this.arr[index]
      this.selected_index = index
    },
    onRemoveClicked(index){
      this.$delete(this.arr, index)
    },
    onSubmit(data){
      if(this.selected_index < 0)
        this.arr.push(data)
      else
        this.$set(this.arr, this.selected_index, data)
    },
    async validate(){
      var message = ''
      
        
      this.$emit('onValidate', message, {
        arr_content: this.arr,
      })
    },
  },
};
</script>