import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';

// Baza pitanja (Rečenice)
const INITIAL_QUESTIONS = [
  { normal: "Što najviše voliš jesti za doručak?", impostor: "Što najviše voliš jesti za večeru?" },
  { normal: "Gdje bi najradije otputovao/la na odmor?", impostor: "Gdje bi se sakrio/la u slučaju zombi apokalipse?" },
  { normal: "Koja je po tebi najbolja supermoć?", impostor: "Koja je najbeskorisnija supermoć?" },
  { normal: "Koji ti je omiljeni žanr filmova?", impostor: "Koji žanr filmova ti je najdosadniji?" },
  { normal: "Što bi prvo kupio/la da dobiješ na lutriji?", impostor: "Što bi kupio/la nekome za rođendan u zadnji tren?" },
];

// Baza pojmova (Reči i Hintovi)
const WORD_DATABASE = [
  { word: "Pizza", hint: "sir" }, { word: "Tesla", hint: "struja" }, { word: "Fudbal", hint: "gol" },
  { word: "Pariz", hint: "toranj" }, { word: "Gitara", hint: "žice" }, { word: "Sushi", hint: "riža" },
  { word: "Planinarenje", hint: "vrh" }, { word: "Ajfelov toranj", hint: "visina" }, { word: "Laptop", hint: "ekran" },
  { word: "Kafa", hint: "kofein" }, { word: "Košarka", hint: "obruč" }, { word: "London", hint: "magla" },
  { word: "Čokolada", hint: "kakao" }, { word: "Bicikl", hint: "pedale" }, { word: "Plivanje", hint: "voda" },
  { word: "Apple", hint: "telefon" }, { word: "Burger", hint: "meso" }, { word: "Rim", hint: "istorija" },
  { word: "Tenis", hint: "reket" }, { word: "Pas", hint: "lajanje" }, { word: "Mačka", hint: "prede" },
  { word: "Berlin", hint: "zid" }, { word: "Sladoled", hint: "hladno" }, { word: "Netflix", hint: "serije" },
  { word: "Trčanje", hint: "brzina" }, { word: "Dubai", hint: "luksuz" }, { word: "Pizza Margherita", hint: "bosiljak" },
  { word: "Volleyball", hint: "mreža" }, { word: "Sat", hint: "vrijeme" }, { word: "Instagram", hint: "slike" },
  { word: "Skijanje", hint: "snijeg" }, { word: "Beograd", hint: "Srbija" }, { word: "Palačinke", hint: "namaz" },
  { word: "Auto", hint: "vožnja" }, { word: "YouTube", hint: "video" }, { word: "Ronaldo", hint: "golovi" },
  { word: "Knjiga", hint: "stranice" }, { word: "Teretana", hint: "tegovi" }, { word: "Tokio", hint: "Japan" },
  { word: "Sendvič", hint: "kruh" }, { word: "PlayStation", hint: "igre" }, { word: "Šah", hint: "figure" },
  { word: "Muzej", hint: "eksponati" }, { word: "Čaj", hint: "toplo" }, { word: "Fotoaparat", hint: "slikanje" },
  { word: "More", hint: "valovi" }, { word: "Kampovanje", hint: "šator" }, { word: "Hamburger", hint: "pecivo" },
  { word: "Spotify", hint: "muzika" }, { word: "Avion", hint: "let" }, { word: "Zub", hint: "osmeh" },
  { word: "Kiša", hint: "kišobran" }, { word: "Škola", hint: "učenje" }, { word: "Zlato", hint: "nakit" },
  { word: "Vino", hint: "grožđe" }, { word: "Oceani", hint: "brod" }, { word: "Maraton", hint: "kondicija" }
];

