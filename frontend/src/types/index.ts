// ─── Enums ────────────────────────────────────────────────────────────────────

export type Rol = 'ADMIN' | 'USER';
export type EstadoProducto = 'ACTIVO' | 'INACTIVO' | 'AGOTADO';
export type EstadoPedido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'ENVIADO'
  | 'ENTREGADO'
  | 'CANCELADO';

// ─── Entidades ────────────────────────────────────────────────────────────────

export interface Usuario {
  id:        number;
  nombre:    string;
  apellido:  string;
  email:     string;
  telefono?: string;
  rol:       Rol;
  activo:    boolean;
  createdAt: string;
}

export interface Categoria {
  id:          number;
  nombre:      string;
  slug:        string;
  descripcion?: string;
  icono?:      string;
}

export interface Producto {
  id:           number;
  nombre:       string;
  descripcion?: string;
  precio:       number;
  precioOferta?: number;
  stock:        number;
  imagen?:      string;
  imagenes?:    string[];
  marca?:       string;
  modelo?:      string;
  material?:    string;
  color?:       string;
  categoriaId:  number;
  categoria:    Categoria;
  estado:       EstadoProducto;
  destacado:    boolean;
  createdAt:    string;
}

export interface CarritoItem {
  id:        number;
  carritoId: number;
  productoId: number;
  cantidad:  number;
  producto:  Pick<Producto, 'id' | 'nombre' | 'precio' | 'precioOferta' | 'imagen' | 'stock' | 'estado'>;
}

export interface Carrito {
  id:        number;
  usuarioId: number;
  items:     CarritoItem[];
}

export interface PedidoItem {
  id:        number;
  productoId: number;
  cantidad:  number;
  precioUnit: number;
  subtotal:  number;
  producto:  Pick<Producto, 'id' | 'nombre' | 'imagen'>;
}

export interface Pedido {
  id:        number;
  usuarioId: number;
  total:     number;
  estado:    EstadoPedido;
  direccion?: string;
  ciudad?:   string;
  telefono?: string;
  notas?:    string;
  createdAt: string;
  usuario:   Pick<Usuario, 'id' | 'nombre' | 'apellido' | 'email'>;
  items:     PedidoItem[];
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token:   string;
  usuario: Usuario;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data:    T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data:    T[];
  meta: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  };
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export interface ProductoFormData {
  nombre:       string;
  descripcion?: string;
  precio:       number;
  precioOferta?: number;
  stock:        number;
  marca?:       string;
  modelo?:      string;
  material?:    string;
  color?:       string;
  categoriaId:  number;
  estado?:      EstadoProducto;
  destacado?:   boolean;
}
