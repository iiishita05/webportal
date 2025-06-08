const ldap = require("ldapjs");

const LDAP_URL = process.env.LDAP_URL; // You will set this in .env
const BASE_DN = process.env.LDAP_BASE_DN; // Also in .env

function ldapAuthenticate(username, password) {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({ url: LDAP_URL });
    const userDN = `uid=${username},${BASE_DN}`; // This depends on your LDAP structure

    client.bind(userDN, password, (err) => {
      if (err) {
        client.unbind();
        return reject("Invalid LDAP credentials");
      }
      client.unbind();
      return resolve({ username, dn: userDN });
    });
  });
}

module.exports = ldapAuthenticate;
