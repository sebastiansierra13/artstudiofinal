import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Categoria, Producto, ProductoConImagenes } from '../interfaces/interfaces-app';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/api/categorias`;
  private apiUrlProductos = `${environment.apiUrl}/api/productos`;

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<{ $id: string, $values: Categoria[] }>(this.apiUrl).pipe(
      map(response => response.$values),
      switchMap(categorias => {
        const categoriasMap = new Map<number, Categoria>();
        categorias.forEach((categoria: Categoria) => {
          if (categoria.idCategoria !== undefined) {
            categoriasMap.set(categoria.idCategoria, {
              ...categoria,
              productos: []
            });
          }
        });

        return this.http.get<{ $id: string, $values: Producto[] }>(this.apiUrlProductos).pipe(
          map(response => {
            return response.$values.map(product => {
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
          }),
          map((productos: ProductoConImagenes[]) => {
            productos.forEach((producto: ProductoConImagenes) => {
              const categoria = categoriasMap.get(producto.idCategoria);
              if (categoria) {
                if (!categoria.productos) {
                  categoria.productos = [];
                }
                categoria.productos.push(producto);
              } else {
                console.warn(`Producto con id ${producto.idProducto} no tiene categoría asociada.`);
              }
            });
            return Array.from(categoriasMap.values());
          })
        );
      })
    );
  }

  getCategoryById(idCategoria: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${idCategoria}`);
  }

  getUltimasCategorias(): Observable<Categoria[]> {
    return this.http.get<{ $values: Categoria[] }>(`${this.apiUrl}/latest`).pipe(
      map(response => response.$values)
    );
  }

  agregarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }
}
