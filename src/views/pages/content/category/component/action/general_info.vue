<template>
  <div class="card">
    <div class="card-body">
      <div class="form-group">
        <label>Name</label>
        <input v-model="name" type="text" class="form-control" />
      </div>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";

export default {
  props: ["data", 'tab', 'index', ],
  components: { },
  data() {
    return {
      base: null,
      name: '',
    }
  },
  watch: {
    tab(val){
      if(this.index < val)
        this.validate()
    },
    data(val){
      if(val.id != null)
        this.name = val.name
    },
  },
  mounted() {
    this.base = new Base()
  },
  methods: {
    async validate(){
      var message = ''
      
      if(this.name == '')
        message = 'Name is Empty'
        
      this.$emit('onValidate', message, {
        name: this.name
      })
    }
  },
};
</script>