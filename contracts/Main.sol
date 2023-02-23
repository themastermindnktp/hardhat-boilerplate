// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./utils/Permission.sol";

contract Main is Permission {
    address public admin;

    IERC20 public cash;

    constructor(IERC20 _cash) {
        admin = msg.sender;
        cash = _cash;
    }

    function askBalance(address _account) permittedTo(admin) external view returns (uint256) {
        return cash.balanceOf(_account);
    }
}
