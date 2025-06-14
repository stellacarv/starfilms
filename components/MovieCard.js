// components/MovieCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const MovieCard = ({ movie, onPress }) => {
  const imageUrl = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x220?text=No+Poster';

  return (
    <TouchableOpacity onPress={() => onPress(movie)} style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.poster} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{movie.Title}</Text>
        <Text style={styles.year}>{movie.Year}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#333',
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 5,
    overflow: 'hidden',
    width: 150, // Tamanho fixo para o card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poster: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default MovieCard;