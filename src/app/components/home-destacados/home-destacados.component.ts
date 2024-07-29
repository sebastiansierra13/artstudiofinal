import { Component, OnInit, HostListener } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Router, RouterLink } from '@angular/router';
import { ProductoConImagenes } from '../../interfaces/interfaces-app';
import { ServiceProductService } from '../../services/service-product.service';
import { WishlistService } from '../../services/wishlist.service';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-home-destacados',
  standalone: true,
  imports: [CardModule, ButtonModule, CarouselModule, TagModule, RouterLink],
  templateUrl: './home-destacados.component.html',
  providers: [MessageService],
  styleUrls: ['./home-destacados.component.css']
})
export class HomeDestacadosComponent implements OnInit {
  imgSelect: String = '';
  products: ProductoConImagenes[] = [];
  isSmallScreen: boolean = false;

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '800px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  isMobileOrTablet: boolean = false;

  constructor(
    private wishlistService: WishlistService,
    private router: Router,
    private serviceProduct: ServiceProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.serviceProduct.getProducts().subscribe(
      data => {
        this.products = data
          .filter(product => product.destacado)
          .sort((a, b) => a.posicion! - b.posicion!);
      },
      error => {
        console.error("error es:", error);
      }
    );
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 450;
    this.isMobileOrTablet = window.innerWidth <= 1024;
  }

  addToWishlist(event: Event, product: ProductoConImagenes) {
    this.wishlistService.addToWishlist(product);
    this.notificationService.showNotification('Producto agregado a la lista de deseos');
    event.stopPropagation();
  }
}
