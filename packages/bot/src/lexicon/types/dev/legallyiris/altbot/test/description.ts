/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from "@atproto/lexicon";
import { CID } from "multiformats/cid";
import { validate as _validate } from "../../../../../lexicons";
import {
  type $Typed,
  type OmitKey,
  is$typed as _is$typed,
} from "../../../../../util";

const is$typed = _is$typed,
  validate = _validate;
const id = "dev.legallyiris.altbot.test.description";

export interface Record {
  $type: "dev.legallyiris.altbot.test.description";
  text: string;
  post: string;
  /** index of the image in the post */
  image: number;
  createdAt: string;
  [k: string]: unknown;
}

const hashRecord = "main";

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord);
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true);
}
