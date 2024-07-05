<script>

// import CKEditor from 'ckeditor4-vue'
import Layout from "@/views/layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import momentTZ from 'moment-timezone'
import $ from 'jquery'
import Base from "@/Utils/base";
import CustomTable from "@/views/layouts/CustomTable";
import NoImage from '@/assets/no_image.png'

const base = new Base()

/**
 * Event component
 */
export default {
  props: ['selected_tab', 'data', ],
  components: {CustomTable, Layout, PageHeader, },
  data() {
    return {
      title: "Detail Match",
      items: [],
      base: null,
      match: {},
      arr_player1: [],
      arr_player2: [],
      arr_match_event: [],
    };
  },
  watch: {
    selected_tab(val){
      if(val == 2)
        this.force_reload = true
    },
    match(val){
      this.manage_player_data()
    },
    arr_match_event(val){
      this.manage_player_data()
    },
  },
  created(){
    this.base = new Base()
    base.save_current_page('Match Detail')

    this.$emit('onSetArrFactor', 3)
    this.get_data()
    this.get_match_data()
  },
  methods: {
    manage_player_data(){
      if(this.match.id != null && this.arr_match_event.length > 0){
        this.get_player_data(this.match.member1.registration_event.id, 'team1')
        this.get_player_data(this.match.member2.registration_event.id, 'team2')
      }
    },
    async get_data() {
      var date = this.date != '' && this.date != null ? momentTZ(this.date, 'DD/MM/YYYY') : ''
      var response = await this.base.request(this.base.url_api + '/match/event/all?match_id=' + this.$route.params.id)

      if (response != null) {
        if (response.status == "success") {
          for (let event of response.data) {
            if (event.registration_event_player != null)
              event.registration_event_player.url_image = event.registration_event_player.file_name != null ? this.base.host + '/media/registration/player?file_name=' + event.registration_event_player.file_name : NoImage
          }
          this.arr_match_event = response.data
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log(this.$t('server_error'))
    },
    async get_match_data() {
      var response = await this.base.request(this.base.url_api + '/match/all?rel_type=simple&id=' + this.$route.params.id)

      if (response != null) {
        if (response.status == "success") {
          response.data.date = momentTZ.tz(response.data.date, this.base.locale_timezone)
          if (response.data.member1 != null && response.data.member2 != null) {
            response.data.member1.registration_event.url_image = response.data.member1.registration_event.file_name != null ? this.base.host + '/media/registration/team?file_name=' + response.data.member1.registration_event.file_name : NoImage
            response.data.member2.registration_event.url_image = response.data.member2.registration_event.file_name != null ? this.base.host + '/media/registration/team?file_name=' + response.data.member2.registration_event.file_name : NoImage
            this.arr_member1_player = response.data.member1.registration_event.player
            this.arr_member2_player = response.data.member2.registration_event.player
          }
          else if (response.data.tournament != null) {
            response.data.tournament.registration_event1.url_image = response.data.tournament.registration_event1.file_name != null ? this.base.host + '/media/registration/team?file_name=' + response.data.tournament.registration_event1.file_name : NoImage
            response.data.tournament.registration_event2.url_image = response.data.tournament.registration_event2.file_name != null ? this.base.host + '/media/registration/team?file_name=' + response.data.tournament.registration_event2.file_name : NoImage
            this.arr_member1_player = response.data.tournament.registration_event1.player
            this.arr_member2_player = response.data.tournament.registration_event2.player
          }
          var allow_edit = false
          var str_coordinator = ''
          var arr_coordinator = response.data.group != null ? response.data.group.event_category_sport.coordinator : response.data.tournament.event_category_sport.coordinator
          for (let x in arr_coordinator) {
            var coordinator = arr_coordinator[x]

            str_coordinator += coordinator.name
            if (x < arr_coordinator.length - 1)
              str_coordinator += ', '
            if (coordinator.coordinator != null) {

              if (this.user != null && coordinator.coordinator.id == this.user.id) {
                allow_edit = true
              }
            }
          }
          response.data.allow_edit = allow_edit
          response.data.str_coordinator = str_coordinator

          this.match = response.data
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log(this.$t('server_error'))
    },
    async get_player_data(registration_event_id, type = 'team1') {
      var response = await this.base.request(this.base.url_api + '/event/registration/player/all?registration_event_id=' + registration_event_id + '&match_id=' + this.match.id)

      if (response != null) {
        if (response.status == "success") {
          for (let player of response.data) {
            var total_score = 0
            var total_yellow_card = 0
            var total_red_card = 0
            for(let event of this.arr_match_event){
              if(event.registration_event_player.id == player.id){
                if(event.type == 'score')
                  total_score++
                else if(event.type == 'yellow_card')
                  total_yellow_card++
                else if(event.type == 'red_card')
                  total_red_card++
                break
              }
            }
            player.total_score = total_score
            player.total_yellow_card = total_yellow_card
            player.total_red_card = total_red_card
            player.is_best_player = this.match.best_player != null && this.match.best_player.id == player.id
            player.url_image = player.file_name != null ? this.base.host + '/media/registration/player?file_name=' + player.file_name : NoImage
          }
          if(type == 'team1')
            this.arr_player1 = response.data
          else if(type == 'team2')
            this.arr_player2 = response.data
        }
        else
          this.base.show_error(response.message)
      }
      else
        console.log(this.$t('server_error'))
    },
    async onActionClicked(row, action_button_index){
      var action_button = this.arr_action_button[action_button_index]
      // var data = this.arr[data_index]
    },
    onTopButtonClicked(index){
      var top_button = this.arr_top_button[index]

      if(top_button.id == 'download_excel')
        window.open(base.host + '/export/best-player/excel?event_category_sport_id=' + this.$route.params.id, '_blank')
    },
    onLoadComplete(){
      this.force_reload = false
    },
    onBackPressed(){
      base.back_page()
    },
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div>
      <a class="btn btn-primary" @click="onBackPressed">Back</a>
    </div>

    <div class="card mt-3">
      <div class="card-body">
        <div class="py-3">
          <div>
            <h4>Match Detail</h4>
          </div>

          <div class="match-grid mt-4">
            <div class="match-grid-1 d-flex align-items-center">
              <div>
                <p class="m-0 font-weight-bold">{{ match.name }}</p>
                <p class="m-0 text-secondary">{{ match.tournament != null ? match.tournament.event_category_sport_category.name :
                    match.group.event_category_sport_category.name }} / {{ match.tournament != null ? match.tournament.type.name : match.group.name }}</p>
              </div>
            </div>
            <div class="match-grid-2 d-flex flex-column align-items-center">
              <p class="m-0 font-weight-bold">{{ match.date.format('DD/MM/YYYY') }}</p>
              <p class="m-0 text-secondary">{{ match.date.format('HH:mm') }}</p>
            </div>
            <div class="match-grid-3 text-right">
              <p class="m-0 font-weight-bold">{{ match.event_category_sport_venue != null ? match.event_category_sport_venue.venue.name : 'No Venue' }}</p>
              <p class="m-0 text-secondary">{{ match.event_category_sport_venue != null ? match.event_category_sport_venue.court : 'No Court' }}</p>
            </div>
            <div class="match-grid-4 d-flex align-items-center justify-content-center justify-content-md-start flex-column flex-md-row member-container">
              <div class="d-flex align-items-center justify-content-center match-image-container">
                <img :src="match.tournament != null ? match.tournament.registration_event1.url_image : match.member1.registration_event.url_image"  style="width: 10rem" />
              </div>
              <div class="text-center text-md-left mt-2 mt-md-0 ml-md-3">
                <p class="m-0 font-weight-bold text-white">{{ match.tournament != null ? match.tournament.registration_event1.user.name :
                    match.member1.registration_event.user.name }}</p>
                <p class="m-0 text-white">{{ match.tournament != null ? match.tournament.registration_event1.team_name :
                    match.member1.registration_event.team_name }}</p>
                <p class="m-0 text-white">{{ match.tournament != null ? match.tournament.registration_event1.jersey_team :
                    match.member1.registration_event.jersey_team }}</p>
              </div>
            </div>
            <div class="match-grid-5 d-flex align-items-center justify-content-center score-container">
              <h4 class="font-weight-bold text-white">{{ match.group_member1_score }}</h4>
              <h4 class="mx-3 text-white">-</h4>
              <h4 class="font-weight-bold text-white">{{ match.group_member2_score }}</h4>
            </div>
            <div class="match-grid-6 d-flex align-items-center justify-content-end flex-column-reverse flex-md-row member-container">
              <div class="text-center text-md-right mt-2 mt-md-0 mr-md-3">
                <p class="m-0 font-weight-bold text-white">{{ match.tournament != null ? match.tournament.registration_event2.user.name :
                    match.member2.registration_event.user.name }}</p>
                <p class="m-0 text-white">{{ match.tournament != null ? match.tournament.registration_event2.team_name :
                    match.member2.registration_event.team_name }}</p>
                <p class="m-0 text-white">{{ match.tournament != null ? match.tournament.registration_event2.jersey_team :
                    match.member2.registration_event.jersey_team }}</p>
              </div>
              <div class="d-flex align-items-center justify-content-center match-image-container">
                <img :src="match.tournament != null ? match.tournament.registration_event2.url_image : match.member2.registration_event.url_image"   style="width: 10rem"/>
              </div>
            </div>
            <div class="match-grid-7 bg-primary"></div>
          </div>

          <div>
            <div class="row">

              <div class="col-6">
                <div v-for="(player, index) in arr_player1" :key="index">
                  <div
                    class="d-flex flex-column flex-md-row flex-fill align-items-start align-items-md-center mt-3"
                    style="gap: 0.5rem"
                  >
                    <div
                      class="d-flex align-items-center justify-content-center"
                      style="width: 4rem; height: 4rem"
                    >
                      <img
                        :src="player.url_image"
                        class="mw-100 mh-100"
                      />
                    </div>
                    <div
                      class="d-flex align-items-baseline flex-fill"
                      style="gap: 0.5rem"
                    >
                      <p class="m-0 text-center" style="min-width: 2rem">
                        {{ player.back_number }}
                      </p>
                      <div class="d-flex flex-column align-items-start">
                        <p class="m-0 font-weight-bold text-primary">
                          {{ player.name }}
                        </p>
                        <small class="m-0">
                          {{ player.player_position != null ? player.player_position.name : "-" }}
                        </small>
                      </div>
                    </div>
                    <div class="d-flex align-items-baseline flex-row " style="gap: 0.5rem">
                      <p class="m-0 text-center" style="min-width: 2rem">
                        {{ player.total_score }}
                      </p>
                      <div class="p-3 bg-warning ml-3">{{ player.total_yellow_card }}</div>
                      <div class="p-3 bg-danger text-white ml-3">{{ player.total_red_card }}</div>
                      <div class="ml-3">
                        <input
                          class=""
                          type="checkbox"
                          :value="true"
                          :checked="player.already_attendance"
                          :disabled="true"
                          id="defaultCheck1"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-6">
                <div v-for="(player, index) in arr_player2" :key="index">
                  <div
                    class="d-flex flex-column flex-md-row flex-fill align-items-start align-items-md-center mt-3"
                    style="gap: 0.5rem"
                  >
                    <div class="d-flex align-items-baseline flex-row " style="gap: 0.5rem">
                      <div class="ml-3">
                        <input
                          class=""
                          type="checkbox"
                          :value="true"
                          :checked="player.already_attendance"
                          :disabled="true"
                          id="defaultCheck1"/>
                      </div>
                      <div class="p-3 bg-danger text-white ml-3">{{ player.total_red_card }}</div>
                      <div class="p-3 bg-warning ml-3">{{ player.total_yellow_card }}</div>
                      <p class="m-0 text-center" style="min-width: 2rem">
                        {{ player.total_score }}
                      </p>
                    </div>
                    
                    <div
                      class="d-flex align-items-baseline flex-fill justify-content-end"
                      style="gap: 0.5rem"
                    >
                      <div class="d-flex flex-column align-items-start">
                        <p class="m-0 font-weight-bold text-primary">
                          {{ player.name }}
                        </p>
                        <small class="m-0">
                          {{ player.player_position != null ? player.player_position.name : "-" }}
                        </small>
                      </div>
                      <p class="m-0 text-center" style="min-width: 2rem">
                        {{ player.back_number }}
                      </p>
                    </div>

                    <div
                      class="d-flex align-items-center justify-content-center"
                      style="width: 4rem; height: 4rem"
                    >
                      <img
                        :src="player.url_image"
                        class="mw-100 mh-100"
                      />
                    </div>
                    
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="breakline"></div>

          <div class="mt-3">
            <div class="d-flex justify-content-between">
              <p class="m-0">Best Player</p>
              <p class="m-0">{{ match.best_player != null ? match.best_player.name : '-' }}</p>
            </div>

            <div class="d-flex justify-content-between mt-3">
              <p class="m-0">Competition Coordinator</p>
              <p class="m-0">{{ match.str_coordinator }}</p>
            </div>

            <div class="d-flex justify-content-between mt-3">
              <p class="m-0">Referee</p>
              <p class="m-0">{{ match.referee != null ? match.referee : '-' }}</p>
            </div>

            <div class="d-flex justify-content-between mt-3">
              <p class="m-0">Judge 1</p>
              <p class="m-0">{{ match.judge1 != null ? match.judge1 : '-' }}</p>
            </div>

            <div class="d-flex justify-content-between mt-3">
              <p class="m-0">Judge 2</p>
              <p class="m-0">{{ match.judge2 != null ? match.judge2 : '-' }}</p>
            </div>
          </div>

          <div class="breakline"></div>
        </div>
      </div>
    </div>

    <div>
      <a class="btn btn-primary" @click="onBackPressed">Back</a>
    </div>
  </Layout>
</template>

<style lang="scss">

.match-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: auto 1fr;
  gap: 1rem;
}
#about-us-content img {
  width: 100%;
  border-radius: 1rem;
}

.trust-list>p:nth-child(1) {
  min-height: 100px;
  text-align: center;
}

.trust-list>p:nth-child(2) {
  text-align: justify;
  text-align-last: center;
}

.table-member {
  display: block;
  overflow-x: auto;
  white-space: nowrap;
  font-size: 0.75rem;
}

.table-member>tr {
  display: table;
  width: 100%;
}

.btn .caret {
  position: absolute;
  top: calc(50% - 1px);
}
.match-grid-1 { grid-area: 1 / 1 / 2 / 2; }
.match-grid-2 { grid-area: 1 / 2 / 2 / 3; }
.match-grid-3 { grid-area: 1 / 3 / 2 / 4; }
.match-grid-4 { grid-area: 2 / 1 / 3 / 2; z-index: 2; margin: 1rem 0; }
.match-grid-5 { grid-area: 2 / 2 / 3 / 3; z-index: 2; margin: 1rem 0; }
.match-grid-6 { grid-area: 2 / 3 / 3 / 4; z-index: 2; margin: 1rem 0; }
.match-grid-7 {
  grid-area: 2 / 1 / 3 / 4; z-index: 1; position: relative;
  &:after {
    content: "";
    /* width: 100vw; */
    height: 100%;
    background-color: var(--primary);
    position: absolute;
    /* margin: 0 -100vw; */
    left: -50vw;
    // right: 50vw;
    padding: 0 100vw;
    // margin-left: -50vw;
  }
}
// .match-grid-7{
//   grid-area: 2 / 1 / 3 / 4;

// }

// .form-control{
//   background-position: right .75rem center;
// }
</style>