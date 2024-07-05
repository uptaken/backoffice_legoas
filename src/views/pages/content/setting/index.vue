<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import Base from "@/Utils/base";
import CustomTextareaArray from "@/views/layouts/CustomTextareaArray";
import CustomPleaseWait from "@/views/layouts/CustomPleaseWait";
import CustomTable from "@/views/layouts/CustomTable";
import SettingItem from "@/views/pages/content/setting/component/settingItem";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Setting component
 */
export default {
    page: {
        title: "Setting",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, SettingItem, CustomPleaseWait, },
    data() {
        return {
            tableData: [],
            title: "Setting",
            progress: 0,
        };
    },
    async mounted() {
      base.save_current_page('Setting', true)
    },
    methods: {
    }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    

    <div class="row">
      <div class="col-4">
        <SettingItem title="Service Charge"
          setting_key="service_charge"
          type="currency"/>
      </div>
    </div>

    <CustomPleaseWait :progress="progress"/>
  </Layout>
</template>