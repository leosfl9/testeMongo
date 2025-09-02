"use client"

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [images, setImages] = useState([]);

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    if (!reader.result) return;
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];

      const res = await fetch("/api/upload/route.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      });

      const data = await res.json();
      setUrl(data.url);

      // atualizar lista de imagens
      fetchImages();
    };
    reader.readAsDataURL(file);
  };

  const fetchImages = async () => {
    const res = await fetch("/api/images");
    const data = await res.json();
    setImages(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload de Imagens</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="bg-blue-500 px-5 py-2" onClick={handleUpload}>Enviar</button>

      {url && (
        <div>
          <h3>Última imagem enviada:</h3>
          <img src={url} alt="uploaded" width="200" />
        </div>
      )}

      <hr />
      <button onClick={fetchImages}>Carregar todas imagens</button>
      <div>
        {images.map((img) => (
          <img key={img._id} src={img.url} alt="img" width="150" style={{ margin: 10 }} />
        ))}
      </div>
    </div>
  );
}
