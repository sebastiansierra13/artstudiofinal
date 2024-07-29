import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/interfaces-app';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [CommonModule, SidebarModule, BadgeModule, RouterModule, DividerModule],
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {
  @Input() setTitle: string = '';
  showCard = false;
  hideCardTimeout: any;
  visibleSidebar = false;
  cartItemsCount: number = 0;

  constructor(private cartService: CartService) {} // Inyecta el CartService

  ngOnInit(): void {
    this.updateCartItemsCount();
  }

  updateCartItemsCount(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItemsCount = items.length;
    });
  }

  showCart() {
    this.clearHideCartTimer();
    this.showCard = true;
  }

  keepCartOpen() {
    this.clearHideCartTimer();
  }

  startHideCartTimer() {
    this.hideCardTimeout = setTimeout(() => {
      this.showCard = false;
    }, 200);
  }

  clearHideCartTimer() {
    if (this.hideCardTimeout) {
      clearTimeout(this.hideCardTimeout);
      this.hideCardTimeout = null;
    }
  }

  toggleSidebar() {
    this.visibleSidebar = !this.visibleSidebar;
  }
}