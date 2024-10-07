<script>
import simplebar from "simplebar-vue";
import { layoutComputed } from "@/state/helpers";
import Base from "@/Utils/base";

// import MetisMenu from "metismenujs/dist/metismenujs";

import { menuItems } from "./menu";

export default {
  components: {
    simplebar,
  },
  props: {
    isCondensed: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    user_data: {
      name: String
    }
  },
  data() {
    return {
      menuItems: [
				{
					id: 1,
					menuName: 'Dictionary',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/dictionary',
					childMenu: [],
				},
				{
					id: 1,
					menuName: 'Location',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/location',
					childMenu: [],
				},
				{
					id: 1,
					menuName: 'Partner',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/partner',
					childMenu: [],
				},
				{
					id: 1,
					menuName: 'Office',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/office',
					childMenu: [],
				},
				{
					id: 1,
					menuName: 'Customer',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/customer',
					childMenu: [],
				},
				{
					id: 1,
					menuName: 'Menu',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/menu',
					childMenu: [],
				},
				{
					id: 1,
					menuName: 'Role',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/role',
					childMenu: [],
				},
				{
					id: 1,
					menuName: 'User Role',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/role/user',
					childMenu: [],
				},
				{
					id: 1,
					menuName: 'User',
					menuIcon: 'ri-dashboard-line',
					menuUrl: '/user',
					childMenu: [],
				},
			],
			base: null,
    };
  },
  computed: {
    ...layoutComputed,
  },
  mounted: function () {
		this.base = new Base()

		// this.get_menu()
    // eslint-disable-next-line no-unused-vars
    // var menuRef = new MetisMenu("#side-menu");
    var links = document.getElementsByClassName("side-nav-link-ref");
    var matchingMenuItem = null;
    for (var i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i].pathname) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      var parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add("mm-active");
        const parent2 = parent.parentElement.closest("ul");
        if (parent2 && parent2.id !== "side-menu") {
          parent2.classList.add("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add("mm-active");
            var childAnchor = parent3.querySelector(".has-arrow");
            var childDropdown = parent3.querySelector(".has-dropdown");
            if (childAnchor) childAnchor.classList.add("mm-active");
            if (childDropdown) childDropdown.classList.add("mm-active");

            const parent4 = parent3.parentElement;
            if (parent4 && parent4.id !== "side-menu") {
              parent4.classList.add("mm-show");
              const parent5 = parent4.parentElement;
              if (parent5 && parent5.id !== "side-menu") {
                parent5.classList.add("mm-active");
                const childanchor = parent5.querySelector(".is-parent");
                if (childanchor && parent5.id !== "side-menu") {
                  childanchor.classList.add("mm-active");
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
		async get_menu(){
			var response = await this.base.request(this.base.url_api + '/admin/main/menu', 'post', {})

			if (response != null) {
				this.menuItems = response.data.mainMenu
			}
			else
				this.base.show_error("Server Error")

		},
    /**
     * Returns true or false if given menu item has child or not
     * @param item menuItem
     */
    hasItems(item) {
      return item.childMenu != null ? item.childMenu.length > 0 : false;
    },
    onRoutechange() {
      // setTimeout(() => {
      //   const currentPosition = document.getElementsByClassName("mm-active")[0]
      //     .offsetTop;
      //   if (currentPosition > 400)
      //     this.$refs.currentMenu.SimpleBar.getScrollElement().scrollTop =
      //       currentPosition + 200;
      // }, 300);
    },
		onMenuClicked(item){
			window.localStorage.setItem('menu', JSON.stringify(item))
		},
  },
  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.body.setAttribute("data-sidebar", "dark");
              document.body.removeAttribute("data-topbar");
              document.body.removeAttribute("data-sidebar-size");
              break;
            case "light":
              document.body.setAttribute("data-topbar", "dark");
              document.body.removeAttribute("data-sidebar");
              document.body.removeAttribute("data-sidebar-size");
              document.body.classList.remove("vertical-collpsed");
              break;
            case "compact":
              document.body.setAttribute("data-sidebar-size", "small");
              document.body.setAttribute("data-sidebar", "dark");
              document.body.classList.remove("vertical-collpsed");
              document.body.removeAttribute("data-topbar", "dark");
              break;
            case "icon":
              document.body.setAttribute("data-keep-enlarged", "true");
              document.body.classList.add("vertical-collpsed");
              document.body.setAttribute("data-sidebar", "dark");
              document.body.removeAttribute("data-topbar", "dark");
              break;
            case "colored":
              document.body.setAttribute("data-sidebar", "colored");
              document.body.removeAttribute("data-keep-enlarged");
              document.body.classList.remove("vertical-collpsed");
              document.body.removeAttribute("data-sidebar-size");
              break;
            default:
              document.body.setAttribute("data-sidebar", "dark");
              break;
          }
        }
      },
    },
    width: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "boxed":
              document.body.setAttribute("data-layout-size", "boxed");
              break;
            case "fluid":
              document.body.setAttribute("data-layout-mode", "fluid");
              document.body.removeAttribute("data-layout-size");
              break;
            default:
              document.body.setAttribute("data-layout-mode", "fluid");
              break;
          }
        }
      },
    },
  },
};
</script>
<template>
  <!-- ========== Left Sidebar Start ========== -->
  <div class="vertical-menu">
    <simplebar class="h-100" ref="currentMenu" id="my-element">
      <!--- Sidemenu -->
      <div id="sidebar-menu">
        <!-- Left Menu Start -->
        <ul class="metismenu list-unstyled" id="side-menu">
          <template v-for="item in menuItems">
            <li class="menu-title" v-if="item.isTitle" :key="item.id">
              {{ $t(item.label) }}
            </li>

            <!--end Layouts menu -->
            <li v-if="!item.isTitle && !item.isLayout" :key="item.id">
              <a v-if="hasItems(item)" href="javascript:void(0);" class="is-parent" :class="{
                'has-arrow': !item.badge,
                'has-dropdown': item.badge,
              }">
                <i :class="`fa ${item.menuIcon}`" v-if="item.menuIcon"></i>
                <span>{{ item.menuName }}</span>
                <span :class="`badge badge-pill badge-${item.badge.variant} float-right`" v-if="item.badge">{{ $t(item.badge.text) }}</span>
              </a>

              <a :href="item.menuUrl != '#' ? item.menuUrl : '/custom?menu_id=' + item.id" v-if="!hasItems(item)" @click="onMenuClicked(item)" class="side-nav-link-ref">
                <i :class="`fa-solid ${item.menuIcon}`" v-if="item.menuIcon"></i>
                <span>{{ $t(item.menuName) }}</span>
                <span :class="`badge badge-pill badge-${item.badge.variant} float-right`" v-if="item.badge">{{ $t(item.badge.text) }}</span>
              </a>

              <ul v-if="hasItems(item)" class="sub-menu" aria-expanded="false">
                <li v-for="(child, index) of item.childMenu" :key="index">
                  <router-link :to="child.menuUrl != '#' ? child.menuUrl : '/custom?menu_id=' + child.id" v-if="!hasItems(child)" class="side-nav-link-ref">{{ child.menuName }}</router-link>
                  <a v-if="hasItems(child)" class="side-nav-link-a-ref has-arrow" href="javascript:void(0);">{{
                    child.menuName }}</a>
                  <!-- <ul v-if="hasItems(subitem)" class="sub-menu mm-collapse" aria-expanded="false">
                    <li v-for="(subSubitem, index) of subitem.subItems" :key="index">
                      <router-link :to="subSubitem.link" class="side-nav-link-ref">{{ $t(subSubitem.label)
                      }}</router-link>
                    </li>
                  </ul> -->
                </li>
              </ul>
            </li>
          </template>

          <!-- <li>
              <a href="javascript: void(0);" class="has-arrow waves-effect">
                <i class="ri-share-line"></i>
                <span>Multi Level</span>
              </a>
              <ul class="sub-menu" aria-expanded="true">
                <li>
                  <a href="javascript: void(0);">Level 1.1</a>
                </li>
                <li>
                  <a href="javascript: void(0);" class="has-arrow">Level 1.2</a>
                  <ul class="sub-menu" aria-expanded="true">
                    <li>
                      <a href="javascript: void(0);">Level 2.1</a>
                    </li>
                    <li>
                      <a href="javascript: void(0);">Level 2.2</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li> -->
        </ul>
      </div>
      <!-- Sidebar -->
    </simplebar>
  </div>
  <!-- Left Sidebar End -->
</template>