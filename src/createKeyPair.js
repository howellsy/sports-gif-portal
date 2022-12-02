/**
 * Utility to generate a new random account keypair for signing transactions.
 */
const fs = require('fs');
const anchor = require('@project-serum/anchor');

const account = anchor.web3.Keypair.generate();

fs.writeFileSync('./keypair.json', JSON.stringify(account));
