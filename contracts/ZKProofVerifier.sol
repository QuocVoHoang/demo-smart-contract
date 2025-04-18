// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Mô phỏng một ZKP Verifier (chỉ trả về true)
contract ZKProofVerifier {
    function verifyProof(bytes calldata proof) public pure returns (bool) {
        // Giả lập xác minh thành công
        return proof.length > 0;
    }
}