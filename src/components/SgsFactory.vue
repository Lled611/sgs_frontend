<template>
    <SelectFormFloating field-name="city" :title="$t('City')" :options="cityOptions" v-model:model-value="city" />
    <SelectFormFloating field-name="workshop" :title="$t('Workshop')" :options="workshopOptions" v-model:model-value="workshop" />
    <SelectFormFloating field-name="shift" :title="$t('Shift')" :options="shiftOptions" v-model:model-value="shift" />
    <SelectFormFloating field-name="team" :title="$t('Team')" :options="teamOptions" v-model:model-value="team" />
</template>

<script setup>
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { ref, readonly, watch } from 'vue'
import SelectFormFloating from '@/components/SelectFormFloating.vue'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.headers.common['Content-Type'] = 'application/json'

const { t } = useI18n()
const requestMethods = readonly(ref({
    get: 'get',
    post: 'post',
    put: 'put'
}))
const city = ref(null)
const cityOptions = ref([])
const workshop = ref(null)
const workshopOptions = ref([])
const shift = ref(true)
const shiftOptions = ref([
    {
        text: t('First') + ' 08:00 - 20:00',
        value: true
    },
    {
        text: t('Second') + ' 20:00 - 08:00',
        value: false
    }
])
const team = ref(null)
const teamOptions = ref([])

function makeRequest(url, data={}, callbackSuccess=undefined, callbackError=undefined, method=requestMethods.value.get) {
    const abortController = new AbortController()
    switch (method) {
        case requestMethods.value.get:
            axios.get(url, {
                params: data,
                signal: abortController.signal
            })
                .then(callbackSuccess)
                .catch(callbackError)
            break
        case requestMethods.value.post:
            axios.post(url, data, {
                signal: abortController.signal
            })
                .then(callbackSuccess)
                .catch(callbackError)
            break
        case requestMethods.value.put:
            axios.put(url, data, {
                signal: abortController.signal
            })
                .then(callbackSuccess)
                .catch(callbackError)
            break
    }
    return abortController
}

makeRequest('cities/', {}, (response) => {
    response.data.forEach(item => {
        cityOptions.value.push({
            text: item.name,
            value: item.id
        })
    })
})
watch(city, (newValue) => {
    workshop.value = null
    workshopOptions.value = []
    makeRequest('workshops/', {
        city: newValue
    }, (response) => {
        response.data.forEach(item => {
            workshopOptions.value.push({
                text: item.name,
                value: item.id
            })
        })
    })
})
watch([shift, workshop], ([newValueShift, newValueWorkshop]) => {
    team.value = null
    teamOptions.value = []
    if (newValueWorkshop != null) {
        makeRequest('teams/', {
            shift: newValueShift,
            workshop: newValueWorkshop
        }, (response) => {
            response.data.forEach(item => {
                teamOptions.value.push({
                    text: item.number,
                    value: item.id
                })
            })
        })
    }
})
</script>

<style module>

</style>