import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Categoria, Producto, Tag } from '../../interfaces/interfaces-app'; // Asegúrate de tener esta importación correcta
import { ServiceProductService } from '../../services/service-product.service'; 
import { TagService } from '../../services/tag.service';
import { getStorage, ref, uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    InputTextModule, 
    FormsModule, 
    MatDividerModule, 
    ScrollPanelModule, 
    ConfirmDialogModule, 
    ToastModule, 
    FileUploadModule, 
    ButtonModule, 
    CommonModule, 
    BadgeModule, 
    HttpClientModule, 
    ProgressBarModule, 
    MultiSelectModule, 
    DropdownModule, 
    InputTextareaModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @Input() selectedCategory!: Categoria | null;  // Asegúrate de que selectedCategory tenga nombreCategoria
  @Output() closePanel = new EventEmitter<void>();

  categories: Categoria[] = [];
  selectedCategories: Categoria | null = null;

  value: string = '';
  tags: Tag[] = [];
  selectedTags: Tag[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  description: string = '';
  selectedFiles: File[] = [];
  imageUrls: string[] = []; // URLs de las imágenes subidas
  
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productoService: ServiceProductService,
    private tagService: TagService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Inicializamos la categoría seleccionada
    if (this.selectedCategory) {
      this.categories = [this.selectedCategory];
      this.selectedCategories = this.selectedCategory;
    } else {
      console.error('La categoría seleccionada no tiene nombreCategoria', this.selectedCategory);
    }
    this.loadTags();
  }

  loadTags(): void {
    this.tagService.obtenerTags().subscribe({
      next: (tags) => {
        console.log('Tags recibidos del backend:', tags);
        this.tags = tags.map(tag => ({ idTag: tag.idTag, nombreTag: tag.nombreTag }));
        console.log('Tags transformados:', this.tags);
      },
      error: (error) => {
        console.error('Error al cargar los tags', error);
      }
    });
  }

  

  async confirm1(event: Event) {
    if (this.value && this.selectedCategory && this.selectedTags.length && this.description && this.selectedFiles) {
      try {
        const imagenesUrls = await this.uploadImagesToFirebase(this.selectedFiles);
        let imagenesString = JSON.stringify(imagenesUrls);
        const nuevoProducto: Producto = {
          idProducto: 0,
          nombreProducto: this.value,
          idCategoria: this.selectedCategory.idCategoria!,
          listTags: this.selectedTags.map(tag => tag.idTag).join(','),
          descripcionProducto: this.description,      
          imagenes: imagenesString,
          listPrecios: '',
          cantVendido: 0,
          posicion: 0,
          destacado: false,
        };
  
        console.log('Producto a enviar:', nuevoProducto);
  
        this.productoService.agregarProducto(nuevoProducto).subscribe(
          response => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto añadido correctamente' });
            this.closePanel.emit();
            this.cdr.detectChanges();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir el producto' });
            console.error('Error al agregar el producto', error);
            console.error('Detalles del error:', error.error.errors);
          }
        );
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al subir las imágenes', life: 3000 });
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Completa toda la información antes de añadir' });
    }
  }
  

  

async uploadImagesToFirebase(files: File[]): Promise<string[]> {
  const storage = getStorage();
  console.log('Archivos a subir:', files);
  
  const uploadPromises = files.map(async file => {
    const storageRef = ref(storage, `images/Productos/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`Imagen subida: ${file.name}, URL: ${downloadURL}`);
    return downloadURL;
  });

  const imagesArray = await Promise.all(uploadPromises);
  console.log('URLs de las imágenes:', imagesArray);
  return imagesArray;
}


  


  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target!,
      message: '¿Estás seguro de que quieres cancelar?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.closePanel.emit(); 
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Acción cancelada' });
      }
    });
  }


  
  onSelectedFiles(event: any) {
    this.selectedFiles = event.currentFiles;
    console.log('Archivos seleccionados:', this.selectedFiles);
  }
  



  formatSize(size: number): string {
    if (size === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onRemoveTemplatingFile(event: Event, file: any, callback: (index: number) => void, index: number) {
    this.totalSize -= file.size;
    this.totalSizePercent = (this.totalSize / 1000000) * 100;
    callback(index);
  }

  removeCallback(index: number) {
    // Lógica para eliminar el archivo de la lista
  }

  uploadEvent(uploadCallback: any) {
    if (this.totalSize <= 1000000) {
      uploadCallback();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Total file size exceeds the 1MB limit' });
    }
  }
}