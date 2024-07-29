import { Routes } from '@angular/router';
import { PruebaxdComponent } from './components/pruebaxd/pruebaxd.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { HomeDestacadosComponent } from './components/home-destacados/home-destacados.component';
import { FooterComponent } from './components/footer/footer.component';
import { ViewPreviaComponent } from './components/view-previa/view-previa.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NuevosDesignComponent } from './components/nuevos-design/nuevos-design.component';
import { ConfigurationAdminComponent } from './components/configuration-admin/configuration-admin.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { HomeCategoriasComponent } from './components/home-categorias/home-categorias.component';
import { HomeConectaCreatividadComponent } from './components/home-conecta-creatividad/home-conecta-creatividad.component';
import { HomeBannerComponent } from './components/home-banner/home-banner.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { HighlightsComponent } from './components/highlights/highlights.component';
import { CheckoutComponent } from './components/checkout-component/checkout-component.component';
import { CarShopComponent } from './components/car-shop/car-shop.component';
import { DetailedCartComponent } from './components/detailed-cart/detailed-cart.component';
import { MenuAdminComponent } from './components/menu-admin/menu-admin.component';
import { FloatingButtonsComponent } from './components/floating-buttons/floating-buttons.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

export const routes: Routes = [  
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'homedestacados', component: HomeDestacadosComponent},
    {path: 'footer' ,component:FooterComponent},
    {path: 'preview/:nombre/:id' ,component:ViewPreviaComponent},
    {path: 'nav' ,component:NavBarComponent},
    {path: 'newDesign' ,component:NuevosDesignComponent},
    {path: 'admin' ,component:ConfigurationAdminComponent},
    {path: 'about' ,component:AboutUsComponent},
    {path: 'add' ,component:AddProductComponent},
    {path: 'homecategorias' ,component:HomeCategoriasComponent},
    {path: 'homeconecta' ,component:HomeConectaCreatividadComponent},
    {path: 'homeBanner' ,component:HomeBannerComponent},
    {path: 'products', component:MyProductsComponent},
    {path: 'highlights', component:HighlightsComponent},
    {path: 'checkout', component:CheckoutComponent},
    {path: 'car', component:CarShopComponent},
    {path: 'detailed-cart', component: DetailedCartComponent},
    {path: 'adminMenu', component: MenuAdminComponent},
    {path: 'btns', component: FloatingButtonsComponent},
    {path: 'blog', component: BlogCardComponent },
    {path: 'blog/:id', component: BlogDetailComponent },
    {path: 'list', component: ListProductsComponent },
    {path: 'prueba', component: PruebaxdComponent},
    {path: 'wishlist', component: WishlistComponent},
    {path: 'list-products/:nombreCategoria/:idCategoria', component: ListProductsComponent },
    {path: '', redirectTo:'/home' , pathMatch:'full'},
    {path: "**",redirectTo:'/home' , pathMatch:'full'},
    ];
