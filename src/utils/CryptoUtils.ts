import CryptoJS from "crypto-js";

const keySize = 256;
const iterations = 1000;
const password = "hide@@!!";
const salt = "e0cf1267f564b362";

const key = CryptoJS.PBKDF2(password, salt, {
  keySize: keySize / 32,
  iterations,
  hasher: CryptoJS.algo.SHA256,
});

export const CryptoEncrypt = (data: any | undefined): string => {
  try {
    if (!data) return "";

    const en = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return en.toString();
  } catch (error) {
    return "";
  }
};

export const CryptoDecrypt = (data: any | undefined): any => {
  try {
    if (!data) return undefined;

    const de = CryptoJS.AES.decrypt(data, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.parse(de.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    return undefined;
  }
};
