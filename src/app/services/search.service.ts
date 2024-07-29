// search.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ServiceProductService } from './service-product.service';
import { CategoriaService } from './categoria.service';
import { ProductoConImagenes, Categoria } from '../interfaces/interfaces-app';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private productService: ServiceProductService,
    private categoriaService: CategoriaService
  ) {}

  search(query: string): Observable<(ProductoConImagenes | Categoria)[]> {
    return this.productService.getProducts().pipe(
      switchMap(products => {
        const matchingProducts = products.filter(product =>
          this.matchesSearch(product.nombreProducto, query) ||
          this.matchesSearch(product.DescripcionProducto, query) ||
          (product.ListTags && product.ListTags.split(',').some(tag => this.matchesSearch(tag.trim(), query)))
        );

        return this.categoriaService.getCategorias().pipe(
          map(categories => {
            const matchingCategories = categories.filter(category =>
              this.matchesSearch(category.nombreCategoria, query)
            );

            return [...matchingProducts, ...matchingCategories];
          })
        );
      })
    );
  }

  private matchesSearch(text: string, query: string): boolean {
    return text.toLowerCase().includes(query.toLowerCase());
  }
}