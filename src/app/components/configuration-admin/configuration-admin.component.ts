import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';
import { ButtonAdminMenuComponent } from '../button-admin-menu/button-admin-menu.component';
import { PriceUpdateModalComponent } from '../price-update-modal/price-update-modal.component';
import { SizeUpdateModalComponent } from '../size-update-modal/size-update-modal.component'
import { DialogModule } from 'primeng/dialog';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Precio } from '../../interfaces/interfaces-app';
import { PrecioService } from '../../services/precio.service';

@Component({
  selector: 'app-configuration-admin',
  standalone: true,
  imports: [MatDividerModule, ButtonModule, ConfirmDialogModule, ToastModule, EditorModule, FormsModule,MenuAdminComponent,ButtonAdminMenuComponent,PriceUpdateModalComponent,DialogModule,CommonModule,SizeUpdateModalComponent],
  templateUrl: './configuration-admin.component.html',
  styleUrls: ['./configuration-admin.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ConfigurationAdminComponent implements OnInit{
  aboutUsText: string | undefined;
  termsText: string | undefined;
  shippingPoliciesText: string | undefined;
  returnPoliciesText: string | undefined;

  showPriceUpdateModal: boolean = false;
  showSizeUpdateModal: boolean = false;
  precios: Precio[] = [];

  constructor(private precioService: PrecioService,private confirmationService: ConfirmationService, private messageService: MessageService,private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  saveText(section: string) {
    switch (section) {
      case 'aboutUs':
        console.log('About Us text saved:', this.aboutUsText);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Texto de Sobre Nosotros guardado' });
        break;
      case 'terms':
        console.log('Terms text saved:', this.termsText);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Texto de Términos y Condiciones guardado' });
        break;
      case 'shippingPolicies':
        console.log('Shipping Policies text saved:', this.shippingPoliciesText);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Texto de Políticas de Envío guardado' });
        break;
      case 'returnPolicies':
        console.log('Return Policies text saved:', this.returnPoliciesText);
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Texto de Políticas de Devolución guardado' });
        break;
      default:
        console.log('Unknown section:', section);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sección desconocida' });
        break;
    }
  }

  ngOnInit() {
    this.loadPrecios();
  }

  confirmAction(actionType: 'price' | 'size') {
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: 'Por favor confirma que quieres realizar esta acción',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        if (actionType === 'price') {
          this.showPriceUpdateModal = true;
        } else {
          this.showSizeUpdateModal = true;
        }
        this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Realiza los cambios', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado la acción', life: 3000 });
      }
    });
  }

  onPriceUpdate(updatedPrecio: Precio) {
    this.precioService.updatePrecio(updatedPrecio).subscribe(
      (result) => {
        if (result) {
          const index = this.precios.findIndex(p => p.idPrecio === result.idPrecio);
          if (index !== -1) {
            this.precios[index] = result;
          }
          this.showPriceUpdateModal = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Precios actualizados correctamente' });
        } else {
          console.error('El resultado de la actualización es null');
          this.showPriceUpdateModal = false;  // Cerrar el modal también en caso de error
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el precio (resultado null)' });
        }
      },
      (error) => {
        console.error('Error al actualizar el precio:', error);
        this.showPriceUpdateModal = false;  // Cerrar el modal también en caso de error
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el precio' });
      }
    );
  }

  onSizeUpdate(updatedSizes: Omit<Precio, 'idPrecio'>[]) {
    const addPromises = updatedSizes.map(size => this.precioService.addPrecio(size).toPromise());
    
    Promise.all(addPromises)
      .then(() => {
        this.loadPrecios(); // Reload all prices after updating
        this.showSizeUpdateModal = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medidas actualizadas correctamente' });
      })
      .catch((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron actualizar las medidas' });
      });
  }

  onModalCancel(modalType: 'price' | 'size') {
    this.messageService.add({ severity: 'error', summary: 'Acción Cancelada', detail: `Se canceló la acción y no modificaste los ${modalType === 'price' ? 'precios' : 'medidas'}` });
    if (modalType === 'price') {
      this.showPriceUpdateModal = false;
    } else {
      this.showSizeUpdateModal = false;
    }
    this.renderer.setStyle(this.document.body, 'overflow', 'visible');
  }

  loadPrecios() {
    this.precioService.getPrecios().subscribe(
      (precios) => {
        this.precios = precios;
        console.log('Precios cargados:', this.precios); // Para depuración
      },
      (error) => {
        console.error('Error al cargar precios:', error); // Para depuración
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los precios' });
      }
    );
  }


  updatePrice(precio: Precio) {
    this.precioService.updatePrecio(precio).subscribe(
      (updatedPrecio) => {
        if (updatedPrecio && updatedPrecio.idPrecio) {
          const index = this.precios.findIndex(p => p.idPrecio === updatedPrecio.idPrecio);
          if (index !== -1) {
            this.precios[index] = updatedPrecio;
          }
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Precio actualizado correctamente' });
        } else {
          console.error('El resultado de la actualización es null o no contiene idPrecio');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el precio (resultado null o inválido)' });
        }
      },
      (error) => {
        console.error('Error al actualizar el precio:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el precio' });
      }
    );
  }
  
  

  addSize(nuevoPrecio: Omit<Precio, 'idPrecio'>) {
    this.precioService.addPrecio(nuevoPrecio).subscribe(
      (addedPrecio) => {
        this.precios.push(addedPrecio);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Nueva medida agregada correctamente' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar la nueva medida' });
      }
    );
  }

  deleteSize(id: number) {
    this.precioService.removePrecio(id).subscribe(
      () => {
        this.precios = this.precios.filter(p => p.idPrecio !== id);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Medida eliminada correctamente' });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la medida' });
      }
    );
  }
}
