<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">{{ label }}</h4>
      <div class="row" :class="index > 0 ? 'mt-3' : ''" v-for="(data, index) in arr" :key="index">
        <div class="col-2" v-if="with_image">
          <img class="rounded mr-2" width="100%" :src="data.is_view ? data.image_display : image_display" data-holder-rendered="true" />
          <div v-show="!is_view && !data.is_view">
            <input type="file" class="d-none" accept="image/*" :ref="'inputImage' + index" @change="change_image" />
            <button class="btn btn-primary mt-3 w-100" @click="onUpload(index)">Choose Image</button>
          </div>
        </div>
        <div :class="is_view ? (with_image ? 'col-10' : 'col-12') : (with_image ? 'col-8' : 'col-10')">
          <div v-for="(form, index1) in arr_form" :key="index1">
            <div class="form-group" v-if="form.type == 'text'">
              <label>{{ form.label }}</label>
              <input type="text" class="form-control" :value="data.is_view ? data[form.id] : arr_data_local[form.id].value" @keyup="(e) => $set(arr_data_local, form.id, {type: form.type, value: e.target.value})" :disabled="data.is_view || form.disabled">
            </div>
            <div class="form-group" v-else-if="form.type == 'textarea'">
              <label>{{ form.label }}</label>
              <CustomEditor :id="index + '_' + (form.editor_id != null ? form.editor_id : form.id)" 
                :forceReload="!data.is_view" 
                :readOnly="data.is_view" 
                :value="data.is_view ? data[form.id] : arr_data_local[form.id].value" 
                :contentType="data.is_view ? data[form.content_type_id] : arr_data_local[form.content_type_id].value" 
                @onContentTypeChanged="(val) => $set(arr_data_local, form.content_type_id, {type: 'content_type', value: val})" 
                @onDataChanged="(val) => $set(arr_data_local, form.id, {type: form.type, value: val})"/>
            </div>
            <div class="form-group" v-else-if="form.type == 'file'">
              <label>{{ form.label }}</label>
              <p class="rounded mr-2">{{ data[form.id + '_data'] != null && data[form.id + '_data'].file_display != null && data[form.id + '_data'].file_display != '' ? data[form.id + '_data'].file_display : '-' }}</p>
              <div v-show="!is_view && !data.is_view">
                <input type="file" class="d-none" accept="*/*" :ref="'inputFile' + index" @change="change_file($event, index, index1)" />
                <button class="btn btn-primary mt-3 w-100" @click="onUploadFile(index)">Choose Image</button>
              </div>
            </div>
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
        <div class="col-12" v-if="with_level2">
          <div class="row ml-5" :class="index1 > 0 ? 'mt-3' : ''" v-for="(level2, index1) in data.arr_level2" :key="index1">
            <div :class="is_view ? 'col-12' : 'col-10'">
              <div v-for="(form_level2, index2) in arr_form" :key="index2">
                <div class="form-group" v-if="form_level2.type == 'textarea'">
                  <label>{{ form_level2.label }}</label>
                  <CustomEditor :id="index + '_level2_' + (form_level2.editor_id != null ? form_level2.editor_id : form_level2.id)" 
                    :forceReload="!level2.is_view" 
                    :readOnly="level2.is_view" 
                    :value="level2.is_view ? level2[form_level2.id] : arr_data_local_level2[form_level2.id].value" 
                    :contentType="level2.is_view ? level2[form_level2.content_type_id] : arr_data_local_level2[form_level2.content_type_id].value" 
                    @onContentTypeChanged="(val) => $set(arr_data_local_level2, form_level2.content_type_id, {type: 'content_type', value: val})" 
                    @onDataChanged="(val) => $set(arr_data_local_level2, form_level2.id, {type: form_level2.type, value: val})"/>
                </div>
              </div>
            </div>
            <div class="col-2" v-show="!is_view">
              <button class="btn btn-primary rounded-circle mr-1" :disabled="is_view" @click="action_btn_level2(index, index1, 'save')">
                <i :class="level2.is_view ? 'mdi mdi-pencil' : 'mdi mdi-content-save'"></i>
              </button>
              <button class="btn rounded-circle ml-1 " :disabled="is_view" :class="level2.is_view ? 'btn-danger' : 'btn-warning'" @click="action_btn_level2(index, index1, 'cancel')">
                <i class="mdi " :class="level2.is_view ? 'mdi-trash-can' : 'mdi-close'"></i>
              </button>
            </div>
          </div>
          <button type="button" class="btn btn-outline-primary" v-show="!is_view" @click="add_level2_action(index)">Add Level 2</button>
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
import $ from 'jquery'

