import { NotImplementedException } from "@nestjs/common";

export abstract class BaseEntity {
  char = '-';

  // Colon delimited
  businessKey(): string[] {
    throw NotImplementedException;
  };

  normalizeId(id: string): string {
    // TODO: Swap synonyms and eliminate stopwords
    id = id.trim().normalize('NFC').toLowerCase();
    // TODO: Unaccent, which needs to be language specific
    id = id.replace(/[\u0000-\u0027\u200b]/g, this.char);
    id = id.replace(/&\w+;/g, this.char);
    id = id.replace(/[\s!\"#\$%&'()*+,\/:;<=>?@\[\\\]^_`{\|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿×ˆ˜–—‘’‚“”„†‡•…‰‹›€™\t]/g, this.char);
    id = id.replace(/-+/g, this.char);
    id = id.replace(/^-|-$/g, '');

    return id;
  }
}