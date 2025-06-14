// services/api.js
import axios from 'axios';

const API_KEY = 'aa1e1ddd'; // Sua chave da OMDb API
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}?s=${query}&apikey=${API_KEY}`);
    if (response.data.Response === 'True') {
      return response.data.Search;
    } else {
      return []; // Retorna um array vazio se não houver resultados
    }
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
};

export const getMovieDetails = async (imdbID) => {
  try {
    const response = await axios.get(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
    if (response.data.Response === 'True') {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    return null;
  }
};