import { NotImplementedException } from "@nestjs/common";

export abstract class BaseEntity {
  char = '-';

  // Colon delimited
  businessKey(): string[] {
    throw NotImplementedException;
  };

  normalizeName(name: string): string {
    return name.trim().normalize('NFC').toLowerCase();
  }

  normalizeId(id: string): string {
    id = this.normalizeName(id);
    id = id.replace(/[\u0000-\u0027\u200b]/g, this.char);
    id = id.replace(/&\w+;/g, this.char);
    id = id.replace(/[\s!\"#\$%&'()*+,\/:;<=>?@\[\\\]^_`{\|}~¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿×ˆ˜–—‘’‚“”„†‡•…‰‹›€™\t]/g, this.char);
    id = id.replace(/-+/g, this.char);
    id = id.replace(/^-|-$/g, '');

    return id;
  }
}