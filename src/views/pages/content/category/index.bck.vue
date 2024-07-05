<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment'
import Base from "@/Utils/base";
import CustomTextareaArray from "@/views/layouts/CustomTextareaArray";
import CustomPleaseWait from "@/views/layouts/CustomPleaseWait";

const base = new Base()
// import { tableData } from "../../../tables/dataAdvancedtable";

/**
 * Venue component
 */
export default {
    page: {
        title: "Venue",
        meta: [{ name: "description", content: appConfig.description }]
    },
    components: { Layout, PageHeader, CustomTextareaArray, },
    data() {
        return {
            tableData: [],
            title: "Venue",
            items: [
                {
                    text: "Tables",
                    href: "/"
                },
                {
                    text: "Venue",
                    active: true
                }
            ],
            arr_form: [
              {
                id: 'name',
                label: 'Name',
                type: 'text',
              },
              {
                id: 'address',
                label: 'Address',
                type: 'textarea',
                content_type_id: 'address_content_type_id',
              },
            ],
            progress: 0,
        };
    },
    methods: {

    }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <CustomPleaseWait :progress="progress"/>

    <div>
      <CustomTextareaArray 
        label="Venue" 
        url_path="venue"
        :with_image="false"
        :arr_form="arr_form"/>
    </div>
  </Layout>
</template>