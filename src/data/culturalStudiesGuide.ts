import type { CulturalStudiesGuide, GuideBlock } from "./culturalStudiesGuideTypes";

const p = (text: string): GuideBlock => ({ type: "paragraph", text });
const ul = (items: string[]): GuideBlock => ({ type: "list", items });
const h3 = (text: string): GuideBlock => ({ type: "heading", level: 3, text });
const h4 = (text: string): GuideBlock => ({ type: "heading", level: 4, text });
const key = (title: string, text: string): GuideBlock => ({
  type: "callout",
  variant: "key",
  title,
  text,
});
const tip = (text: string): GuideBlock => ({ type: "callout", variant: "tip", text });
const table = (headers: string[], rows: string[][]): GuideBlock => ({
  type: "table",
  headers,
  rows,
});
const terms = (items: { term: string; definition: string }[]): GuideBlock => ({
  type: "terms",
  items,
});

export const culturalStudiesGuide: CulturalStudiesGuide = {
  title: "Cultural Studies",
  subtitle: "Complete Exam Study Guide",
  description:
    "10 lectures — detailed notes for the final examination. Scroll through one continuous guide or jump to any lecture.",
  sections: [
    {
      id: "lecture-1",
      number: 1,
      title: "Morphology of Culture & Language of Culture",
      subtitle: "Historical development, definitions, types, language",
      blocks: [
        h3("1. Historical Development of the Concept of Culture"),
        p(
          "The word culture comes from the Latin verb colere — to cultivate, inhabit, honor. Originally it always required an object (e.g., 'culture of the spirit/mind').",
        ),
        h4("Key milestones"),
        ul([
          "Ancient Rome: agri cultura = cultivation of land. Cicero (1st c. BCE) coined cultura animi — cultivation of the soul.",
          "Middle Ages: term faded; replaced by 'cult'. Culture = humanity, what separates humans from barbarism.",
          "Renaissance: culture = personal development, humanistic ideal (Michelangelo's David, Raphael's Sistine Madonna).",
          "Enlightenment (17th–18th c.): Herder, Montesquieu, Voltaire — culture through reason, social order, science, arts.",
          "19th century: culture became an analytical/scientific category; intersected with 'civilization.'",
          "20th century (Marxist view): culture = result of human labor, reflects transformations of nature and society.",
        ]),
        key(
          "Founding term",
          "Leslie Alvin White (US anthropologist) coined 'Cultural Studies' as an interdisciplinary field (anthropology + philosophy + sociology + semiotics).",
        ),
        h3("2. Culture vs. Civilization"),
        p("Often used synonymously but represent different dimensions:"),
        table(
          ["Aspect", "Culture (Internal)", "Civilization (External)"],
          [
            ["What it is", "Values, beliefs, ethics, traditions, norms, religion, morals", "Tools, cities, infrastructure, technology, agriculture, institutions"],
            ["Focus", "How people think, believe, practice", "What people build, organize, leave behind"],
            ["Result", "Social behavior, worldview, spiritual life", "Physical/material development"],
          ],
        ),
        h3("3. Definitions of Culture"),
        p(
          "In 1952, Alfred Kroeber & Clyde Kluckhohn compiled 200+ definitions, organized into 8 categories: topical, historical, behavioral, normative, functional, mental, structural, and symbolic.",
        ),
        key(
          "Edward Tylor (1871)",
          "Culture is that complex whole which includes knowledge, belief, art, morals, law, custom, and any other capabilities and habits acquired by man as a member of society.",
        ),
        h3("4. Theoretical Views on Culture"),
        h4("Symbolic view (Clifford Geertz & Victor Turner)"),
        p(
          "Symbols are both practices of social actors AND the context giving those practices meaning. Anthony Cohen: common symbols allow communication while preserving personal significance. Symbols are the 'webs of significance.'",
        ),
        h4("Sociobiological theory (Richard Dawkins, 1976)"),
        p("Meme = unit of cultural transmission/imitation, analogous to biological genes."),
        ul([
          "Meme → absorbed unconsciously",
          "Theme (sim) → conscious behavioral response based on internalized memes",
          "Dream/Ritual → deeply influences worldview",
        ]),
        tip(
          "Example: Kazak hospitality — 'when a guest arrives blessings come with them' (meme) → ritual of serving tea/food (theme) → hosting rituals for Nauryz/weddings/funerals (ritual) → hospitality as sacred (worldview).",
        ),
        h3("5. Morphology of Culture"),
        p(
          "Branch analyzing the structure of culture as a social phenomenon — regularities in composition and how cultural forms are created.",
        ),
        ul([
          "Material culture: tangible objects — tools, furniture, books, buildings",
          "Non-material (spiritual) culture: customs, traditions, beliefs, language, art, religion, lore",
        ]),
        h4("Two-tiered structure"),
        ul([
          "Specialized level: cumulative (economics, politics, science, art, philosophy) + translational (education, mass media, social institutions)",
          "Everyday level: daily life, traditional morals/customs, general morality, everyday worldview, simple technologies",
        ]),
        h3("6. Types of Culture"),
        ul([
          "Folk culture: oral traditions, crafts, rituals (Nauryz, Kazak epics, yurts — UNESCO heritage)",
          "Elite/High culture: classical music, fine arts, philosophy, opera",
          "Mass culture: commercial, media-driven — pop music, cinema, fashion, TikTok, K-pop",
          "Ecological culture: ethical norms for human-environment interaction",
          "Digital culture: norms/forms emerging from digital technology and the internet",
        ]),
        h3("7. Language of Culture"),
        p(
          "Language encodes cultural meanings, social norms, and shared experiences — it doesn't just describe reality; it shapes it.",
        ),
        ul([
          "Sapir-Whorf Hypothesis: language influences thought and perception",
          "Politeness & hierarchy: formal/informal speech (Japanese honorifics; Kazak 'aga/apa')",
          "Hospitality in language: rituals reinforce social bonds (kumiss/shubat for guests)",
          "Idioms & values: 'Time is money' (USA) vs. 'Keep calm and carry on' (UK)",
          "Cross-cultural challenges: language barriers, non-verbal differences",
        ]),
      ],
    },
    {
      id: "lecture-2",
      number: 2,
      title: "Semiotics of Culture: Anatomy of Culture",
      subtitle: "Saussure, Peirce, Lotman, Barthes, cultural symbols",
      blocks: [
        h3("1. What is Semiotics of Culture?"),
        p(
          "Understanding culture as a system of signs and symbols. The 'anatomy of culture' = internal structure: space, dimensions, and forms of culture.",
        ),
        h3("2. Ferdinand de Saussure (European Tradition)"),
        ul([
          "Signifier: form of the sign (sound, word, visual symbol)",
          "Signified: concept/meaning the sign represents",
          "Relationship is arbitrary — no natural connection",
          "Langue: structured system of rules | Parole: actual speech use",
          "Synchrony vs. Diachrony: language at one moment vs. evolving over time",
        ]),
        key("Semiology", "Saussure proposed semiology — science of all types of signs in society, not just words."),
        h3("3. Charles Sanders Peirce (American Tradition)"),
        h4("Three types of signs"),
        ul([
          "Icon: resembles what it represents (photograph, pictograms, maps)",
          "Index: logical connection (smoke = fire; footprint = animal)",
          "Symbol: learned/arbitrary (national flag)",
        ]),
        key(
          "Interpretant",
          "Meaning is a mental process in the interpreter's mind. Each interpretation can become a new sign → unlimited semiosis. Example: smoke → fire → danger → call for help.",
        ),
        h3("4. Saussure vs. Peirce"),
        table(
          ["Aspect", "Saussure (European)", "Peirce (American)"],
          [
            ["Focus", "Language structure", "Logic, cognition, all sign types"],
            ["Sign parts", "Signifier + Signified", "Sign + Object + Interpretant"],
            ["Meaning", "Relations within language system", "Mental interpretation process"],
            ["Key concept", "Semiology", "Semiosis / Unlimited semiosis"],
          ],
        ),
        h3("5. Yuri Lotman & Cultural Semiotics"),
        ul([
          "Culture as unified whole of inherited information societies accumulate and transmit",
          "Text (Lotman) = any cultural artifact carrying meaning (novel, ritual, monument, fashion)",
          "Codes = invisible rules; internalizing codes lets people function in society",
          "Semiosfera (semiosphere) = space where sign systems interact and produce meaning",
        ]),
        h3("6. Charles Morris — Semiotics as Behavior"),
        p("Signs guide human actions. Four components of semiosis:"),
        ul([
          "Sign vehicle: physical form (red traffic light)",
          "Interpreter: perceives the sign (driver)",
          "Designatum: object/concept referred to (rule: stop)",
          "Interpretant: mental reaction (driver hits brakes)",
        ]),
        h4("Three subfields"),
        ul([
          "Semantics: signs and what they represent",
          "Syntactics: relationships between signs (grammar)",
          "Pragmatics: effects of signs on behavior",
        ]),
        h3("7–9. Kristeva, Vygotsky, Barthes"),
        p(
          "Julia Kristeva — semianalysis: how meaning is produced through tensions in language. Lev Vygotsky — language as cognitive tool; higher-order thinking through inner speech. Roland Barthes — Mythologies (1963): myth = second-order sign system with ideological meaning (e.g., soldier saluting flag).",
        ),
        h3("10. Cultural Symbols"),
        ul([
          "Circle = cosmos/unity | Triangle = fertility | Cross = world tree | Square = material world",
          "Ouroboros = eternity | Turkish Nazar = protection from evil eye",
          "Maple leaf (Canada) = national identity | Golden Warrior (Kazakhstan) = independence",
          "Kazak Dombra = cultural soul and cosmic harmony",
        ]),
      ],
    },
    {
      id: "lecture-3",
      number: 3,
      title: "Nomadic Culture of Kazakhstan",
      subtitle: "Nomadism, Tengriism, digital nomads, Saka & Scythians",
      blocks: [
        terms([
          { term: "Cosmogony", definition: "Study of origin of cosmic bodies; theory/myth of universe origin" },
          { term: "Tengriism", definition: "Religion of ancient Eurasian nomads (Turks & Mongols)" },
          { term: "Tengri", definition: "'Heaven' — highest cult, Central Asia from 5th–1st millennium BCE" },
          { term: "Syncretism", definition: "Unity of dance, song, ritual — no separation" },
          { term: "Nomadism", definition: "Society where majority engages in extensive nomadic pastoralism" },
        ]),
        h3("1. Nomadism — Definition & Classification"),
        p("Three main characteristics:"),
        ul([
          "Extensive pastoralism as dominant economic activity",
          "Recurrent movement of population and livestock",
          "Particular material culture and specific worldview",
        ]),
        h4("Types & geography"),
        ul([
          "Types: nomadic, semi-nomadic, semi-sedentary, sedentary, distant, yayla-type",
          "Movement: vertical (mountain/flat) and horizontal (latitudinal, meridian, circular)",
          "7 zones: Eurasian steppe, Middle East/Iran/Afghanistan, Arabian Desert & Sahara, East Africa, sub-Saharan Africa, Inner Asian plateaus, subarctic, Great Plains of North America",
        ]),
        h3("2. Contributions of Nomads to World Civilization"),
        p("UNESCO: nomads made huge contribution to Asian countries and the wider world."),
        ul([
          "Bronze and iron tools and military weapons",
          "Technology for clothing from animal skin, wool, and fluff",
          "Emergence of the Great Silk Road",
          "Formation of dialects, clans, tribes, and states",
          "Iranian, European, Semitic, Turkic, and Mongolian language groups through migrations",
        ]),
        h3("3. Digital Nomadism"),
        ul([
          "Marshall McLuhan (1960s–70s): predicted modern nomads without permanent home",
          "Jacques Attali: rich travel for business; poor seek better living",
          "Tsugio Makimoto & David Manners: Digital Nomad",
          "Manuel Castells: virtual (internet) and global (physical) mobility",
          "Irina Kushilova: socio-cultural phenomenon connected to ICT",
        ]),
        tip("Accelerated during COVID-19. 'Freedom without limitation' still depends on internet quality and devices."),
        h3("4. Ancient Turkic Civilization — Cosmogony & Mythology"),
        p("Syncretism — no separation between dance, religion, ritual, art."),
        h4("Religious evolution"),
        ul([
          "8th–9th c.: Zoroastrianism and Manichaeism/Buddhism in Altai and East Turkestan",
          "Mid-10th c.: Karakhanids proclaimed Islam → Islamization complete",
        ]),
        h4("Tengriism — hierarchy of deities"),
        ul([
          "Tengri: supreme heaven deity",
          "Jer/Yer: earth/spirits — mutually helping, not opposites",
          "Gutengri: center of Turkic worldview; prosperity",
          "Yoltengri: messenger of Tengri; daring and freedom",
          "Viruttengri: takes souls of warriors to the sky",
          "Erlik: master of the underworld",
        ]),
        h3("5. Saka, Scythians, Taxakid & Anacharsis"),
        p(
          "Taxakid — educated Scythian healer in Athens (Lucian). Legend: ghost advised watering streets with wine during plague.",
        ),
        key(
          "Anacharsis",
          "Scythian thinker, member of the Areopagus in Athens. Philosophy: 'Speech cannot be bad if thoughts are good, and good action follows good thoughts.' — ethics over eloquence.",
        ),
      ],
    },
    {
      id: "lecture-4",
      number: 4,
      title: "Medieval Culture of Central Asia",
      subtitle: "Urban culture, Silk Road, al-Farabi, Sufism, Yassawi",
      blocks: [
        h3("1. Formation of Medieval Urban Culture"),
        p(
          "Cities on Syr Darya, Talas, Shu, Ili (Ispijab, Utrar, Taraz, Suyab, Kayalik…) — centers on the Great Silk Road.",
        ),
        h4("Urban structure"),
        ul([
          "Citadel: fortified center; palaces with paintings, clay coverings, carved wood",
          "Sharistan: ruler and nobility residence (includes citadel)",
          "Rabat: suburban craft settlement",
        ]),
        ul([
          "Mosques (9th–12th c.) | Bazaars ('souk', 'awok', 'bazar')",
          "Bathhouses (10th–12th c. in South Kazakhstan)",
          "Houses: one-room or two-room with storage",
        ]),
        h3("2. Craft Specialization & Trade"),
        ul([
          "Glazed ceramics — decanters, jugs, bowls; craftsmen guilds",
          "Metal work: blacksmithing, copper dishes, lamps, jewelry",
          "Glass production for window discs",
          "Silk Road: Suyab → Taraz → Ispijab → Farab/Utrar → Shavgar/Turkistan",
        ]),
        h3("3. Mongol Invasion & Timur Renaissance"),
        p(
          "Mongol invasion disrupted urban culture. Revival from mid-13th c. Timur Empire → stability, Ahmed Yassawi Mosque, Arnamb Mosque. Ahmad Yassawi Mosque — UNESCO World Heritage.",
        ),
        h3("4. Yusuf Balasaguni — Kutadgu Bilig (1069–70)"),
        key(
          "Kutadgu Bilig",
          "'Blessed Knowledge' — first book of wisdom in Turkic language. Political treatise: ideal society, righteous ruler, law and intelligence.",
        ),
        h3("5. Mahmud al-Kashgari — Diwan Lughat at-Turk"),
        p(
          "Most massive monument of Turkic language — only source on medieval Turkic life: material culture, ethnonyms, food, astronomy, geography, military language, heroes, children's games.",
        ),
        h3("6. Al-Farabi (870–950) — Second Teacher"),
        key(
          "Muallim as-Sani",
          "'Second Teacher' (Aristotle = First). Native of Utrar. Works: The Big Book of Music, On the Classification of Sciences, The Gems of Wisdom, The Virtuous City. Synthesized Arab, Persian, Greek, Indian, and Turkic cultures.",
        ),
        h3("7. Sufism in Central Asia"),
        p(
          "Mystical Islamic practice — divine love through direct experience. 'Sufi' from Arabic suf (wool). Also fuqara (the poor), darwish (Persian).",
        ),
        ul([
          "Educators and missionaries — spread Islam peacefully across Central Asia",
          "Literary impact on Arabic, Persian, Turkish, Urdu, and more",
          "In Kazakhstan (11th–12th c.): blended with shamanism; loud dhikr; tariqas: Yasawi, Naqshbandi, Qadariyya",
        ]),
        key(
          "Khoja Ahmed Yassawi",
          "Diwani Hikmet in Turkic — called 'Qurani Turki'. Sacred sites: Turkistan, Arystanbab, Bikata. No violent persecution in Kazakhstan.",
        ),
      ],
    },
    {
      id: "lecture-5",
      number: 5,
      title: "Formation of Kazak Culture (15th–19th centuries)",
      subtitle: "Khanate, oral poetry, batyrs, music, Zar Zaman",
      blocks: [
        h3("1. Proto-Kazak Roots"),
        p(
          "Muhammad Orbekov: proto-Kazak period from Saka-Hunnic times to mid-1st millennium CE. Language, worldview, and rituals rooted before the Kazak Khanate.",
        ),
        h3("2. Kazak Khanate (15th–19th c.)"),
        p("Classical era: oral literature, customary law, religious life, collective memory."),
        h4("Islam + Tengriism syncretism"),
        ul([
          "Eid al-Fitr and Eid al-Adha",
          "Pre-Islamic customs: night guard, purification by fire, burial near winter dwelling",
          "Jar (coral wedding song) — community approval for marriage",
          "'God (Allah) and Tengri gave it' — dual divine invocation",
        ]),
        h3("3. Oral Poetry — Genres"),
        ul([
          "Tol: instructive/reflective songs",
          "Ritual songs, proverbs, fairy tales",
          "Heroic epics: Koblandy, Alpamys, Karatkalpak",
          "Lyrical epics: love, beauty, morals",
        ]),
        p("Poets: Asan Kaigy, Shalk, Dospambet, Zhambyl, Bukhar Zhyrau…"),
        h3("4. Institution of Batyr"),
        p(
          "Warriors specialized in military art. Titles: onbasy (ten), zhizbasy (hundred). Political roles at Khan's meetings. Abai: 'Kazak people title those batyrs who have big hearts.'",
        ),
        h3("5. Written Histories"),
        ul([
          "Jami at-Tawarikh (Kadyr Ali Jalairi) — 13th–16th c. Kazakhstan and Central Asia",
          "Tarikh-i Rashidi (Muhammad Haidar Dulati, 1543–46) — Chaghatai Ulus, founders Janibek and Kerei",
        ]),
        h3("6. Musical Creativity"),
        p(
          "Kurmangazy (1823–1896): dombra virtuoso — Aksak kula, Adai, Saryarka, Alatau. Tattimbet: classical 'shed' style. Daulet-Seraly Musa: satirical Aissa, introduced violin.",
        ),
        h3("7. Zar Zaman — Era of Sorrow (19th century)"),
        key(
          "Zar Zaman",
          "Crisis under Russian colonization. Shortanbai founded the genre; criticized bayism and zhatak (landless). Themes: anti-colonial sentiment, akhirzaman (end of time). Branded 'reactionary' in Stalin era.",
        ),
      ],
    },
    {
      id: "lecture-6",
      number: 6,
      title: "Kazak Culture in the 20th Century: Soviet Period",
      subtitle: "Education, higher ed, literature, arts, cinema",
      blocks: [
        h3("1. Soviet Cultural Policy"),
        p(
          "New culture based on partisanship, class ideology, and socialism. Symbols: communism, equal opportunities, free education and healthcare — but also boundaries, limitations, hatred of non-Soviet worldviews.",
        ),
        h3("2. Soviet Education"),
        ul([
          "Late 1917–1918: first literacy schools in Akmola, Almaty",
          "Unified labor schools: Level 1 (8–13), Level 2 (13–17)",
          "1939: literacy under 15 ≈ 98.3% | 1943: universal compulsory primary education",
        ]),
        h4("Problems"),
        ul([
          "School as tool for obedient ideological generation",
          "Pioneer and Komsomol propagated Stalinist dogma",
          "Books by Baitursynov and other intelligentsia withdrawn",
        ]),
        h3("3. Higher Education"),
        ul([
          "1928: first Kazak National Pedagogical University (Abai), Almaty",
          "1934: Kazak State University (now KazNU al-Farabi)",
          "1946: Academy of Sciences — Kanish Satpayev, 50 institutions, ~5,000 scientists",
        ]),
        h3("4. Soviet Literature & Arts"),
        key(
          "Abai by Mukhtar Auezov",
          "Stalin Prize 1st degree — 'encyclopedia of Kazak people's life.' Baurzhan Momyshuly: 'Spiral of Baurzhan,' Panfilov Division, studied in military universities worldwide.",
        ),
        h3("5–6. Theater, Music, Fine Art, Cinema"),
        ul([
          "European genres with national content — Yer Targyn, Abai opera",
          "Nikolai Khludov — painting studio Almaty 1920; 1958 Moscow exhibition 500+ works",
          "First movie: Amangeldy (1916 uprising)",
        ]),
        tip("Cultural independence began December 16, 1991."),
      ],
    },
    {
      id: "lecture-7",
      number: 7,
      title: "Kazak Culture in the Context of Modern World Processes",
      subtitle: "Globalization, identity, contemporary art",
      blocks: [
        h3("1. Globalization & Cultural Identity"),
        p(
          "Formation of relationships in economy, military, finance, information, technologies. Problems: identity challenges, fear of losing national identity, unequal development.",
        ),
        ul([
          "Localization of national culture",
          "Integration into planetary culture",
        ]),
        h3("2. Identity — Definition & Types"),
        p("'Who am I, what is my role in the world.'"),
        ul([
          "Positive identity: 'We are like them' — belonging through shared values",
          "Negative identity: 'We are different and better' — can lead to xenophobia",
          "Types: personal, state/collective, gender, sexual, ethnic, national",
        ]),
        key(
          "Lev Gumilev",
          "Identity = objective basis for mobilization — the 'passionate force' of society.",
        ),
        h3("3. Types of Culture in Contemporary Kazakhstan"),
        ul([
          "Known vs. unknown culture",
          "Culture of social groups: children's, youth, adult",
          "Capital vs. local (urban vs. rural)",
        ]),
        h3("4. Contemporary Art (Post-1991)"),
        p(
          "Artists lost Soviet government orders — had to experiment. Main trend: Tengrian elements and national identity codes in modern forms.",
        ),
        ul([
          "Rustam Khalfin: minimalistic 3 colors — figure without head between two walls (1990s marginalization)",
          "Sergei Maslov: kobuz + modern elements; sculptures from car tires",
          "Solo Suleimanova: plastic bags; famine, December 1986 protests; 'Between Us Girls'",
        ]),
      ],
    },
    {
      id: "lecture-8",
      number: 8,
      title: "Museums, Cultural Institutions & Hofstede",
      subtitle: "Museums, Menin El, six cultural dimensions",
      blocks: [
        h3("1. Museums & Cultural Memory"),
        p(
          "Museums preserve ethnic memory. Programs: Menin El ('My Country'), Cultural Heritage Program. Trends: interactive exhibitions, Night in Museum (May 8), aul-museums.",
        ),
        tip("Example: Karaganda mining museum — Makhmet Turdaldin; minerals, British power plant, German locomotive."),
        h3("2. Hofstede's Six Cultural Dimensions"),
        p("Geert Hofstede — IBM research in 50+ countries (late 1970s)."),
        h4("1. Power Distance Index (PDI)"),
        p("High PDI (Kazakhstan): hierarchical; students stand for teachers; boss isolated. Low PDI (USA): egalitarian."),
        h4("2. Individualism vs. Collectivism"),
        p("Kazakhstan: collectivist — group decisions, loyalty to group."),
        h4("3. Masculinity vs. Femininity"),
        p("Kazakhstan: roughly 50/50, slightly masculine."),
        h4("4. Uncertainty Avoidance (UAI)"),
        p("High UAI (Kazakhstan): predictable life; innovation difficult. Low UAI: relaxed, risk-taking."),
        h4("5. Long-term vs. Short-term"),
        p("Kazakhstan: long-term — Kazakhstan 2030, 2050 plans; pragmatic and thrifty."),
        h4("6. Indulgence vs. Restraint"),
        p("Kazakhstan & Russia: restraint — suppressing gratification; social norms govern behavior."),
        key(
          "Kazakhstan profile",
          "High PDI, Collectivist, Masculine (roughly), High UAI, Long-term, Restraint.",
        ),
      ],
    },
    {
      id: "lecture-9",
      number: 9,
      title: "Cultural Policy in Kazakhstan & Cultural Shock",
      subtitle: "Mangilik El, glocalization, Oberg's four stages",
      blocks: [
        h3("1. Kazakhstan Model of Cultural Policy"),
        ul([
          "Kazakhstani patriotism and sustainable values",
          "All-Kazakhstan cultural space — national diversity",
          "Integration into global cultural space",
          "Mangilik El format for heritage and tourism",
        ]),
        h3("2. Modernization vs. Multiculturalism"),
        p(
          "Modernization (1960s–70s): Kazakhstan won among Central Asian countries conceptualizing reforms. Multiculturalism: equal respect, celebrating diversity — debated vs. strengthening identity against globalization.",
        ),
        h3("3. Mangilik El — Seven Principles"),
        p(
          "Introduced by Nazarbayev, January 2014 — 'Kazakhstan's Way — 2050.' National ideology for Kazak nation and 130+ nationalities.",
        ),
        h3("4. Globalization vs. Glocalization"),
        key(
          "Glocalization (Robertson)",
          "Adaptation of borrowed elements locally. Q-POP: K-pop features + Kazak language, rhythm, music.",
        ),
        h3("5. Cultural Shock — Kalervo Oberg"),
        p(
          "Anxiety from losing familiar signs and symbols of social intercourse. Culture is learned — moving to a new environment requires adjustment.",
        ),
        h4("8 influencing factors"),
        ul([
          "Previous intercultural experience | Prior knowledge | Linguistic ability",
          "Human values | Personality | Similarities between cultures",
          "Geography and weather | Situation in new environment",
        ]),
        h4("4 stages"),
        table(
          ["Stage", "Name", "Characteristics"],
          [
            ["1", "Honeymoon", "Euphoric; language seems easy; everything fine"],
            ["2", "Rejection", "Tiredness; food/weather problems; homesickness"],
            ["3", "Adjustment", "Routines; new friends; understands culture isn't 'wrong'"],
            ["4", "Mastery", "Feels native; 2–5+ years"],
          ],
        ),
      ],
    },
    {
      id: "lecture-10",
      number: 10,
      title: "Cultural Heritage, UNESCO & Globalization",
      subtitle: "Heritage, SDGs, tradition vs. innovation, Astana",
      blocks: [
        h3("1. What is Cultural Heritage?"),
        p(
          "Chris Barker: tangible artifacts + intangible attributes (language, music, ritual). Active process of meaning-making — communities shape identities.",
        ),
        h3("2. UNESCO & Kazakhstan"),
        h4("Cultural World Heritage (3)"),
        ul([
          "Mausoleum of Khoja Ahmed Yassawi (Turkistan)",
          "Petroglyphs of Tamgaly (5,000+ Bronze Age carvings)",
          "Silk Roads: Chang'an-Tianshan Corridor",
        ]),
        h4("Natural Heritage (3)"),
        ul(["Saryarka steppe and lakes", "Western Tien-Shan", "Cold Winter Deserts of Turan"]),
        h4("Intangible Heritage"),
        ul(["Aitysh/Aitys", "Dombra", "Nauryz", "Traditional games", "Falconry"]),
        h3("3. Cultural Heritage State Program (2004)"),
        ul([
          "35+ sites restored | 80+ archaeological excavations",
          "Challenges: urbanization, outdated registries, need for research",
        ]),
        h3("4–6. Identity, Sports, SDGs"),
        ul([
          "Oral traditions, Islam, Soviet legacy, urbanization shape identity",
          "Sports: kurys, kokpar, asyk — intangible heritage + tourism",
          "SDGs 8, 11, 17 — culture underpins all 17 goals",
        ]),
        h3("7–8. Globalization & Hybridity"),
        p(
          "Opportunities: global visibility, digital preservation. Challenges: pop culture overshadowing traditions, Kazak language vs. Russian/English.",
        ),
        key(
          "Homi Bhabha",
          "Cultures are 'in between' — hybridity where tradition and innovation merge. Tlenov: tradition = foundation; innovation = change filtered through norms.",
        ),
        h3("9. Astana — Tradition + Innovation"),
        ul([
          "Baiterek: tree of life, golden egg (Akmyrza Rustambekov)",
          "Khan Shatyr: nomadic tent (Norman Foster)",
          "Pyramid of Peace, Hazrat Sultan Mosque, Mangilik El Arch",
        ]),
        h3("10. Cultural Ecology & Institutions"),
        p(
          "Julian Steward: culture adapts to geography. Three UNESCO landscape types: designed, organically evolved, associative (Ulytau). Museums, cultural centers, schools carry living heritage.",
        ),
        tip(
          "Final insight: Kazakhstan's heritage is living and adaptive — cultural resilience protects knowledge, rituals, landscapes, and stories that define who we are.",
        ),
      ],
    },
  ],
  quickReference: [
    { scholar: "Cicero", field: "Roman Philosophy", contribution: "Cultura animi — cultivation of the soul" },
    { scholar: "Leslie A. White", field: "Anthropology", contribution: "Coined 'Cultural Studies' as a discipline" },
    { scholar: "Tylor (1871)", field: "Anthropology", contribution: "Classic definition of culture" },
    { scholar: "Kroeber & Kluckhohn", field: "Anthropology", contribution: "200+ definitions in 8 categories (1952)" },
    { scholar: "Clifford Geertz", field: "Symbolic Anthropology", contribution: "Symbols = webs of significance" },
    { scholar: "Richard Dawkins", field: "Biology/Culture", contribution: "Meme theory (1976)" },
    { scholar: "Ferdinand de Saussure", field: "Linguistics", contribution: "Signifier/Signified; Langue/Parole; Semiology" },
    { scholar: "Charles Sanders Peirce", field: "Semiotics", contribution: "Icon/Index/Symbol; Unlimited semiosis" },
    { scholar: "Yuri Lotman", field: "Cultural Semiotics", contribution: "Semiosfera; culture as texts and codes" },
    { scholar: "Charles Morris", field: "Semiotics", contribution: "Semantics/Syntactics/Pragmatics" },
    { scholar: "Julia Kristeva", field: "Semiotics/Lit.", contribution: "Semianalysis" },
    { scholar: "Lev Vygotsky", field: "Psychology", contribution: "Language as cognitive tool; inner speech" },
    { scholar: "Roland Barthes", field: "Cultural Theory", contribution: "Mythologies — second-order sign systems" },
    { scholar: "Al-Farabi", field: "Philosophy", contribution: "Muallim as-Sani; The Virtuous City" },
    { scholar: "Al-Kashgari", field: "Linguistics", contribution: "Diwan Lughat at-Turk" },
    { scholar: "Yusuf Balasaguni", field: "Literature", contribution: "Kutadgu Bilig (1069)" },
    { scholar: "Kalervo Oberg", field: "Anthropology", contribution: "Cultural shock; 4 stages" },
    { scholar: "Geert Hofstede", field: "Cross-cultural Psych.", contribution: "6 Cultural Dimensions" },
    { scholar: "Homi Bhabha", field: "Post-colonial Theory", contribution: "Cultural hybridity" },
    { scholar: "Julian Steward", field: "Cultural Ecology", contribution: "Culture as human-environment adaptation" },
  ],
};
