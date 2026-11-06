import * as migration_20261102_234530_initieel from './20261102_234530_initieel';
import * as migration_20261105_111926_referentie_kaartpunt from './20261105_111926_referentie_kaartpunt';
import * as migration_20261105_125927_mededeling_planning from './20261105_125927_mededeling_planning';
import * as migration_20261105_133128_review_foto_referentie from './20261105_133128_review_foto_referentie';
import * as migration_20261105_134730_referentie_mogelijkheden from './20261105_134730_referentie_mogelijkheden';
import * as migration_20261105_151408_aanvraag_bedrijf from './20261105_151408_aanvraag_bedrijf';
import * as migration_20261106_133457_evenementen from './20261106_133457_evenementen';

export const migrations = [
  {
    up: migration_20261102_234530_initieel.up,
    down: migration_20261102_234530_initieel.down,
    name: '20261102_234530_initieel',
  },
  {
    up: migration_20261105_111926_referentie_kaartpunt.up,
    down: migration_20261105_111926_referentie_kaartpunt.down,
    name: '20261105_111926_referentie_kaartpunt',
  },
  {
    up: migration_20261105_125927_mededeling_planning.up,
    down: migration_20261105_125927_mededeling_planning.down,
    name: '20261105_125927_mededeling_planning',
  },
  {
    up: migration_20261105_133128_review_foto_referentie.up,
    down: migration_20261105_133128_review_foto_referentie.down,
    name: '20261105_133128_review_foto_referentie',
  },
  {
    up: migration_20261105_134730_referentie_mogelijkheden.up,
    down: migration_20261105_134730_referentie_mogelijkheden.down,
    name: '20261105_134730_referentie_mogelijkheden',
  },
  {
    up: migration_20261105_151408_aanvraag_bedrijf.up,
    down: migration_20261105_151408_aanvraag_bedrijf.down,
    name: '20261105_151408_aanvraag_bedrijf',
  },
  {
    up: migration_20261106_133457_evenementen.up,
    down: migration_20261106_133457_evenementen.down,
    name: '20261106_133457_evenementen'
  },
];
