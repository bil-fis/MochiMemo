import {setThemePages} from "../../core/router/routeBuilder.ts"
import HomePage from './HomePage.vue'
import CustomPage from './CustomPage.vue'
import PostsPage from './PostsPage.vue'
import CategoryPage from './CategoryPage.vue'
import TagPage from './TagPage.vue'
import NotFound from './NotFound.vue'
import Layout from './Layout.vue'

export function useTheme(){
    setThemePages({
        HomePage,
        CustomPage,
        PostsPage,
        CategoryPage,
        TagPage,
        NotFound,
        Layout,
    })
}