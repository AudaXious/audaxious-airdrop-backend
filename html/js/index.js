const app = {
  data: {
    chain: {
      id: 5,
      name: 'BSC',
      currency: 'BNB',
    },
    baseUrl: 'https://airdrop.syntrum.com/api',
    contracts: {
      airdrop: {
        abi: [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "ownerAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "managerAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "signerAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "receiver",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "EarningsReceived",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "role",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
              }
            ],
            "name": "checkRole",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "getAirdropStatus",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "getAmount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "getTokenAddress",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "role",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
              }
            ],
            "name": "grantRole",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
              }
            ],
            "name": "receiveEarnings",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "role",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
              }
            ],
            "name": "revokeRole",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
              }
            ],
            "name": "setAirdropStatus",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "setAmount",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
              }
            ],
            "name": "setTokenAddress",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "name": "transferOwnership",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "sender",
                "type": "address"
              },
              {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
              }
            ],
            "name": "verifySignature",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              }
            ],
            "name": "withdraw",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        address: '0xD0b8a5db5929625d42e6C0b40DbC7D60C359B65A',
      }
    },
  },
  async init () {
    if (!window.ethereum) {
      return this.alert('Metamask is not installed', 'danger');
    }
    this.data.accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    if (!this.provider) {
      this.alert('Wallet connection error', 'danger')
    }
    const { chainId } = await this.provider.getNetwork();
    const workingChainId = this.data.chain.id;
    if (chainId !== workingChainId && !document.hidden) {
      this.alert(`Wrong network. Please switch to the network ${this.data.chain.name} (chainId ${this.data.chain.id})`, 'danger');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${workingChainId.toString(16)}` }],
      });
      return false;
    }
    if (!this.data.accounts) this.data.accounts = await this.provider.listAccounts();
    this.data.signer = this.provider.getSigner();
    this.data.address = await this.data.signer.getAddress();
    this.data.contracts.airdrop.contract = new ethers.Contract(
      this.data.contracts.airdrop.address,
      this.data.contracts.airdrop.abi,
      this.data.signer
    );
    this.initialized = true;
    return true;
  },
  async start () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const message = urlParams.get('message');
    const status = urlParams.get('status');
    if (message && status) {
      app.alert(decodeURI(message), decodeURI(status));
    }
    if (localStorage.getItem('authToken')) {
      app.data.authToken = localStorage.getItem('authToken');
      document.querySelector('.signOut')
        .classList.remove('d-none');
      await this.airdrop();
    } else {
      document.querySelector('.signIn')
        .classList.remove('d-none');
    }
    return true;
  },
  airdrop () {
    (async () => {
      let response = await fetch(`${this.data.baseUrl}/airdrop`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-ACCESS-TOKEN': app.data.authToken,
        },
      });
      let result = await response.json();
      if (!result.success || !result.result)
        throw new Error('An error occurred');

      if (result.message) {
        app.alert(result.message.text, result.message.status);
      }
      if (result.result.twitterConnect) {
        document.querySelector('.twitterConnect')
          .classList.remove('d-none');
      }
      if (result.result.signature) {
        document.querySelector('.twitterConnected')
          .classList.remove('d-none');
        this.data.signature = result.result.signature;
      }
    })()
      .catch(error => {
        this.alert('An error occurred. Please try later.', 'danger');
        console.error(error);
      });
  },
  claim () {
    if (!this.data.signature) {
      window.location.reload(true);
    }
    (async () => {
      if (!this.initialized)
        await this.init();
      const tx = await this.data.contracts.airdrop.contract.receiveEarnings(this.data.signature);
      this.txMessage(tx.hash);
      const txReady = await tx.wait(3);
      if (txReady.status !== 1) throw new Error('Airdrop transaction failed');
      this.alert();
    })()
      .catch(error => {
        this.alert('An error occurred', 'danger');
        console.error(error);
      });
  },
  signIn () {
    (async () => {
      if (!this.initialized)
        await this.init();
      if (!this.data.address)
        throw new Error('Signer error');
      let response = await fetch(`${this.data.baseUrl}/auth/get-token/`);
      let result = await response.json();
      if (!result.success || !result.result || !result.result.message || !result.result.token)
        throw new Error('Sign in get request error');
      const token = result.result.token;
      const signature = await this.data.signer.signMessage(result.result.message);
      response = await fetch(`${this.data.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signature,
          token
        }),
      });
      result = await response.json();
      if (!result.success || !result.result || !result.result.authToken)
        throw new Error('Sign in post request error');
      app.data.authToken = result.result.authToken;
      localStorage.setItem('authToken', app.data.authToken);
      localStorage.setItem('address', app.data.address);
      document.querySelector('.signIn')
        .classList.add('d-none');
      document.querySelector('.signOut')
        .classList.remove('d-none');
      await this.airdrop();
    })()
      .catch(error => {
        this.alert('Initialization error', 'danger');
        console.error(error);
      });
  },
  signOut() {
    localStorage.setItem('authToken', '');
    location.reload(true);
  },
  twitterAuth () {
    (async () => {
      let response = await fetch(`${this.data.baseUrl}/twitter/auth/`, {
        headers: {
          'Content-Type': 'application/json',
          'X-ACCESS-TOKEN': app.data.authToken,
        }
      });
      let result = await response.json();
      if (!result.success || !result.result || !result.result.redirectTo)
        throw new Error('Sign in get request error');
      window.location.href = result.result.redirectTo;
    })()
      .catch(error => {
        this.alert('Initialization error', 'danger');
        console.error(error);
      });
  },
  alert (message, type = 'success') {
    const container = document.querySelector('#alertContainer .container');
    if (!message) {
      container.innerHTML = '';
      return false;
    }

    const closeContainer = /* html */ `
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="position:absolute;right:20px;"></button>`;

    const html = /* html */ `
    <div class="alert alert-${type} fade show" role="alert">
      ${closeContainer}
      <p>${message}</p>
    </div>`;

    container.innerHTML = html;
    return false;
  },
  txMessage (hash) {
    this.alert(`
      Tx hash <a target="_blank" href="https://bscscan.com/tx/${hash}">${hash}</a> 
      Please wait until transaction completed.
    `);
  },
};
app.start()
  .catch(error => {
    this.alert('Start function error', 'danger');
    console.error(error);
  });