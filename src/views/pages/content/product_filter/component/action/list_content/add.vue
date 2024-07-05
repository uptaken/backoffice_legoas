<template>
  <div class="">
    <div class="form-group">
      <label>Name</label>
      <input v-model="name" type="text" class="form-control" />
    </div>
    
    <div class="">
      <button class="btn btn-primary" @click="onSubmit">Submit</button>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";

export default {
  props: ["data", ],
  components: {  },
  data() {
    return {
      base: null,
      name: '',
    }
  },
  watch: {
    data(val){
      if(val.name != null){
        this.name = val.name
      }
    }
  },
  mounted() {
    this.base = new Base()
  },
  methods: {
    onSubmit(){
      if(this.name == "")
        this.base.show_error("Name is Empty")
      else{
        this.$emit('onSubmit', {
          name: this.name,
        })
        this.reset()
      }
    },
    reset(){
      this.name = ''
    },
  },
};
</script>