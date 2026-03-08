import type {Plugin} from 'vite'

export default function mochimemoThemePlugin(
    themeName:string
): Plugin {
    return {
        name: 'mochimemo-theme',
        resolveId(id) {
            if (id === 'virtual:mochimemo-current-theme') {
                return '\0virtual:mochimemo-current-theme'
            }
        }, load(id) {
            if (id === '\0virtual:mochimemo-current-theme') {
                if(themeName==='default') {
                    return `
                export * from "@/themes/default/index.ts"
                `
                }
                else if(themeName === '@mochimemo/theme-default'){
                    return `
                export * from "@/themes/default/index.ts"
                `
                }
                else{
                    return `
                export * from "${themeName}"
                `
                }
            }
        }
    }
}