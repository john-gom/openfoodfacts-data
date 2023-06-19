import { NotImplementedException } from "@nestjs/common";

export abstract class BaseEntity {
  // Colon delimited
  businessKey(): string[] {
    throw NotImplementedException;
  };
}