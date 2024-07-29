import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OrderListModule } from 'primeng/orderlist';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { ButtonAdminMenuComponent } from '../button-admin-menu/button-admin-menu.component';
import { BannersService } from '../../services/banners.service';
import { Banner, ProductoConImagenes } from '../../interfaces/interfaces-app';
import { Producto } from '../../interfaces/interfaces-app';
import {
  Storage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { getStorage, ref as storageRef } from 'firebase/storage';
import { ServiceProductService } from '../../services/service-product.service';




@Component({
  selector: 'app-highlights',
  standalone: true,
  imports: [ButtonModule, ToastModule, ConfirmDialogModule, OrderListModule, FileUploadModule, CommonModule, CdkDropList, CdkDrag, DragDropModule, MenuAdminComponent, ButtonAdminMenuComponent],
  providers: [ConfirmationService, MessageService, PrimeNGConfig],
  templateUrl: './highlights.component.html',
  styleUrl: './highlights.component.css'
})
export class HighlightsComponent implements OnInit{
  banners: string[] = [
  ];
  listNewBanners: string[] = [];
  file: any[] = [];
  promises = [];
  tempHighlightedProducts: Producto[] = [];
  products: ProductoConImagenes[] = [];
  highlightedProducts: ProductoConImagenes[] = [];

  constructor(private productService: ServiceProductService,private storage: Storage, private servicesBanners: BannersService, private confirmationService: ConfirmationService, private messageService: MessageService,
    private config: PrimeNGConfig) {    
    this.servicesBanners.getBanners().subscribe((data) => {
      data.forEach(item => {
        if (typeof item.url === 'string') {
          this.banners.push(item.url);
        }
      });
    });
  }
 
  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.highlightedProducts = this.products.filter((product: ProductoConImagenes) => product.destacado);
    });
    this.getHighlightedProducts();
  }

  getHighlightedProducts() {
    this.productService.getProducts().subscribe(
      (products) => {
        this.highlightedProducts = products.filter(product => product.destacado);
        console.log('Productos destacados:', this.highlightedProducts);
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  onReorder(event: any) {
    this.highlightedProducts.forEach((product, index) => {
      product.posicion = index + 1;
    });

    this.productService.updateHighlightedProducts(this.highlightedProducts).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden de productos destacados actualizado', life: 3000 });
      },
      error => {
        console.error('Error updating highlighted products order', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el orden', life: 3000 });
      }
    );
  }

  removeHighlightedProduct(product: Producto) {
    const updatedProduct = { ...product, destacado: false, posicion: undefined };
    this.productService.actualizarProducto(updatedProduct).subscribe(
      () => {
        this.getHighlightedProducts();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado de destacados', life: 3000 });
      },
      error => {
        console.error('Error removing product from highlights', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el producto de destacados', life: 3000 });
      }
    );
  }

  toggleFavorite(product: Producto) {
    product.destacado = !product.destacado;

    if (product.destacado) {
      if (this.highlightedProducts.length < 12) {
        const updatedProduct = {
          idProducto: product.idProducto,
          destacado: product.destacado,
          posicion: this.highlightedProducts.length + 1
        };
        this.addHighlightedProduct(updatedProduct);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Máximo 12 productos en destacados', life: 3000 });
      }
    } else {
      const updatedProduct = { ...product, destacado: false, posicion: undefined };
      this.removeHighlightedProduct(updatedProduct);
    }
  }

  addHighlightedProduct(updatedProduct: any) {
    this.productService.actualizarProducto(updatedProduct).subscribe(
      () => {
        this.getHighlightedProducts();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto añadido a destacados', life: 3000 });
      },
      error => {
        console.error('Error actualizando el producto', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir el producto a destacados', life: 3000 });
      }
    );
  }

  onPositionChange(productId: number, newPosition: number) {
    const product = this.tempHighlightedProducts.find(p => p.idProducto === productId);
    if (product) {
      product.posicion = newPosition;
    }
  }

  saveChanges() {
    const updates = this.tempHighlightedProducts.map(product => ({
      idProducto: product.idProducto,
      posicion: product.posicion
    }));

    this.productService.updateProductPositions(updates).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Posiciones actualizadas', life: 3000 });
        this.getHighlightedProducts();
      },
      error => {
        console.error('Error actualizando las posiciones', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron actualizar las posiciones', life: 3000 });
      }
    );
  }


  confirm1(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        this.cargarImagenAFirebase();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  addBanners(urls: string[]) {
    this.servicesBanners.postBulkBanners(urls)
      .subscribe(
        response => {
          this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Los Banners fueron Agregados Correctamente' });

          // Aquí puedes manejar la respuesta exitosa como desees
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error al Agregar lo Banners', life: 3000 });
          // Aquí puedes manejar el error como desees
        }
      );
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.banners, event.previousIndex, event.currentIndex);
  }

  removeBanner(index: number): void {
    this.banners.splice(index, 1);
  }

  uploadBanner(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file.push(input.files[0]);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.banners.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(input.files[0]);
      reader.onload = () => {
        this.banners.push(reader.result as string);
      };
    }
  }

  async cargarImagenAFirebase(): Promise<void> {
    const storage = getStorage();
    const imagesRef = storageRef(storage, 'images/Banners'); // Referencia a la carpeta donde se almacenarán las imágenes

    // Array para almacenar las promesas de subida de imágenes
    const promises: Promise<string>[] = [];

    // Iterar sobre cada archivo en this.file
    for (let index = 0; index < this.file.length; index++) {
      const file = this.file[index];
      const imageRef = storageRef(imagesRef, file.name);

      // Agregar la promesa de subida de cada imagen al array de promesas
      promises.push(
        new Promise<string>(async (resolve, reject) => {
          try {
            // Subir archivo a Firebase Storage
            const snapshot = await uploadBytes(imageRef, file);

            // Obtener la URL de descarga del archivo subido
            const downloadURL = await getDownloadURL(imageRef);

            // Resolver la promesa con la URL de descarga
            resolve(downloadURL);
          } catch (error) {
            console.error('Error al subir archivo:', error);
            reject(error); // Rechazar la promesa en caso de error
          }
        })
      );
    } try {
      const urls = await Promise.all(promises);

      this.ejecutarAccionDespuesDeSubirImagenes(urls);

    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Error al subir uno o mas banners', life: 3000 });
      // Manejar el error si es necesario
    }
      }
       ejecutarAccionDespuesDeSubirImagenes(urls: string[]) {
        
        this.addBanners(urls);
      }
    }
  
  

