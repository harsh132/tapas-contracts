include .env

CHAIN = 84532

ifeq ($(CHAIN),world)
		RPC = ${WORLD_RPC_URL}
endif
ifeq ($(CHAIN),4801)
		RPC = ${WORLD_SEPOLIA_RPC_URL}
endif
ifeq ($(CHAIN),amoy)
    RPC = ${AMOY_RPC_URL}
endif
ifeq ($(CHAIN),holesky)
		RPC = ${HOLESKY_RPC_URL}
endif
ifeq ($(CHAIN),84532)
    RPC = ${BASE_SEPOLIA_RPC_URL}
endif

deploy:
	- forge clean
	-	forge script --chain ${CHAIN} script/Deploy.s.sol:Deploy --rpc-url ${RPC} --broadcast --verify -vvvv --legacy --etherscan-api-key ${BASESCAN_API_KEY}

deploy2:
	- forge clean
	-	forge create src/AccountFactory.sol:AccountFactory --rpc-url ${RPC} --private-key ${PRIVATE_KEY} --constructor-args "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" --etherscan-api-key ${WORLD_API_KEY} --legacy 

verify:
	- forge verify-contract --etherscan-api-key ${WORLD_API_KEY} 0x3Fb58B53b233466CB56138385826c32880B6C344 AccountFactory --verifier-url https://api-sepolia.worldscan.org/api/
