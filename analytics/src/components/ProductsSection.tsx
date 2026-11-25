import { useState, useEffect } from "react";
import Producto from "./Producto";
import "./ProductsSection.css";

interface ProductoType {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
}

const ProductsSection = () => {
  const [productos, setProductos] = useState<ProductoType[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://lucasferrara015dev.pythonanywhere.com/api/productos"
        );
        if (!response.ok) {
          throw new Error("Error al cargar productos");
        }

        const data = await response.json();
        setProductos(data);

        // 📊 Disparamos view_item_list cuando el catálogo se carga con éxito
        if (data && data.length > 0) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ ecommerce: null }); // Limpiar ecommerce anterior

          window.dataLayer.push({
            event: "view_item_list",
            ecommerce: {
              item_list_id: "catalogo_principal",
              item_list_name: "Catálogo de Productos Fitness",
              items: data.map((p: ProductoType, index: number) => ({
                item_id: String(p.id),
                item_name: p.nombre,
                item_category: p.categoria,
                price: Number(p.precio),
                index: index + 1,
                quantity: 1,
              })),
            },
          });
        }
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

 const productosFiltrados = productos.filter(
    (p) =>
      (categoria === "todas" || p.categoria === categoria) &&
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return <p className="text-center">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">Error: {error}</p>;
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-column text-center mb-5">
        <h4 className="text-primary font-weight-bold">Nuestra Tienda</h4>
        <h4 className="display-4 font-weight-bold">Productos Fitness</h4>
      </div>
      <div className="filtros d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-25 mr-2"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="form-control w-25"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="musculacion">Musculación</option>
          <option value="estructuras">Estructuras</option>
          <option value="suplementos">Suplementos</option>
        </select>
      </div>
      <div className="row">
        {productosFiltrados.map((producto) => (
          <div className="col-lg-4 col-md-6 mb-4" key={producto.id}>
            <Producto producto={producto} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;


