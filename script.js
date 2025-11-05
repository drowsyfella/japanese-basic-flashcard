/*
  Japanese N5 Flashcard - Behavior
  - Loads flashcards from JSON file
  - Renders a single card with front/back
  - Click or press Space to reveal English text
  - Continue button to move to next card
  - Previous/Next navigation
  - Accessibility: keyboard operable, aria-live updates, lang for Japanese
*/

// --- Flashcard data (loaded from external JSON) ---
// Offline/file:// fallback so the app works without a local server
const embeddedFlashcards = [
  { jp: "こんにちは", romaji: "konnichiwa", en: "hello", jaExample: "こんにちは、元気ですか。", example: "Hello, how are you?" },
  { jp: "ありがとう", romaji: "arigatou", en: "thank you", jaExample: "ありがとう、助かりました。", example: "Thank you, that helped." },
  { jp: "すみません", romaji: "sumimasen", en: "excuse me / sorry", jaExample: "すみません、道を聞いてもいいですか。", example: "Excuse me, may I ask the way?" },
  { jp: "お願いします", romaji: "onegaishimasu", en: "please", jaExample: "水をお願いします。", example: "Water, please." },
  { jp: "はい", romaji: "hai", en: "yes", jaExample: "はい、わかりました。", example: "Yes, I understand." },
  { jp: "いいえ", romaji: "iie", en: "no", jaExample: "いいえ、違います。", example: "No, that’s not right." },
  { jp: "おはようございます", romaji: "ohayou gozaimasu", en: "good morning", jaExample: "おはようございます。", example: "Good morning." },
  { jp: "こんばんは", romaji: "konbanwa", en: "good evening", jaExample: "こんばんは、いい天気ですね。", example: "Good evening, nice weather." },
  { jp: "さようなら", romaji: "sayounara", en: "goodbye", jaExample: "さようなら、また明日。", example: "Goodbye, see you tomorrow." },
  { jp: "水", romaji: "mizu", en: "water", jaExample: "水を飲みます。", example: "I drink water." },
  { jp: "お茶", romaji: "ocha", en: "tea", jaExample: "お茶をください。", example: "Please give me tea." },
  { jp: "コーヒー", romaji: "koohii", en: "coffee", jaExample: "コーヒーを飲みます。", example: "I drink coffee." },
  { jp: "ビール", romaji: "biiru", en: "beer", jaExample: "ビールをください。", example: "Beer, please." },
  { jp: "食べる", romaji: "taberu", en: "to eat", jaExample: "寿司を食べます。", example: "I eat sushi." },
  { jp: "飲む", romaji: "nomu", en: "to drink", jaExample: "水を飲みます。", example: "I drink water." },
  { jp: "行く", romaji: "iku", en: "to go", jaExample: "東京へ行きます。", example: "I go to Tokyo." },
  { jp: "来る", romaji: "kuru", en: "to come", jaExample: "友だちが来ます。", example: "My friend is coming." },
  { jp: "見る", romaji: "miru", en: "to see / watch", jaExample: "映画を見ます。", example: "I watch a movie." },
  { jp: "買う", romaji: "kau", en: "to buy", jaExample: "お土産を買いました。", example: "I bought souvenirs." },
  { jp: "行き方", romaji: "ikikata", en: "way to go / directions", jaExample: "駅への行き方を教えてください。", example: "Please tell me how to get to the station." },
  { jp: "どこ", romaji: "doko", en: "where", jaExample: "トイレはどこですか。", example: "Where is the toilet?" },
  { jp: "トイレ", romaji: "toire", en: "toilet", jaExample: "トイレはあちらです。", example: "The toilet is over there." },
  { jp: "駅", romaji: "eki", en: "station", jaExample: "駅はどこですか。", example: "Where is the station?" },
  { jp: "ホテル", romaji: "hoteru", en: "hotel", jaExample: "ホテルに泊まります。", example: "I stay at a hotel." },
  { jp: "レストラン", romaji: "resutoran", en: "restaurant", jaExample: "レストランで食べます。", example: "I eat at a restaurant." },
  { jp: "メニュー", romaji: "menyuu", en: "menu", jaExample: "メニューを見せてください。", example: "Please show me the menu." },
  { jp: "いくら", romaji: "ikura", en: "how much", jaExample: "これはいくらですか。", example: "How much is this?" },
  { jp: "高い", romaji: "takai", en: "expensive", jaExample: "これは高いです。", example: "This is expensive." },
  { jp: "安い", romaji: "yasui", en: "cheap", jaExample: "安いレストランが好きです。", example: "I like cheap restaurants." },
  { jp: "ください", romaji: "kudasai", en: "please give me", jaExample: "これをください。", example: "Please give me this." },
  { jp: "くださいませんか", romaji: "kudasaimasen ka", en: "could you please", jaExample: "写真を撮ってくださいませんか。", example: "Could you take a photo, please?" },
  { jp: "写真", romaji: "shashin", en: "photo", jaExample: "写真を撮ります。", example: "I take a photo." },
  { jp: "地図", romaji: "chizu", en: "map", jaExample: "地図を見ます。", example: "I look at the map." },
  { jp: "空港", romaji: "kuukou", en: "airport", jaExample: "空港へ行きます。", example: "I go to the airport." },
  { jp: "飛行機", romaji: "hikouki", en: "airplane", jaExample: "飛行機で大阪へ行きます。", example: "I go to Osaka by plane." },
  { jp: "電車", romaji: "densha", en: "train", jaExample: "電車に乗ります。", example: "I take the train." },
  { jp: "バス", romaji: "basu", en: "bus", jaExample: "バスで行きます。", example: "I go by bus." },
  { jp: "タクシー", romaji: "takushii", en: "taxi", jaExample: "タクシーを呼んでください。", example: "Please call a taxi." },
  { jp: "切符", romaji: "kippu", en: "ticket", jaExample: "切符を買います。", example: "I buy a ticket." },
  { jp: "お金", romaji: "okane", en: "money", jaExample: "お金を払います。", example: "I pay money." },
  { jp: "円", romaji: "en", en: "yen", jaExample: "これは千円です。", example: "This is 1000 yen." },
  { jp: "カード", romaji: "kaado", en: "card", jaExample: "カードで払えますか。", example: "Can I pay by card?" },
  { jp: "現金", romaji: "genkin", en: "cash", jaExample: "現金で払います。", example: "I’ll pay in cash." },
  { jp: "トイレ", romaji: "toire", en: "toilet", jaExample: "トイレはありますか。", example: "Is there a toilet?" },
  { jp: "道", romaji: "michi", en: "road / way", jaExample: "道を渡ります。", example: "I cross the road." },
  { jp: "右", romaji: "migi", en: "right", jaExample: "右に曲がってください。", example: "Please turn right." },
  { jp: "左", romaji: "hidari", en: "left", jaExample: "左に行きます。", example: "Go left." },
  { jp: "まっすぐ", romaji: "massugu", en: "straight", jaExample: "まっすぐ行ってください。", example: "Go straight ahead." },
  { jp: "前", romaji: "mae", en: "front", jaExample: "駅の前です。", example: "It’s in front of the station." },
  { jp: "後ろ", romaji: "ushiro", en: "behind", jaExample: "ホテルの後ろにあります。", example: "It’s behind the hotel." },
  { jp: "ここ", romaji: "koko", en: "here", jaExample: "ここは渋谷です。", example: "This is Shibuya." },
  { jp: "そこ", romaji: "soko", en: "there", jaExample: "そこにあります。", example: "It’s there." },
  { jp: "あそこ", romaji: "asoko", en: "over there", jaExample: "あそこです。", example: "It’s over there." },
  { jp: "今", romaji: "ima", en: "now", jaExample: "今行きます。", example: "I’m going now." },
  { jp: "時間", romaji: "jikan", en: "time", jaExample: "時間がありますか。", example: "Do you have time?" },
  { jp: "今日", romaji: "kyou", en: "today", jaExample: "今日はいい天気です。", example: "It’s nice weather today." },
  { jp: "明日", romaji: "ashita", en: "tomorrow", jaExample: "明日京都へ行きます。", example: "I’ll go to Kyoto tomorrow." },
  { jp: "昨日", romaji: "kinou", en: "yesterday", jaExample: "昨日、寿司を食べました。", example: "I ate sushi yesterday." },
  { jp: "朝", romaji: "asa", en: "morning", jaExample: "朝ごはんを食べます。", example: "I eat breakfast." },
  { jp: "昼", romaji: "hiru", en: "noon", jaExample: "昼に出かけます。", example: "I go out at noon." },
  { jp: "夜", romaji: "yoru", en: "night", jaExample: "夜に飲みに行きます。", example: "I go drinking at night." },
  { jp: "朝ごはん", romaji: "asagohan", en: "breakfast", jaExample: "朝ごはんはパンです。", example: "Breakfast is bread." },
  { jp: "昼ごはん", romaji: "hirugohan", en: "lunch", jaExample: "昼ごはんを食べました。", example: "I had lunch." },
  { jp: "晩ごはん", romaji: "bangohan", en: "dinner", jaExample: "晩ごはんはカレーです。", example: "Dinner is curry." },
  { jp: "美味しい", romaji: "oishii", en: "delicious", jaExample: "このラーメンは美味しいです。", example: "This ramen is delicious." },
  { jp: "まずい", romaji: "mazui", en: "bad-tasting", jaExample: "この料理はまずいです。", example: "This food tastes bad." },
  { jp: "辛い", romaji: "karai", en: "spicy", jaExample: "カレーは辛いです。", example: "The curry is spicy." },
  { jp: "甘い", romaji: "amai", en: "sweet", jaExample: "ケーキは甘いです。", example: "The cake is sweet." },
  { jp: "おいくら", romaji: "oikura", en: "how much (polite)", jaExample: "おいくらですか。", example: "How much is it?" },
  { jp: "レジ", romaji: "reji", en: "cash register", jaExample: "レジはどこですか。", example: "Where is the cashier?" },
  { jp: "店", romaji: "mise", en: "shop", jaExample: "この店は人気です。", example: "This shop is popular." },
  { jp: "お土産", romaji: "omiyage", en: "souvenir", jaExample: "お土産を買います。", example: "I buy souvenirs." },
  { jp: "カメラ", romaji: "kamera", en: "camera", jaExample: "カメラを持っています。", example: "I have a camera." },
  { jp: "電気", romaji: "denki", en: "electricity / light", jaExample: "電気をつけてください。", example: "Please turn on the light." },
  { jp: "冷たい", romaji: "tsumetai", en: "cold (touch)", jaExample: "冷たい水です。", example: "It’s cold water." },
  { jp: "暑い", romaji: "atsui", en: "hot (weather)", jaExample: "今日は暑いです。", example: "It’s hot today." },
  { jp: "寒い", romaji: "samui", en: "cold (weather)", jaExample: "冬は寒いです。", example: "It’s cold in winter." },
  { jp: "天気", romaji: "tenki", en: "weather", jaExample: "天気がいいです。", example: "The weather is nice." },
  { jp: "雨", romaji: "ame", en: "rain", jaExample: "雨が降っています。", example: "It’s raining." },
  { jp: "雪", romaji: "yuki", en: "snow", jaExample: "雪がきれいです。", example: "The snow is beautiful." },
  { jp: "暑い", romaji: "atsui", en: "hot", jaExample: "今日は暑いです。", example: "It’s hot today." },
  { jp: "開ける", romaji: "akeru", en: "to open", jaExample: "ドアを開けます。", example: "I open the door." },
  { jp: "閉める", romaji: "shimeru", en: "to close", jaExample: "窓を閉めます。", example: "I close the window." },
  { jp: "入る", romaji: "hairu", en: "to enter", jaExample: "レストランに入ります。", example: "I enter the restaurant." },
  { jp: "出る", romaji: "deru", en: "to exit / leave", jaExample: "ホテルを出ます。", example: "I leave the hotel." },
  { jp: "使う", romaji: "tsukau", en: "to use", jaExample: "トイレを使います。", example: "I use the toilet." },
  { jp: "助けて", romaji: "tasukete", en: "help!", jaExample: "助けてください！", example: "Please help me!" },
  { jp: "警察", romaji: "keisatsu", en: "police", jaExample: "警察を呼んでください。", example: "Please call the police." },
  { jp: "病院", romaji: "byouin", en: "hospital", jaExample: "病院はどこですか。", example: "Where is the hospital?" },
  { jp: "薬", romaji: "kusuri", en: "medicine", jaExample: "薬を飲みます。", example: "I take medicine." },
  { jp: "痛い", romaji: "itai", en: "painful / hurts", jaExample: "頭が痛いです。", example: "My head hurts." },
  { jp: "危ない", romaji: "abunai", en: "dangerous", jaExample: "そこは危ないです。", example: "It’s dangerous there." },
  { jp: "分かる", romaji: "wakaru", en: "to understand", jaExample: "少し分かります。", example: "I understand a little." },
  { jp: "分かりません", romaji: "wakarimasen", en: "I don’t understand", jaExample: "日本語が分かりません。", example: "I don’t understand Japanese." },
  { jp: "英語", romaji: "eigo", en: "English", jaExample: "英語を話せますか。", example: "Can you speak English?" },
  { jp: "日本語", romaji: "nihongo", en: "Japanese language", jaExample: "日本語を勉強します。", example: "I study Japanese." },
  { jp: "話す", romaji: "hanasu", en: "to speak", jaExample: "日本語を話します。", example: "I speak Japanese." },
  { jp: "聞く", romaji: "kiku", en: "to listen / ask", jaExample: "すみません、聞いてもいいですか。", example: "Excuse me, may I ask something?" },
  { jp: "待つ", romaji: "matsu", en: "to wait", jaExample: "ここで待ちます。", example: "I’ll wait here." },
  { jp: "見る", romaji: "miru", en: "to look", jaExample: "地図を見ます。", example: "I look at the map." },
  { jp: "乗る", romaji: "noru", en: "to ride / get on", jaExample: "電車に乗ります。", example: "I get on the train." },
  { jp: "降りる", romaji: "oriru", en: "to get off", jaExample: "次の駅で降ります。", example: "I get off at the next station." },
  { jp: "速い", romaji: "hayai", en: "fast", jaExample: "新幹線は速いです。", example: "The bullet train is fast." },
  { jp: "遅い", romaji: "osoi", en: "slow / late", jaExample: "電車が遅いです。", example: "The train is slow." },
  { jp: "切る", romaji: "kiru", en: "to cut", jaExample: "紙を切ります。", example: "I cut paper." },
  { jp: "使える", romaji: "tsukaeru", en: "can use", jaExample: "Wi-Fiは使えますか。", example: "Can I use Wi-Fi?" },
  { jp: "Wi-Fi", romaji: "waifai", en: "Wi-Fi", jaExample: "Wi-Fiがありますか。", example: "Is there Wi-Fi?" },
  { jp: "携帯", romaji: "keitai", en: "mobile phone", jaExample: "携帯をなくしました。", example: "I lost my phone." },
  { jp: "忘れる", romaji: "wasureru", en: "to forget", jaExample: "パスポートを忘れました。", example: "I forgot my passport." },
  { jp: "パスポート", romaji: "pasupooto", en: "passport", jaExample: "パスポートを見せてください。", example: "Please show your passport." },
  { jp: "荷物", romaji: "nimotsu", en: "luggage", jaExample: "荷物があります。", example: "I have luggage." },
  { jp: "失くす", romaji: "nakusu", en: "to lose", jaExample: "財布を失くしました。", example: "I lost my wallet." },
  { jp: "財布", romaji: "saifu", en: "wallet", jaExample: "財布はどこですか。", example: "Where is my wallet?" },
  { jp: "電話", romaji: "denwa", en: "telephone", jaExample: "電話をかけます。", example: "I make a phone call." },
  { jp: "番号", romaji: "bangou", en: "number", jaExample: "電話番号を教えてください。", example: "Please tell me your phone number." },
  { jp: "分", romaji: "fun", en: "minute", jaExample: "５分待ってください。", example: "Please wait five minutes." },
  { jp: "時", romaji: "ji", en: "hour / time", jaExample: "３時です。", example: "It’s three o’clock." },
  { jp: "早い", romaji: "hayai", en: "early / fast", jaExample: "今日は早く起きました。", example: "I woke up early today." },
  { jp: "遅れる", romaji: "okureru", en: "to be late", jaExample: "少し遅れます。", example: "I’ll be a little late." },
  { jp: "休む", romaji: "yasumu", en: "to rest", jaExample: "少し休みます。", example: "I’ll take a short rest." },
  { jp: "遊ぶ", romaji: "asobu", en: "to play / have fun", jaExample: "公園で遊びます。", example: "I play at the park." },
  { jp: "公園", romaji: "kouen", en: "park", jaExample: "公園はあそこです。", example: "The park is over there." },
  { jp: "観光", romaji: "kankou", en: "sightseeing", jaExample: "東京で観光します。", example: "I go sightseeing in Tokyo." },
  { jp: "寺", romaji: "tera", en: "temple", jaExample: "有名な寺です。", example: "It’s a famous temple." },
  { jp: "神社", romaji: "jinja", en: "shrine", jaExample: "神社に行きます。", example: "I go to the shrine." },
  { jp: "写真を撮る", romaji: "shashin o toru", en: "to take a photo", jaExample: "神社で写真を撮ります。", example: "I take a photo at the shrine." },
  { jp: "楽しい", romaji: "tanoshii", en: "fun / enjoyable", jaExample: "旅行は楽しいです。", example: "The trip is fun." },
  { jp: "疲れた", romaji: "tsukareta", en: "tired", jaExample: "今日は疲れました。", example: "I’m tired today." },
  { jp: "大丈夫", romaji: "daijoubu", en: "okay / alright", jaExample: "大丈夫ですか。", example: "Are you okay?" },
  { jp: "助かります", romaji: "tasukarimasu", en: "that helps / I appreciate it", jaExample: "本当に助かります。", example: "That really helps." },
  { jp: "わかりやすい", romaji: "wakar yasui", en: "easy to understand", jaExample: "説明がわかりやすいです。", example: "The explanation is easy to understand." },
  { jp: "楽しい", romaji: "tanoshii", en: "fun", jaExample: "旅行は楽しいです。", example: "The trip is fun." },
  { jp: "行きましょう", romaji: "ikimashou", en: "let’s go", jaExample: "行きましょう！", example: "Let’s go!" },
  { jp: "すごい", romaji: "sugoi", en: "amazing / great", jaExample: "富士山はすごいです。", example: "Mount Fuji is amazing." },
  { jp: "きれい", romaji: "kirei", en: "beautiful / clean", jaExample: "京都はきれいです。", example: "Kyoto is beautiful." },
  { jp: "楽しかった", romaji: "tanoshikatta", en: "was fun", jaExample: "旅行は楽しかったです。", example: "The trip was fun." }
];
let flashcards = [];
async function loadFlashcards() {
  try {
    // If opened directly as file://, fetch will be blocked by the browser.
    if (location.protocol === 'file:') {
      console.warn('Running from file:// — using embedded flashcards fallback. Start a local server to load data/flashcards.json.');
      flashcards = embeddedFlashcards;
      return;
    }
    const src = document.querySelector('.app')?.getAttribute('data-source') || 'data/flashcards.json';
    const res = await fetch(src, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load flashcards: ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Flashcards JSON must be an array');
    flashcards = data;
  } catch (err) {
    console.error(err);
    // Final fallback to embedded data
    flashcards = embeddedFlashcards;
  }
}

// --- State ---
// Deck queue holds indices of flashcards in the order they will be shown
let deckQueue = [];
let currentIndex = 0;

// --- Elements ---
const cardInner = document.getElementById("cardFace");
const jpText = document.getElementById("jpText");
const romajiText = document.getElementById("romajiText");
const enText = document.getElementById("enText");
const exampleText = document.getElementById("exampleText");
const liveRegion = document.getElementById("live-region");

const randomBtn = document.getElementById("randomBtn");
const searchToggleBtn = document.getElementById("searchToggleBtn");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchCloseBtn = document.getElementById("searchCloseBtn");
const searchResults = document.getElementById("searchResults");

// --- Rendering ---
function renderCard() {
  const { jp, romaji, en, jaExample, example } = flashcards[currentIndex];

  // Apply Japanese language semantics on the jp element
  jpText.setAttribute("lang", "ja");
  jpText.textContent = jp;
  romajiText.textContent = romaji;
  enText.textContent = en;
  exampleText.textContent = example;
  const jaExampleText = document.getElementById("jaExampleText");
  jaExampleText.textContent = jaExample || "";

  // Announce update to assistive technologies
  liveRegion.textContent = `Card ${currentIndex + 1} of ${flashcards.length}: ${jp} - ${en}`;

  // Ensure English text is blurred initially and clickable to toggle
  enText.classList.add("blurred", "toggleable");
  exampleText.classList.add("blurred", "toggleable");
}

function resetForNewCard() {
  // Reset blur on English side when moving to a new card
  enText.classList.add("blurred");
  exampleText.classList.add("blurred");
}

// No flip function for single-sided card

// Go to next card in queue
function advanceToNext() {
  // Remove the head (current) and move to next
  deckQueue.shift();
  if (deckQueue.length === 0) {
    // If exhausted, reinitialize the deck in current order
    deckQueue = Array.from({ length: flashcards.length }, (_, i) => i);
  }
  currentIndex = deckQueue[0];
  resetForNewCard();
  renderCard();
  cardInner.focus();
}

// Reinsert the current card after N cards in the queue
function reinsertCurrent(offset) {
  const id = currentIndex;
  const insertAt = Math.min(offset, deckQueue.length);
  deckQueue.splice(insertAt, 0, id);
}

function rateAndContinue(difficulty) {
  // Difficulty spacing: Easy=15, Medium=10, Hard=5
  const spacing = difficulty === "easy" ? 15 : difficulty === "medium" ? 10 : 5;
  reinsertCurrent(spacing);
  advanceToNext();
  playDing();
}

// --- Event wiring ---
// No flip interactions for single-sided card

// Toggle blur on English word/example when clicked
enText.addEventListener("click", () => enText.classList.toggle("blurred"));
exampleText.addEventListener("click", () => exampleText.classList.toggle("blurred"));

// Random: shuffle remaining deck (excluding current head)
randomBtn.addEventListener("click", () => {
  if (flashcards.length === 0) return;
  let rand = currentIndex;
  if (flashcards.length > 1) {
    while (rand === currentIndex) {
      rand = Math.floor(Math.random() * flashcards.length);
    }
  }
  // Rebuild queue so the random card is now current
  const rest = Array.from({ length: flashcards.length }, (_, i) => i).filter(i => i !== rand);
  deckQueue = [rand, ...rest];
  currentIndex = rand;
  resetForNewCard();
  renderCard();
  cardInner.focus();
  playDing();
});

// Keyboard shortcuts: Space reveals English text
document.addEventListener("keydown", (e) => {
  const activeTag = (document.activeElement && document.activeElement.tagName) || "";
  const isTyping = activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT" || document.activeElement?.isContentEditable;
  // Global shortcuts to open/close search
  if (e.ctrlKey && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    openSearch();
    return;
  }
  if (e.key === 'Escape' && !searchPanel?.hidden) {
    e.preventDefault();
    closeSearch();
    return;
  }
  if (isTyping) return;
  if (e.key === " ") {
    // Space reveals English word (not the example). Prevent page scroll.
    e.preventDefault();
    enText.classList.remove("blurred");
    exampleText.classList.remove("blurred");
    return;
  }
});

// --- Search feature ---
function openSearch() {
  if (!searchPanel) return;
  searchPanel.hidden = false;
  searchInput?.focus();
  if (searchToggleBtn) searchToggleBtn.style.display = 'none';
}

function closeSearch() {
  if (!searchPanel) return;
  searchPanel.hidden = true;
  searchInput.value = "";
  renderSearchResults([]);
  if (searchToggleBtn) searchToggleBtn.style.display = '';
}

function renderSearchResults(items) {
  if (!searchResults) return;
  searchResults.innerHTML = "";
  items.slice(0, 5).forEach((item, idx) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.tabIndex = 0;
    li.innerHTML = `<span class="result-main" lang="ja">${item.jp}</span><span class="result-sub">${item.romaji} • ${item.en}</span>`;
    li.addEventListener("click", () => selectSearchItem(item));
    li.addEventListener("keydown", (e) => { if (e.key === "Enter") selectSearchItem(item); });
    searchResults.appendChild(li);
  });
}

