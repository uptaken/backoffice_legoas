<script>
import Layout from "@/views/layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTextareaArray from "@/views/layouts/CustomTextareaArray";
import CustomPleaseWait from "@/views/layouts/CustomPleaseWait";
import CustomTable from "@/views/layouts/CustomTable";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Setting component
 */
export default {
  props: ['title', 'setting_key', 'type',],
  components: { Layout, PageHeader, CustomPleaseWait, },
  data() {
    return {
      setting_data: {},
      value: '',
      progress: 0,
    };
  },
  watch: {
    value(val){
      if(this.type == 'number' || this.type == 'currency' || this.type == 'percent')
        this.value = base.to_currency_format(val)
    }
  },
  async mounted() {
    await this.get_data()
  },
  methods: {
    async get_data() {
      var response = await base.request(base.url_api + '/setting?key=' + this.setting_key);

      if (response != null) {
        if (response.status == "success") {
          response.data.value_format = ''
          if(this.type == 'currency')
            response.data.value_format += 'Rp. '
          if(this.type == 'number' || this.type == 'currency' || this.type == 'percent')
            response.data.value_format += base.str_to_double(response.data.value).toLocaleString(base.locale_string)
          else
            response.data.value_format += response.data.value
          if(this.type == 'percent')
            response.data.value_format += '%'

          this.setting_data = response.data
          this.value = response.data.value
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error("Server Error")
    },
    async submit(){
      if(this.value == '')
        base.show_error("Value is Empty")
      else{
        $('#please_wait_modal').modal('show')
        var response = await base.request(base.url_api + '/setting/edit', 'post', {
          key: this.setting_key,
          value: this.type == 'number' || this.type == 'currency' || this.type == 'percent' ? base.str_to_double(this.value) : this.value,
        });

        $('#please_wait_modal').modal('hide')
        if (response != null) {
          if (response.status == "success") {
            var value_format = ''
            if(this.type == 'currency')
              value_format += 'Rp. '
            value_format += this.value
            if(this.type == 'percent')
              value_format += '%'

            this.$set(this.setting_data, 'value_format', value_format)
            $(this.$refs.modalEdit).modal('hide')
          }
          else
            base.show_error(response.message)
        }
        else
          base.show_error("Server Error")
      }
    },
    onEditClicked(){
      $(this.$refs.modalEdit).modal('show')
    },
  }
};
</script>

<template>
  <div>
    

    <div class="card">
      <div class="card-body">
        <h4>{{ title }}</h4>
        <p class="m-0">{{ setting_data.value_format }}</p>
        <button class="btn btn-primary mt-3" @click="onEditClicked">Edit {{ title }}</button>
      </div>
    </div>

    <div class="modal fade" ref="modalEdit" :id="setting_key + '_modal'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Edit {{ title }}</h5>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Value</label>
              <div class="input-group mb-3" v-if="type == 'currency' || type == 'percent'">
                <div class="input-group-prepend" v-if="type == 'currency'">
                  <span class="input-group-text" id="basic-addon1">Rp.</span>
                </div>
                <input v-model="value" type="text" class="form-control" placeholder="Value" />
                <div class="input-group-prepend" v-if="type == 'percent'">
                  <span class="input-group-text" id="basic-addon1">%</span>
                </div>
              </div>
              <div v-else>
                <input v-model="value" type="text" class="form-control" placeholder="Value" />
              </div>
            </div>

            <div>
              <button type="button" class="btn btn-outline-primary" data-dismiss="modal">Close</button>
              <button class="btn btn-primary ml-3" @click="submit">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>