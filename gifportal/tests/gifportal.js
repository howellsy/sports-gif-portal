const anchor = require('@project-serum/anchor');

// get the system program
const { SystemProgram } = anchor.web3;

const main = async () => {
  // create and set the provider (using data from `solana config get`)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // compile code in lib.rs and deploy it locally on a local validator
  const program = anchor.workspace.Gifportal;

  // create an account keypair for our program to use
  // some credentials for the BaseAccount we're creating
  const baseAccount = anchor.web3.Keypair.generate();

  // call function and wait for our local validator to 'mine' the instruction
  await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  // retrieve the account we created and fetch totalGifs
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString());

  await program.rpc.addGif(
    'https://media.giphy.com/media/eijyqxdmTiiIPU6qbc/giphy.gif',
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString());

  console.log('👀 GIF List', account.gifList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
