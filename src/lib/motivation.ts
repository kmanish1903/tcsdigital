import m1 from "@/assets/motivation-1.jpg";
import m2 from "@/assets/motivation-2.jpg";
import m3 from "@/assets/motivation-3.jpg";
import m4 from "@/assets/motivation-4.jpg";
import m5 from "@/assets/motivation-5.jpg";
import m6 from "@/assets/motivation-6.jpg";
import m7 from "@/assets/motivation-7.jpg";

export const MOTIVATION_IMAGES = [m1, m2, m3, m4, m5, m6, m7];

export type Quote = {
  te: string; // Telugu
  hi: string; // Hindi
  en: string; // English
  author?: string;
};

export const QUOTES: Quote[] = [
  {
    te: "నీ కల నిన్ను నిద్రపోనివ్వకపోతేనే నువ్వు మేల్కొన్నట్లు.",
    hi: "जब तक सपना आपको सोने न दे, तब तक आप जागे नहीं हैं।",
    en: "You haven't truly woken up until your dream stops letting you sleep.",
    author: "A. P. J. Abdul Kalam",
  },
  {
    te: "శ్రమించు, నిశ్శబ్దంగా శ్రమించు. నీ విజయమే శబ్దం చేయనీ.",
    hi: "चुपचाप मेहनत करो, तुम्हारी सफलता शोर मचाएगी।",
    en: "Work hard in silence. Let your success make the noise.",
  },
  {
    te: "ప్రతి రోజు ఒక్క శాతం మెరుగుపడితే, ఒక సంవత్సరంలో నీవు 37 రెట్లు మంచిగా ఉంటావు.",
    hi: "हर दिन सिर्फ़ 1% बेहतर बनो, साल भर में तुम 37 गुना बेहतर हो जाओगे।",
    en: "Get 1% better every day — in a year you'll be 37× stronger.",
    author: "James Clear",
  },
  {
    te: "హనుమంతుని భక్తితో, రాముని ధైర్యంతో — ఏ లక్ష్యం దూరం కాదు.",
    hi: "हनुमान की भक्ति और राम के साहस से कोई भी लक्ष्य दूर नहीं।",
    en: "With Hanuman's devotion and Rama's courage, no goal is too far.",
  },
  {
    te: "3.5 LPA మొదలు మాత్రమే. నీ నిజమైన విలువ ఇంకా రాబోతుంది.",
    hi: "3.5 LPA सिर्फ़ शुरुआत है। असली पहचान अभी आनी बाक़ी है।",
    en: "3.5 LPA is just the start. Your real worth is still on its way.",
  },
  {
    te: "క్రమశిక్షణ + పునశ్చరణ + కమ్యూనికేషన్ = ప్లేస్‌మెంట్.",
    hi: "अनुशासन + दोहराव + संवाद = प्लेसमेंट।",
    en: "Discipline + Revision + Communication = Placement.",
  },
  {
    te: "నిన్న కంటే ఈ రోజు బలంగా ఉండు. రేపటి కంటే ఈ రోజు సిద్ధంగా ఉండు.",
    hi: "कल से मज़बूत बनो, परसों से ज़्यादा तैयार बनो।",
    en: "Be stronger than yesterday. Be more prepared than tomorrow.",
  },
  {
    te: "ప్రతి బగ్ ఒక గురువు. ప్రతి తిరస్కరణ ఒక దిశానిర్దేశం.",
    hi: "हर bug एक गुरु है। हर rejection एक नई दिशा।",
    en: "Every bug is a teacher. Every rejection is a redirection.",
  },
  {
    te: "రామ రామ — మనసు శాంతిస్తే, బుద్ధి పనిచేస్తుంది.",
    hi: "राम राम — मन शांत होगा तो बुद्धि चलेगी।",
    en: "Ram Ram — when the mind settles, the intellect performs.",
  },
  {
    te: "నీ కథలో హీరోవి నువ్వే. స్క్రిప్ట్ నువ్వే రాయాలి.",
    hi: "अपनी कहानी के हीरो तुम हो — स्क्रिप्ट भी तुम्हें ही लिखनी है।",
    en: "You are the hero of your own story. Write the script yourself.",
  },
  {
    te: "శరీరం ఆరోగ్యంగా ఉంటే, మనసు చురుకుగా ఉంటుంది, కోడ్ క్లీన్‌గా ఉంటుంది.",
    hi: "शरीर स्वस्थ तो मन तेज़, और कोड साफ़।",
    en: "Healthy body, sharp mind, clean code.",
  },
  {
    te: "ఇంటర్వ్యూలో గెలిచేది తెలివి కాదు — ప్రాక్టీస్.",
    hi: "इंटरव्यू टैलेंट से नहीं — practice से जीते जाते हैं।",
    en: "Interviews are won by practice, not by talent.",
  },
];

// Deterministic helpers so the daily picks are stable per day
function dayHash(dateISO: string) {
  let h = 0;
  for (let i = 0; i < dateISO.length; i++) h = (h * 31 + dateISO.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function dailyImage(dateISO: string) {
  return MOTIVATION_IMAGES[dayHash(dateISO) % MOTIVATION_IMAGES.length];
}

export function dailyQuotes(dateISO: string, count = 3): Quote[] {
  const seed = dayHash(dateISO);
  const out: Quote[] = [];
  for (let i = 0; i < count; i++) {
    out.push(QUOTES[(seed + i * 7) % QUOTES.length]);
  }
  return out;
}

export function randomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function randomImage() {
  return MOTIVATION_IMAGES[Math.floor(Math.random() * MOTIVATION_IMAGES.length)];
}