import CustomEditor from "@/views/layouts/CustomEditor";
import Base from "@/Utils/base";
import NoImage from "@/assets/png/no_image_available.jpeg";
import imageBase from 'image-to-base64'

export default {
  props: ["label", 'url_path', 'with_image', 'arr_form', 'with_level2', ],
  components: { CustomEditor, },
  data() {
    return {
      base: null,
      base_arr: [],
      arr: [],
      arr_level2: [],
      is_view: true,
      arr_data_local: {},
      arr_data_local_level2: {},
      title: '',
      content: '',
      content_type: 'editor',
      image_display: NoImage,
      image_data: '',
    }
  },
  watch: {
    arr_form: {
      handler: function(val) {
        this.manageDataLocal()
      },
      deep: true,
    },
    arr: {
      handler: function(val) {
        console.log(val)
      },
      deep: true,
    },
    arr_data_local_level2: {
      handler: function(val) {
        console.log(val)
      },
      deep: true,
    },
  },
  mounted() {
    this.base = new Base()
    this.manageDataLocal()
    this.get_data()
  },
  methods: {
    onContentTypeChanged(form, val){
      console.log(this.arr_data_local)
      // this.$set(this.arr_data_local, form.content_type_id, {type: 'content_type', value: val})
    },
    manageDataLocal(){
      if(this.arr_form != null && this.arr_form.length > 0){
        var arr = {}
        for(let form of this.arr_form){
          var obj = {
            type: form.type,
            value: '',
          }
          if(form.num_prefix != null)
            obj.num_prefix = form.num_prefix
          arr[form.id] = obj

          if(form.type == "textarea")
            arr[form.content_type_id] = {
              type: 'content_type',
              value: 'editor',
            }
        }
        this.arr_data_local = arr

        if(this.with_level2){
          arr = {}
          for(let form of this.arr_form){
            obj = {
              type: form.type,
              value: '',
            }
            if(form.num_prefix != null)
              obj.num_prefix = form.num_prefix
            arr[form.id] = obj

            if(form.type == "textarea")
              arr[form.content_type_id] = {
                type: 'content_type',
                value: 'editor',
              }
          }
          this.arr_data_local_level2 = arr
        }
      }
    },
    async get_data() {
      $('#please_wait_modal').modal('show')
      var url = this.base.url_api + '/' + this.url_path + '/all'
      var response = await this.base.request(url);

      setTimeout(() => {
        $('#please_wait_modal').modal('hide')
      }, 500)
      if (response != null) {
        if (response.status == "success") {
          var arr = response.data

          for(let data of arr){
            data.is_view = true
            data.image_display = this.base.host + '/media/' + this.url_path + '?file_name=' + data.file_name
            for(let form of this.arr_form){
              data[form.id + '_data'] = {}
              data[form.id + '_data'].file_display = data[form.id + '_file_name']
            }

            if(this.with_level2){
              for(let level2 of data.level2)
                level2.is_view = true

              data.arr_level2 = data.level2
            }
          }

          this.arr = JSON.parse(JSON.stringify(arr))
          this.base_arr = JSON.parse(JSON.stringify(arr))
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log('Server Error')
    },
    reset(index){
      var arr = JSON.parse(JSON.stringify(this.arr_data_local))
      for(let x in arr){
        if(arr[x].type == "content_type")
          arr[x].value = 'editor'
        else
          arr[x].value = ''
      }
      this.arr_data_local = arr

      if(this.with_image){
        this.image_display = NoImage
        this.image_data = ''
        this.$refs['inputFile' + index][0].value = null
      }
    },
    action_btn_level2(index, index1, type){
      var arr_data = this.arr[index]
      var data = arr_data.arr_level2[index1]

      if(type == "save"){
        if(data.is_view){
          data.is_view = false

          var arr1 = JSON.parse(JSON.stringify(this.arr_data_local_level2))
          for(let x in arr1)
            arr1[x].value = data[x]
          this.arr_data_local_level2 = arr1
        }
        else{
          for(let x in this.arr_data_local_level2)
            data[x] = this.arr_data_local_level2[x].value
          data.is_view = true
        }
        
      }
      else if(type == "cancel"){
        if(data.is_view)
          arr_data.arr_level2.splice(index1, 1)
        else{
          data.is_view = true
        }
      }
      this.$set(this.arr, index, arr_data)
    },
    async action_btn(index, type){
      var data = this.arr[index]
      if(type == "save"){
        if(data.is_view){
          data.is_view = false

          var arr1 = JSON.parse(JSON.stringify(this.arr_data_local))
          for(let x in arr1)
            arr1[x].value = data[x]
          this.arr_data_local = arr1

          if(this.with_image){
            this.image_data = data.image_data
            this.image_display = data.image_display
          }
        }
        else{
          for(let x in this.arr_data_local)
            data[x] = this.arr_data_local[x].value

          if(this.with_image && this.image_data != null && this.image_data != ''){
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
    add_level2_action(index){
      var data_arr = this.arr[index]
      var data = { is_view: false, }
      if(this.with_image){
        data.image_display = NoImage
        data.image_data = ''
      }

      for(let x in this.arr_data_local_level2){
        if(this.arr_data_local_level2[x].type == "content_type")
          data[x] = "editor"
        else
          data[x] = this.arr_data_local_level2[x].num_prefix != null ? this.arr_data_local_level2[x].num_prefix + (this.arr.length + 1) : ''
      }

      data_arr.arr_level2.push(data)
      this.$set(this.arr, index, data_arr)
    },
    addAction(){
      var data = { is_view: true, }
      if(this.with_image){
        data.image_display = NoImage
        data.image_data = ''
      }

      for(let x in this.arr_data_local){
        if(this.arr_data_local[x].type == "content_type")
          data[x] = "editor"
        else
          data[x] = this.arr_data_local[x].num_prefix != null ? this.arr_data_local[x].num_prefix + (this.arr.length + 1) : ''
      }
      if(this.with_level2)
        data.arr_level2 = []

      this.arr.push(data)
    },
    cancel_action() {
      this.is_view = true
      this.arr = JSON.parse(JSON.stringify(this.base_arr))
    },
    onUpload(index) {
      this.$refs['inputImage' + index][0].click()
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
    onUploadFile(index) {
      this.$refs['inputFile' + index][0].click()
    },
    async change_file(event, index, index_form) {
      var arr = JSON.parse(JSON.stringify(this.arr))
      var arr_form = JSON.parse(JSON.stringify(this.arr_form))
      var context = this

      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = function () {
        arr[index][arr_form[index_form].id + '_data'] = {}
        arr[index][arr_form[index_form].id + '_data'].file_display = event.target.files[0].name
        arr[index][arr_form[index_form].id + '_data'].file_data = reader.result
        context.arr = arr
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

          if(arr[x].arr_level2 != null){
            for(let y in arr[x].arr_level2){
              if(!arr[x].arr_level2[y].is_view)
                await this.action_btn_level2(x, y, 'save')
            }
          }
        }
        arr = JSON.parse(JSON.stringify(this.arr))

        var data = {
          arr: arr,
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