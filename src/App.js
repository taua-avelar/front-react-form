import { useState } from "react";
import "./App.css";

function App() {
  const [pesquisa, setPesquisa] = useState();
  const [tracks, setTracks] = useState([]);
  const [erro, setErro] = useState();
  const [load, setLoad] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoad(true);
    setErro(null);
    try {
      const token = await pegarToken();
      const { tracks } = await pesquisar(pesquisa, token);

      setTracks(tracks.items);
    } catch (error) {
      setErro(error);
    }
    setLoad(false);
  }

  async function pegarToken() {
    const client_ID = "2671afd683ca4da089ccb8653150bdf5";
    const secret_key = "5575fe6e9cbd48e0adeb8d4aa2f999ec";

    const baseURL = (id, secret) =>
      `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${id}&client_secret=${secret}`;

    const response = await fetch(baseURL(client_ID, secret_key), {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });
    const { token_type, access_token } = await response.json();
    return `${token_type} ${access_token}`;
  }

  async function pesquisar(pesquisa, token) {
    const baseURL = `https://api.spotify.com/v1/search?q=${pesquisa}&type=track&limit=10`;

    const response = await fetch(baseURL, {
      headers: {
        Authorization: token,
      },
    });
    return response.json();
  }

  const IMG_SIZES = {
    LARGE: 0,
    MEDIUM: 1,
    SMALL: 2,
  };

  function getAlbumCover(album) {
    return album.images[IMG_SIZES.SMALL].url;
  }

  function getArtistsNames(artists) {
    const artistsNames = artists.map((artist) => artist.name);
    return artistsNames.join(", ");
  }

  function Card({ track }) {
    const { name, album, external_urls, artists } = track;

    return (
      <div className="card">
        <a href={external_urls.spotify}>
          <img src={getAlbumCover(album)} alt={`${name} album cover`} />
        </a>
        <b>{name}</b>- {getArtistsNames(artists)}
      </div>
    );
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name={pesquisa}
          placeholder="Nome da música..."
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>
      {load && <span className="load">Carregando...</span>}
      {erro && <span className="error">{erro}</span>}
      {tracks.length === 0 && (
        <span className="not-found">Nada encontrado</span>
      )}
      {tracks.map((track) => (
        <Card track={track} />
      ))}
    </div>
  );
}

export default App;
