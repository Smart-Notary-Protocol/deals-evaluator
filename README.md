
# SMART NOTARY PROTOCOL - CLIENT EVALUATOR

## Brief

The objective of this project is to be able to evaluate each client and provide a score on chain.

## How 

Will fetch data from a db containing all info about deals. Will evaluate each client looking at (will follow the explaination):

- Provider Distribution 
- Replica Distribution
- Cid Sharing


# Modus Operandi

How will it work?

This service will run on a daily basis and will calculate the score and update a mapping on chain 

the contract looks like this:

```
contract ClientScoreProvider {
    mapping(address => uint256) public scores;

    // More or less... to be implemented
    function updateScore(address[] memory clients, uint256 _score) public {
    for (uint256 i = 0; i < clients.length; i++) {
        address client = clients[i];
        if (scores[client] != _score) {
            scores[client] = _score;
        }
    }
}
}
```

the Idea is to create some score tiers where the client deserves different rate of datacap.

for example:

-  0 ≦ score < 5: client deserves no datacap until his score is higher
-  5 ≦ score <10: client deserves normal amount of DC defined in fil+
-  10 ≦ score <15: client deserves x2 amount of DC defined in fil+
-  15 ≦ score: client deserves x3 amount of DC defined in fil+


## To Address

1. We need to define how the score will be calculated and what tiers we can put there
2. We need to define how to update the smart contract in the most gas-convenient way

## Conditions from CID checker

having this [comment](https://github.com/filecoin-project/filecoin-plus-large-datasets/issues/982#issuecomment-1352815406) as example.

### SP distribution

For most of the datacap application, below restrictions should apply:

- Storage provider should not exceed 25% of total datacap.
- Storage provider should not be storing duplicate data for more than 20%.
- Storage provider should have published its public IP address.
- All storage providers should be located in different regions.

### Deal Data Replication

- No more than 25% of unique data are stored with less than 4 providers

### Deal Data Shared with other Clients

- different applications owns different data and should not resolve to the same CID

