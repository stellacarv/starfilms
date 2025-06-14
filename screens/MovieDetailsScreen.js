// screens/MovieDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMovieDetails } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const MovieDetailsScreen = ({ route, navigation }) => {
  const { imdbID } = route.params;
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const details = await getMovieDetails(imdbID);
      setMovieDetails(details);
      await checkFavoriteStatus(details);
      setLoading(false);
    };

    fetchDetails();
    requestPermissions(); // Solicitar permissões da câmera e galeria ao carregar a tela
  }, [imdbID]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraStatus === 'granted');

    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(galleryStatus === 'granted');
  };

  const checkFavoriteStatus = async (movie) => {
    try {
      const jsonValue = await AsyncStorage.getItem('@favorite_movies');
      const favorites = jsonValue != null ? JSON.parse(jsonValue) : [];
      const found = favorites.some((favMovie) => favMovie.imdbID === movie.imdbID);
      setIsFavorite(found);
    } catch (e) {
      console.error('Erro ao verificar status de favorito:', e);
    }
  };

  const toggleFavorite = async () => {
    try {
      let favorites = [];
      const jsonValue = await AsyncStorage.getItem('@favorite_movies');
      if (jsonValue != null) {
        favorites = JSON.parse(jsonValue);
      }

      if (isFavorite) {
        // Remover dos favoritos
        const updatedFavorites = favorites.filter((favMovie) => favMovie.imdbID !== movieDetails.imdbID);
        await AsyncStorage.setItem('@favorite_movies', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
        Alert.alert('Sucesso', 'Filme removido dos favoritos!');
      } else {
        // Adicionar aos favoritos
        favorites.push({
          imdbID: movieDetails.imdbID,
          Title: movieDetails.Title,
          Year: movieDetails.Year,
          Poster: movieDetails.Poster,
        });
        await AsyncStorage.setItem('@favorite_movies', JSON.stringify(favorites));
        setIsFavorite(true);
        Alert.alert('Sucesso', 'Filme adicionado aos favoritos!');
      }
    } catch (e) {
      console.error('Erro ao alternar favorito:', e);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar/remover o filme.');
    }
  };

  const openCamera = async () => {
    if (cameraPermission) {
      // Abre a câmera para tirar uma foto
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert('Foto Tirada!', `Foto salva em: ${result.assets[0].uri}`);
        // Você pode fazer algo com a URI da imagem aqui, como exibi-la ou enviá-la para um servidor.
      }
    } else {
      Alert.alert('Permissão Negada', 'Você precisa conceder permissão de câmera para usar esta funcionalidade.');
    }
  };

  const openGallery = async () => {
    if (galleryPermission) {
      // Abre a galeria para selecionar uma imagem
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert('Imagem Selecionada!', `Imagem selecionada de: ${result.assets[0].uri}`);
        // Você pode fazer algo com a URI da imagem aqui.
      }
    } else {
      Alert.alert('Permissão Negada', 'Você precisa conceder permissão de galeria para usar esta funcionalidade.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Não foi possível carregar os detalhes do filme.</Text>
      </View>
    );
  }

  const imageUrl = movieDetails.Poster && movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.poster} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{movieDetails.Title}</Text>
        <Text style={styles.subtitle}>{movieDetails.Year} • {movieDetails.Runtime} • {movieDetails.Genre}</Text>
        <Text style={styles.rating}>IMDb Rating: {movieDetails.imdbRating}</Text>
        <Text style={styles.plot}>{movieDetails.Plot}</Text>
        <Text style={styles.detailText}>**Diretor:** {movieDetails.Director}</Text>
        <Text style={styles.detailText}>**Escritor:** {movieDetails.Writer}</Text>
        <Text style={styles.detailText}>**Atores:** {movieDetails.Actors}</Text>
        <Text style={styles.detailText}>**Prêmios:** {movieDetails.Awards}</Text>

        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={30} color={isFavorite ? 'red' : '#fff'} />
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Text>
        </TouchableOpacity>

        <View style={styles.cameraButtons}>
          <TouchableOpacity onPress={openCamera} style={styles.cameraButton}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.cameraButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery} style={styles.cameraButton}>
            <Ionicons name="images" size={24} color="#fff" />
            <Text style={styles.cameraButtonText}>Escolher da Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for rating
    marginBottom: 10,
  },
  plot: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    justifyContent: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cameraButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A057F', // Purple
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  cameraButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default MovieDetailsScreen;