<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title">{{ title }}</h4>
      <div class="row">
        <div class="col-12">
          <CustomEditor :id="index + '_content'" :readOnly="is_view" :value="content" :contentType="content_type" @onContentTypeChanged="(val) => content_type = val" @onDataChanged="(val) => content = val"/>
        </div>
        <div class="col-12 mt-3">
          <button type="button" class="btn btn-primary" @click="edit_action">{{ is_view ? 'Edit' : 'Save' }} {{ title }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

import CustomEditor from "./CustomEditor";
import Base from "@/Utils/base";

export default {
  props: ["title", "index", "map_type", ],
  components: { CustomEditor, },
  data() {
    return {
      base: null,
      is_view: true,
      id: '',
      content: '',
      content_type: '',
    };
  },
  mounted() {
    this.base = new Base()
    this.get_data()
  },
  methods: {
    async get_data() {
      $('#please_wait_modal').modal('show')
      var url = this.base.url_api + '/info?type=' + this.map_type
      var response = await this.base.request(url);

      setTimeout(() => {
        $('#please_wait_modal').modal('hide')
      }, 500)
      
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data

          this.id = response_data.id
          this.content = response_data.content
          this.content_type = response_data.content_type
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