function selectSearchItem(item) {
  if (!item) return;
  // Try to find this card in the active dataset by jp
  let idx = flashcards.findIndex(c => c.jp === item.jp);
  if (idx === -1) {
    // If not found, switch to embeddedFlashcards dataset
    flashcards = embeddedFlashcards;
    deckQueue = Array.from({ length: flashcards.length }, (_, i) => i);
    idx = flashcards.findIndex(c => c.jp === item.jp);
  }
  if (idx < 0) return;
  const rest = Array.from({ length: flashcards.length }, (_, i) => i).filter(i => i !== idx);
  deckQueue = [idx, ...rest];
  currentIndex = idx;
  resetForNewCard();
  renderCard();
  closeSearch();
}

let searchDebounce;
function handleSearchInput() {
  const q = (searchInput?.value || "").trim().toLowerCase();
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    if (q.length < 3) { renderSearchResults([]); return; }
    const results = embeddedFlashcards.filter(c =>
      (c.romaji && c.romaji.toLowerCase().includes(q)) ||
      (c.en && c.en.toLowerCase().includes(q))
    );
    renderSearchResults(results);
  }, 150);
}

// Removed on-screen toggle button; keep keyboard shortcut support below
searchCloseBtn?.addEventListener("click", closeSearch);
searchInput?.addEventListener("input", handleSearchInput);

// --- Ding sound (WebAudio) ---
let audioCtx;
function playDing() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.12; // seconds
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880; // A5
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator.connect(gain).connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (_) {
    // ignore if audio cannot play
  }
}

// --- Init ---
(async function init() {
  await loadFlashcards();
  if (flashcards.length === 0) return;
  deckQueue = Array.from({ length: flashcards.length }, (_, i) => i);
  currentIndex = deckQueue[0];
  renderCard();
})();

// Notes for future editors:
// - To add a new card, push another object into the `flashcards` array
//   with keys: jp, romaji, en, example. Keep strings short for best layout.


