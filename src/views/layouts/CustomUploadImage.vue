<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">{{ title }}</h4>
      <div class="row">
        <!-- <div class="col-12">
          <CustomEditor :id="index + '_content'" :readOnly="is_view" :value="content" :contentType="content_type" @onContentTypeChanged="(val) => content_type = val" @onDataChanged="(val) => content = val"/>
        </div> -->

        <div class="col-12 mt-3" v-if="arr_image.length > 0">
          <div class="row">
            <div class="col-6 col-md-4 col-lg-2 position-relative" v-for="(image, index) in arr_image" :key="index">
              <img class="rounded mr-2" width="100%" :src="image.image_display" data-holder-rendered="true" />
            </div>
          </div>
        </div>

        <div class="col-12 mt-2" v-if="!is_view">
          <input type="file" class="d-none" accept="image/*" multiple id="input_image" ref="inputFile" @change="change_image($event)" />
          <button class="btn btn-primary" @click="onUpload">Choose Image</button>
        </div>

        <div class="col-12 mt-3">
          <button class="btn btn-primary mr-1" @click="edit_action">{{ is_view ? 'Edit' : 'Save' }} {{ title }}</button>
          <button class="btn btn-primary mr-1" @click="onCancel" v-show="!is_view">Cancel</button>
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
  props: ["title", "index", "map_type", 'url_path', 'custom_url_path', ],
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
    }
  },
  mounted() {
    this.base = new Base()
    // this.get_data()
  },
  methods: {
    async get_data() {
      $('#please_wait_modal').modal('show')
      var url = this.base.url_api + (this.custom_url_path != null ? this.custom_url_path : '/' + this.url_path + '/all')
      var response = await this.base.request(url);

      $('#please_wait_modal').modal('hide')
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data

          this.id = response_data.id
          this.content = response_data.content
          this.content_type = response_data.content_type
        }
      }
    },
    onCancel(){
      this.is_view = true
    },
    onUpload() {
      this.$refs.inputFile.click()
    },
    async change_image(event) {
      for(let file of event.target.files){
        if(event.target.files[0].size / 1024 / 1024 > this.max_size)
          this.base.show_error('Your File exceed '+this.max_size+" MB")
        else{
          const image = new Image()
          image.src = URL.createObjectURL(file)
          var context = this
          image.onload = async () => {
            const { height, width } = image

            var data = {}
            data.image_display = URL.createObjectURL(file)
            data.image_data = await imageBase(URL.createObjectURL(file))
            context.arr_image.push(data)
          }
        }
      }
    },
    async edit_action() {
      if (this.is_view) 
        this.is_view = false
      else {
        var url = this.base.url_api + '/info'
        var method = 'post'
        var data = {
          content: this.content,
          is_publish: 1,
          type: this.map_type,
        }
        if (this.id != '') {
          data.id = this.id
          url += '/edit'
        }

        var context = this
        await this.base.request_chunk(url, method, data, (progress) => {
          context.progress = progress
        }, 'reload')
      }
    },
  },
};
</script>