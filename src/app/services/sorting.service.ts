import { Injectable } from '@angular/core';
import { ProductoConImagenes } from '../interfaces/interfaces-app';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  constructor() {}

  private getSortFunction(sortBy: string): (a: ProductoConImagenes, b: ProductoConImagenes) => number {
    const sortFunctions: { [key: string]: (a: ProductoConImagenes, b: ProductoConImagenes) => number } = {
      'nameAsc': (a, b) => (a.nombreProducto || '').localeCompare(b.nombreProducto || ''),
      'nameDesc': (a, b) => (b.nombreProducto || '').localeCompare(a.nombreProducto || ''),
      'popularityDesc': (a, b) => (b.CantVendido || 0) - (a.CantVendido || 0),
      'popularityAsc': (a, b) => (a.CantVendido || 0) - (b.CantVendido || 0)
    };
    return sortFunctions[sortBy] || ((a, b) => 0); // Default no-op sort function
  }

  sortProducts(products: ProductoConImagenes[], sortBy: string): ProductoConImagenes[] {
    const sortedProducts = [...products]; // Create a copy to avoid mutating the original array
    const sortFunction = this.getSortFunction(sortBy);
    return sortedProducts.sort(sortFunction);
  }

  getSortOptions() {
    return [
      { label: 'Nombre (A-Z)', value: 'nameAsc' },
      { label: 'Nombre (Z-A)', value: 'nameDesc' },
      { label: 'Más populares', value: 'popularityDesc' },
      { label: 'Menos populares', value: 'popularityAsc' }
    ];
  }
}
