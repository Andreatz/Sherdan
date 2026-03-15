export type LocationType = 'region' | 'city';

export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  x: number;
  y: number;
  r?: number;
  shortDescription: string;
  fullDescription: string;
  regionSlug?: string;
}

export const MAP_LOCATIONS: MapLocation[] = [
  // ── REGIONI ──────────────────────────────────────────────────────────────
  {
    id: 'tharros',
    name: 'Tharros',
    type: 'region',
    x: 27,
    y: 54,
    r: 2,
    shortDescription: 'Il Gioiello d\'Ottone e Vapore. Metropoli verticale dominata dall\'ingegneria e dall\'Obsidium raffinato, governata dal Consiglio del Progresso.',
    fullDescription: 'Tharros è costruita su un massiccio promontorio di granito bianco che si affaccia sulla Madre. L\'aria ha un sapore metallico di rame e ozono, il suono è un ronzio costante di ingranaggi e pistoni. La società è divisa in tre livelli verticali: Aurea (élite), Il Meccanismo (classe lavoratrice) e Il Ventre (gli scarti). Governa il Consiglio del Progresso, sette individui scelti per il valore dei loro brevetti.',
    regionSlug: 'tharros',
  },
  {
    id: 'arborea',
    name: 'Arborea',
    type: 'region',
    x: 68,  // un po' più a sinistra (era 72)
    y: 48,
    r: 2,
    shortDescription: 'Il Santuario Vivente. Città-foresta bioluminescente dove la natura domina la tecnologia, patria degli Elfi e dei druidi del Circolo dei Custodi.',
    fullDescription: 'Arborea non sembra costruita, ma emersa. La città è un\'unica entità biologica cresciuta in millenni di simbiosi tra elfi, spiriti e flora. Si sviluppa in verticale: Il Sottobosco (oscuro e pericoloso), L\'Intreccio (vita civile sospesa tra i rami) e La Fronda (élite spirituale tra le cime). La governa la Matriarca Sylvanas, un\'elfa antica quanto la Scissione.',
    regionSlug: 'arborea',
  },
  {
    id: 'eshterzyli',
    name: 'Eshterzyli',
    type: 'region',
    x: 35,  // leggermente più a destra (era 38)
    y: 14,  // pochissimo più in basso (era 13)
    r: 2,
    shortDescription: 'Il Bastione di Cenere e Sangue. Fortezza-città ai piedi di un vulcano attivo, dominata da una cultura marziale e dalle fonderie più grandi del mondo.',
    fullDescription: 'Eshterzyli sorge ai piedi del Monte Arxi. Il cielo è perennemente tinto di rosso e nero dalla cenere vulcanica. La città è organizzata come una fortezza concentrica: il Vallo di Ferro (anello esterno militare) e la Caldera Industriale (cuore produttivo con fonderie alimentate dalla lava). La circonda la Foresta Ruggine, con alberi dalla corteccia nera dura come il ferro e foglie color autunno perenne.',
    regionSlug: 'eshterzyli',
  },
  {
    id: 'urash',
    name: 'Urash',
    type: 'region',
    x: 76,  // un bel po' più a sinistra (era 83)
    y: 76,  // un po' più in basso (era 72)
    r: 2,
    shortDescription: 'I Custodi Silenziosi. Città a terrazze tra le vette innevate, regno di Goliath e monaci che praticano la neutralità armata e custodiscono antiche sorgenti di Obsidium.',
    fullDescription: 'Urash si innalza sulle catene montuose del sud-est, con vette perennemente innevate e aria rarefatta. La città è costruita a terrazze sulle pareti rocciose. È il regno dei Goliath, dei monaci, degli Aarakocra e dei Duergar. La filosofia locale è la Neutralità Armata: non attaccano nessuno, ma sono pronti a difendersi con ferocia assoluta. Nelle valli nascoste esistono sorgenti termali riscaldate dall\'Obsidium.',
    regionSlug: 'urash',
  },
  {
    id: 'domus-nova',
    name: 'Domus Nova',
    type: 'region',
    x: 63,  // un po' più a sinistra (era 67)
    y: 22,  // di molto più in basso (era 11)
    r: 2,
    shortDescription: 'Dove il Mondo Finisce. Arcipelago anarchico di pirati e reietti, labirinto di isole tropicali dove la Fratellanza della Marea ha costruito il suo impero.',
    fullDescription: 'Domus Nova è un arcipelago di isole tropicali insidiose, coperte da giungle umide e circondate da barriere coralline affilate. È la casa della Fratellanza della Marea: marinai, operai fuggiaschi e disertori che rifiutano le leggi delle grandi nazioni. Qui vivono tutte le razze mescolate: Tiefling, Mezzorchi, Tabaxi e molti altri. La legge è solo quella del più forte.',
    regionSlug: 'domus-nova',
  },

  // ── CITTÀ ────────────────────────────────────────────────────────────────
  {
    id: 'ultima-dimora',
    name: 'Ultima Dimora',
    type: 'city',
    x: 20,  // un bel po' più a destra (era 23)
    y: 18,  // più in alto (era 21)
    r: 1.2,
    shortDescription: 'Avamposto ai margini del Mare Senza Tempo, dove il ghiaccio eterno incontra la civiltà. Sopravvive grazie alla caccia alle balene e agli scambi con Tharros.',
    fullDescription: 'Ultima Dimora è l\'insediamento più settentrionale di Sherdan, situato ai margini del deserto bianco del Mare Senza Tempo. Il clima è implacabile, un inverno perenne che non concede tregua. La fauna locale è composta da orsi polari corazzati da placche ossee e dai temibili Remorhaz. Le acque gelide ospitano balene franche grandi come galeoni, cacciate per il loro grasso essenziale per lubrificare gli ingranaggi di Tharros.',
  },
  {
    id: 'porto-antico',
    name: 'Porto Antico',
    type: 'city',
    x: 47,  // un bel po' più a destra (era 39)
    y: 27,  // più in alto (era 33)
    r: 1.2,
    shortDescription: 'Scalo commerciale strategico tra Tharros e il continente orientale. Porto trafficato dove si incrociano merci lecite e traffici clandestini.',
    fullDescription: 'Porto Antico è uno degli snodi commerciali più importanti della Madre. Situato sulla costa tra Tharros e il cuore del continente, accoglie navi mercantili da entrambi gli emisferi. È un luogo cosmopolita e spesso caotico, dove le dogane di Tharros cercano di mantenere il controllo su un flusso inarrestabile di merci, persone e segreti.',
  },
  {
    id: 'luxia',
    name: 'Luxia',
    type: 'city',
    x: 28,  // di poco più a sinistra (era 30)
    y: 37,  // un po' più in alto (era 40)
    r: 1.2,
    shortDescription: 'Il cancello delle Pianure Verdi. Città agricola meccanizzata che funge da porta d\'accesso alle fertili terre intorno a Tharros.',
    fullDescription: 'Luxia funge da cancello per le Pianure Verdi, un tempo praterie sconfinate oggi segnate dalle cicatrici del progresso. È circondata da campi coltivati in modo intensivo grazie a macchine agricole semoventi. La popolazione è cosmopolita, con una prevalenza di Umani, Gnomi inventori e Halfling. La fauna locale mostra spesso segni di mutazione dovuta alle scorie di Obsidium.',
  },
  {
    id: 'solitaria',
    name: 'Solitaria',
    type: 'city',
    x: 9,   // leggermente più a sinistra (era 11)
    y: 52,  // leggermente più in alto (era 55)
    r: 1.2,
    shortDescription: 'Città isolata sulle scogliere di granito grigio della costa ovest, avvolta da nebbie perenni. I suoi abitanti vivono di pesca e leggende antiche.',
    fullDescription: 'Solitaria è isolata dalle montagne e si affaccia sul mare aperto, circondata da scogliere di granito grigio e nebbie perenni. È un luogo malinconico dove la gente vive di pesca e leggende. Lontana dall\'influsso diretto di Tharros, conserva antiche tradizioni e un senso di malinconica indipendenza.',
  },
  {
    id: 'bonorxili',
    name: 'Bonorxili',
    type: 'city',
    x: 20,  // di poco più a sinistra (era 22)
    y: 71,  // un po' più in alto (era 75)
    r: 1.2,
    shortDescription: 'Ultimo avamposto della natura selvaggia a sud-ovest. Foreste antiche e oscure, abitate da Treant e reietti che rifiutano la tecnologia di Tharros.',
    fullDescription: 'Bonorxili si trova nell\'estremo sud, dove le foreste sono fitte, scure e antiche, simili a quelle che coprivano il mondo prima della Scissione. Gli abitanti sono spesso Mezzelfi o Umani reietti che rifiutano la tecnologia di Tharros, vivendo in simbiosi con la boscaglia. Si dice che in queste foreste si nascondano ancora i Treant e Orsigufi particolarmente aggressivi.',
  },
  {
    id: 'crocevia-del-viandante',
    name: 'Crocevia del Viandante',
    type: 'city',
    x: 54,
    y: 33,  // pochissimo più in alto (era 35)
    r: 1.2,
    shortDescription: 'L\'unico punto neutrale ai margini di Arborea. Radura commerciale dove i mercanti audaci scambiano merci con i druidi della foresta.',
    fullDescription: 'Il Crocevia del Viandante è l\'unico punto sicuro al confine con Arborea: una radura neutrale dove mercanti audaci scambiano merci con i druidi locali. È uno dei pochi luoghi dove Tharros e Arborea si trovano, almeno commercialmente, faccia a faccia. Le tensioni politiche si fanno sentire, ma il profitto supera spesso l\'ideologia.',
  },
  {
    id: 'mineralia',
    name: 'Mineralia',
    type: 'city',
    x: 78,  // di poco più a sinistra (era 80)
    y: 38,  // un bel po' più in basso (era 28)
    r: 1.2,
    shortDescription: 'Città nelle anomalie magnetiche del nord-est. Canyon rossi e rocce fluttuanti dovute all\'Obsidium grezzo nel sottosuolo, abitata da Genasi e tribù Firbolg.',
    fullDescription: 'Mineralia è un deserto roccioso di canyon rossi e formazioni geologiche impossibili: le rocce fluttuano a pochi metri da terra a causa delle anomalie magnetiche causate dall\'Obsidium grezzo nel sottosuolo. Qui abitano i Genasi della Terra e tribù di Firbolg nomadi. Le miniere a cielo aperto sono infestate da Bulette e Basilischi. La vegetazione è composta da cactus giganti e arbusti spinosi.',
  },
  {
    id: 'collefermo',
    name: 'Collefermo',
    type: 'city',
    x: 52,  // un bel po' più a sinistra (era 60)
    y: 53,  // di poco più in alto (era 56)
    r: 1.2,
    shortDescription: 'Città al confine tra i territori di Arborea e il centro del continente orientale. Punto di transito e rifornimento per i viaggiatori.',
    fullDescription: 'Collefermo è situata nel cuore del continente orientale, al confine tra le influenze di Arborea e le terre più aride del centro. È una città di transito, dove i viaggiatori si riforniscono prima di addentrarsi nella foresta o nel deserto. La sua posizione strategica la rende un luogo di incontro tra culture molto diverse.',
  },
  {
    id: 'tana-del-falco',
    name: 'Tana del Falco',
    type: 'city',
    x: 79,  // pochissimo più a sinistra (era 80)
    y: 54,  // un bel po' più in basso (era 44)
    r: 1.2,
    shortDescription: 'Fortezza arroccata sulle alture ad est di Arborea. Rifugio di cacciatori, mercenari e guardie di frontiera che proteggono i confini orientali.',
    fullDescription: 'La Tana del Falco è una fortezza arroccata sulle alture orientali, dominando il territorio sottostante. È il rifugio di cacciatori, mercenari e guardie di frontiera che proteggono i confini tra le terre civilizzate e le regioni selvagge a est. Il nome deriva dall\'usanza locale di addestrare falchi da guerra per il pattugliamento aereo.',
  },
  {
    id: 'guardia-del-lago',
    name: 'Guardia del Lago',
    type: 'city',
    x: 80,
    y: 62,  // di poco più in basso (era 59)
    r: 1.2,
    shortDescription: 'Città lacustre tra Arborea e Urash. Custodisce uno dei laghi più grandi del continente orientale, fonte d\'acqua strategica per tutta la regione.',
    fullDescription: 'Guardia del Lago sorge sulle rive di uno dei laghi più grandi del continente orientale. La sua posizione tra Arborea e Urash la rende un punto di equilibrio delicato tra la filosofia druidica degli elfi e la neutralità armata dei montanari. L\'acqua del lago è una risorsa strategica, contesa da più fazioni.',
  },
  {
    id: 'porto-verde',
    name: 'Porto Verde',
    type: 'city',
    x: 55,  // un bel po' più a sinistra (era 63)
    y: 81,  // un po' più in basso (era 77)
    r: 1.2,
    shortDescription: 'Porto commerciale sul Mare dei Sussurri. Punto di partenza per le rotte verso Y\'Tshal e le terre del sud, avvolto dalla nebbia psichica delle acque meridionali.',
    fullDescription: 'Porto Verde è l\'ultimo porto civilizzato prima del Mare dei Sussurri, le acque più temute di Sherdan. Da qui partono le spedizioni verso Y\'Tshal e le rotte più rischiose del sud. I marinai che tornano da questi viaggi sono spesso segnati dalle illusioni psichiche del mare, e la città ha sviluppato una fiorente industria di alchimisti e guaritori specializzati in traumi mentali.',
  },
  {
    id: 'ytshal',
    name: "Y'Tshal",
    type: 'city',
    x: 32,  // di molto più a sinistra (era 44)
    y: 80,  // un po' più in alto (era 83)
    r: 1.2,
    shortDescription: 'Gioiello del deserto, scavata nell\'arenaria su un\'oasi sotterranea. Patria dei Thri-kreen e delle tribù del deserto, mercato di veleni e spezie rarissime.',
    fullDescription: "Y'Tshal sorge su un'oasi sotterranea in una penisola desertica di sabbia bianca e perlacea, resti di antiche barriere coralline di un mare prosciugato millenni fa. È un gioiello di architettura scavata nell'arenaria, abitata dai misteriosi Thri-kreen (uomini-insetto) e dalle tribù umane del deserto. I pericoli principali sono i Vermi Purpurei e gli scorpioni giganti il cui veleno è ricercatissimo dagli alchimisti di Tharros.",
  },
];

export const REGION_LOCATIONS = MAP_LOCATIONS.filter((l) => l.type === 'region');
export const CITY_LOCATIONS = MAP_LOCATIONS.filter((l) => l.type === 'city');
