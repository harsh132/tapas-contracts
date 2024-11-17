// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/utils/Create2.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestUSDC is ERC20 {
  constructor() ERC20("TestUSDC", "USDC") {
    _mint(tx.origin, 1000000000 * (10 ** 18));
  }

  function mint(address to) public {
    _mint(to, 100 * (10 ** 18));
  }
}
