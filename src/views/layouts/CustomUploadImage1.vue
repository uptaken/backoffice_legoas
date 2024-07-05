<template>
  <div class="row">
    <div class="col-12 mt-2">
      <input type="file" class="d-none" accept="image/*" multiple id="input_image" ref="inputFile" @change="change_image($event)" />
      <button class="btn btn-primary" @click="onUpload">Choose Image</button>
    </div>
    
    <div class="col-12 mt-3" v-if="arr_image.length > 0">
      <div class="row">
        <div class="col-6 col-md-4 col-lg-2 h-100" v-for="(image, index) in arr_image" :key="index">
          <div class="position-relative">
            <button class="btn btn-danger position-absolute" style="right: 0" @click="onRemove(index)">X</button>
            <div>
              <img class="rounded mr-2" width="100%" :src="image.image_display" data-holder-rendered="true" />
              <div class="d-flex align-items-center justify-content-center h-100">
                <button class="btn btn-primary w-100" @click="onPrimaryClicked(index)" v-show="!image.is_primary">Set Primary</button>
                <p class="m-0" v-show="image.is_primary">Already Primary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

import CustomEditor from "./CustomEditor";
import Base from "@/Utils/base";
import imageBase from 'image-to-base64'

export default {
  props: ["title", "arr", ],
  components: { CustomEditor, },
  data() {
    return {
      base: null,
      is_view: true,
      id: '',
      arr_image: [],
      max_size: 3,
    };
  },
  watch:{
    arr_image(val){
      this.$emit('onImageChanged', val)
    },
    arr(val){
      if(JSON.stringify(val) != JSON.stringify(this.arr_image))
        this.arr_image = val
    }
  },
  mounted() {
    this.base = new Base()
    // this.get_data()
  },
  methods: {
    onRemove(index){
      this.arr_image.splice(index, 1)
    },
    onPrimaryClicked(index){
      var arr_image = JSON.parse(JSON.stringify(this.arr_image))
      for(let image of arr_image)
        image.is_primary = false
      arr_image[index].is_primary = true
      this.arr_image = arr_image
    },
    onUpload() {
      this.$refs.inputFile.click()
    },
    async change_image(event) {
      for(let file of event.target.files){
        if(event.target.files[0].size / 1024 / 1024 > this.max_size){
          this.base.show_error('Your File exceed '+this.max_size+" MB")
          break
        }
        else{
          const image = new Image()
          image.src = URL.createObjectURL(file)
          var context = this
          image.onload = async () => {
            const { height, width } = image

            var data = {}
            data.image_display = URL.createObjectURL(file)
            data.image_data = await imageBase(URL.createObjectURL(file))
            data.is_primary = context.arr_image.length == 0
            context.arr_image.push(data)
          }
        }
      }
    },
  },
};
</script>