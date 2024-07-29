import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { InstagramService } from '../../services/instagram.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home-conecta-creatividad',
  standalone: true,
  imports: [ImageModule, CommonModule],
  templateUrl: './home-conecta-creatividad.component.html',
  styleUrls: ['./home-conecta-creatividad.component.css']
})
export class HomeConectaCreatividadComponent implements OnInit {
  instagramPosts: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private instagramService: InstagramService
  ) {}

  ngOnInit() {
    this.loadInstagramPosts();
  }

  loadInstagramPosts() {
    this.isLoading = true;
    this.error = null;
    this.instagramService.getLatestPosts().subscribe(
      (posts: any[]) => {
        console.log('Respuesta completa:', posts);
        if (Array.isArray(posts)) {
          console.log('Posts recibidos:', posts);
          this.instagramPosts = posts;
        } else {
          console.error('La respuesta no es un array:', posts);
          this.error = 'Formato de respuesta inesperado';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al cargar posts de Instagram:', error);
        this.error = 'No se pudieron cargar las publicaciones. Por favor, intenta más tarde.';
        this.isLoading = false;
      }
    );
  }  

  initiateInstagramAuth() {
    this.instagramService.initiateInstagramAuth();
  }
}
