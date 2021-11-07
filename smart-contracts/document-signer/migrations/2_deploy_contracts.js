const DocumentSigner = artifacts.require("./DocumentSigner.sol");

module.exports = function(deployer) {
    deployer.deploy(DocumentSigner);
};
