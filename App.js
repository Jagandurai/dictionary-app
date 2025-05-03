import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function App() {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDefinition = async () => {
    if (!term) return;
    setLoading(true);
    setError('');
    setDefinition(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
      const data = await response.json();

      if (data.title === 'No Definitions Found') {
        setError('❌ Term not found.');
      } else {
        setDefinition(data[0]);
      }
    } catch (err) {
      setError('⚠️ Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Dictionary App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a term"
        value={term}
        onChangeText={setTerm}
      />
      <Button title="Define" onPress={fetchDefinition} />

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {definition && (
        <ScrollView style={styles.card}>
          <Text style={styles.word}>{definition.word}</Text>
          {definition.meanings.map((meaning, index) => (
            <View key={index}>
              <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
              {meaning.definitions.map((def, i) => (
                <Text key={i} style={styles.definition}>• {def.definition}</Text>
              ))}
              {meaning.synonyms.length > 0 && (
                <Text style={styles.synonyms}>
                  Synonyms: {meaning.synonyms.slice(0, 5).join(', ')}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  error: { color: 'red', marginTop: 20 },
  card: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  word: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  partOfSpeech: { fontStyle: 'italic', marginTop: 10 },
  definition: { marginVertical: 4 },
  synonyms: { color: 'blue', marginTop: 5 },
});
