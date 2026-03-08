import {useTheme} from 'virtual:mochimemo-current-theme'
export async function loadTheme() {
    try{
        useTheme()
    }catch (e){
        console.error(e)
        const fallback = await import('./default/index')
        fallback.useTheme()
    }
}