export default function App() {
  // Sva stanja igre
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [words, setWords] = useState(WORD_DATABASE);
  const [gameMode, setGameMode] = useState('sentences'); // 'sentences' ili 'words'
  const [players, setPlayers] = useState(["", "", "", ""]);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState('setup'); 
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [impostorIndex, setImpostorIndex] = useState(null);
  const [selectedData, setSelectedData] = useState(null); // Čuva ili par pitanja ili par reč-hint
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Stanja za nove unose
  const [newNormal, setNewNormal] = useState("");
  const [newImpostor, setNewImpostor] = useState("");

  const handleNameChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayerField = () => {
    if (players.length < 12) setPlayers([...players, ""]);
    else Alert.alert("Maksimum", "Maksimalan broj igrača je 12.");
  };

  const removePlayerField = () => {
    if (players.length > 3) {
      const newPlayers = [...players];
      newPlayers.pop();
      setPlayers(newPlayers);
    } else Alert.alert("Minimum", "Moraju biti bar 3 igrača.");
  };

  const addNewEntry = () => {
    if (newNormal.trim() === "" || newImpostor.trim() === "") {
      Alert.alert("Greška", "Popunite oba polja!");
      return;
    }
    if (gameMode === 'sentences') {
      setQuestions([...questions, { normal: newNormal, impostor: newImpostor }]);
    } else {
      setWords([...words, { word: newNormal, hint: newImpostor }]);
    }
    setNewNormal("");
    setNewImpostor("");
    Alert.alert("Uspešno!", "Dodato u tvoju bazu.");
  };

  const pickRandomData = () => {
    if (gameMode === 'sentences') {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setSelectedData(questions[randomIndex]);
    } else {
      const randomIndex = Math.floor(Math.random() * words.length);
      setSelectedData(words[randomIndex]);
    }
  };

  const startGame = () => {
    if (players.some(name => name.trim() === "")) {
      Alert.alert("Pažnja", "Molim vas, popunite sva imena igrača.");
      return;
    }
    pickRandomData();
    setImpostorIndex(Math.floor(Math.random() * players.length));
    setPhase('preview');
  };

  const confirmAndPlay = () => {
    setAnswers([]);
    setCurrentPlayerIndex(0);
    setPhase('pass');
  };

  const submitAnswer = () => {
    if (currentAnswer.trim() === "") {
      Alert.alert("Greška", "Moraš nešto napisati!");
      return;
    }
    setAnswers([...answers, { name: players[currentPlayerIndex], text: currentAnswer }]);
    setCurrentAnswer("");

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setPhase('pass');
    } else {
      setPhase('discussion');
    }
  };

  const resetGame = () => {
    setPhase('setup');
    setAnswers([]);
    setCurrentAnswer("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Tko je Impostor?</Text>
        <Text style={styles.subtitle}>
          Mod: {gameMode === 'sentences' ? 'Rečenice' : 'Reči i Hintovi'}
        </Text>
      </View>

      <View style={styles.card}>
        
        {/* FAZA 1: SETUP */}
        {phase === 'setup' && (
          <View>
            <Text style={styles.phaseTitle}>1. Izaberi mod igre</Text>
            <View style={styles.modeContainer}>
              <TouchableOpacity 
                style={[styles.modeButton, gameMode === 'sentences' && styles.modeButtonActive]} 
                onPress={() => setGameMode('sentences')}
              >
                <Text style={styles.buttonText}>📝 Rečenice</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modeButton, gameMode === 'words' && styles.modeButtonActive]} 
                onPress={() => setGameMode('words')}
              >
                <Text style={styles.buttonText}>🔑 Reči</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.phaseTitle, { marginTop: 20 }]}>2. Unesite igrače</Text>
            <View style={styles.playerControlRow}>
              <TouchableOpacity style={styles.controlButtonSmall} onPress={removePlayerField}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.playerCountText}>{players.length} igrača</Text>
              <TouchableOpacity style={styles.controlButtonSmall} onPress={addPlayerField}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>

            {players.map((player, idx) => (
              <TextInput
                key={idx}
                style={styles.input}
                placeholder={`Igrač ${idx + 1}`}
                placeholderTextColor="#94a3b8"
                value={player}
                onChangeText={(text) => handleNameChange(idx, text)}
              />
            ))}
            
            <TouchableOpacity style={styles.buttonPrimary} onPress={startGame}>
              <Text style={styles.buttonText}>Započni igru</Text>
            </TouchableOpacity>

            <View style={styles.dividerBox} />

            <Text style={styles.phaseTitle}>3. Dodaj svoj sadržaj (Opciono)</Text>
            <TextInput
              style={styles.input}
              placeholder={gameMode === 'sentences' ? "Normalno pitanje..." : "Reč (npr. Pizza)"}
              placeholderTextColor="#94a3b8"
              value={newNormal}
              onChangeText={setNewNormal}
            />
            <TextInput
              style={styles.input}
              placeholder={gameMode === 'sentences' ? "Impostor pitanje..." : "Hint (npr. Sir)"}
              placeholderTextColor="#94a3b8"
              value={newImpostor}
              onChangeText={setNewImpostor}
            />
            <TouchableOpacity style={styles.buttonSecondary} onPress={addNewEntry}>
              <Text style={styles.buttonText}>+ Dodaj u bazu</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FAZA 1.5: HOST PREVIEW */}
        {phase === 'preview' && (
          <View>
            <Text style={[styles.phaseTitle, { color: '#fbbf24' }]}>Izabran zadatak:</Text>
            <Text style={styles.subtitle}>Samo host gleda! Proveri da li ti se sviđa izbor.</Text>
            
            <View style={styles.revealInfoBox}>
              <Text style={styles.labelNormal}>{gameMode === 'sentences' ? "Normalno:" : "Reč:"}</Text>
              <Text style={styles.textNormal}>{gameMode === 'sentences' ? selectedData?.normal : selectedData?.word}</Text>
              {gameMode === 'words' && (
                <>
                </>
              )}
            </View>

            <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: '#f59e0b', marginTop: 20 }]} onPress={pickRandomData}>
              <Text style={styles.buttonText}>🔄 Drugo nasumično</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.buttonSuccess, { marginTop: 10 }]} onPress={confirmAndPlay}>
              <Text style={styles.buttonText}>Kreni ▶</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FAZA 2: PASS DEVICE */}
        {phase === 'pass' && (
          <View style={styles.centerContent}>
            <Text style={styles.emoji}>🤫</Text>
            <Text style={styles.passText}>Dodaj mobitel igraču:</Text>
            <Text style={styles.playerNameHighlight}>{players[currentPlayerIndex]}</Text>
            <Text style={styles.passSubtext}>Budi diskretan!</Text>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => setPhase('answer')}>
              <Text style={styles.buttonText}>Spreman sam</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FAZA 3: ANSWER */}
        {phase === 'answer' && (
          <View>
            <Text style={styles.phaseTitle}>Za: {players[currentPlayerIndex]}</Text>
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>
                {gameMode === 'sentences' 
                  ? (currentPlayerIndex === impostorIndex ? selectedData?.impostor : selectedData?.normal)
                  : (currentPlayerIndex === impostorIndex ? `TVOJA REČ JE (HINT): ${selectedData?.hint}` : `TVOJA REČ JE: ${selectedData?.word}`)
                }
              </Text>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Odgovori diskretno..."
              placeholderTextColor="#94a3b8"
              value={currentAnswer}
              onChangeText={setCurrentAnswer}
              multiline={true}
            />
            <TouchableOpacity style={styles.buttonSuccess} onPress={submitAnswer}>
              <Text style={styles.buttonText}>Spremi i sakrij</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FAZA 4: DISCUSSION */}
        {phase === 'discussion' && (
          <View>
            <Text style={[styles.phaseTitle, { color: '#fbbf24' }]}>Vreme je za detektivski rad!</Text>
            <Text style={styles.subtitle}>Pročitajte odgovore i otkrijte uljeza.</Text>
            
            {answers.map((ans, idx) => (
              <View key={idx} style={styles.answerBox}>
                <Text style={styles.answerName}>{ans.name}:</Text>
                <Text style={styles.answerText}>"{ans.text}"</Text>
              </View>
            ))}

            <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: '#dc2626', marginTop: 20 }]} onPress={() => setPhase('reveal')}>
              <Text style={styles.buttonText}>Otkrij Impostora</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FAZA 5: REVEAL */}
        {phase === 'reveal' && (
          <View style={styles.centerContent}>
            <Text style={styles.revealTitle}>IMPOSTOR JE BIO...</Text>
            <View style={styles.impostorBox}>
              <Text style={styles.impostorName}>{players[impostorIndex]}</Text>
            </View>

            <View style={styles.revealInfoBox}>
              {gameMode === 'sentences' ? (
                <>
                  <Text style={styles.labelNormal}>Normalno pitanje:</Text>
                  <Text style={styles.textNormal}>{selectedData?.normal}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.labelImpostor}>Impostorovo pitanje:</Text>
                  <Text style={styles.textImpostor}>{selectedData?.impostor}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.labelNormal}>Glavna reč:</Text>
                  <Text style={styles.textNormal}>{selectedData?.word}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.labelImpostor}>Hint koji je Impostor video:</Text>
                  <Text style={styles.textImpostor}>{selectedData?.hint}</Text>
                </>
              )}
            </View>

            <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: '#475569', marginTop: 20 }]} onPress={resetGame}>
              <Text style={styles.buttonText}>Igraj ponovo</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f172a', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 15 },
  header: { alignItems: 'center', marginBottom: 20 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#f97316', textAlign: 'center' },
  subtitle: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 5, marginBottom: 10 },
  card: { backgroundColor: '#1e293b', width: '100%', maxWidth: 400, borderRadius: 15, padding: 20, elevation: 5 },
  phaseTitle: { fontSize: 18, fontWeight: 'bold', color: '#a5b4fc', textAlign: 'center', marginBottom: 10 },
  modeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  modeButton: { padding: 12, borderRadius: 8, backgroundColor: '#334155', borderWidth: 1, borderColor: '#475569', flex: 0.45, alignItems: 'center' },
  modeButtonActive: { backgroundColor: '#6366f1', borderColor: '#818cf8' },
  playerControlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, backgroundColor: '#334155', padding: 10, borderRadius: 8 },
  playerCountText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  controlButtonSmall: { backgroundColor: '#475569', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: '#334155', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  buttonPrimary: { backgroundColor: '#6366f1', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonSecondary: { backgroundColor: '#8b5cf6', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  buttonSuccess: { backgroundColor: '#16a34a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  dividerBox: { height: 1, backgroundColor: '#334155', marginVertical: 20 },
  centerContent: { alignItems: 'center', paddingVertical: 10 },
  emoji: { fontSize: 50, marginBottom: 10 },
  passText: { fontSize: 20, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  playerNameHighlight: { fontSize: 26, color: '#818cf8', fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
  passSubtext: { color: '#94a3b8', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  questionBox: { backgroundColor: '#334155', padding: 20, borderRadius: 10, marginBottom: 15 },
  questionText: { fontSize: 18, color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  textArea: { backgroundColor: '#0f172a', color: '#fff', borderRadius: 8, padding: 15, fontSize: 16, height: 100, textAlignVertical: 'top' },
  answerBox: { backgroundColor: '#334155', padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#6366f1' },
  answerName: { color: '#a5b4fc', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  answerText: { color: '#fff', fontSize: 15, fontStyle: 'italic' },
  revealTitle: { fontSize: 24, fontWeight: 'bold', color: '#ef4444', marginBottom: 10 },
  impostorBox: { backgroundColor: 'rgba(127, 29, 29, 0.4)', borderColor: '#ef4444', borderWidth: 1, padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 15 },
  impostorName: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  revealInfoBox: { backgroundColor: '#334155', padding: 15, borderRadius: 10, width: '100%' },
  labelNormal: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  textNormal: { color: '#fff', fontSize: 16, marginTop: 5, marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#475569', marginVertical: 10 },
  labelImpostor: { color: '#f87171', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  textImpostor: { color: '#fecaca', fontSize: 16, marginTop: 5 }
});