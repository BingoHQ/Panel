<template lang="pug">
    modal.request-personal-link(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('user.referredUsers') }}
        div.user-referrer(slot="content")
            <!--Referrer link-->
            div.row.referrer-link
                div.row.description
                    span.ta-right {{$i18n.t('user.copyReferrerLinkDescription')}}
                div.row.full-width.no-margin
                    div.col-xs.label-group.full-width.no-margin
                        div.col-xs.text.merchant-code
                            input.txt-referrer-link.dir-ltr(:id="'txtReferrerId'" onfocus="this.select();" v-bind:value="$root.baseUrl + '/auth/register?referrer=' + referrer.link" readonly="readonly")
                        div.icon.copy(@click="clipboardMessage(referrer.link)" v-clipboard="" v-bind:data-clipboard-text="$root.baseUrl + '/auth/register?referrer=' + referrer.link")

            <!--Referred Users-->
            div.referrers
                div.referrer-box(v-if="referredUsers")
                    loading(v-if="loadingData")

                    div.row(v-else v-for="referrer in referredUsers")
                        div.col-lg-2
                            img.avatar(:src="referrer.avatar")
                        div.col-lg-6.ta-right
                            span {{referrer.name}}
                            span.persian-num (ZP.{{referrer.public_id}})
                        div.col-lg-4.ta-left
                            span.persian-num {{referrer.referrer_fee | numberFormat}} {{$i18n.t('transaction.toman')}}

</template>


<script>
    import modal from "../partials/modal";
    import loading from "../partials/loading";
    export default {
        name: 'user-referrer',
        data() {
            return {
                loadingData: true,
                referredUsers: {},
                referrer: {
                    link: btoa(this.$store.state.auth.user.public_id)
                }
            }
        },
        created() {
            this.getReferredUsers();
        },
        methods: {
            getReferredUsers() {
                if (!this.referredUsers.length) {
                    this.$store.state.http.requests['user.referred']
                        .get()
                        .then((response) => {
                                this.referredUsers = response.data.data;
                                this.loadingData = false;
                            }, (response) => {
                                store.commit('setValidationErrors', response.data.validation_errors);
                                store.commit('flashMessage', {
                                    text: response.data.meta.error_type,
                                    type: 'danger'
                                });
                            }
                        );
                }
            },
            clipboardMessage() {
                setTimeout(function () {
                    let txtReferrerId = document.getElementById('txtReferrerId');
                    if (txtReferrerId) {
                        txtReferrerId.select();
                    }
                }, 10);

                store.commit('flashMessage', {
                    text: 'Copied',
                    type: 'success',
                    timeout: '1500'
                });
            },
            closeModal() {
                this.$emit('closeModal');
            }
        },
        components: {
            modal,
            loading
        }
    }
</script>