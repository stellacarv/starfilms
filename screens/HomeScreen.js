// screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    const results = await searchMovies(query);
    if (results && results.length > 0) {
      setMovies(results);
    } else {
      setMovies([]);
      setError('Nenhum filme encontrado para a sua pesquisa.');
    }
    setLoading(false);
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('MovieDetails', { imdbID: movie.imdbID, movieTitle: movie.Title });
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />

      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Favorites')}>
          <Ionicons name="heart" size={24} color="#fff" />
          <Text style={styles.buttonText}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Funcionalidade da câmera será implementada na tela de detalhes!')}>
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.buttonText}>Câmera</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={movies}
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
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default HomeScreen;