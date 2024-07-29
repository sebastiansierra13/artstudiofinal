export interface Categoria {
    idCategoria?: number;
    nombreCategoria: string;
    imagenCategoria?: string;
    productos?: ProductoConImagenes[];
  }

export interface Tag{
  idTag: number;
  nombreTag: string;
}
export interface Producto {
  idProducto: number;
  nombreProducto: string;
  idCategoria: number;
  imagenes: string;  // Nota: 'imagenes' en minúscula
  descripcionProducto: string;
  listPrecios: string;
  listTags: string;
  cantVendido?: number;
  posicion?: number;
  destacado?: boolean;
  idCategoriaNavigation?: Categoria;
}

export interface ProductoConImagenes {
  idProducto: number;
  nombreProducto: string;
  idCategoria: number;
  Imagenes: string[];  // Mantenemos 'Imagenes' con mayúscula
  DescripcionProducto: string;
  ListPrecios: string;
  ListTags: string;
  CantVendido?: number;
  posicion?: number;
  destacado?: boolean;
  idCategoriaNavigation?: Categoria;
}
export interface Banner {
    id: number;
    posicion: number;
    url: string;
  }

  export interface Precio {
    idPrecio: number;
    tamanhoPoster: string;
    precioMarco: number;
    precioPoster: number;
  }

  
  export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    options?: { [key: string]: string };
  }


  export interface Region {
    id: number;
    nombre: string;
  }
  
  export interface Departamento {
    id: number;
    nombre: string;
    codigoDane: number;
    regionId: number;
  }
  
  export interface Municipio {
    id: number;
    nombre: string;
    codigoDane: number;
    departamentoId: number;
  }
  

  export function isProducto(item: ProductoConImagenes | Categoria): item is ProductoConImagenes {
    return (item as ProductoConImagenes).nombreProducto !== undefined;
  }