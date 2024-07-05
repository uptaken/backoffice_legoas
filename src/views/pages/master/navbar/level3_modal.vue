<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "../../../layouts/main";
  import CustomPleaseWait from "../../../layouts/CustomPleaseWait";
  import CustomEditor from "../../../layouts/CustomEditor";
  import PageHeader from "@/components/page-header";
  import appConfig from "@/app.config";
  import moment from 'moment'
  import $ from 'jquery'
  import imageBase from 'image-to-base64'
  import Base from "@/Utils/base";

  const base = new Base()

  import {
    required,

  } from "vuelidate/lib/validators";

// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Level 3 Modal component
 */
  export default {
    props: ['data',],
    components: { Layout, PageHeader, CustomEditor, CustomPleaseWait, },
    data() {
      return {
        name: '',
      };
    },
    watch: {
      data(val){
        if(val.name != null)
          this.name = val.name
      },
    },
    mounted() {
    },
    methods: {
    }
  };
</script>

<template>
    <div class="modal fade" id="level3Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label>Nama</label>
                  <input v-model="name" type="text" class="form-control" placeholder="Nama" />
                </div>
              </div>

              <div class="col-12 mt-3">
                <button class="btn btn-primary mr-1" @click="$emit('onSubmit', name)">Save</button>
                <button class="btn btn-warning ml-1" @click="$emit('onCancel')">Cancel</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
</template>