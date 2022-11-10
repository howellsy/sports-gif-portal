import React,{ useEffect, useState } from 'react';
import './App.css';

const TEST_GIFS = [
	'https://media.giphy.com/media/eijyqxdmTiiIPU6qbc/giphy.gif',
	'https://media.giphy.com/media/58FDt1y3fibXLUq1YS/giphy.gif',
	'https://media.giphy.com/media/dut5x9NGlzl2Lj9y4d/giphy-downsized-large.gif',
	'https://media.giphy.com/media/4Q1BkEEdC7oBDRYvae/giphy-downsized-large.gif'
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  /**
   * Check if the user has the Phantom wallet installed
   */
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('🚨 Phantom wallet found!');

      // 
      const response = await window.solana.connect({ onlyIfTrusted: true });
      const publicKey = response.publicKey.toString();
      console.log('🚨 Connected with Public Key: ', publicKey);

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
      console.log('🚨 Connected with Public Key: ', publicKey);

      setWalletAddress(publicKey);

    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('🚨 Gif link: ', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('🚨 Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const NotConnectedContainer = () => (
    <button 
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const ConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input type="text" placeholder="Enter gif link!" onChange={onInputChange} />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {gifList.map((gif) => (
            <div className="gif-item" key={gif}>
              <img src={gif} alt={gif} />
            </div>
          ))}
      </div>
    </div>
  );

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
      console.log('🚨 Fetching GIF list...');  
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

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
