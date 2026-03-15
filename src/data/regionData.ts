export interface NPC {
  name: string;
  role: string;
  description: string;
}

export interface Location {
  name: string;
  description: string;
}

export interface Faction {
  name: string;
  description: string;
}

export interface RegionData {
  slug: string;
  atmosphere: string;
  government: string;
  factions: Faction[];
  locations: Location[];
  npcs: NPC[];
  curiosity: string;
}

export const REGION_DATA: RegionData[] = [
  // ─────────────────────────────────────────────────────────────────
  // THARROS
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'tharros',
    atmosphere:
      "L'aria di Tharros sa di rame e ozono. Un ronzio costante di ingranaggi e pistoni pervade ogni vicolo. Il cielo è sempre velato da nubi di vapore che filtrano la luce in un eterno crepuscolo dorato. La città cresce verso l'alto: ponti sospesi tra torri di ottone collegano tre livelli sociali — Aurea in cima, il Meccanismo nel mezzo, il Ventre sotto.",
    government:
      'Il Consiglio del Progresso — sette Artefici scelti per il valore dei loro brevetti. Chi inventa di più, governa. Chi smette di innovare, decade.',
    factions: [
      {
        name: 'La Synapse',
        description:
          "Il monopolio energetico guidato da Lady Beatrix. Controlla la distribuzione dell'Obsidium raffinato e quindi il destino di tutta la città.",
      },
      {
        name: 'Figli dell\'Ingranaggio',
        description:
          "Movimento ribelle che sabota le fabbriche. Non tutti sono terroristi: alcuni cercano solo giustizia per i lavoratori del Ventre.",
      },
      {
        name: 'Occhi di Vetro',
        description:
          "La polizia segreta del Consiglio. Usano droni spia e incantesimi di divinazione tecnologica. Se ti stanno cercando, probabilmente ti hanno già trovato.",
      },
    ],
    locations: [
      {
        name: 'Aurea',
        description:
          "Il livello più alto. Giardini pensili, palazzi di cristallo e ottone. L'aria è pulita, il cibo abbondante. Viverci è il sogno proibito di milioni di persone.",
      },
      {
        name: 'Il Meccanismo',
        description:
          'Il cuore pulsante. Officine, laboratori, mercati. La classe operaia vive qui tra il rumore delle macchine e l\'odore di olio.',
      },
      {
        name: 'Il Ventre',
        description:
          'I bassifondi sotto le fondamenta. Poveri, rifiutati e ribelli. L\'unico posto dove le leggi del Consiglio sono solo teoria.',
      },
      {
        name: 'I Moli di Ferro',
        description:
          "Il porto industriale. Le Solcatrici — navi da guerra di metallo — vengono assemblate qui. Ogni nave è un capolavoro d'ingegneria e uno strumento di conquista.",
      },
      {
        name: 'Grande Biblioteca dei Brevetti',
        description:
          'Centinaia di anni di innovazione custoditi in scaffali di ferro. Chi conosce i segreti qui dentro, conosce i segreti di Tharros.',
      },
    ],
    npcs: [
      {
        name: 'Alto Artefice Valerius',
        role: 'Capo del Consiglio',
        description:
          "Più macchina che uomo. Ha sostituito ogni organo che falliva con macchinari a Obsidium. Non è malvagio — è un utilitarista assoluto. Se mille morti servono a salvarne un milione, firma senza esitare.",
      },
      {
        name: 'Lady Beatrix «La Vedova d\'Oro»',
        role: 'CEO della Synapse',
        description:
          "La donna più ricca del continente occidentale. Usa veleno e ricatto più spesso delle armi. Colleziona pirati famosi come trofei viventi.",
      },
      {
        name: 'Generale Octavia Steel',
        role: 'Comandante delle Difese',
        description:
          'Non urla mai. Comanda le flotte con fredda precisione. Odia i pirati con una passione personale — la sua famiglia fu uccisa in un raid. Non si fermerà finché non li vedrà impiccati.',
      },
      {
        name: 'Dr. Aris Lothar',
        role: 'Scienziato Riluttante',
        description:
          "Un halfling genio della fisica aetherica, inorridito da come le sue invenzioni vengano usate per la guerra. Potrebbe diventare un prezioso alleato, se riesci ad avvicinarti senza spaventarlo.",
      },
      {
        name: 'Unità 734 «Aegis»',
        role: 'Costrutto Senziente',
        description:
          'Un robot da guerra difettoso che ha sviluppato una coscienza. Aiuta di nascosto i poveri del Ventre. Parla con voce monotona ma esprime concetti poetici.',
      },
      {
        name: 'Zoya «La Voce del Vapore»',
        role: 'Leader della Resistenza',
        description:
          'Nessuno conosce il suo vero volto — indossa sempre una maschera antigas. Guida i Figli dell\'Ingranaggio con carisma e ferocia. Alleata preziosa o pericolo imprevedibile?',
      },
    ],
    curiosity:
      "L'Obsidium grezzo provoca mutazioni nella fauna locale. Nel Ventre circolano voci di ratti grandi come cani e di bambini nati con occhi di cristallo ceruleo.",
  },

  // ─────────────────────────────────────────────────────────────────
  // ARBOREA
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'arborea',
    atmosphere:
      "Arborea non sembra costruita, ma emersa. La città è un'unica entità biologica cresciuta in millenni di simbiosi tra elfi, spiriti e flora. Di notte i funghi e le radici emettono una luce bioluminescente azzurra e verde che trasforma la foresta in un sogno. L'aria profuma di resina, fiori notturni e terra bagnata.",
    government:
      'Il Circolo dei Custodi — guidato dalla Matriarca Sylvanas, elfa millenaria la cui parte inferiore del corpo è fusa con il legno del Cuore della Madre. Le sue parole sono profezie, non ordini.',
    factions: [
      {
        name: 'Il Circolo dei Custodi',
        description:
          'I governanti spirituali. Antichi, lenti nelle decisioni e distaccati dalle questioni mortali. La pace a ogni costo è il loro credo.',
      },
      {
        name: 'Le Spine',
        description:
          'I radicali. Credono che l\'unica cura per Sherdan sia l\'estirpazione totale della tecnologia. Finanziano sabotatori e assassini. Guidati da Kaela «Spina Nera», il cui volto è parzialmente divorato da un fungo parassita.',
      },
      {
        name: 'Valchirie della Fronda',
        description:
          "Guerriere elfe d'élite che proteggono le vie aeree della foresta montando Hippogrifi e uccelli da guerra. Neutrali tra Circolo e Spine, fedeli solo alla foresta.",
      },
    ],
    locations: [
      {
        name: 'Il Cuore della Madre',
        description:
          "L'albero più antico del mondo. Alto centinaia di metri, cavo all'interno: dentro vive la Matriarca Sylvanas. Ottenere udienza da lei è un'impresa epica.",
      },
      {
        name: "L'Intreccio",
        description:
          'La vita civile sospesa tra i rami. Mercati, abitazioni e osterie costruite su ponti di legno vivo. I rami crescono e cambiano lentamente, rimodellando la città ogni decennio.',
      },
      {
        name: 'Il Sottobosco',
        description:
          "Il livello più basso, oscuro e pericoloso. Creature mutate e spiriti inquieti. Chi scende senza una guida raramente torna con la mente integra.",
      },
      {
        name: 'Albero dei Sussurri',
        description:
          "La biblioteca vivente. Le foglie custodiscono la memoria di ogni storia mai raccontata nella foresta. Il custode è il Saggio Ooran, un Tortle millenario.",
      },
      {
        name: 'Serraglio delle Chimere',
        description:
          'Il laboratorio di Varis il Plasmatore. Qui la magia druidica viene usata per creare creature ibride: armi biologiche silenziose.',
      },
      {
        name: 'Crocevia del Viandante',
        description:
          'L\'unico punto neutrale al confine della foresta. Mercanti di ogni nazione si incontrano qui per scambiare merci con i druidi. Tensioni sempre alte, ma il profitto supera l\'ideologia.',
      },
    ],
    npcs: [
      {
        name: 'Matriarca Sylvanas',
        role: 'Voce del Cuore',
        description:
          "Ha più di mille anni. Parla raramente — quando lo fa, la sua voce risuona nella testa di tutti i presenti. È la custode della pace a ogni costo, ma la sua passività sta facendo infuriare i giovani.",
      },
      {
        name: 'Alto Druido Thorn',
        role: 'Guardiano dei Confini',
        description:
          'Un Firbolg alto tre metri coperto di muschio. Generale riluttante che sa che la guerra sta arrivando. Brusco con gli stranieri, ma rispetta chi dimostra coraggio e rispetto per la natura.',
      },
      {
        name: 'Kaela «Spina Nera»',
        role: 'Leader delle Spine',
        description:
          "Il suo volto è per metà ustionato da un'arma chimica di Tharros, coperto da un fungo parassita che controlla. Carismatica e terrorizzante. Non accetta il fallimento.",
      },
      {
        name: 'Ambasciatrice Lysandra',
        role: 'Il Volto Pubblico',
        description:
          "L'unica del Circolo che capisce la politica e il denaro. Pragmatica e accessibile — si trova spesso al Crocevia del Viandante. Se hai bisogno di un lasciapassare, è lei che lo firma.",
      },
      {
        name: 'Varis il Plasmatore',
        role: 'Bio-Ingegnere',
        description:
          'Usa la magia per mutare animali in armi. Amorale: per lui creare una tigre a prova di proiettile è arte. Vuole in cambio campioni biologici freschi di creature rare.',
      },
      {
        name: 'Maestra Elara',
        role: 'Costruttrice di Navi Vive',
        description:
          "Non costruisce navi, le coltiva. Considera ogni nave come una figlia. Non venderà mai a chi non rispetta il mare. Le sue creazioni si riparano da sole.",
      },
    ],
    curiosity:
      "Si dice che nel Sottobosco esista un fungo capace di mostrare a chi lo mangia una visione della propria morte. I druidi lo usano come oracolo. I mercenari lo cercano come arma.",
  },

  // ─────────────────────────────────────────────────────────────────
  // ESHTERZYLI
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'eshterzyli',
    atmosphere:
      "Il cielo è perennemente tinto di rosso e nero dalla cenere del Monte Arxi. Una pioggia sottile di cenere nera ricopre ogni superficie. Tutt'intorno, la Foresta Ruggine abbraccia la città con alberi dalla corteccia nera dura come il ferro e foglie rosso fuoco. Il clangore ritmico di migliaia di martelli idraulici non si interrompe mai, giorno o notte.",
    government:
      'Stratocratica — il Gran Generale Krael presiede il Consiglio della Guerra. Non esistono nobili, solo gradi militari guadagnati in battaglia o nell\'Arena del Giudizio.',
    factions: [
      {
        name: 'Consiglio della Guerra',
        description:
          'I generali al comando. La gerarchia è instabile ma competente: chiunque può sfidare il proprio superiore a duello. Solo i forti e gli astuti restano al comando.',
      },
      {
        name: 'Caldera Industriale',
        description:
          "I maestri fabbri che alimentano la macchina da guerra. Dipendono dalla Mastro Forgiatore Hestia, l'unica persona che può urlare contro il Generale Krael senza essere giustiziata.",
      },
      {
        name: 'Polizia Militare (Inquisizione)',
        description:
          'Guidata dall\'Alto Inquisitore Moros. Non usa la tortura fisica ma incantesimi di illusione mentale. Temuta persino dai generali.',
      },
    ],
    locations: [
      {
        name: 'Il Vallo di Ferro',
        description:
          "L'anello esterno della città. Muraglia irta di torrette difensive, trincee e bunker. Nessun crimine di strada — la polizia militare giustizia i ladri sul posto.",
      },
      {
        name: 'La Caldera Industriale',
        description:
          'Passerelle sospese sopra canali di magma a cielo aperto. Di notte la luce rossa della lava illumina tutto. Qui nascono le leghe metalliche più resistenti del mondo.',
      },
      {
        name: 'Porto Armato del Leviatano',
        description:
          "Il cantiere navale militare. Le Corazzate — navi massive ricoperte di piastre d'acciaio — vengono assemblate qui. Lente ma devastanti: fatte per speronare e affondare.",
      },
      {
        name: "L'Arena del Giudizio",
        description:
          'Qualsiasi disputa legale o politica può essere risolta con un duello qui. Il Campione Senza Nome è il combattente più forte della città — nessuno sa chi si nasconde sotto l\'elmo.',
      },
      {
        name: 'Il Forte del Comando',
        description:
          "Un monolite di ossidiana e acciaio nero al centro di tutto. Qui risiede l'élite militare e vengono pianificate le campagne di espansione.",
      },
    ],
    npcs: [
      {
        name: 'Gran Generale Krael «Il Corazzato»',
        role: 'Dittatore Supremo',
        description:
          'Il suo corpo è un ammasso di carne cicatrizzata e protesi di ferro nero alimentate da un cuore di Obsidium. Non dorme, non mangia cibo solido. Parla come pietre che macinano. Rispetta solo chi lo guarda negli occhi senza tremare.',
      },
      {
        name: 'Vraxxa',
        role: 'Signora della Guerra',
        description:
          'Una Dragonide Rossa dalle scaglie lucide come rubini. Rivale di Krael — crede nella forza bruta del drago più che nella tecnologia. Selvaggia, passionale, adora combattere in prima linea.',
      },
      {
        name: 'Mastro Forgiatore Hestia',
        role: 'Direttrice delle Fonderie',
        description:
          "Genasi del Fuoco con i capelli che sono fiamme vive. L'unica intoccabile nella città. Può forgiare armi su misura — ma richiede materiali impossibili come cuori di golem di magma.",
      },
      {
        name: 'Alto Inquisitore Moros',
        role: 'Capo della Polizia Militare',
        description:
          'Un umano pallido e magro vestito di pelle nera. Non usa la tortura fisica — spezza la mente con illusioni. Temuto da tutti, generali inclusi.',
      },
      {
        name: '«Ironhull» Torvin',
        role: "Grand'Ammiraglio",
        description:
          'Un Duergar con pistoni idraulici al posto delle gambe. Signore del Porto del Leviatano. Odia i pirati disorganizzati — ma rispetta i corsari disciplinati.',
      },
      {
        name: 'Baronessa Silica',
        role: 'Alchimista Esplosiva',
        description:
          'Una Gnomo con un senso dell\'umorismo disturbante. Il suo laboratorio salta in aria regolarmente. Vende granate, mine marine e la Polvere del Drago — fuoco liquido che brucia anche sull\'acqua.',
      },
    ],
    curiosity:
      "La Polvere del Drago, l'arma più temuta di Eshterzyli, brucia anche sull'acqua di mare. I marinai di tutto Sherdan hanno soprannominato le navi di Eshterzyli \"Le Bare Galleggianti\".",
  },

  // ─────────────────────────────────────────────────────────────────
  // URASH
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'urash',
    atmosphere:
      "Urash si innalza sulle catene montuose del sud-est, con vette perennemente innevate e aria così rarefatta che i nuovi arrivati bocheggiano per i primi tre giorni. La città è costruita a terrazze sulle pareti rocciose. Il silenzio è la prima cosa che colpisce chi arriva dal basso — nessun rumore di macchine, nessuna folla chiassosa. Solo vento, campanelle rituali e il respiro del ghiaccio.",
    government:
      'Il Concilio delle Voci — tre saggi che governano con parabole, non decreti. Incontrarli richiede il superamento di prove fisiche lungo la scalinata sacra.',
    factions: [
      {
        name: 'Il Concilio delle Voci',
        description:
          "I tre saggi che governano con saggezza e silenzio. Le loro decisioni sono lente come le montagne, ma definitive come le valanghe.",
      },
      {
        name: 'Guardie del Gelo',
        description:
          'La compagnia mercenaria d\'élite esportata in tutto Sherdan. Guidata dal Capitano Kael, non tradiscono mai un contratto — ma se lo violate, ve ne andranno all\'istante.',
      },
      {
        name: 'Monaci del Passo',
        description:
          'I custodi delle tradizioni. Praticano arti marziali proibite e meditazione nel freddo. La Maestra Jian, minuta come un ramoscello, può lanciare un orco attraverso una stanza con un tocco delle dita.',
      },
    ],
    locations: [
      {
        name: 'Monastero della Nube',
        description:
          'La sede del Concilio, avvolta sempre tra le nuvole. Raggiungerla richiede giorni di scalata. Nessuno entra senza essere invitato.',
      },
      {
        name: 'Terme dell\'Anima',
        description:
          'Sorgenti termali riscaldate dall\'Obsidium nelle valli nascoste. Guariscono ferite fisiche e mentali. Gestite da Madre Yana, che è anche la pettegola più informata della città.',
      },
      {
        name: 'Caverna della Signora degli Echi',
        description:
          "Una grotta acustica perfetta. La sua abitante cieca può sentire suoni da qualsiasi parte di Sherdan. Il prezzo di una risposta è un segreto mai detto a nessuno.",
      },
      {
        name: 'Mercato d\'Alta Quota',
        description:
          "L'unico posto in città dove la valuta straniera è benvenuta. Ramponi, corde di seta di ragno, tende termiche. Tenzin il Mercante vende anche oggetti di Tharros 'caduti dal carro'.",
      },
    ],
    npcs: [
      {
        name: 'Venerabile Oji',
        role: 'La Voce del Vento',
        description:
          'Un Aarakocra così anziano che le sue piume sono diventate bianche come la neve. La memoria vivente di Sherdan. Conosce la posizione delle città sommerse pre-Scissione. Non vuole oro — vuole una storia che non ha mai sentito.',
      },
      {
        name: 'Thrum «Cuore di Granito»',
        role: 'La Voce della Terra',
        description:
          'Un Goliath la cui pelle sembra pietra levigata. Può stare in meditazione sotto una bufera di neve per settimane. Giudice morale supremo. Odia la tecnologia — rifiuta di parlare con chi indossa protesi meccaniche visibili.',
      },
      {
        name: 'Maestra Jian',
        role: 'Istruttrice dei Diecimila Passi',
        description:
          'Anziana e minuta come un ramoscello. La più grande maestra di arti marziali di Sherdan. Il suo addestramento è brutale e spesso umiliante. Ma chi sopravvive impara a lanciare orchi attraverso le stanze.',
      },
      {
        name: 'Lama Tenzin',
        role: 'Diplomatico del Concilio',
        description:
          "L'unico del Concilio che viaggia. Si trova spesso nei porti di Sherdan a negoziare contratti. Astuto, mondano, apprezza il buon vino — vizio che nasconde agli altri monaci.",
      },
      {
        name: 'Zarkov il Silenzioso',
        role: 'Monaco Guerriero',
        description:
          'Un Dragonide d\'Argento che ha fatto voto di silenzio per espiare un crimine di guerra. Comunica solo a gesti o scrivendo sulla neve. Può sputare ghiaccio che congela il metallo.',
      },
    ],
    curiosity:
      "Esiste un sentiero segreto attraverso le montagne, conosciuto solo dalle Guardie del Gelo, che collega Urash direttamente al territorio di Arborea in tre giorni. Nessun accordo politico lo ha mai reso ufficiale.",
  },

  // ─────────────────────────────────────────────────────────────────
  // DOMUS NOVA
  // ─────────────────────────────────────────────────────────────────
  {
    slug: 'domus-nova',
    atmosphere:
      "Domus Nova si annuncia prima con il rumore che con la vista: urla, musica, esplosioni e il cigolio di carrucole arrugginite. L'arcipelago è un labirinto di isole tropicali collegate da ponti di corda e zattere galleggianti. L'aria è satura di rum, spezie, polvere da sparo e alghe. Non esiste legge qui, solo il Codice — e chi lo rispetta lo fa per sopravvivenza, non per virtù.",
    government:
      'Anarchia regolata dal Codice di Domus Nova — quattro regole fondamentali scritte sul molo principale. I Cinque Signori del Mare esercitano il potere reale attraverso le loro fazioni.',
    factions: [
      {
        name: 'Valchirie della Burrasca',
        description:
          'Guidate dalla Capitana Lunacupa «La Vedova». Schiavisti e violenti sono i loro nemici giurati. Audaci, leali tra loro, terrificanti per i nemici.',
      },
      {
        name: 'Signori della Ruggine',
        description:
          "Guidati dall'Ammiraglio Rotella — più macchina che gnomo. Ingegneri folli ossessionati dall'efficienza. Non hanno empatia: farebbero esplodere un quartiere per testare una bomba.",
      },
      {
        name: 'Flotta Cremisi',
        description:
          'Guidata dal Comandante Ivar — Dragonide d\'Argento disertore di Eshterzyli. Uomini d\'onore in una città di ladri. Rispettano la forza e la disciplina.',
      },
      {
        name: 'I Collezionisti',
        description:
          'Guidati da Lady Nyx, sempre avvolta in veli che lasciano intravedere occhi che cambiano colore. Commerciano ricordi, segreti e sogni in cambio di artefatti magici.',
      },
      {
        name: 'Figli del Kraken',
        description:
          "Guidati dal Profeta delle Maree — Genasi dell'Acqua con coralli vivi sulla pelle. Fanatici convinti che la terraferma affonderà. Imprevedibili.",
      },
    ],
    locations: [
      {
        name: 'Porto Franco',
        description:
          'Il cuore dell\'arcipelago. Ogni nazione ha una bandiera issata qui — e nessuna ha autorità. Il mercato più grande e pericoloso di Sherdan.',
      },
      {
        name: 'Lo Squalo che Ride',
        description:
          'La taverna di Grog «Mano-di-Legno». L\'anima del porto: conosce tutti, vede tutto, non giudica nessuno. Purché paghino.',
      },
      {
        name: 'Cantiere dello Scrappers',
        description:
          "Il laboratorio di Scrappy 'Scintilla'. Ripara navi, potenzia armi, vende granate artigianali con il 50% di probabilità di funzionare benissimo e il 10% di esplodere in mano.",
      },
      {
        name: 'La Guglia del Cartografo',
        description:
          'Dove vive Sestante, un automa antico fatto di ottone ossidato. È la banca dati vivente più completa di Sherdan. In cambio di informazioni non vuole denaro — vuole storie che non ha ancora sentito.',
      },
      {
        name: 'I Bassifondi Sommersi',
        description:
          'Il livello inferiore, semi-allagato. Rifugio degli ultimi tra gli ultimi. Qui il Codice è ancora più flessibile.',
      },
    ],
    npcs: [
      {
        name: 'Capitana Lunacupa «La Vedova»',
        role: 'Leader delle Valchirie',
        description:
          'Capelli argento in trecce strette, cicatrice sottile sul labbro. Non alza mai la voce — il suo sussurro è più terrificante delle urla di un orco. Ha un debole per l\'arte e finanzia di nascosto la scuola di musica della città.',
      },
      {
        name: 'Ammiraglio Rotella',
        role: 'Capo dei Signori della Ruggine',
        description:
          'Più macchina che gnomo. Si muove su un ragno meccanico a quattro zampe. Ossessionato dall\'efficienza. Non ha empatia: la carne per lui è un limite obsoleto.',
      },
      {
        name: 'Lady Nyx',
        role: 'Voce dei Collezionisti',
        description:
          'Nessuno conosce la sua vera razza. Avvolta in sete viola e veli. Gestisce i suoi affari dalla cabina del Leviatano di Velluto, dove l\'aria profuma di incenso narcotico.',
      },
      {
        name: 'Sestante',
        role: "L'Automa Cartografo",
        description:
          'Un costrutto antico risalente alla pre-Scissione. Filosofico e malinconico. In cambio di informazioni non vuole denaro — vuole storie che non ha ancora sentito.',
      },
      {
        name: 'Zio Baryl',
        role: 'Il Cartografo Cieco',
        description:
          'Un vecchio Tiefling dalla pelle grigia e corna spezzate. Cieco, ma vede la magia e le intenzioni. Disegna mappe perfette basandosi sui racconti dei marinai. Avverte sempre: "La mappa ti dice dove andare, non come tornare vivo".',
      },
      {
        name: 'Grog «Mano-di-Legno»',
        role: 'Oste dello Squalo che Ride',
        description:
          'Un Mezzorco gigantesco con una gamba di legno di mogano pregiato. Conosce tutti. Nasconde un fucile a canne mozze sotto il bancone — non esita a usarlo se qualcuno rompe i suoi bicchieri.',
      },
    ],
    curiosity:
      "Esiste una lingua pidgin parlata solo a Domus Nova, nata dall'incrocio di diciassette idiomi diversi. I locali la chiamano \"Il Codice Parlato\" e la usano per discutere affari che non vogliono far capire agli stranieri.",
  },
];
