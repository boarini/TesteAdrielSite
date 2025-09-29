import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  
  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setNewPrice(product.price);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setNewPrice("");
  };

  const handleUpdatePrice = async () => {
    try {
      const response = await fetch(
        `https://localhost:5001/api/products/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...selectedProduct,
            price: parseFloat(newPrice),
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        alert(`Erro: ${errorMessage}`);
        return;
      }

      const updatedProduct = await response.json();
      setProducts(
        products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
      setSelectedProduct(updatedProduct);
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar preço:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Produtos</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h3>{product.name}</h3>
            <p>Preço: R$ {product.price}</p>
            <button onClick={() => openModal(product)}>Ver detalhes</button>
          </div>
        ))}
      </div>

      {modalOpen && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>{selectedProduct.name}</h2>
            <p>
              <strong>Descrição:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Preço atual:</strong> R$ {selectedProduct.price}
            </p>
            <label>
              Novo preço:
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button onClick={handleUpdatePrice}>Atualizar preço</button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
