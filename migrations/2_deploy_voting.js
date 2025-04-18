const EncryptedVoting = artifacts.require("EncryptedVoting");
const ZKProofVerifier = artifacts.require("ZKProofVerifier");
const { performance } = require('perf_hooks');

module.exports = async function (deployer) {
  try {
    // Khởi tạo biến đo lường
    let peakMemory = 0;
    const memStart = process.memoryUsage();

    // Hàm theo dõi bộ nhớ
    function trackMemory() {
      const memoryUsage = process.memoryUsage();
      const currentMemory = memoryUsage.heapUsed / 1024 / 1024; // MB
      peakMemory = Math.max(peakMemory, currentMemory);
    }

    // Đo bộ nhớ ban đầu
    trackMemory();

    // Đo tổng thời gian
    console.time("Total");
    const totalStart = performance.now();

    // Triển khai ZKProofVerifier
    console.time("Deployment");
    await deployer.deploy(ZKProofVerifier);
    const verifierInstance = await ZKProofVerifier.deployed();
    console.log("ZKProofVerifier deployed at:", verifierInstance.address);
    trackMemory();

    // Triển khai EncryptedVoting với địa chỉ ZKProofVerifier
    const candidateCount = 3;
    await deployer.deploy(EncryptedVoting, candidateCount, verifierInstance.address);
    const voting = await EncryptedVoting.deployed();
    console.log("EncryptedVoting deployed at:", voting.address);
    const deploymentTime = performance.now() - totalStart;
    console.timeEnd("Deployment");
    trackMemory();

    // Đo thời gian tạo proof (giả lập hoặc gọi vote)
    console.time("ProofGen");
    const proofGenStart = performance.now();
    // Giả lập proof
    const accounts = await web3.eth.getAccounts();
    const voter = accounts[0];
    const candidateId = 0;
    const encryptedVote = "0x01"; // Giả lập
    const zkProof = "0x1234"; // Giả lập
    await voting.vote(candidateId, encryptedVote, zkProof, { from: voter });
    const proofGenTime = performance.now() - proofGenStart;
    console.timeEnd("ProofGen");
    trackMemory();

    // Đo thời gian giải mã
    console.time("Decryption");
    const decryptionStart = performance.now();
    const result = await voting.getVotes(candidateId);
    const decryptionTime = performance.now() - decryptionStart;
    console.timeEnd("Decryption");
    trackMemory();

    // Kết thúc đo tổng thời gian
    const totalTime = performance.now() - totalStart;
    console.timeEnd("Total");

    // Tính toán và in kết quả
    const memEnd = process.memoryUsage();
    console.log("======== Resource Summary ========");
    console.log(`Total Time: ${(totalTime).toFixed(2)} ms`);
    console.log(`Deployment Time: ${(deploymentTime).toFixed(2)} ms`);
    console.log(`Proof Generation Time: ${(proofGenTime).toFixed(2)} ms`);
    console.log(`Decryption Time: ${(decryptionTime).toFixed(2)} ms`);
    console.log(`Peak Memory Usage: ${peakMemory.toFixed(2)} MB`);
  } catch (err) {
    console.error("Deployment failed:", err);
    throw err;
  }
};