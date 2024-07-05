<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-name">{{ label }}</h4>
      <div class="row" :class="index > 0 ? 'mt-3' : ''" v-for="(data, index) in arr" :key="index">
        <div :class="is_view ? 'col-12' : 'col-10'">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" :value="data.is_view ? data.name : name" @keyup="(e) => name = e.target.value" :disabled="data.is_view">
          </div>
        </div>
        <div class="col-2" v-show="!is_view">
          <button class="btn btn-primary rounded-circle mr-1" :disabled="is_view" @click="action_btn(index, 'save')">
            <i :class="data.is_view ? 'mdi mdi-pencil' : 'mdi mdi-content-save'"></i>
          </button>
          <button class="btn rounded-circle ml-1 " v-show="!data.is_view" :disabled="is_view" :class="data.is_view ? 'btn-danger' : 'btn-warning'" @click="action_btn(index, 'cancel')">
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

export default {
  props: ["label", 'url_path', ],
  components: { CustomEditor, },
  data() {
    return {
      base: null,
      base_arr: [],
      arr: [],
      is_view: true,
      name: '',
      content: '',
      content_type: 'editor',
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
    reset(){
      this.name = ''
      // this.content = ''
      // this.content_type = 'editor'
    },
    async action_btn(index, type){
      var data = this.arr[index]
      if(type == "save"){
        if(data.is_view){
          data.is_view = false
          this.name = data.name
          // this.content = data.content
          // this.content_type = data.content_type
        }
        else{
          data.name = this.name
          // data.content = this.content
          // data.content_type = this.content_type
          data.is_view = true
          
          this.reset()
        }
        this.$set(this.arr, index, data)
      }
      else if(type == "cancel"){
        if(data.is_view)
          this.arr.splice(index, 1)
        else{
          data.is_view = true
          this.$set(this.arr, index, data)
          this.reset()
        }
      }

    },
    addAction(){
      this.arr.push({
        name: '',
        // content: '',
        // content_type: 'editor',
        is_view: true,
      })
    },
    cancel_action() {
      this.is_view = true
      this.arr = JSON.parse(JSON.stringify(this.base_arr))
    },
    async edit_action() {
      if (this.is_view) 
        this.is_view = false
      else {
        var arr = JSON.parse(JSON.stringify(this.arr))
        for(let x in arr){
          if(!arr[x].is_view)
            await this.action_btn(x, 'save')
        }
        arr = JSON.parse(JSON.stringify(this.arr))

        var url = this.base.url_api + '/' + this.url_path + '/edit'
        var method = 'post'
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