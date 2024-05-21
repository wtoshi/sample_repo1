const fs = require('fs');
const path = require('path');

// İngilizce ve Türkçe kelime listelerini JSON dosyalarından oku
const englishWords = JSON.parse(fs.readFileSync(path.join(__dirname, 'english_words.json'), 'utf8'));
const turkishWords = JSON.parse(fs.readFileSync(path.join(__dirname, 'turkish_words.json'), 'utf8'));

// Daha önce oluşturulan JSON dosyasını kontrol et
const getPreviousGameData = (language: any) => {
  const filePath = path.join(__dirname, '..', 'data', `${language}_game_data.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } else {
    return [];
  }
};

// Harflerin rastgele seçimi için kullanılacak fonksiyon
const getRandomLetters = (letters: any[], count: number) => {
  const shuffled = letters.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Geçerli kelimeleri filtreleme ve benzersiz hale getirme fonksiyonu
const filterWords = (words: any[], letters: any[], middle: string) => {
  const lowerCaseLetters = letters.map(letter => letter.toLowerCase());
  const lowerCaseMiddle = middle.toLowerCase();
  const uniqueWords = new Set();

  words.forEach(word => {
    const lowerCaseWord = word.toLowerCase();
    if (lowerCaseWord.length < 4) return;
    if (!lowerCaseWord.includes(lowerCaseMiddle)) return;

    const wordLetters = lowerCaseWord.split('');
    const letterCounts: { [key: string]: number } = {};

    wordLetters.forEach((letter: string | number) => {
      if (letterCounts[letter]) {
        letterCounts[letter]++;
      } else {
        letterCounts[letter] = 1;
      }
    });

    let isValid = true;
    for (const letter in letterCounts) {
      const count = letterCounts[letter];
      if (letter === lowerCaseMiddle) {
        continue;
      }
      if (count > lowerCaseLetters.filter(l => l === letter).length) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      uniqueWords.add(lowerCaseWord);
    }
  });

  return Array.from(uniqueWords);
};

// Oyun JSON verisini oluşturma fonksiyonu
const createGameData = (words: any[], allLetters: any[], previousGameData: any[], maxCombinations: number) => {
  const gameDataList = [];
  let tries = 0;

  while (gameDataList.length < maxCombinations && tries < 1000) {
    tries++;
    const middle = allLetters[Math.floor(Math.random() * allLetters.length)];
    const otherLetters = getRandomLetters(allLetters.filter(letter => letter.toLowerCase() !== middle.toLowerCase()), 6);

    // Tekrarlanan harfleri ortadan kaldırarak letters dizisini oluştur
    const uniqueLetters = [middle, ...otherLetters.filter((letter, index, self) => self.indexOf(letter) === index)];

    // letters dizisini 7 harfe tamamla
    while (uniqueLetters.length < 7) {
      const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
      if (!uniqueLetters.includes(randomLetter)) {
        uniqueLetters.push(randomLetter);
      }
    }

    const validWords = filterWords(words, uniqueLetters, middle);

    // Geçerli kelimeler varsa gameDataList'e ekle
    if (validWords.length >= 5) {
      const gameData = {
        words: validWords,
        letters: uniqueLetters.filter(letter => letter.toLowerCase() !== middle.toLowerCase()),
        middle: middle
      };

      // Aynı kombinasyonun daha önce oluşturulup oluşturulmadığını kontrol et
      if (!previousGameData.some(data => data.middle.toLowerCase() === gameData.middle.toLowerCase() && data.letters.sort().join('').toLowerCase() === gameData.letters.sort().join('').toLowerCase())) {
        gameDataList.push(gameData);
      }
    }
  }

  return gameDataList;
};

// Ana fonksiyon
const main = (language: string, maxCombinations: number) => {
  let words, allLetters, fileName;

  if (language === 'english') {
    words = englishWords;
    allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    fileName = 'english_game_data.json';
  } else if (language === 'turkish') {
    words = turkishWords;
    allLetters = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
    fileName = 'turkish_game_data.json';
  } else {
    console.error('Unsupported language');
    return;
  }

  const previousGameData = getPreviousGameData(language);
  const gameDataList = createGameData(words, allLetters, previousGameData, maxCombinations);

  if (gameDataList.length > 0) {
    previousGameData.push(...gameDataList);
    fs.writeFileSync(path.join(__dirname, '..', 'data', fileName), JSON.stringify(previousGameData, null, 1));
    console.log(`Game data for ${language} created successfully.`);
  } else {
    console.log(`No valid combinations found for ${language}.`);
  }
};

// Dil seçimini ve kombinasyon sayısını kullanıcıdan al
const language = process.argv[2];
const maxCombinations = parseInt(process.argv[3], 10);

if (!language || isNaN(maxCombinations)) {
  console.error('Please specify a language ("english" or "turkish") and a number of combinations.');
  process.exit(1);
}

main(language, maxCombinations);
