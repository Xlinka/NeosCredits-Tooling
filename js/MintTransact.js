//todo: what the fuck?

// Function to fetch Mint transactions using the given wallet address and Etherscan API key
async function getMintTransactions(mintWalletAddress, etherscanApiKey) {
    const apiEndpoint = 'https://api.etherscan.io/api';
    const params = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      address: mintWalletAddress,
      apikey: etherscanApiKey,
    });
  
    try {
      const response = await fetch(`${apiEndpoint}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Mint transactions.'); // if only
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  // Function to fetch NCR outbound transactions using the given wallet address and Etherscan API key
  async function getNCROutboundTransactions(mintWalletAddress, etherscanApiKey) {
    const apiEndpoint = 'https://api.etherscan.io/api';
    const params = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      address: mintWalletAddress,
      apikey: etherscanApiKey,
    });
  
    try {
      const response = await fetch(`${apiEndpoint}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch NCR outbound transactions.'); // shame
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  // Function to display the list of Mint transactions and cross-reference with NCR outbound transactions
  async function displayTransactionList() {
    const etherscanApiKey = ''; // put your own API key here; I'm not using mine, and I'm too lazy to make this an environment variable
    const mintWalletAddress = '0x7CCBac6D333838608be0c40E124381016F4c81Fc';
  
    // Fetch Mint and NCR outbound transactions
    try {
      const mintTransactions = await getMintTransactions(mintWalletAddress, etherscanApiKey);
      const ncrOutboundTransactions = await getNCROutboundTransactions(mintWalletAddress, etherscanApiKey);
  
      // Get the columns where the transaction data will be displayed
      const mintTransactionsColumn = document.getElementById('mintTransactionsColumn');
      const crossReferenceColumn = document.getElementById('crossReferenceColumn');
  
      // Display Mint transactions
      mintTransactions.forEach((transaction) => {
        const transactionDiv = document.createElement('div');
        transactionDiv.classList.add('transaction');
  
        // Create spans for each piece of transaction data
        const hashSpan = document.createElement('span');
        hashSpan.textContent = `Hash: ${transaction.hash}`;
  
        const fromSpan = document.createElement('span');
        fromSpan.textContent = `From: ${transaction.from}`;
  
        const toSpan = document.createElement('span');
        toSpan.textContent = `To: ${transaction.to}`;
  
        const valueSpan = document.createElement('span');
        const valueInEther = transaction.value / 10 ** 18;
        valueSpan.textContent = `Value: ${valueInEther} Ether`;
  
        const timestampSpan = document.createElement('span');
        const timestampDate = new Date(parseInt(transaction.timestamp) * 1000);
        timestampSpan.textContent = `Timestamp: ${timestampDate.toLocaleString()}`;
  
        // Append spans to the transaction div
        transactionDiv.appendChild(hashSpan);
        transactionDiv.appendChild(fromSpan);
        transactionDiv.appendChild(toSpan);
        transactionDiv.appendChild(valueSpan);
        transactionDiv.appendChild(timestampSpan);
  
        // Append the transaction div to the mint transactions column
        mintTransactionsColumn.appendChild(transactionDiv);
      });
  
      // Cross-reference mint transactions with NCR outbound transactions
      mintTransactions.forEach((mintTx) => {
        const matchingNCRTransaction = ncrOutboundTransactions.find(
          (ncrTx) => mintTx.to.toLowerCase() === ncrTx.from.toLowerCase()
        );
  
        if (matchingNCRTransaction) {
          // Create a cross-reference element
          const crossReferenceDiv = document.createElement('div');
          crossReferenceDiv.classList.add('cross-reference');
  
          // Create spans for displaying cross-reference data
          const mintTxHashSpan = document.createElement('span');
          mintTxHashSpan.textContent = `Mint Transaction Hash: ${mintTx.hash}`;
  
          const ncrTxHashSpan = document.createElement('span');
          ncrTxHashSpan.textContent = `Matching NCR Transaction Hash: ${matchingNCRTransaction.hash}`;
  
          // Append spans to the cross-reference div
          crossReferenceDiv.appendChild(mintTxHashSpan);
          crossReferenceDiv.appendChild(ncrTxHashSpan);
  
          // Append the cross-reference div to the cross-reference column
          crossReferenceColumn.appendChild(crossReferenceDiv);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  // Call the function to display the transaction list
  displayTransactionList();
  