import React,{ useCallback, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider as AnchorProvider, web3 } from '@project-serum/anchor';
import kp from './keypair.json';
import './App.css';

window.Buffer = Buffer;

// SystemProgram is a reference to the Solana runtime
const { SystemProgram, Keypair } = web3;

// a keypair for the account that will hold the GIF data
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = Keypair.fromSecretKey(secret);

// address of the Solana program
const programID = new PublicKey('CLBxsKeP1uCgzNCao3GSqJ3wfLUN7c55KCYkEASaSeZa');

// set the network to devnet
const network = clusterApiUrl('devnet');

// options for confirming transactions
const opts = {
  preflightCommitment: 'processed',
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  /**
   * Check if the user has the Phantom wallet installed
   */
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      const response = await window.solana.connect({ onlyIfTrusted: true });
      const publicKey = response.publicKey.toString();

      setWalletAddress(publicKey);
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      const publicKey = response.publicKey.toString();

      setWalletAddress(publicKey);
    }
  };

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = await getProgram();
      
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });

      await getGifList();  
    } catch(error) {
      console.log('🚨 Error creating BaseAccount account:', error);
    }
  };

  const sendGif = async () => {
    // no GIF link provided
    if (inputValue.length === 0) {
      return;
    }

    setInputValue('');

    try {
      const provider = getProvider();
      const program = await getProgram(); 
  
      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
  
      await getGifList();
    } catch (error) {
      console.log('🚨 Error sending GIF:', error);
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);

    // create an authenticated connection to Solana
    const provider = new AnchorProvider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  };

  const getProgram = useCallback(async () => {
    // get metadata about the Solana program
    const idl = await Program.fetchIdl(programID, getProvider());
    // create a program that we can call
    return new Program(idl, programID, getProvider());
  }, []);

  const getGifList = useCallback(async () => {
    try {
      const program = await getProgram(); 
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      setGifList(account.gifList);
  
    } catch (error) {
      console.log('🚨 Error in getGifList:', error);
      setGifList(null);
    }
  }, [getProgram]);

  const NotConnectedContainer = () => (
    <button 
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const ConnectedContainer = () => {
    // the program account hasn't been initialised
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button className="cta-button submit-gif-button" onClick={createGifAccount}>
            Do one-time initialisation for GIF program account
          </button>
        </div>
      );
    } 

    return (
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input type="text" value={inputValue} placeholder="Enter gif link!" onChange={onInputChange} />
          <button type="submit" className="cta-button submit-gif-button">Submit</button>
        </form>
        <div className="gif-grid">
          {gifList.map((item, index) => (
            <div className="gif-item" key={index}>
              <img src={item.gifLink} alt={item.gifLink} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    /**
     * The Phantom wallet team suggests waiting for the window to fully finish loading
     * before checking for the solana object
     */
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      getGifList();
    }
  }, [getGifList, walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 Sports GIF Portal</p>
          <p className="sub-text">
            View your sports GIF collection in the metaverse ✨
          </p>
          {!walletAddress && <NotConnectedContainer />}
          {walletAddress && <ConnectedContainer />}
        </div>
      </div>
    </div>
  );
};

export default App;
