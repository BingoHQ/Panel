<template lang="pug">
    modal.zarin-gate(v-on:closeModal="closeModal()")
        span(slot="title") {{ $i18n.t('webservice.activeZarinGate') }}
        div(slot="content")
            div.row
                <!--p.create-description {{ $i18n.t('webservice.zarinGateNotice') }}-->
                span.create-description  هزینه زرین‌گیت براساس تعداد تراکنش موجود بر روی درگاه عادی زرین‌پال متغیر  است.
                    span.read-description(@click="visibleDescription=!visibleDescription") {{ $i18n.t('webservice.description') }}

            transition(name="fade"
            enter-active-class="fade-in"
            leave-active-class="fade-out")
                div.ta-right.more-description(v-if="visibleDescription") {{ $i18n.t('webservice.zarinGateNotice') }}

            div.row
                purse.purses.col-lg-12.col-md-12.col-sm-12.col-xs-12(@click.native="removeErrors('purse')" v-focus="" v-validate="{ rules: {required: true}}" name="purse" v-model="purse" v-bind:data-vv-as="$i18n.t('user.purse')" :class="{'input-danger': errors.has('purse')}" v-on:select="selectedPurse"  placeholder="انتخاب کیف‌پول" autofocus tabindex="1")
                div.ta-right(v-if="validation('purse')")
                    span.text-danger {{ errors.first('purse') }}

            div.row.body-bottom
                div.col-lg-9.col-md-12.col-sm-12.col-xs-12.ta-right
                    loading(v-if="getPriceLoading" v-bind:width="20" v-bind:height="20")
                    span.persian-num.activation-price(v-else)  هزینه ی درخواست زرین‌گیت {{priceZaringate.amount | numberFormat}} تومان می‌باشد.

                div.col-lg-3.col-md-12.col-sm-12.col-xs-12.ta-left
                    button.btn.success.pull-left(v-ripple="" @click="validateForm") {{$i18n.t('webservice.activeZarinGateSubmit')}}
                        svg.material-spinner(v-if="loading" width="25px" height="25px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg")
                            circle.path(fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30")


</template>


<script>
    import selectbox from '../../partials/selectbox.vue';
    import purse from '../../partials/purses.vue';
    import modal from '../../partials/modal.vue';
    import loading from '../../partials/loading.vue';

    export default {
        name: 'home-webservice-partials-zarinGateActivation',
        data() {
            return {
                loading: false,
                getPriceLoading: true,
                visibleDescription: false,
                closeModalContent: true,
                purse: null,
                priceZaringate: null,
            }
        },
        props: ['webservice'],
        mounted(){
            this.closeModalContent = false
        },
        created() {
            store.commit('clearValidationErrors');
            this.getPriceZaringate();
        },
        methods: {
            validateForm() {
                this.$validator.validateAll({
                    purse: this.purse,
                }).then((result) => {
                    if (result) {
                        this.activeZarinGate();
                    }
                });
            },
            removeErrors: function (field) {
                !!this[field] && this.errors.remove(field);
            },
            closeModal() {
                this.$emit('closeModal');
            },
            selectedPurse(purseId) {
                this.purse = purseId;
            },
            activeZarinGate() {
                this.loading = true;
                let ussdData = {
                    webservice: this.webservice.entity_id,
                    purse: this.purse,
                };

                this.$store.state.http.requests['webservice.postRequestZaringate'].save(ussdData).then(
                    () => {
                        let vm = this;
                        let webserviceIndex = _.findIndex(this.$store.state.auth.user.webservices, function (webservice) {
                            return webservice.entity_id === vm.webservice.entity_id;
                        });
                        this.$store.state.auth.user.webservices[webserviceIndex].zaringate_status = 'Activate';

                        store.commit('flashMessage', {
                            text: 'WebserviceZarinGateActivatedLocal',
                            type: 'success'
                        });

                        this.validationErrors = null;
                        this.closeModal();
                    },
                    (response) => {
                        this.loading = false;
                        store.commit('setValidationErrors', response.data.validation_errors);
                        this.$store.commit('flashMessage', {
                            text: response.data.meta.error_type,
                            important: false,
                            type: 'danger'
                        });
                    }
                )
            },
            getPriceZaringate() {
                this.$store.state.http.requests['webservice.getPriceZaringate'].get().then(response => {
                    this.priceZaringate = response.data.data[0];
                    this.getPriceLoading = false;
                });
            },
        },
        components: {
            selectbox,
            purse,
            modal,
            loading
        }
    }

</script>
