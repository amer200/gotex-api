const Fuse = require('fuse.js');

exports.addNew = (req, res, next) => {
    // const city = compareCites(req.body.s_city);
    // console.log(req.body.s_city)
    matchInArray(req.body.s_city)
}
//**************************** */
const cityRef = ["Ad Dilam",
    "Ad Diriyah",
    "Afif",
    "Afifh",
    "Al Aarid",
    "Al Aflag",
    "Al Aflaj",
    "Al Ahmar",
    "Al Amaaria",
    "Al Badayea",
    "Al Bijadyah",
    "Al Bir",
    "Al Bukayriyah",
    "Al Dhahreyah",
    "Al Dheelah",
    "Al Dulaymiyah",
    "Al Duwadimi",
    "Al Fawwarah",
    "Al Ghnamiah",
    "Al Hariq",
    "Al Hayathem",
    "Al Janadriyyah",
    "Al Jubaylah",
    "Al Khabra",
    "Al Kharma Al Shimaliah",
    "Al Mansourah",
    "Al Mashael",
    "Al Muzahimiyah",
    "Al Petra",
    "Al Qarinah",
    "Al Qasab",
    "Al Qirawan",
    "Al Qurainah",
    "Al Quwaiiyah",
    "Al Quwarah",
    "Al Umjiah",
    "Al Uyaynah",
    "Al-Badie Al-Shamali",
    "Al-Fuwayliq",
    "Al-Kharj",
    "AlMu'tadil",
    "Almuzayri",
    "Ammaria",
    "An Nabhaniyah",
    "Ar Rass",
    "Ar Rayn",
    "Ar Ruwaidah",
    "arja",
    "As Sulayyil", "As Suwaidi",
    "Ash Shifa",
    "Ash Shu'ara",
    "At Tuwalah",
    "Ath Thumamah Village",
    "Banban",
    "Da'a",
    "Dariyah",
    "Dhurma",
    "Duhknah",
    "Dulay Rasheed",
    "Hareeq",
    "Howtat Bani Tamim",
    "Huraymila",
    "Jubaila",
    "Kalakh Dam",
    "Khairan",
    "Malham",
    "Maraghan",
    "Marat",
    "Mubhel",
    "Naajan",
    "Nifi",
    "Nubayha",
    "Qusaiba",
    "Rafaya Al Jemsh",
    "Riyadh",
    "Riyadh Al Khabra",
    "Rumah",
    "Sajir",
    "Salbookh",
    "Salbukh",
    "Shaqra",
    "Subaih",
    "Thadiq",
    "Tharamda",
    "Thebea",
    "Tumair",
    "Uglat Asugour",
    "Umm al Jamajim",
    "Ushaiqer",
    "Wadi al Dawasir",
    "Abu Hadriyah",
    "Airj",
    "Al Awamiyah",
    "Al Aziziyah",
    "Al Badiyah",
    "Al Batha",
    "Al Fadiliyah",
    "Al Hassa", "Al Hinnah",
    "Al Hofuf", "Al Husayy", "Al Jubail",
    "Al Khobar", "Al Khushaybi", "Al Markuz",
    "Al Mubarraz", "Al Nuzha", "Al Oyun", "Al Oyun Hofuf",
    "Al Qatif", "Al Qulayyib", "Al Taraf", "Al Tarf", "Al Thawn",
    "Al Umran", "Al Wannan", "Al Wozeyh", "AlKhhafah",
    "Almazrooa 2nd", "Anak", "As Sadawi", "As Salmanyah",
    "As Sarrar", "As Sihaf", "Ash Shu'bah", "At Timyat",
    "Ath Thybiyah", "Az Zahrah", "Az Zughayn", "Buqayq",
    "Dammam", "Dhahran", "Ghanwa", "Hanidh", "Harad",
    "Haradh", "Hawiyah", "Ibn Shuraym", "Juatha", "Judah", "Julayjilah",
    "Khafji", "Manifah", "Mighati", "Mulayjah", "Nairyah", "Nisab",
    "Nita", "Qaryat Al Ulya",
    "Rahima",
    "Ras Al Khair",
    "Ras Tanura",
    "Rawdat Habbas",
    "Safwa",
    "Saihat",
    "Salasil",
    "Salwa",
    "Satorp",
    "Shedgum Gas Plant",
    "Shifiyah",
    "Tanajib",
    "Tarout",
    "Thaj",
    "Udhailiyah",
    "Udhailiyah Hofuf",
    "Utayiq",
    "Uthmaniyah",
    "Zibala",
    "Abu Ajram",
    "Al Ajfar",
    "Al Amar",
    "Al Ammar",
    "Al Artawiyah",
    "Al Asyah",
    "Al Atheeb",
    "Al Bad",
    "Al Butayn",
    "Al Gayal",
    "Al Ghat",
    "Al Ghazalah",
    "Al Hadithah",
    "Al Hait",
    "Al Hufayr",
    "Al Hulayfah As Sufla",
    "Al JABRIYAH",
    "Al Jihfah",
    "Al Jouf",
    "Al Jumaymah",
    "Al Khitah",
    "Al Khuffiyah",
    "Al Khuraytah",
    "Al Khuzama",
    "Al Laqayit",
    "Al Lsawiyah",
    "Al Majmaah",
    "Al Majma'ah",
    "Al Mayyah",
    "Al Mithnab", "Al Mudayyih",
    "Al Muhammadiyah D",
    "Al Mukaily",
    "Al Muwaileh",
    "Al Qaid",
    "Al Qaisumah",
    "Al Qalibah",
    "Al Qarah",
    "Al Qurayyat",
    "Al Rafaeya'a",
    "Al Ula", "Al Uwayqilah",
    "Al Wajh",
    "Al-Nasfah",
    "Al-Nasifa",
    "Alsharaf",
    "Amaaer Ben Sana'a",
    "An Nabk Abu Qasr",
    "An Nazayim",
    "Ar Rafi'ah",
    "Ar Rawdah",
    "Arar",
    "Artawiah",
    "As Sam'uriyah",
    "As Sulubiayh",
    "Asbtar",
    "Ash Shamli",
    "Ash Sharaf",
    "Ash Shimasiyah",
    "Ash Shinan",
    "Ash Shuqayq",
    "Ath Thamiriyah",
    "Ayn Ibn Fuhayd",
    "Az Zulfi",
    "Bada",
    "Baqaa",
    "Barzan",
    "Bir ibn Harmas",
    "Bir Ibn Hirmas",
    "Buraydah",
    "Duba",
    "DUBAY'AH",
    "Dulayhan",
    "Dumah Al Jandal",
    "Feyadh Tabrjal",
    "Ghaf Al Jawa",
    "Hadban",
    "HADCO-Almarai",
    "Hafar Al Batin",
    "Hail", "Halat Ammar",
    "Haql",
    "Hautat Sudair",
    "Hazem Aljalamid",
    "Hedeb",
    "Ithrah",
    "Jalajil",
    "Jibal Khuraibah",
    "Jubbah",
    "King Khalid Military City",
    "Magna",
    "Mawqaq",
    "Meegowa",
    "Mogayra",
    "Mudarraj",
    "Mulayh",
    "Munifah",
    "Qassim",
    "Qina",
    "Qiyal",
    "Qlayyb Khedr",
    "Qufar",
    "Radifah",
    "Rafha",
    "Raudat Sudair",
    "Rawdat Al Hisu",
    "Rawdat Sudair",
    "Sadyan",
    "Sakaka",
    "Saqf",
    "Shari",
    "Sharma",
    "Shiqri",
    "Sude'a",
    "Sumaira'a",
    "Suwayr",
    "Tabarjal",
    "Tabuk",
    "Tayma",
    "Thumair",
    "Trubah",
    "Tubarjal",
    "Turaif",
    "Umm Al Jamajm",
    "Umm Hazim",
    "Unayzah",
    "Uthal",
    "Uyun Al Jawa",
    "Zalom",
    "Abha", "Abu Arish",
    "Abu Muloh",
    "Ad Darb",
    "Addayer",
    "Adham",
    "Ahad Al Masarihah",
    "Ahad Rafidah",
    "Al Ama ir",
    "Al Amoah",
    "Al Aqiq",
    "Al Aridhah",
    "Al Atawilah",
    "Al Bahah",
    "Al Baheem",
    "Al Birk",
    "Al Dhabyah",
    "Al Edabi",
    "Al Farshah",
    "Al Gafrat",
    "Al Habala",
    "Al Hadror",
    "Al Hajrah",
    "Al Harajah",
    "Al Hazmi",
    "Al Hifah",
    "Al Husayniyah",
    "Al Jaizah",
    "Al Jaradiyah",
    "Al Jifah",
    "Al Karbus",
    "Al Khaniq",
    "Al Khashabiyah",
    "Al Lith",
    "Al Madaya",
    "Al Makhwah",
    "Al Marooj",
    "Al Mishaliah",
    "Al Mozvin",
    "Al Mubarakah",
    "Al Namas",
    "Al Qahma",
    "Al Qeddeh",
    "Al Qunfudhah",
    "Al Rafaie",
    "Al Salamah",
    "Al Shatt",
    "Al Sheqiqah",
    "Al Shuqaiq",
    "Al Soudah",
    "Al Theniah", "Al Turshiah",
    "Al Tuwal",
    "Al Uferiah",
    "Al Wadeen",
    "Al Wurud",
    "Algayed",
    "Alkhazzan",
    "Almahalah",
    "Almajaridah",
    "Almandaq",
    "Al-Matan",
    "Almuzaylif",
    "Alnajameiah",
    "Alsilaa",
    "Amaq",
    "An Nuzhah",
    "Arman",
    "As Safa",
    "Bahr Abu Sukaynah",
    "Baish",
    "Baljurashi",
    "Bani Malik",
    "Bariq",
    "Baynah",
    "Biljurashi",
    "Billasmar",
    "Bir Askar",
    "Bish",
    "Bisha",
    "Bishah",
    "Dahu",
    "Damad",
    "Dhahran Al Janoob",
    "Dhahran Al Janub",
    "Farasan Island",
    "Fayfa",
    "Gaabah",
    "Hajrah",
    "Harub",
    "Hubuna",
    "Hullatal Ahwass",
    "Jarab",
    "Jazan",
    "Jazan Economic City",
    "Jazirah",
    "Karra",
    "Khamis Mushait",
    "Khamis Mutair",
    "Khbash", "Lahumah", "Mahalah",
    "Majzuah",
    "Mehr Bisha Center",
    "Mijannah",
    "Mizhirah",
    "Mojour",
    "Mu fija",
    "Muhayil",
    "Najran",
    "Nakhal",
    "Namerah",
    "Qana",
    "Qilwah",
    "Ranyah",
    "Rijal Alma",
    "Rojal",
    "Ruqayqah",
    "Sabt Al Alayah",
    "Sabya",
    "Samtah",
    "Sarat Abidah",
    "Sharorah",
    "Sittr AlLihyani",
    "Tabalah",
    "Tamniah",
    "Tanomah",
    "Tarqush",
    "Tathleeth",
    "Tendaha",
    "Tereeb",
    "Thar",
    "Umm Rahta",
    "Waaer",
    "Wadi Bishah",
    "Wadi Ibn Hashbal",
    "Zawral Harith",
    "Abiyar Al Mashi",
    "Abu Markha",
    "Ad Dumayriyah",
    "Airpot",
    "Al Akhal",
    "Al Arbaeen",
    "Al Aziziyah",
    "Al Basatin",
    "Al Harara",
    "Al Henakiyah",
    "Al Heno",
    "Al Jerisiyah",
    "Al Jumum",
    "Al Juranah", "Al Kamil",
    "Al Khurma",
    "Al Lahien",
    "Al Mabuth",
    "Al Mindassah",
    "Al Mulaylih",
    "Al Muwayh",
    "Al Nabah",
    "Al Nagaf",
    "Al Qrahin",
    "Al Rathaya",
    "Al Rawabi",
    "Al Rehab",
    "Al Shegrah",
    "Al Shlayil",
    "Al Sir",
    "Al Thamad",
    "Al Torkiyah",
    "Al Yutamah",
    "Alhada",
    "Almojermah Village",
    "An Nawwariyyah",
    "Ar rayis",
    "Arafa",
    "As Sail Al Kabeer",
    "As Sayl as Saghir",
    "As Sudayrah",
    "Asfan",
    "Ash Shafa",
    "Ashayrah",
    "Asuwayq",
    "Ateef",
    "Badr",
    "Bahrah",
    "Bryman",
    "Dahaban",
    "Dhalm",
    "Heelan Village",
    "Husayniyah",
    "Industrial Area",
    "Isharah",
    "Jeddah",
    "Khaybar",
    "Khulais",
    "Macca",
    "Mahd Al Thahab",
    "Mastorah",
    "Mecca",
    "Medina",
    "New Muwayh",
    "Nimran",
    "Qia",
    "Rabigh",
    "Shoaiba",
    "Shoqsan",
    "Taiba",
    "Taif",
    "Thuwal",
    "Turbah",
    "Umluj",
    "Umm Aldoom",
    "Urwah",
    "Ushayrah",
    "Wadi Al Fora'a",
    "Wadi Reem",
    "Yanbu"]
