<template>
    <div class="input-group mb-3">
        <div class="input-group-text" v-if="props.checkType !== undefined">
            <input class="form-check-input mt-0" :type="(props.checkType === undefined ? 'text' : props.checkType)" :value="props.checkValue" v-model="checkedValue" />
        </div>
        <div class="form-floating">
            <select class="form-select" :class="{ 'is-invalid': isInvalid }" :id="UUID" v-model="value">
                <option v-for="option in props.options" :key="option.value" :value="option.value">{{ option.text }}</option>
            </select>
            <label :for="UUID">{{ props.title }}</label>
            <div class="invalid-feedback">
                <ul>
                    <li v-for="errMsg in errorMessages" :key="errMsg">{{ errMsg }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRef, watch, computed } from 'vue'
import { uuid } from 'vue3-uuid'

const props = defineProps({
    fieldName: String,
    title: {
        type: String,
        default: 'Label'
    },
    modelValue: [String, Number, Boolean],
    options: Array,
    errorMessages: {
        type: Array,
        default() {
            return []
        }
    },
    checkType: String,
    checkValue: [String, Number, Boolean],
    checkedValue: [String, Number, Boolean]
})
const emits = defineEmits(['update:modelValue'])
const UUID = ref(uuid.v5(props.fieldName, uuid.v5.URL))
const errorMessages = toRef(props.errorMessages)
const isInvalid = computed(() => {
    return errorMessages.value.length > 0
})
const value = toRef(props.modelValue)
const checkedValue = toRef(props.checkedValue)
let valueWatchStop
let checkedValueWatchStop
watch(() => props.modelValue, (newValue) => {
    resetErrorMessages()
    if (value.value != newValue) {
        if (valueWatchStop !== undefined) {
            valueWatchStop()
            valueWatchStop = undefined
        }
        value.value = newValue
        startWatchValue()
    }
})
watch(() => props.errorMessages, (newValue) => {
    errorMessages.value = newValue
})
watch(() => props.checkedValue, (newValue) => {
    if (props.checkType !== undefined) {
        if (checkedValue.value != newValue) {
            if (checkedValueWatchStop !== undefined) {
                checkedValueWatchStop()
                checkedValueWatchStop = undefined
            }
            checkedValue.value = newValue
            startWatchCheckedValue()
        }
    }
})

function startWatchValue() {
    if (valueWatchStop === undefined) {
        valueWatchStop = watch(value, (newValue) => {
            resetErrorMessages()
            emits('update:modelValue', newValue)
        })
    }
}

function resetErrorMessages() {
    if (errorMessages.value.length > 0) {
        errorMessages.value = []
    }
}

function startWatchCheckedValue() {
    if ((props.checkType !== undefined) && (checkedValueWatchStop === undefined)) {
        checkedValueWatchStop = watch(checkedValue, (newValue) => {
            emits('update:checkedValue', newValue)
        })
    }
}

startWatchValue()
startWatchCheckedValue()
</script>

<style scoped>

</style>