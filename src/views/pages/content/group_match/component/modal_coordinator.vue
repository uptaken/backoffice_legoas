<script>

// import CKEditor from 'ckeditor4-vue'

import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import imageBase from 'image-to-base64'
import Base from "@/Utils/base";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['data', ],
  components: {DatePicker, },
  data() {
    return {
      id: '',
      name: '',
      gender: 1,
      email: '',
      phone: '',
      selected_coordinator: {},
      arr_coordinator: [],
    };
  },
  watch: {
    data(val){
      if(val != null){
        this.id = val.id
        this.name = val.name
        this.gender = val.gender
        this.email = val.email
        this.phone = val.phone
      }
      else{
        this.id = ''
        this.name = ''
        this.gender = 1
        this.email = ''
        this.phone = ''
      }
    },
    tab(val){
      if(this.index < val)
        this.validate()
    },
    is_submit(val){
      if(val)
        this.validate()
    },
    phone(val){
      base.phone_validation(val)
    },
    selected_coordinator(val){
      if(val.id != null){
        this.id = val.id
        this.name = val.name
        this.email = val.email
        this.phone = val.phone
        this.id = val.id
      }
    },
  },
  mounted(){
    this.onCoordinatorSearch('')
  },
  methods: {
    async onCoordinatorSearch(search){
      var response = await base.request(base.url_api + "/coordinator?search=" + search)

      if(response != null){
        if(response.status === "success"){
          for(let coordinator of response.data){
            coordinator.label = coordinator.name
          }
          this.arr_coordinator = response.data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error(this.$t('server_error'))
    },
    onSubmit(){
      if(this.name == "")
        base.show_error('Name is empty')
      else if(this.email == "")
        base.show_error('Email is empty')
      else if(this.phone == "")
        base.show_error('Phone is empty')
      else if(!base.validate_email(this.email))
        base.show_error('Email is not in email format')
      else{
        this.$emit('onSubmit', {
          id: this.id,
          coordinator: this.selected_coordinator,
          name: this.name,
          gender: this.gender,
          email: this.email,
          phone: this.phone,
        })
        $('#editCoordinator').modal('hide')
      }
    },
  }
};
</script>

<template>
  <div class="modal fade" id="editCoordinator" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Add Coordinator</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label class="w-100">Coordinator</label>
                <v-select @search="onCoordinatorSearch" v-model="selected_coordinator" :options="arr_coordinator"/>
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-control" v-model="name" disabled />
              </div>
            </div>

            <div class="col-12">
              <div class="form-group">
                <label>Gender</label>
                <div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" disabled value="1" id="radioGenderMale">
                    <label class="form-check-label" for="radioGenderMale">
                      Male
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" disabled value="0" id="radioGenderFemale">
                    <label class="form-check-label" for="radioGenderFemale">
                      Female
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-6">
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="email" disabled class="form-control"/>
              </div>
            </div>

            <div class="col-6">
              <div class="form-group">
                <label>Phone</label>
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">+62</span>
                  </div>
                  <input type="text" v-model="phone" disabled class="form-control"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="onSubmit">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>