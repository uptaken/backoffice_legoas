<template>
  <div class="page-title-right">
    <b-breadcrumb class="m-0">
      <b-breadcrumb-item @click="onClicked(index)" :href="item.href" v-for="(item, index) in items" :key="index">
        {{ item.text }}
      </b-breadcrumb-item>
    </b-breadcrumb>
  </div>
</template>

<script>
import CustomEditor from "./CustomEditor";
import Base from "@/Utils/base";

export default {
  props: ["title", "index", "map_type", ],
  components: { CustomEditor, },
  data() {
    return {
      base: null,
      items: [],
    };
  },
  mounted() {
    this.base = new Base()
    setTimeout(() => {
      this.get_pages()
    }, 500)
  },
  methods: {
    async get_pages() {
      var arr_pages = await window.localStorage.getItem('arr_pages')
      arr_pages = JSON.parse(arr_pages)

      var arr = []
      for(let x in arr_pages){
        arr.push({
          text: arr_pages[x].name,
          href: arr_pages[x].url,
          // active: x == arr_pages.length - 2,
        })
      }
      this.items = arr
    },
    onClicked(index){
      if(index < this.items.length - 1)
        this.base.back_page(true, index + 1)
    },
  },
};
</script>