# GODEAN PROJECT
This is Game Interface Repository that will interact with user 

### NOTE [Pre requirements]

- Keep your socket game server on and make sure it's running in port `7890`, clone the project form here [Godean-Game-Server](https://github.com/AncientSclupture/Godean-Game-Server.git) **[clone to another root folder]**

- Keep your asset-api game server on and make sure it's running in port `9090`, clone the project from here [Godean-Asset-API](https://github.com/AncientSclupture/Godean-Asset-API.git) **[clone to another root folder]**

## Setup and Configuration in Development Mode
**`.env`**
```bash
VITE_SMART_CONTRACT_ADRESS = 0x9fE46....
VITE_GAME_SERVER_API = https://.....
VITE_GAME_API = https://.....

VITE_GAME_SERVER_API_DEV = http://127.0.0.1:7890
VITE_GAME_API_DEV = http://127.0.0.1:9090

```

You can get `VITE_SMART_CONTRACT_ADRESS` from 
[Godean-Smart-Contract](https://github.com/AncientSclupture/Godean-Smart-Contract.git) repository. By following this steps.

### Run Hardhat
```bash
npx hardhat node
```
The Resulut should be like this `(keep it on) all the dummy accounts is presistent`
```bash
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: Funds sent on live network to accounts with publicly known private keys WILL BE LOST.

Account #0:  0xf39f... (10000 ETH)
Private Key: 0xac0974...

...

Account #19: 0x8626...(10000 ETH)
Private Key: 0xdf57...

WARNING: Funds sent on live network to accounts with publicly known private keys WILL BE LOST.
```

### Deploy Smartcontract
```bash
npx hardhat ignition deploy ignition/modules/Counter.ts --network localhost
```

The Resulut should be like this
```bash
Deploying [ CounterModule ]

Batch #1
  Executed CounterModule#Counter

Batch #2
  Executed CounterModule#Counter.incBy

[ CounterModule ] successfully deployed 🚀

Deployed Addresses

CounterModule#Counter - 0x9fE46....
```

Copy the **0x9fE46....** from `CounterModule#Counter` and get the abi-json file that took place in
`artifacts\contracts\Counter.sol\Counter.json`, place it to the `src\abi\Counter.json`

### Run Your Frontend
```bash
npm install

npm run dev
```