// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Giả lập thư viện TFHE của Zama
library TFHE {
    type euint32 is uint256;
    type ebool is uint256;

    function asEuint32(uint256 value) internal pure returns (euint32) {
        return euint32.wrap(value);
    }

    function asEbool(bool value) internal pure returns (ebool) {
        return ebool.wrap(value ? 1 : 0);
    }

    function add(euint32 a, euint32 b) internal pure returns (euint32) {
        return euint32.wrap(euint32.unwrap(a) + euint32.unwrap(b));
    }

    function decrypt(euint32 value) internal pure returns (bytes memory) {
        return abi.encode(euint32.unwrap(value));
    }

    // Thêm hàm để kiểm tra giá trị của ebool
    function isTrue(ebool value) internal pure returns (bool) {
        return ebool.unwrap(value) == 1;
    }

    // Thêm hàm để kiểm tra giá trị phủ định của ebool
    function isFalse(ebool value) internal pure returns (bool) {
        return ebool.unwrap(value) == 0;
    }
}