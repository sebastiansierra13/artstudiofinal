import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, catchError, throwError } from 'rxjs';
import { Producto, ProductoConImagenes } from '../interfaces/interfaces-app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductService {
  private apiUrl = `${environment.apiUrl}/api/productos`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductoConImagenes[]> {
    return this.http.get<{ $id: string, $values: Producto[] }>(this.apiUrl).pipe(
      map(response => {
        const products = response.$values.map(product => {
          let imagenes: string[] = [];
          try {
            if (product.imagenes) {  // Nota: 'imagenes' en minúscula
              imagenes = JSON.parse(product.imagenes);
            } else {
              console.warn(`Imagenes field is empty or undefined for product ${product.idProducto}`);
            }
          } catch (e) {
            console.error(`Error parsing imagenes for product ${product.idProducto}:`, e);
          }
          return {
            idProducto: product.idProducto,
            nombreProducto: product.nombreProducto,
            idCategoria: product.idCategoria,
            Imagenes: imagenes,  // Aquí usamos 'Imagenes' con mayúscula para coincidir con tu interfaz
            DescripcionProducto: product.descripcionProducto,
            ListPrecios: product.listPrecios,
            ListTags: product.listTags,
            CantVendido: product.cantVendido,
            posicion: product.posicion,
            destacado: product.destacado,
            idCategoriaNavigation: product.idCategoriaNavigation
          } as ProductoConImagenes;
        });
        console.log('Productos recibidos:', products);
        return products;
      })
    );
  }

  getUltimosProductos(): Observable<ProductoConImagenes[]> {
    return this.http.get<{ $id: string, $values: Producto[] }>(`${this.apiUrl}/ultimos`).pipe(
      map(response => {
        const products = response.$values.map(product => {
          let imagenes: string[] = [];
          try {
            if (product.imagenes) {  // Nota: 'imagenes' en minúscula
              imagenes = JSON.parse(product.imagenes);
            } else {
              console.warn(`Imagenes field is empty or undefined for product ${product.idProducto}`);
            }
          } catch (e) {
            console.error(`Error parsing imagenes for product ${product.idProducto}:`, e);
          }
          return {
            idProducto: product.idProducto,
            nombreProducto: product.nombreProducto,
            idCategoria: product.idCategoria,
            Imagenes: imagenes,  // Aquí usamos 'Imagenes' con mayúscula para coincidir con tu interfaz
            DescripcionProducto: product.descripcionProducto,
            ListPrecios: product.listPrecios,
            ListTags: product.listTags,
            CantVendido: product.cantVendido,
            posicion: product.posicion,
            destacado: product.destacado,
            idCategoriaNavigation: product.idCategoriaNavigation
          } as ProductoConImagenes;
        });
        console.log('Últimos productos recibidos:', products);
        return products;
      })
    );
  }
  
  
  

  agregarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  eliminarProducto(idProducto: number): Observable<void> {
    const url = `${this.apiUrl}/${idProducto}`;
    return this.http.delete<void>(url);
  }

  actualizarProducto(producto: Producto): Observable<Producto> {
    const url = `${this.apiUrl}/${producto.idProducto}`;
    console.log('Datos enviados:', producto);
    return this.http.put<Producto>(url, producto).pipe(
      catchError(error => {
        console.error('Error actualizando el producto', error);
        return throwError(error);
      })
    );
  }

  getProductByID(idProducto: number): Observable<ProductoConImagenes> {
    const url = `${this.apiUrl}/${idProducto}`;
    return this.http.get<Producto>(url).pipe(
      map(product => this.convertToProductoConImagenes(product))
    );
  }

  private convertToProductoConImagenes(product: Producto): ProductoConImagenes {
    let imagenes: string[] = [];
    try {
      if (product.imagenes) {
        imagenes = JSON.parse(product.imagenes);
      }
    } catch (e) {
      console.error(`Error parsing imagenes for product ${product.idProducto}:`, e);
    }

    return {
      idProducto: product.idProducto,
      nombreProducto: product.nombreProducto,
      idCategoria: product.idCategoria,
      Imagenes: imagenes,
      DescripcionProducto: product.descripcionProducto,
      ListPrecios: product.listPrecios,
      ListTags: product.listTags,
      CantVendido: product.cantVendido,
      posicion: product.posicion,
      destacado: product.destacado,
      idCategoriaNavigation: product.idCategoriaNavigation
    };
  }


  getProductsByCategory(idCategoria: number): Observable<ProductoConImagenes[]> {
    return this.http.get<{ $id: string, $values: Producto[] }>(`${this.apiUrl}/categoria/${idCategoria}`).pipe(
      map(response => {
        const products = response.$values.map(product => {
          let imagenes: string[] = [];
          try {
            if (product.imagenes) {
              imagenes = JSON.parse(product.imagenes);
            } else {
              console.warn(`Imagenes field is empty or undefined for product ${product.idProducto}`);
            }
          } catch (e) {
            console.error(`Error parsing imagenes for product ${product.idProducto}:`, e);
          }
          return {
            idProducto: product.idProducto,
            nombreProducto: product.nombreProducto,
            idCategoria: product.idCategoria,
            Imagenes: imagenes,
            DescripcionProducto: product.descripcionProducto,
            ListPrecios: product.listPrecios,
            ListTags: product.listTags,
            CantVendido: product.cantVendido,
            posicion: product.posicion,
            destacado: product.destacado,
            idCategoriaNavigation: product.idCategoriaNavigation
          } as ProductoConImagenes;
        });
        console.log('Productos recibidos:', products);
        return products;
      })
    );
  }

  getHighlightedProducts(): Observable<Producto[]> {
    const url = `${this.apiUrl}/destacados`;
    return this.http.get<Producto[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching highlighted products', error);
        return throwError(error);
      })
    );
  }

  updateProductPositions(updates: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-positions`, updates).pipe(
      catchError(error => {
        console.error('Error actualizando posiciones de productos', error);
        return throwError(error);
      })
    );
  }

  updateHighlightedProducts(products: ProductoConImagenes[]): Observable<any> {
    const updates = products.map(product => this.actualizarProducto({
      idProducto: product.idProducto,
      nombreProducto: product.nombreProducto,
      idCategoria: product.idCategoria,
      imagenes: JSON.stringify(product.Imagenes),
      descripcionProducto: product.DescripcionProducto,
      listPrecios: product.ListPrecios,
      listTags: product.ListPrecios,
      cantVendido: product.CantVendido,
      posicion: product.posicion,
      destacado: product.destacado,
      idCategoriaNavigation: product.idCategoriaNavigation
    }));
    return forkJoin(updates);
  }
  
}
