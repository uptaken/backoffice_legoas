<template>
  <div class="card">
    <div class="card-body">
      <CustomUploadImage1 title="List Image"
        @onImageChanged="onImageChanged"
        :arr="arr"/>
    </div>
  </div>
</template>

<script>
import Base from "@/Utils/base";
import $ from 'jquery'
import CustomUploadImage1 from '@/views/layouts/CustomUploadImage1'

export default {
  props: ["data", 'tab', 'index', 'is_submit', ],
  components: { CustomUploadImage1, },
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
    data(val){
      if(val.id != null && this.arr.length == 0){
        for(let image of val.image){
          image.image_display = image.url_image
        }
        this.arr = val.image
      }
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
    onImageChanged(arr){
      this.arr = arr
    },
    async validate(){
      var message = ''
      
      var arr = JSON.parse(JSON.stringify(this.arr))
      for(let temp of arr){
        temp.image = temp.image_data
      }
      
      if(this.arr.length == 0)
        message = 'Image is Empty'
        
      this.$emit('onValidate', message, {
        arr_image: arr
      })
    },
  },
};
</script>