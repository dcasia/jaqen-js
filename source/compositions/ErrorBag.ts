import { ref } from 'vue'

export function useError() {

    const errorBag = ref({})

    return {
        errorBag
    }

}
