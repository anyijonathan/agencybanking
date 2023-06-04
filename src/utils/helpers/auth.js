const CryptoJS = require("crypto-js")

const keySize = 256
const ivSize = 128
const saltSize = 256
const iterations = 1000
const pass = "1234567890_"


const hexToBase64 = (str) => {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

const base64ToHex = (str) => {
  // for (var i = 0, bin = atob(str.toString().replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
  for (var i = 0, bin = atob(str.toString().replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join("");
}

// Encrypt
export const encrypt = (payload) => {
  payload = JSON.stringify(payload)
  var salt = CryptoJS.lib.WordArray.random(saltSize / 8);
  var key = CryptoJS.PBKDF2(pass, salt, { keySize: keySize / 32, iterations: iterations });
  var iv = CryptoJS.lib.WordArray.random(ivSize / 8);
  var encrypted = CryptoJS.AES.encrypt(payload, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
  var encryptedHex = base64ToHex(encrypted.toString());
  var base64result = hexToBase64(salt + iv + encryptedHex);
  return base64result.toString();
}

// Decrypt
export const decrypt = (transitmessage) => {
  var hexResult = base64ToHex(transitmessage)
  var salt = CryptoJS.enc.Hex.parse(hexResult.substr(0, 64));
  var iv = CryptoJS.enc.Hex.parse(hexResult.substr(64, 32));
  var encrypted = hexToBase64(hexResult.substring(96));
  var key = CryptoJS.PBKDF2(pass, salt, { keySize: keySize / 32, iterations: iterations });
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}



export const authRemoveAsyncData = () => {
  try {
    localStorage.removeItem("authData");
    localStorage.removeItem("token");
    localStorage.removeItem("onboardingAccountNumber");
    localStorage.removeItem("onboardingEmail");
    localStorage.removeItem("onboardingCreatedBy");
    localStorage.removeItem("onboardingPersonalInfo")
    localStorage.removeItem("onboardingBusinessInfo")
    localStorage.removeItem("onboardingRegionInfo")
  } catch (error) {
    console.log(error);
  }
};

export const authStoreAsyncData = (payload) => {
  try {
    localStorage.setItem("authData", JSON.stringify(payload?.authData));
    localStorage.setItem("token", payload?.token);
    localStorage.setItem("userRole", payload?.authData?.RoleName);
  } catch (error) {
    console.log(error);
  }
};

export const getStoredToken = () => localStorage.getItem("token")

export const getStoredAuthData = () => {
  if (getStoredToken()) {
    return JSON.parse(localStorage.getItem("authData"))
  }
  return null
}

export const storeOnboardingAccountNumber = (accountNumber) => localStorage.setItem("onboardingAccountNumber", accountNumber)

export const getOnboardingAccountNumber = () => localStorage.getItem("onboardingAccountNumber")

export const storeOnboardingEmail = (email) => localStorage.setItem("onboardingEmail", email)

export const getOnboardingEmail = () => localStorage.getItem("onboardingEmail")

export const storeOnboardingCreatedBy = (createdBy) => localStorage.setItem("onboardingCreatedBy", createdBy)

export const getOnboardingCreatedBy = () => localStorage.getItem("onboardingCreatedBy")

export const removeOnboardingCred = () => {
  localStorage.removeItem("onboardingAccountNumber")
  localStorage.removeItem("onboardingEmail")
  localStorage.removeItem("onboardingCreatedBy")
  localStorage.removeItem("onboardingBusinessInfo")
  localStorage.removeItem("onboardingRegionInfo")
}

export const storeOnboardingPersonalInfo = (payload) => localStorage.setItem("onboardingPersonalInfo", JSON.stringify(payload))

export const getOnboardingPersonalInfo = () => JSON.parse(localStorage.getItem("onboardingPersonalInfo"))

export const storeOnboardingBusinessInfo = (payload) => localStorage.setItem("onboardingBusinessInfo", JSON.stringify(payload))

export const getOnboardingBusinessInfo = () => JSON.parse(localStorage.getItem("onboardingBusinessInfo"))


export const storeOnboardingRegionInfo = (payload) => localStorage.setItem("onboardingRegionInfo", JSON.stringify(payload))

export const getOnboardingRegionInfo = () => JSON.parse(localStorage.getItem("onboardingRegionInfo"))


