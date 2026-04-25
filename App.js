import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Animated,
  Pressable 
} from 'react-native';

// Baza pitanja (Rečenice)
const INITIAL_QUESTIONS = [
{ normal: "Koliko novca bi ti trebalo da zauvek napustiš posao?", impostor: "Koliko novca bi tražio/la za godinu dana bez rada?" },
{ normal: "Koji kućni posao najčešće izaziva svađe kod tebe?", impostor: "Koji kućni posao najčešće izbegavaš?" },
{ normal: "Koju državu bi izabrao/la da vladaš kao diktator?", impostor: "Koju državu nikad ne bi želeo/la da vodiš?" },
{ normal: "Koliko bivših partnera još ima tvoje stvari?", impostor: "Koliko stvari si zadržao/la od bivših?" },

{ normal: "Šta bi prvo uradio/la da dobiješ milion evra?", impostor: "Šta bi uradio/la sa poslednjih 100 evra?" },
{ normal: "Koju laž najčešće ljudi govore?", impostor: "Koju istinu ljudi najčešće kriju?" },
{ normal: "Koju naviku bi voleo/la da promeniš kod sebe?", impostor: "Koju naviku nikad ne bi promenio/la?" },
{ normal: "Koja je najgluplja kupovina koju si napravio/la?", impostor: "Koja kupovina ti je bila najisplativija?" },

{ normal: "Koliko dugo možeš bez telefona?", impostor: "Koliko često proveravaš telefon?" },
{ normal: "Koji ti je bio najgori prvi utisak o nekome?", impostor: "Koji ti je bio najbolji prvi utisak?" },
{ normal: "Šta bi radio/la da možeš da nestaneš na nedelju dana?", impostor: "Šta bi radio/la da moraš biti stalno dostupan/na?" },
{ normal: "Koju tajnu nikad ne bi otkrio/la?", impostor: "Koju tajnu si već nekome rekao/la?" },

{ normal: "Koji je najčudniji san koji si imao/la?", impostor: "Koji san najčešće sanjaš?" },
{ normal: "Šta te najbrže izbaci iz takta?", impostor: "Šta te najbrže smiri?" },
{ normal: "Koju osobu bi voleo/la da nikad nisi upoznao/la?", impostor: "Koja osoba ti je promenila život?" },
{ normal: "Šta bi uradio/la da znaš da nema posledica?", impostor: "Šta te najviše sprečava da nešto uradiš?" },

{ normal: "Koliko si spreman/na da rizikuješ za uspeh?", impostor: "Koliko izbegavaš rizik?" },
{ normal: "Koji je najgori savet koji si dobio/la?", impostor: "Koji je najbolji savet koji si dobio/la?" },
{ normal: "Šta bi promenio/la u svom detinjstvu?", impostor: "Šta bi zadržao/la iz detinjstva?" },
{ normal: "Koja je tvoja najveća slabost?", impostor: "Koja je tvoja najveća prednost?" },

{ normal: "Šta te najviše motiviše?", impostor: "Šta te najviše demotiviše?" },
{ normal: "Koliko ti je važan novac u životu?", impostor: "Koliko možeš bez novca?" },
{ normal: "Koju grešku stalno ponavljaš?", impostor: "Koju grešku si naučio/la da izbegavaš?" },
{ normal: "Šta bi radio/la da možeš da živiš bez rada?", impostor: "Šta bi radio/la kad moraš da radiš svaki dan?" },

{ normal: "Koju odluku najviše žališ?", impostor: "Koju odluku bi ponovio/la?" },
{ normal: "Šta bi uradio/la da možeš da vratiš vreme?", impostor: "Šta bi uradio/la da ubrzaš vreme?" },
{ normal: "Koliko ti je bitno mišljenje drugih?", impostor: "Koliko ignorišeš mišljenje drugih?" },
{ normal: "Koju osobinu kod ljudi najviše ceniš?", impostor: "Koju osobinu ne podnosiš?" },

{ normal: "Šta bi uradio/la da dobiješ apsolutnu moć?", impostor: "Šta bi uradio/la da nemaš nikakvu kontrolu?" },
{ normal: "Koji je tvoj najveći strah?", impostor: "Šta te najmanje plaši?" },
{ normal: "Šta bi uradio/la da moraš da počneš iz početka?", impostor: "Šta bi zadržao/la iz sadašnjeg života?" },
{ normal: "Koja situacija te najviše posramila?", impostor: "Koja situacija te učinila ponosnim/om?" },

{ normal: "Koliko si spreman/na da se menjaš?", impostor: "Koliko se držiš svojih navika?" },
{ normal: "Šta bi uradio/la da izgubiš sve?", impostor: "Šta bi uradio/la da dobiješ sve?" },
{ normal: "Koji trenutak bi ponovo proživeo/la?", impostor: "Koji trenutak bi izbegao/la?" },
{ normal: "Šta ti najviše nedostaje iz prošlosti?", impostor: "Šta ti ne nedostaje iz prošlosti?" }

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
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [words, setWords] = useState(WORD_DATABASE);
  const [gameMode, setGameMode] = useState('sentences');
  const [players, setPlayers] = useState(["", "", "", ""]);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState('setup'); 
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [impostorIndex, setImpostorIndex] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Stanja za nove unose (Dodaj pitanje/reč)
  const [newNormal, setNewNormal] = useState("");
  const [newImpostor, setNewImpostor] = useState("");

  // Animacija kartice
  const flipAnim = useRef(new Animated.Value(0)).current;
  const handleFlip = (toValue) => {
    Animated.spring(flipAnim, { toValue, friction: 8, useNativeDriver: true }).start();
  };

  // Funkcije za igrače
  const handleNameChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayerField = () => {
    if (players.length < 12) setPlayers([...players, ""]);
    else Alert.alert("Maksimum", "Maksimalno 12 igrača.");
  };

  const removePlayerField = () => {
    if (players.length > 3) {
      const newPlayers = [...players];
      newPlayers.pop();
      setPlayers(newPlayers);
    } else Alert.alert("Minimum", "Minimalno 3 igrača.");
  };

  // Dodavanje u bazu
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
    setNewNormal(""); setNewImpostor("");
    Alert.alert("Uspešno", "Dodato u bazu!");
  };

  // Funkcija za zamenu pitanja (nasumično)
  const pickRandomData = () => {
    const data = gameMode === 'sentences' ? questions : words;
    const randomIndex = Math.floor(Math.random() * data.length);
    setSelectedData(data[randomIndex]);
  };

  const startGame = () => {
    if (players.some(name => name.trim() === "")) {
      Alert.alert("Pažnja", "Popunite imena svih igrača.");
      return;
    }
    pickRandomData();
    setImpostorIndex(Math.floor(Math.random() * players.length));
    setPhase('preview');
  };

  const submitAnswer = () => {
    if (gameMode === 'sentences') {
      if (currentAnswer.trim() === "") {
        Alert.alert("Greška", "Unesi odgovor!");
        return;
      }
      setAnswers([...answers, { name: players[currentPlayerIndex], text: currentAnswer }]);
    }
    
    setCurrentAnswer("");
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setPhase('pass');
    } else {
      setPhase('discussion');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainTitle}>Ko je Impostor?</Text>

      <View style={styles.card}>
        {/* SETUP FAZA */}
        {phase === 'setup' && (
          <View>
            <Text style={styles.phaseTitle}>1. Mod Igre</Text>
            <View style={styles.modeContainer}>
              <TouchableOpacity style={[styles.modeButton, gameMode === 'sentences' && styles.activeMode]} onPress={() => setGameMode('sentences')}>
                <Text style={styles.buttonText}>📝 Rečenice</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeButton, gameMode === 'words' && styles.activeMode]} onPress={() => setGameMode('words')}>
                <Text style={styles.buttonText}>🔑 Reči</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.playerControlRow}>
              <TouchableOpacity style={styles.roundBtn} onPress={removePlayerField}><Text style={styles.buttonText}>-</Text></TouchableOpacity>
              <Text style={styles.playerCount}>{players.length} Igrača</Text>
              <TouchableOpacity style={styles.roundBtn} onPress={addPlayerField}><Text style={styles.buttonText}>+</Text></TouchableOpacity>
            </View>

            {players.map((p, i) => (
              <TextInput key={i} style={styles.input} placeholder={`Igrač ${i+1}`} value={p} onChangeText={t => handleNameChange(i, t)} placeholderTextColor="#94a3b8" />
            ))}
            
            <TouchableOpacity style={styles.buttonPrimary} onPress={startGame}><Text style={styles.buttonText}>Započni</Text></TouchableOpacity>

            <View style={styles.divider} />
            
            <Text style={styles.phaseTitle}>Dodaj svoje</Text>
            <TextInput style={styles.input} placeholder="Normalno / Reč" value={newNormal} onChangeText={setNewNormal} placeholderTextColor="#94a3b8" />
            <TextInput style={styles.input} placeholder="Impostor / Hint" value={newImpostor} onChangeText={setNewImpostor} placeholderTextColor="#94a3b8" />
            <TouchableOpacity style={styles.buttonSecondary} onPress={addNewEntry}><Text style={styles.buttonText}>+ Dodaj u bazu</Text></TouchableOpacity>
          </View>
        )}

        {/* PREVIEW SA ZAMENOM PITANJA */}
        {phase === 'preview' && (
          <View style={styles.center}>
            <Text style={styles.labelNormal}>IZABRANO:</Text>
            <Text style={styles.textNormal}>{gameMode === 'sentences' ? selectedData?.normal : selectedData?.word}</Text>
            <TouchableOpacity style={styles.buttonSecondary} onPress={pickRandomData}>
              <Text style={styles.buttonText}>🔄 Drugo nasumično</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSuccess} onPress={() => {setAnswers([]); setCurrentPlayerIndex(0); setPhase('pass');}}>
              <Text style={styles.buttonText}>Kreni ▶</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PASS DEVICE */}
        {phase === 'pass' && (
          <View style={styles.center}>
            <Text style={styles.passText}>Dodaj mobitel:</Text>
            <Text style={styles.playerNameHighlight}>{players[currentPlayerIndex]}</Text>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => setPhase('answer')}>
              <Text style={styles.buttonText}>Spreman sam</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ODGOVARANJE (SA ANIMACIJOM KARTICE ZA REČI) */}
        {phase === 'answer' && (
          <View style={styles.center}>
            <Text style={styles.phaseTitle}>Igrač: {players[currentPlayerIndex]}</Text>
            
            {gameMode === 'sentences' ? (
              <View style={{width: '100%'}}>
                <View style={styles.questionBox}>
                  <Text style={styles.questionText}>{currentPlayerIndex === impostorIndex ? selectedData?.impostor : selectedData?.normal}</Text>
                </View>
                <TextInput style={styles.textArea} value={currentAnswer} onChangeText={setCurrentAnswer} multiline placeholder="Tvoj odgovor..." placeholderTextColor="#94a3b8" />
                <TouchableOpacity style={styles.buttonSuccess} onPress={submitAnswer}><Text style={styles.buttonText}>Spremi</Text></TouchableOpacity>
              </View>
            ) : (
              <View style={styles.center}>
                <Pressable onPressIn={() => handleFlip(1)} onPressOut={() => handleFlip(0)} style={styles.cardBox}>
                  <Animated.View style={[styles.flipCard, styles.flipFront, { transform: [{ rotateY: flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }]}>
                    <Text style={{fontSize: 50}}>👆</Text>
                    <Text style={{color: '#fff', marginTop: 10}}>Drži da vidiš</Text>
                  </Animated.View>
                  <Animated.View style={[styles.flipCard, styles.flipBack, { transform: [{ rotateY: flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] }) }] }]}>
                    <Text style={styles.labelNormal}>{currentPlayerIndex === impostorIndex ? "HINT:" : "REČ:"}</Text>
                    <Text style={styles.textNormal}>{currentPlayerIndex === impostorIndex ? selectedData?.hint : selectedData?.word}</Text>
                  </Animated.View>
                </Pressable>
                <TouchableOpacity style={styles.buttonSuccess} onPress={submitAnswer}><Text style={styles.buttonText}>Video sam, sledeći</Text></TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* REZULTATI I OTKRIVANJE */}
        {phase === 'discussion' && (
          <View>
            <Text style={styles.textNormal}>{gameMode === 'sentences' ? selectedData?.normal : selectedData?.word}</Text>
            {gameMode === 'sentences' && answers.map((a, i) => (
              <View key={i} style={styles.ansBox}><Text style={styles.ansName}>{a.name}:</Text><Text style={{color: '#fff'}}>"{a.text}"</Text></View>
            ))}
            <TouchableOpacity style={[styles.buttonPrimary, {backgroundColor: '#dc2626'}]} onPress={() => setPhase('reveal')}><Text style={styles.buttonText}>Otkrij Impostora</Text></TouchableOpacity>
          </View>
        )}

        {phase === 'reveal' && (
          <View style={styles.center}>
            <Text style={styles.labelImpostor}>IMPOSTOR JE BIO:</Text>
            <Text style={styles.playerNameHighlight}>{players[impostorIndex]}</Text>
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => setPhase('setup')}><Text style={styles.buttonText}>Igraj ponovo</Text></TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f172a', padding: 20, alignItems: 'center' },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#f97316', marginVertical: 20 },
  card: { backgroundColor: '#1e293b', width: '100%', maxWidth: 400, borderRadius: 15, padding: 20 },
  phaseTitle: { fontSize: 18, color: '#a5b4fc', textAlign: 'center', marginBottom: 15, fontWeight: 'bold' },
  modeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modeButton: { flex: 0.48, padding: 12, backgroundColor: '#334155', borderRadius: 8, alignItems: 'center' },
  activeMode: { backgroundColor: '#6366f1' },
  playerControlRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  roundBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#475569', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 },
  playerCount: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  input: { backgroundColor: '#334155', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 10 },
  buttonPrimary: { backgroundColor: '#6366f1', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonSecondary: { backgroundColor: '#475569', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  buttonSuccess: { backgroundColor: '#16a34a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15, width: '100%' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 20 },
  center: { alignItems: 'center', width: '100%' },
  labelNormal: { color: '#94a3b8', fontSize: 12 },
  textNormal: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  passText: { color: '#fff', fontSize: 20 },
  playerNameHighlight: { color: '#818cf8', fontSize: 32, fontWeight: 'bold', marginVertical: 15 },
  questionBox: { backgroundColor: '#334155', padding: 20, borderRadius: 10, marginBottom: 15 },
  questionText: { color: '#fff', fontSize: 18, textAlign: 'center' },
  textArea: { backgroundColor: '#0f172a', color: '#fff', borderRadius: 8, padding: 15, height: 80 },
  ansBox: { backgroundColor: '#334155', padding: 10, borderRadius: 8, marginBottom: 5, borderLeftWidth: 4, borderLeftColor: '#6366f1' },
  ansName: { color: '#a5b4fc', fontWeight: 'bold' },
  labelImpostor: { color: '#ef4444', fontWeight: 'bold' },
  // STILOVI ZA KARTICU
  cardBox: { width: 220, height: 280, marginVertical: 20 },
  flipCard: { width: '100%', height: '100%', position: 'absolute', backfaceVisibility: 'hidden', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  flipFront: { backgroundColor: '#3b82f6' },
  flipBack: { backgroundColor: '#0f172a', transform: [{ rotateY: '180deg' }], borderWidth: 2, borderColor: '#334155' }
});