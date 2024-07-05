<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">{{ label }}</h4>
      <div class="row" :class="index > 0 ? 'mt-3' : ''" v-for="(data, index) in arr" :key="index">
        <div class="col-2">
          <img class="rounded mr-2" width="100%" :src="data.is_view ? data.image_display : image_display" data-holder-rendered="true" />
          <div v-show="!is_view && !data.is_view">
            <input type="file" class="d-none" accept="image/*" :ref="'inputFile' + index" @change="change_image" />
            <button class="btn btn-primary mt-3 w-100" @click="onUpload(index)">Choose Image</button>
          </div>
        </div>
        <div :class="is_view ? 'col-10' : 'col-8'">
          <div class="form-group">
            <label>Description</label>
            <CustomEditor :id="index + '_benefit_content'" :forceReload="!data.is_view" :readOnly="data.is_view" :value="data.is_view ? data.content : content" :contentType="data.is_view ? data.content_type : content_type" @onContentTypeChanged="(val) => content_type = val" @onDataChanged="(val) => content = val"/>
          </div>
        </div>
        <div class="col-2" v-show="!is_view">
          <button class="btn btn-primary rounded-circle mr-1" :disabled="is_view" @click="action_btn(index, 'save')">
            <i :class="data.is_view ? 'mdi mdi-pencil' : 'mdi mdi-content-save'"></i>
          </button>
          <button class="btn rounded-circle ml-1 " v-show="index > 0 || !data.is_view" :disabled="is_view" :class="data.is_view ? 'btn-danger' : 'btn-warning'" @click="action_btn(index, 'cancel')">
            <i class="mdi " :class="data.is_view ? 'mdi-trash-can' : 'mdi-close'"></i>
          </button>
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-outline-primary w-100" v-show="!is_view" @click="addAction">
          Add {{ label }}
        </button>
      </div>

      <div class="mt-3">
        <button type="button" class="btn btn-primary" @click="edit_action">{{ is_view ? 'Edit' : 'Save' }} {{ label }}</button>
        <button type="button" class="btn btn-warning ml-3" v-show="!is_view" @click="cancel_action">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import CustomEditor from "@/views/layouts/CustomEditor";
import Base from "@/Utils/base";
import NoImage from "@/assets/png/no_image_available.jpeg";
import imageBase from 'image-to-base64'

export default {
  props: ["label", 'url_path', ],
  components: { CustomEditor, },
  data() {
    return {
      base: null,
      base_arr: [],
      arr: [],
      is_view: true,
      title: '',
      content: '',
      content_type: 'editor',
      image_display: NoImage,
      image_data: '',
    }
  },
  mounted() {
    this.base = new Base()
    this.get_data()
  },
  methods: {
    async get_data() {
      var url = this.base.url_api + '/' + this.url_path + '/all'
      var response = await this.base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var arr = response.data

          for(let data of arr){
            data.is_view = true
            data.image_display = this.base.host + '/media/sponsorship/benefit?file_name=' + data.file_name
          }

          this.arr = arr
          this.base_arr = arr
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    reset(index){
      // this.title = ''
      this.content = ''
      this.content_type = 'editor'
      this.image_display = NoImage
      this.image_data = ''
      this.$refs['inputFile' + index][0].value = null
    },
    async action_btn(index, type){
      var data = this.arr[index]
      if(type == "save"){
        if(data.is_view){
          data.is_view = false
          // this.title = data.title
          this.content = data.content
          this.content_type = data.content_type
          this.image_data = data.image_data
          this.image_display = data.image_display
        }
        else{
          // data.title = this.title
          data.content = this.content
          data.content_type = this.content_type
          if(this.image_data != null && this.image_data != ''){
            data.image_data = this.image_data
            data.image_display = this.image_display
            data.file = {}
            data.file.file = this.image_data
          }
          data.is_view = true
          
          this.reset(index)
        }
        this.$set(this.arr, index, data)
      }
      else if(type == "cancel"){
        if(data.is_view)
          this.arr.splice(index, 1)
        else{
          data.is_view = true
          this.$set(this.arr, index, data)
          this.reset(index)
        }
      }

    },
    addAction(){
      this.arr.push({
        // title: '',
        content: '',
        content_type: 'editor',
        image_display: NoImage,
        image_data: '',
        is_view: true,
      })
    },
    cancel_action() {
      this.is_view = true
      this.arr = JSON.parse(JSON.stringify(this.base_arr))
    },
    onUpload(index) {
      // console.log(this.$refs['inputFile' + index][0])
      this.$refs['inputFile' + index][0].click()
    },
    async change_image(event) {
      const image = new Image()
      image.src = URL.createObjectURL(event.target.files[0])
      var context = this
      image.onload = async () => {
        const { height, width } = image

        context.image_display = URL.createObjectURL(event.target.files[0])
        context.image_data = await imageBase(URL.createObjectURL(event.target.files[0]))
      }
    },
    async edit_action() {
      if (this.is_view) 
        this.is_view = false
      else {
        var url = this.base.url_api + '/' + this.url_path + '/edit'
        var method = 'post'
        var arr = JSON.parse(JSON.stringify(this.arr))

        for(let x in arr){
          if(!arr[x].is_view)
            await this.action_btn(x, 'save')
        }
        arr = JSON.parse(JSON.stringify(this.arr))

        var data = {
          arr: arr,
        }

        // console.log(JSON.stringify(data))
        var context = this
        await this.base.request_chunk(url, method, data, (progress) => {
          context.progress = progress
        }, 'reload')
      }
    },
  },
};
</script>