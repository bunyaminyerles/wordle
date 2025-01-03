const words = [
    "çanta",
    "tahta",
    "çekiç",
    "radyo",
    "kağıt",
    "sehpa",
    "dolap",
    "kalem",
    "kaşık",
    "bıçak",
    "tabak",
    "tablo",
    "lamba",
    "tepsi",
    "kilit",
    "rende",
    "ayraç",
    "makas",
    "kazak",
    "hırka",
    "ceket",
    "kemer",
    "fular",
    "kaban",
    "palto",
    "yılan",
    "köpek",
    "domuz",
    "kumru",
    "akrep",
    "serçe",
    "tavuk",
    "horoz",
    "hindi",
    "şahin",
    "koyun",
    "katır",
    "manda",
    "tilki",
    "geyik",
    "kirpi",
    "sadık",
    "zayıf",
    "sakin",
    "yalın",
    "alçak",
    "rezil",
    "ebedi",
    "ezeli",
    "vazıh",
    "fakir",
    "asabi",
    "ferah",
    "güzel",
    "nadir",
    "nazik",
    "kibar",
    "sabit",
    "yakın",
    "derin",
    "temiz",
    "gizli",
    "kutlu",
    "kolay",
    "basit",
    "beşir",
    "gamlı",
    "latif",
    "i̇çsel",
    "zebun",
    "cimri",
    "biber",
    "helva",
    "gazoz",
    "hurma",
    "salça",
    "ceviz",
    "badem",
    "kekik",
    "armut",
    "marul",
    "soğan",
    "kiraz",
    "çilek",
    "vişne",
    "kavun",
    "bamya",
    "susam",
    "tahin",
    "reçel",
    "ayran",
    "gurur",
    "kibir",
    "sinir",
    "ahlak",
    "madde",
    "anlam",
    "namus",
    "efsun",
    "hitap",
    "kelam",
    "kanıt",
    "delil",
    "batıl",
    "yalan",
    "doğru",
    "yüzey",
    "çıkış",
    "giriş",
    "defin",
    "kabir",
    "gömüt",
    "mezar",
    "bahçe",
    "hotel",
    "antre",
    "salon",
    "kiler",
    "banyo",
    "beton",
    "doruk",
    "dahil",
    "davul",
    "kabul",
    "diğer",
    "öteki",
    "daima",
    "şimdi",
    "yarın",
    "bugün",
    "evvel",
    "sonra",
    "kayıt",
    "satır",
    "mısra",
    "roman"
];

export function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
}


export function inWordList(word: string) {
    return words.includes(word);
}

