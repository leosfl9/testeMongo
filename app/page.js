"use client"

import { useState } from "react";

export default function Home() {
  // inicializa as variaveis com seus estados iniciais
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [images, setImages] = useState([]);

  const handleUpload = async () => {
    // se nao tiver nenhum arquivo sendo enviado, nao faz nada
    if (!file) return;

    // inicializa um leitor de arquivos, que lê blobs nesse caso
    const reader = new FileReader();

    // executa essa função assim que o reader ler um arquivo
    reader.onloadend = async () => {
      // o reader formata o arquivo em metadados e um codigo em base64, queremos apenas o codigo
      const base64 = reader.result.split(",")[1];

      // envia a imagem para a funcao de upload da api
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      });

      // exibe a ultima imagem enviada
      const data = await res.json();
      setUrl(data.url);

      // atualizar lista de imagens
      fetchImages();
    };
    // le a url do arquivo
    reader.readAsDataURL(file);
  };

  // chama a api para retornar as imagens
  const fetchImages = async () => {
    const res = await fetch("/api/images");
    const data = await res.json();
    // seta a variavel images com os dados das imagens
    setImages(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload de Imagens</h1>
      {/* o input abaixo, ao ser alterado, altera a variavel file, e coloca nela o arquivo selecionado */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      {/* no clique, o botao chama a funcao para fazer upload */}
      <button className="bg-blue-500 px-5 py-2 hover:bg-blue-300 hover:cursor-pointer" onClick={handleUpload}>Enviar</button>

      {/* tendo uma url armazenada na variavel url, utiliza ela no src da img */}
      {url && (
        <div>
          <h3>Última imagem enviada:</h3>
          <img src={url} alt="uploaded" width="200" />
        </div>
      )}

      <hr />
      {/* ao clicar no botao de carregar as imagens, chama a funcao que carrega-as */}
      <button onClick={fetchImages}>Carregar todas imagens</button>
      <div>
        {/* utiliza o map no array de imagens, usando como key o id de cada uma, e src a url */}
        {images.map((img) => (
          <img key={img._id} src={img.url} alt="img" width="150" style={{ margin: 10 }} />
        ))}
      </div>
    </div>
  );
}
