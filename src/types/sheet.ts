export interface CharacterSheet {
  id: string;
  character_id: string;

  // Caratteristiche (DM)
  forza: number;
  destrezza: number;
  costituzione: number;
  intelligenza: number;
  saggezza: number;
  carisma: number;
  bonus_competenza: number;

  // Tiri salvezza (DM)
  ts_forza: boolean;
  ts_destrezza: boolean;
  ts_costituzione: boolean;
  ts_intelligenza: boolean;
  ts_saggezza: boolean;
  ts_carisma: boolean;

  // Competenze abilità (DM)
  comp_atletica: boolean;
  comp_acrobazia: boolean;
  comp_furtivita: boolean;
  comp_rapidita_mano: boolean;
  comp_arcano: boolean;
  comp_indagare: boolean;
  comp_natura: boolean;
  comp_religione: boolean;
  comp_storia: boolean;
  comp_addestrare_animali: boolean;
  comp_intuizione: boolean;
  comp_medicina: boolean;
  comp_percepire: boolean;
  comp_sopravvivenza: boolean;
  comp_intimidire: boolean;
  comp_inganno: boolean;
  comp_intrattenere: boolean;
  comp_persuasione: boolean;

  // Combattimento (DM imposta max, player aggiorna dinamici)
  pf_massimi: number;
  ca: number;
  iniziativa: number;
  movimento: number;

  // Dinamici (player)
  pf_attuali: number;
  pf_temporanei: number;
  dadi_vita_totali: string;
  dadi_vita_usati: number;
  ispirazione: boolean;
  ts_morte_successi: number;
  ts_morte_fallimenti: number;

  // Testi liberi (player)
  armi_munizioni: string;
  equipaggiamento: string;
  monete: string;
  tratti_caratteriali: string;
  ideali: string;
  legami: string;
  difetti: string;
  note_incantesimi: string;

  // Testi liberi (DM)
  privilegi_classe: string;
  tratti_razziali: string;
  talenti: string;
  competenze_lingue: string;

  updated_at: string;
}

export const defaultSheet = (character_id: string): Omit<CharacterSheet, 'id' | 'updated_at'> => ({
  character_id,
  forza: 10, destrezza: 10, costituzione: 10,
  intelligenza: 10, saggezza: 10, carisma: 10,
  bonus_competenza: 2,
  ts_forza: false, ts_destrezza: false, ts_costituzione: false,
  ts_intelligenza: false, ts_saggezza: false, ts_carisma: false,
  comp_atletica: false, comp_acrobazia: false, comp_furtivita: false,
  comp_rapidita_mano: false, comp_arcano: false, comp_indagare: false,
  comp_natura: false, comp_religione: false, comp_storia: false,
  comp_addestrare_animali: false, comp_intuizione: false, comp_medicina: false,
  comp_percepire: false, comp_sopravvivenza: false, comp_intimidire: false,
  comp_inganno: false, comp_intrattenere: false, comp_persuasione: false,
  pf_massimi: 0, ca: 10, iniziativa: 0, movimento: 9,
  pf_attuali: 0, pf_temporanei: 0,
  dadi_vita_totali: '', dadi_vita_usati: 0,
  ispirazione: false, ts_morte_successi: 0, ts_morte_fallimenti: 0,
  armi_munizioni: '', equipaggiamento: '', monete: '',
  tratti_caratteriali: '', ideali: '', legami: '', difetti: '',
  note_incantesimi: '',
  privilegi_classe: '', tratti_razziali: '', talenti: '', competenze_lingue: '',
});
