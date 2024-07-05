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
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit',],
  components: {DatePicker, },
  data() {
    return {
      total_max_team: '0',
      is_first_time: true,
    };
  },
  watch: {
    data(val){
      if(val != null){
        this.total_max_team = val.total_max_team != null ? val.total_max_team.toLocaleString(base.locale_string) : '0'
      }
    },
    tab(val){
      if(this.index < val)
        this.validate()
    },
    total_max_team(val){
      this.total_max_team = base.to_currency_format(val)
    },
  },
  mounted(){
  },
  methods: {
    validate(){
      var message = ''
      if(this.total_max_team == '0')
        message = 'Total Max Team per Group is empty'

      this.$emit('onValidate', message, {
        total_max_team: base.str_to_double(this.total_max_team),
      })
    },
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Total Max team per group</label>
            <input v-model="total_max_team" type="text" class="form-control" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>