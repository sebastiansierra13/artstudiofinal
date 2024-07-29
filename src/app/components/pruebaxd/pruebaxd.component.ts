import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService,MessageService, PrimeNGConfig } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OrderListModule } from 'primeng/orderlist';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  Storage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { BannersService } from '../../services/banners.service';



@Component({
  selector: 'app-pruebaxd',
  standalone: true,
  imports: [ButtonModule,ToastModule,ConfirmDialogModule,OrderListModule,FileUploadModule,CommonModule,CdkDropList, CdkDrag, DragDropModule ],
  providers:[ConfirmationService,MessageService,PrimeNGConfig],
  templateUrl: './pruebaxd.component.html',
  styleUrl: './pruebaxd.component.css'
})
export class PruebaxdComponent  {
       banners: string[] = [
  ];
  file: any[] = [];
  pathPhotos: any[] = [];
  imagenes: string[] = [];
  constructor( private serviceBarnner : BannersService ,  private storage: Storage) {}


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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.banners, event.previousIndex, event.currentIndex);
  }




  async addServicio() {
    for (let index = 0; index < this.file.length; index++) {

      const imgRef = ref(
        this.storage,
        `images/Banners/${this.file[index].name}`
      );
      try {
        const response = await uploadBytes(imgRef, this.file[index]);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
