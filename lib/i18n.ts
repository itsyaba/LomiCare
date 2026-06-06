export const translations = {
  en: {
    language: "English",
    nav: {
      dashboard: "Dashboard",
      checkin: "Daily Check-in",
      chat: "AI Companion",
      feed: "Wellness Feed",
      profile: "Profile",
    },
    checkin: {
      title: "Daily check-in",
      description:
        "Capture how today feels. Selam will use this pattern for better guidance.",
      submit: "Submit check-in",
      saving: "Saving check-in",
      note: "Anything on your mind today?",
      placeholder: "A short note is enough.",
    },
    chat: {
      title: "AI Companion",
      description: "Culturally grounded wellness support, not medical care.",
      placeholder: "Share what is on your mind...",
      send: "Send",
      greeting:
        "Selam. Tell me what feels most present today: stress, sleep, energy, food, or something in your relationships.",
      fresh: "Fresh start. What would you like to talk through with Selam today?",
    },
  },
  am: {
    language: "አማርኛ",
    nav: {
      dashboard: "ዳሽቦርድ",
      checkin: "ዕለታዊ ሁኔታ",
      chat: "AI ጓደኛ",
      feed: "የጤና ምክሮች",
      profile: "መገለጫ",
    },
    checkin: {
      title: "ዕለታዊ ሁኔታ",
      description: "ዛሬ ስሜትዎ፣ ኃይልዎ፣ እንቅልፍዎ እና ጭንቀትዎ እንዴት እንደሆነ ይመዝግቡ።",
      submit: "አስገባ",
      saving: "በማስቀመጥ ላይ",
      note: "ዛሬ በአእምሮዎ ላይ ያለ ነገር?",
      placeholder: "አጭር ማስታወሻ በቂ ነው።",
    },
    chat: {
      title: "AI ጓደኛ",
      description: "በባህል የተመሠረተ የጤና ድጋፍ፣ የሕክምና ምክር አይደለም።",
      placeholder: "በአእምሮዎ ላይ ያለውን ያጋሩ...",
      send: "ላክ",
      greeting: "ሰላም። ዛሬ በጣም የሚሰማዎት ጭንቀት፣ እንቅልፍ፣ ኃይል፣ ምግብ ወይም ግንኙነት ነው?",
      fresh: "አዲስ መጀመሪያ። ዛሬ ከሰላም ጋር ምን ማውራት ይፈልጋሉ?",
    },
  },
};

export type AppLanguage = keyof typeof translations;
