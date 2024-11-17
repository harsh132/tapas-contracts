// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {BaseAccount, IEntryPoint, PackedUserOperation} from "account-abstraction/core/BaseAccount.sol";
import "account-abstraction/core/Helpers.sol";
import "account-abstraction/samples/callback/TokenCallbackHandler.sol";

contract SmartAccount is BaseAccount, TokenCallbackHandler, EIP712Upgradeable, UUPSUpgradeable {
  using SafeERC20 for IERC20;
  address public owner;
  address private immutable _factory;

  mapping(address => bool) private signers;
  address[] public signersList;

  IEntryPoint private immutable _entryPoint;

  event AccountInitialized(IEntryPoint indexed entryPoint, address indexed owner);

  modifier onlyOwner() {
    _onlyOwner();
    _;
  }

  modifier onlyFactory() {
    _onlyFactory();
    _;
  }

  /// @inheritdoc BaseAccount
  function entryPoint() public view virtual override returns (IEntryPoint) {
    return _entryPoint;
  }

  // solhint-disable-next-line no-empty-blocks
  receive() external payable {}

  constructor(IEntryPoint anEntryPoint) {
    _entryPoint = anEntryPoint;
    _disableInitializers();
    _factory = msg.sender;
  }

  function _onlyOwner() internal view {
    //directly from EOA owner, or through the account itself (which gets redirected through execute())
    require(msg.sender == owner || msg.sender == address(this), "only owner");
  }

  function _onlyFactory() internal view {
    require(msg.sender == _factory, "only factory");
  }

  /**
   * execute a transaction (called directly from owner, or by entryPoint)
   * @param dest destination address to call
   * @param value the value to pass in this call
   * @param func the calldata to pass in this call
   */
  function execute(address dest, uint256 value, bytes calldata func) external {
    _requireAuthorization();
    _call(dest, value, func);
  }

  /**
   * execute a sequence of transactions
   * @dev to reduce gas consumption for trivial case (no value), use a zero-length array to mean zero value
   * @param dest an array of destination addresses
   * @param value an array of values to pass to each call. can be zero-length for no-value calls
   * @param func an array of calldata to pass to each call
   */
  function executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func) external {
    _requireAuthorization();
    require(dest.length == func.length && (value.length == 0 || value.length == func.length), "wrong array lengths");
    if (value.length == 0) {
      for (uint256 i = 0; i < dest.length; i++) {
        _call(dest[i], 0, func[i]);
      }
    } else {
      for (uint256 i = 0; i < dest.length; i++) {
        _call(dest[i], value[i], func[i]);
      }
    }
  }

  /**
   * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint,
   * a new implementation of SmartAccount must be deployed with the new EntryPoint address, then upgrading
   * the implementation by calling `upgradeTo()`
   * @param anOwner the owner (signer) of this account
   */
  function initialize(address anOwner) public virtual initializer {
    _initialize(anOwner);
    EIP712Upgradeable.__EIP712_init("SmartAccount", "v0.0.1");
  }

  function _initialize(address anOwner) internal virtual {
    owner = anOwner;
    emit AccountInitialized(_entryPoint, owner);
  }

  // Require the function call went through EntryPoint or owner
  function _requireAuthorization() internal view {
    require(
      signers[msg.sender] || msg.sender == address(entryPoint()) || msg.sender == owner,
      "account: not Owner or EntryPoint"
    );
  }

  /// implement template method of BaseAccount
  function _validateSignature(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash
  ) internal virtual override returns (uint256 validationData) {
    bytes32 hash = MessageHashUtils.toEthSignedMessageHash(userOpHash);
    if (owner != ECDSA.recover(hash, userOp.signature)) return SIG_VALIDATION_FAILED;
    return SIG_VALIDATION_SUCCESS;
  }

  function _recoverSigner(bytes32 msgHash, bytes memory signature) internal view returns (address recoveredSigner) {
    bytes32 hash = _hashTypedDataV4(msgHash);
    return ECDSA.recover(hash, signature);
  }

  function _isValidSignature(bytes32 hash, bytes memory signature) internal view returns (bool) {
    address signer = _recoverSigner(hash, signature);
    return (signers[signer] || signer == owner);
  }

  function _call(address target, uint256 value, bytes memory data) internal {
    (bool success, bytes memory result) = target.call{value: value}(data);
    if (!success) {
      assembly {
        revert(add(result, 32), mload(result))
      }
    }
  }

  /**
   * check current account deposit in the entryPoint
   */
  function getDeposit() public view returns (uint256) {
    return entryPoint().balanceOf(address(this));
  }

  function isSigner(address signer) public view returns (bool) {
    return signers[signer];
  }

  function getSigners() public view returns (address[] memory) {
    return signersList;
  }

  function _addSigner(address _signer) internal {
    require(signers[_signer] == false, "signer already exists");
    signers[_signer] = true;
    signersList.push(_signer);
  }

  function setInitialSigners(address[] calldata _signers) public onlyFactory {
    for (uint256 i = 0; i < _signers.length; i++) {
      _addSigner(_signers[i]);
    }
  }

  function addSigner(address _signer) public onlyOwner {
    _addSigner(_signer);
  }

  function addSignerWithSig(address _signer, bytes calldata _signature) public onlyOwner {
    bytes32 msgHash = keccak256(abi.encodePacked(keccak256("addSigner(address)"), _signer));
    require(_isValidSignature(msgHash, _signature), "invalid signature");
    _addSigner(_signer);
  }

  function _removeSigner(address _signer) internal {
    require(signers[_signer], "signer does not exist");
    delete signers[_signer];
    for (uint256 i = 0; i < signersList.length; i++) {
      if (signersList[i] == _signer) {
        signersList[i] = signersList[signersList.length - 1];
        signersList.pop();
        break;
      }
    }
  }

  function removeSigner(address _signer) public onlyOwner {
    _removeSigner(_signer);
  }

  function removeSignerWithSig(address _signer, bytes calldata _signature) public onlyOwner {
    bytes32 msgHash = keccak256(abi.encodePacked(keccak256("removeSigner(address)"), _signer));
    require(_isValidSignature(msgHash, _signature), "invalid signature");
    _removeSigner(_signer);
  }

  /**
   * deposit more funds for this account in the entryPoint
   */
  function addDeposit() public payable {
    entryPoint().depositTo{value: msg.value}(address(this));
  }

  /**
   * withdraw value from the account's deposit
   * @param withdrawAddress target to send to
   * @param amount to withdraw
   */
  function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
    entryPoint().withdrawTo(withdrawAddress, amount);
  }

  function withdrawWithSig(address to, address token, uint256 amount, bytes calldata signature) public onlyOwner {
    bytes32 hash = keccak256(abi.encodePacked(keccak256("withdraw(address,address,uint256)"), to, token, amount));
    require(_isValidSignature(hash, signature), "invalid signature");

    if (token == address(0)) {
      payable(to).transfer(amount);
    } else {
      IERC20(token).safeTransfer(to, amount);
    }
  }

  function _authorizeUpgrade(address newImplementation) internal view override {
    (newImplementation);
    _onlyOwner();
  }
}