const compareCites = (city) => {
    if (city == 'makkah') {
        return "Makkah"
    }
    if (city == 'Mecca') {
        return "Makkah"
    }
    const result = cityRef.some(rx => rx.test(city));
    return result
    // const words = cityRef;
    // const options = {
    //     keys: ['word'],
    //     threshold: 0.03,
    // };

    // const fuse = new Fuse(words, options);
    // const result = fuse.search(city); // returns [{ word: 'apple' }]
    // return result
}
function matchInArray(string) {
    cityRef.forEach(city => {
        if (city.search(string)) {
            console.log(city)
        }
    })
    // let stringSplit = string.split("");
    // cityRef.forEach(city => {
    //     let citySplit = city.split("");
    //     for (let i = 0; i <= city.length; i++) {
    //         let numberOfMatchesChar = 0;
    //         if (stringSplit[i] == citySplit[i]) {
    //             // console.log(citySplit[i])
    //             numberOfMatchesChar + 1
    //         }
    //         if (numberOfMatchesChar >= 3) {
    //             return console.log({
    //                 isFind: true,
    //                 city: city
    //             })
    //         }
    //     }
    // })
    console.log(false)
    // var len = cityRef.length,
    //     i = 0;

    // for (; i < len; i++) {
    //     if (string.match(cityRef[i])) {
    //         return true;
    //     }
    // }

    // return false;

}