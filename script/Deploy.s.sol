// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
// import {Vm} from "forge-std/Vm.sol";
import {SmartAccount} from "src/SmartAccount.sol";
import {AccountFactory} from "src/AccountFactory.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";

// import {ERC1967Proxy} from "@oz/proxy/ERC1967/ERC1967Proxy.sol";
// import {Upgrades, Options} from "openzeppelin-foundry-upgrades/Upgrades.sol";

contract Deploy is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddr = (vm.createWallet(deployerPrivateKey, "deployer"))
            .addr;
        console.log("Deployer:", deployerAddr);

        vm.startBroadcast(deployerPrivateKey);

        IEntryPoint entrypoint = IEntryPoint(
            0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
        ); // ERC-4337 entrypoint v0.6

        // SmartAccount smartAccountInstance = new SmartAccount(entrypoint);
        AccountFactory accountFactoryInstance = new AccountFactory(entrypoint);

        vm.stopBroadcast();

        console.log("Deployed contracts");
        console.log("EntryPoint:", address(entrypoint));

        console.log("Account Factory:", address(accountFactoryInstance));
    }
}
