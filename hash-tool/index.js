/**
 * File hashing script.
 *
 * @author David Drazic
 * @note This script is used for blockchain document signer PoC project.
 * */

const hashFiles = require('hash-files')

// Get console arguments
let args = process.argv.slice(2)
const fileName = args[0]
const hashingAlgorithm = args[1]

// Hashing algorithms
const hashingAlgorithms = ['md5', 'sha', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512']

if (!fileName && !hashingAlgorithm) {
    console.log('Invalid argument input.')
    console.log('Try using something like: node index.js package.json sha256')
    process.exit(0)
}

if (!hashingAlgorithms.includes(hashingAlgorithm)) {
    console.log('Invalid hashing algorithm! Choose one of the following:')
    console.log(hashingAlgorithms)
    process.exit(0)
}

const options = {
    files: [fileName],
    algorithm: hashingAlgorithm
}

hashFiles(options, function(error, hash) {
    console.log('Hash successfully calculated!')
    console.log('Algorithm used: ' + hashingAlgorithm)
    console.log('Document hash:')
    console.log(hash)
});
