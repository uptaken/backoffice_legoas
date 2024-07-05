<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Base from '@/Utils/base'

const base = new Base()

export default {
    page: {
        title: "Change Password",
        meta: [{ name: "description", content: appConfig.description }],
    },
    components: { Layout, PageHeader },
    data() {
        return {
            title: "Change Password",
            items: [
                {
                    text: "Dashboard",
                    href: "/",
                },
                {
                    text: "Change Password",
                    active: true,
                },
            ],
            email_arr: [],
            old_password: '',
            new_password: '',
            confirm_password: '',
            is_view_only: true
        };
    },
    async created() {
        await this.get_data()
    },
    methods: {
        add_email() {
            this.email_arr.push({ email: '' })
        },
        async action_btn() {
            if (this.old_password == "")
                base.show_error("Old Password is Empty")
            else if (this.new_password == "")
                base.show_error("New Password is Empty")
            else if (this.confirm_password == "")
                base.show_error("Confirm Password is Empty")
            else if (this.confirm_password != this.new_password)
                base.show_error("Confirm Password is not same with New Password")
            else {
                var url = base.url_api + '/auth/change-password'

                var data = {
                    old_password: this.old_password,
                    new_password: this.new_password,
                    confirm_password: this.confirm_password,
                }

                var method = 'post'

                var response = await base.request(url, method, data);

                if (response != null) {
                    if (response.status == "success") {
                        window.location.href = '/'
                    }
                    else
                        base.show_error(response.message)
                }
            }
        },
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
                        <h4 class="card-title">Change Password</h4>
                        <div class="row">
                            <div class="col-12 mt-2">
                                <div class="form-group">
                                    <label class="form-label">Old Password</label>
                                    <input class="form-control" type="password" name="old_password" v-model="old_password"/>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">New Password</label>
                                    <input class="form-control" type="password" name="new_password" v-model="new_password"/>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Confirm Password</label>
                                    <input class="form-control" type="password" name="confirm_password" v-model="confirm_password"/>
                                </div>
                            </div>

                            <div class="col-12 mt-2">
                                <button class="btn btn-primary" v-on:click="action_btn">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
