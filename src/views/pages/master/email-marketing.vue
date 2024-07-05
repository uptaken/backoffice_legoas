<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Base from '@/Utils/base'

const base = new Base()

export default {
    page: {
        title: "Email Marketing",
        meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader },
    data() {
        return {
            title: "Email Marketing",
            items: [
                {
                    text: "Dashboard",
                    href: "/",
                },
                {
                    text: "Email Marketing",
                    active: true,
                },
            ],
            email_arr: [],
            is_view_only: true
        };
    },
    async created() {
        await this.get_data()
    },
    methods: {
        async get_data() {
            var url = base.url_api + '/sales-email-list'

            var response = await base.request(url);

            if (response != null) {
                if (response.status == "success") {
                    var response_data = response.data
                    this.email_arr = response_data
                }
            }
        },
        add_email() {
            this.email_arr.push({ email: '' })
        },
        async action_btn() {
            if (this.is_view_only) {
                this.is_view_only = false
            }
            else {
                var url = base.url_api + '/sales-email-list'

                var data = {
                    arr_email: this.email_arr
                }

                var method = 'post'

                var response = await base.request(url, method, data);

                if (response != null) {
                    if (response.status == "success") {
                        window.location.reload()
                    }
                }
            }
        },
        async delete_email(index) {
            var flag_delete = 1
            var url = base.url_api + '/sales-email-list'

            if (confirm('Are you sure want to delete this data?') == true) {
                flag_delete = 1
            }
            else {
                flag_delete = 0
            }

            if (flag_delete) {
                var response = await base.request(url, "delete", {
                    id: this.email_arr[index].id,
                });
                if (response != null) {
                    if (response.status == "success") {
                        this.email_arr.splice(index, 1);
                    }
                }
            }
        }
    }
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">List Email</h4>
                        <div class="row">
                            <div class="col-12 mt-2" v-for="(data, index) in email_arr" :key="index">
                                <div class="row">
                                    <div class="col">
                                        <input for="text" type="email" v-model="data.email" class="form-control"
                                            :disabled="is_view_only" />
                                    </div>
                                    <div class="col-auto align-items-center d-flex">
                                        <button class="btn btn-sm btn-danger rounded-circle mr-2"
                                            v-on:click="delete_email(index)"><i class="mdi mdi-trash-can"></i></button>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 mt-2" v-if="!is_view_only">
                                <button class="btn btn-outline-primary w-100" style="border-style: dashed;"
                                    v-on:click="add_email">Add New</button>
                            </div>

                            <div class="col-12 mt-2">
                                <button class="btn btn-primary" v-on:click="action_btn">{{ is_view_only ? 'Edit' :
                                    'Save' }} Email</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
