# Social Network on the Blockchain

[Tutorial Video](https://www.youtube.com/watch?v=0pKDav5wKBQ&list=PLS5SEs8ZftgXDYtXZIhYBl18frMt2yWZW&index=3)

## Run Migrations

`truffle migrate`

## View Deployment

```
truffle console
> contract = await SocialNetwork.deployed()
> contract
> contract.address
> name = await contract.name()
> name
```

## Deploy Contract
```
truffle migrate --reset
```

## Ganache

Install Ganache and run it

It will give you an RPC server URL
Eg. `HTTP://127.0.0.1:7545`

Set up a new network on MetaMask for Ganache and put the Chain ID as `1337` (the default for Ganache)

Switch to the Ganache network and check the console log to see your network ID (it should match the one in Ganache)

## Importing Accounts from Ganache to MetaMask

Copy the private keys from the first 3 Ganache accounts (the ones we are using in this project) and go to Metamask and import the accounts individually. You can name them respectively: `Deployer`, `Poster` and `Tipper`.

## Manually Run a Contract Method from Truffle Console

Eg. Write a Post

```
truffle console
sn = await SocialNetwork.deployed()
await sn.createPost('This is my first post!')
```