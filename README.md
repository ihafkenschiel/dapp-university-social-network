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