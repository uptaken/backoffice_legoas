<script>
import CustomBreadcrumb from "@/views/layouts/CustomBreadcrumb";

export default {
  components: {CustomBreadcrumb,},
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
}
</script>

<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <h4 class="mb-0">{{ title }}</h4>

        <CustomBreadcrumb/>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>
