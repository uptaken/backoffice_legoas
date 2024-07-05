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
import NoImage from '@/assets/no_image.png';

import CustomMatch from "@/views/layouts/CustomMatch";

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['is_view_only', 'index', 'tab', 'data', 'is_submit', 'arr_group', ],
  components: {DatePicker, CustomMatch, },
  data() {
    return {
      base: null,
      arr_match: [],
    };
  },
  mounted(){
    this.base = new Base()
    
    this.get_data()
  },
  methods: {
    async get_data() {
      var url = this.base.url_api + '/match/all?rel_type=simple&event_category_sport_id=' + this.$route.params.id
      var response = await this.base.request(url);
      this.$emit('onSetArrFactor', 6)

      if (response != null) {
        if (response.status == "success") {
          for(let x in response.data){
            response.data[x].date = momentTZ.tz(response.data[x].date, this.base.locale_timezone)
            if(response.data[x].tournament == null){
              response.data[x].member1.registration_event.url_image = response.data[x].member1.registration_event.url_image != null ? response.data[x].member1.registration_event.url_image : NoImage
              response.data[x].member2.registration_event.url_image = response.data[x].member2.registration_event.url_image != null ? response.data[x].member2.registration_event.url_image : NoImage
            }
            else{
              if(response.data[x].tournament.registration_event1 != null)
                response.data[x].tournament.registration_event1.url_image = response.data[x].tournament.registration_event1.url_image != null ? response.data[x].tournament.registration_event1.url_image : NoImage
              else{
                response.data[x].tournament.registration_event1 = {}
                response.data[x].tournament.registration_event1.url_image = NoImage
                response.data[x].tournament.registration_event1.user = {}
                response.data[x].tournament.registration_event1.user.name = 'TBA'
                response.data[x].tournament.registration_event1.team_name = 'TBA'
                response.data[x].tournament.registration_event1.jersey_team = 'TBA'
              }
              if(response.data[x].tournament.registration_event2 != null)
                response.data[x].tournament.registration_event2.url_image = response.data[x].tournament.registration_event2.url_image != null ? response.data[x].tournament.registration_event2.url_image : NoImage
              else{
                response.data[x].tournament.registration_event2 = {}
                response.data[x].tournament.registration_event2.url_image = NoImage
                response.data[x].tournament.registration_event2.user = {}
                response.data[x].tournament.registration_event2.user.name = 'TBA'
                response.data[x].tournament.registration_event2.team_name = 'TBA'
                response.data[x].tournament.registration_event2.jersey_team = 'TBA'
              }
              
              response.data[x].member1 = {}
              response.data[x].member2 = {}
              if(response.data[x].tournament.registration_event1 != null)
                response.data[x].member1.registration_event = response.data[x].tournament.registration_event1
              if(response.data[x].tournament.registration_event2 != null)
                response.data[x].member2.registration_event = response.data[x].tournament.registration_event2
            }
          }
          this.arr_match = response.data
        }
        else
          base.show_error(response.message)
      }
      else
        base.show_error("Server Error")
    },
  }
};
</script>

<template>
  <div>
    <CustomMatch :arr="arr_match" :data="data" @onForceReload="get_data"/>
  </div>
</template>