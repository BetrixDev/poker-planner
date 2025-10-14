import { faker } from "@faker-js/faker";
import { startCase } from "es-toolkit/string";

function djb2Hash(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

export function getDefaultUserProfileImage(id: string) {
  return `https://api.dicebear.com/9.x/open-peeps/svg?seed=${encodeURIComponent(
    id
  )}&backgroundType=gradientLinear&backgroundColor=d1d4f9,ffd5dc,ffdfbf,c0aede,b6e3f4`;
}

export function getDefaultUserDisplayName(id: string) {
  faker.seed(djb2Hash(id));

  return startCase(`${faker.word.adjective()} ${faker.animal.type()}`);
}
