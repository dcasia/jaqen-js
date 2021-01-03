import { App, Component, createApp, defineComponent } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useError } from './compositions/ErrorBag'

export const api = {
    extend(endpoints = {}) {
        Object.assign(this, endpoints)
    }
}

export function apiDefinition(endpoints: Record<string, unknown>) {
    return api.extend(endpoints)
}

type VueInstance = ReturnType<typeof defineComponent>

interface ServiceDefinitionInterface {
    components: Record<string, Component>
    routes: RouteRecordRaw[]
    api: Record<string, Promise<any>>

    install(vueInstance: App): this

    registerComponents(components: Record<string, Component>): this
}

export function serviceDefinition(definition: Partial<ServiceDefinitionInterface>): ServiceDefinitionInterface {
    return { ...{ routes: [], api: {} }, ...definition } as ServiceDefinitionInterface
}

function handleErrors(response: Response) {

    if (response.ok) {

    }

}

export function createVueApp(root: VueInstance): CreateVueApp {

    const app = createApp(root)
    // const router = createRouter({
    //     history: createWebHistory('/jaqen'),
    //     routes: []
    // })
    //
    // app.use(router)

    return new CreateVueApp(app)

}

class CreateVueApp {

    private app: App
    private routes: RouteRecordRaw[] = []

    constructor(app: App) {
        this.app = app
    }

    registerComponents(components: Record<string, Component>): this {

        for (const name in components) {

            this.app.component(name, components[ name ])

        }

        return this

    }

    install(installer: ServiceDefinitionInterface | ServiceDefinitionInterface[]): this {

        if (Array.isArray(installer)) {

            for (const definition of installer) {

                this.install(definition)

            }

            return this

        }

        this.registerComponents(installer.components)

        for (const route of installer.routes) {

            this.routes.push(route)

        }

        api.extend(installer.api)

        return this

    }

    mount(container: string): this {

        const router = createRouter({
            history: createWebHistory('/jaqen'),
            routes: this.routes
        })

        this.app.use(router)
        this.app.mount(container)

        return this

    }

}

export const http = {

    async fetch<A>(url: string): Promise<A | null> {

        const response = await fetch(url, {
            headers: {
                Accept: 'application/json'
            }
        })

        if (response.ok) {

            return await response.json()

        }

        return null

    }

}

export {
    useError
}
