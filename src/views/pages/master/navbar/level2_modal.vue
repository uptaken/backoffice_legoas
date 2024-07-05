<script>

// import CKEditor from 'ckeditor4-vue'

  import Layout from "../../../layouts/main";
  import CustomPleaseWait from "../../../layouts/CustomPleaseWait";
  import CustomEditor from "../../../layouts/CustomEditor";
  import Level3Modal from "./level3_modal";
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
 * Level 2 Modal component
 */
  export default {
    props: ['data', ],
    components: { Layout, PageHeader, CustomEditor, CustomPleaseWait, Level3Modal, },
    data() {
      return {
        base_arr_level3: [],
        arr_level3: [],
        selected_level3: {},
        selected_level3_index: -1,
        name: '',
      };
    },
    watch: {
      data(val){
        if(val.name != null){
          this.name = val.name
          this.base_arr_level3 = JSON.parse(JSON.stringify(val.arr))
          this.arr_level3 = JSON.parse(JSON.stringify(val.arr))
        }
      },
      arr_level3(val){

      },
    },
    mounted() {
    },
    methods: {
      onSubmitLevel3(name){
        if(this.selected_level3_index >= 0){
          var arr = JSON.parse(JSON.stringify(this.arr_level3))
          arr[this.selected_level3_index].name = name
          this.arr_level3 = arr
        }
        else
          this.arr_level3.push({ name: name, })

        this.selected_level3_index = -1
        this.selected_level3 = {}
        $('#level3Modal').modal('hide')
      },
      onCancelLevel3(){
        this.selected_level3_index = -1
        this.selected_level3 = {}
        $('#level3Modal').modal('hide')
      },
      onCancelLevel2(){
        this.arr_level3 = JSON.parse(JSON.stringify(this.base_arr_level3))
        this.$emit('onCancel')
      },
      add_level3(){
        $('#level3Modal').modal('show')
      },
      edit_level3(index){
        this.selected_level3 = this.arr_level3[index]
        this.selected_level3_index = index
        $('#level3Modal').modal('show')
      },
      remove_level3(index){
        this.arr_level3.splice(index, 1)
      },
    }
  };
</script>

<template>
  <div>
    

    <div class="modal fade" id="level2Modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
              <div class="col-12">
                <div class="d-flex align-items-center">
                  <label class="m-0">Level 3</label>

                  <button class="btn btn-primary ml-3" type="button" @click="add_level3()">Add</button>
                </div>
                <table class="table mt-3">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody v-if="arr_level3.length > 0">
                    <tr v-for="(level3, index) in arr_level3"  :key="index">
                      <td>{{ level3.name }}</td>
                      <td>
                        <button class="btn btn-primary" type="button" @click="edit_level3(index)">Edit</button>
                        <button class="btn btn-danger ml-3" type="button" @click="remove_level3(index)">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="2" class="text-center">No Data Found</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="col-12 mt-3">
                <button class="btn btn-primary mr-1" @click="$emit('onSubmit', name, arr_level3)">Save</button>
                <button class="btn btn-warning ml-1" @click="onCancelLevel2()">Cancel</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <Level3Modal :data="selected_level3" @onSubmit="(name) => onSubmitLevel3(name)" @onCancel="() => onCancelLevel3()"/>
  </div>
</template>