<script>
import simplebar from "simplebar-vue";
import i18n from "../i18n";
import Base from "@/Utils/base";

const base = new Base()

export default {
  data() {
    return {
      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English"
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French"
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "spanish"
        },
        {
          flag: require("@/assets/images/flags/chaina.png"),
          language: "zh",
          title: "Chinese"
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic"
        }
      ],
      current_language: "en",
      user_data : {
        image_display : base.no_profile_picture
      }
    };
  },
  components: { simplebar },
  async mounted() {
    // await this.get_auth()
  },
  methods: {
    async get_auth() {
      var url = base.url_api + '/auth/profile'
      var response = await base.request(url);
      if (response != null) {
        if (response.status == "success") {
          var response_data = response.data

          response_data.image_display = base.no_profile_picture
          if(response_data.file_name != null){
            response_data.image_display = base.url_photo('user', response_data.file_name)
          }

          this.user_data = response_data
          
        }
      }
    },
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    setLanguage(locale) {
      i18n.locale = locale;
      this.current_language = i18n.locale;
    },
    async change_password() {
      window.location.href = '/change-password'
    },
    async logout() {
      await localStorage.clear()
      window.location.replace('/login')
    },
  }
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box d-flex align-items-center">
          <!-- <a href="#!" class="logo">
            <span class="">
              <img src="@/assets/logo_new.png" alt height="45" />
            </span>
          </a> -->
          <a href="#!" class="logo">
            <h3 class="m-0 text-primary">Backoffice Legoas</h3>
          </a>
        </div>

        <button @click="toggleMenu" type="button" class="btn btn-sm px-3 font-size-24 header-item waves-effect"
          id="vertical-menu-btn">
          <i class="ri-menu-2-line align-middle"></i>
        </button>
      </div>

      <div class="d-flex">

        <b-dropdown right variant="black" toggle-class="header-item" class="d-inline-block user-dropdown">
          <template v-slot:button-content>
            <img class="rounded-circle header-profile-user" :src="user_data.image_display" />
            <!-- <span class="d-none d-xl-inline-block ml-1">{{ $t('navbar.dropdown.kevin.text')}}</span> -->
            <!-- <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i> -->
          </template>
          <a class="dropdown-item" href="#!" v-on:click="change_password()">
            <i class="ri-shut-down-line align-middle mr-1 text-danger"></i>
            {{ $t('navbar.dropdown.kevin.list.change_password') }}
          </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item text-danger" href="#!" v-on:click="logout()">
            <i class="ri-shut-down-line align-middle mr-1 text-danger"></i>
            {{ $t('navbar.dropdown.kevin.list.logout') }}
          </a>
        </b-dropdown>

      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.notify-item {
  .active {
    color: #16181b;
    background-color: #f8f9fa;
  }
}
</style>