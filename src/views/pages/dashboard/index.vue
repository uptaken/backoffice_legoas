<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Base from "@/Utils/base";

const base = new Base()
/**
 * Dashboard component
 */
export default {
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "Dashboard",
          active: true
        }
      ]
    };
  },
  created(){
    base.save_current_page('Dashboard', true)
    
  },
  methods: {
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      
    </div>
  </Layout>
</template>