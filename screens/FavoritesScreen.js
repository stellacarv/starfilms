// screens/FavoritesScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieCard from '../components/MovieCard';
import { useFocusEffect } from '@react-navigation/native'; // Para recarregar a tela quando ela foca

const FavoritesScreen = ({ navigation }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFavorites = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem('@favorite_movies');
      const favorites = jsonValue != null ? JSON.parse(jsonValue) : [];
      setFavoriteMovies(favorites);
    } catch (e) {
      console.error('Erro ao ler favoritos:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getFavorites();
    }, [])
  );

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { imdbID: movie.imdbID, movieTitle: movie.Title });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favoriteMovies.length === 0 ? (
        <Text style={styles.noFavoritesText}>Você ainda não adicionou nenhum filme favorito.</Text>
      ) : (
        <FlatList
          data={favoriteMovies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={handleMoviePress} />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  noFavoritesText: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  listContainer: {
    justifyContent: 'space-between',
  },
});

export default FavoritesScreen;