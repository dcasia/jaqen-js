import { Api } from './Api'
import { createApp, defineComponent, App, Component } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

class JaqenCore {
    public api = Api
}

export const Jaqen = new JaqenCore()

export function apiDefinition(endpoints: Record<string, unknown>) {
    return Jaqen.api.extend(endpoints)
}

type VueInstance = ReturnType<typeof defineComponent>

interface ServiceDefinitionInterface {
    components: Record<string, Component>
    routes: RouteRecordRaw[]
    api: Record<string, Promise<any>>

    install(vueInstance: App): this

    registerComponents(components: Record<string, Component>): this
}

export function serviceDefinition(definition: ServiceDefinitionInterface) {
    return { ...{ routes: [], api: {} }, ...definition }
}

function handleErrors(response: Response) {

    if (response.ok) {

    }

}

export function createVueApp(root: VueInstance) {

    const app = createApp(root)
    const router = createRouter({
        history: createWebHistory('/jaqen-ui'),
        routes: []
    })

    app.use(router)

    return {
        registerComponents(components: Record<string, Component>) {

            for (const name in components) {

                app.component(name, components[ name ])

            }

            return this

        },
        install(installer: ServiceDefinitionInterface) {

            this.registerComponents(installer.components)

            for (const route of installer.routes) {

                router.addRoute(route)

            }

            Jaqen.api.extend(installer.api)

            return this

        },
        mount(container: string) {

            app.mount(container)

            return this

        }
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
