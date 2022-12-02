# Solana Sports GIF Portal

>Based on the buildspace [Build a Web3 app on Solana with React and Rust](https://buildspace.so/p/build-solana-web3-app) project.

A web app that lets anyone with a Solana (Phantom 👻) wallet:
* submit GIFs to a portal
* save them on the Solana blockchain
* retrieve all of the GIFs that have been submitted

![image](https://user-images.githubusercontent.com/82221637/205344191-b6d65371-729a-4819-b2b1-c0743bdcb4b2.png)


---
## ⚡ Quick Start - Running the Web App

1. Clone the repo.
2. Run `npm install` at the root of your directory
3. Run `npm run start` to start the web app  

---
## 📂 Repo Structure

* `gifportal/` a Solana program (written in Rust) to store submitted GIFs on the Solana blockchain
* `src/` a React web app that calls the deployed program

---
## 🚀 Deploying the gifportal program to devnet

>You will need to install [Rust](https://doc.rust-lang.org/book/ch01-01-installation.html), [Solana tool suite](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool) and [Anchor](https://www.anchor-lang.com/docs/installation).

Set the Solana environment to devnet:

`solana config set --url devnet`

Run Anchor build:

`cd gifportal`

`anchor build`

Get the program ID:

`solana address -k target/deploy/gifportal-keypair.json`

Set the program ID in `src/lib.rs` and `Anchor.toml`

Run Anchor deploy:

`anchor deploy`

---
## 🧪 Running Tests

Compile the `gifportal` program and run the tests from `tests/gifportal.js` using:

`anchor test`
