export function getMPCContract(isTestnet = true) {
    if (isTestnet) {
        return 'v1.signer-prod.testnet';
    } else {
        return 'v1.signer';
    }
}

export function getMPCKey(isTestnet = true) {
    if (isTestnet) {
        return 'secp256k1:4NfTiv3UsGahebgTaHyD9vF8KYKMBnfd6kh94mK6xv8fGBiJB8TBtFMP5WWXz6B89Ac1fbpzPwAvoyQebemHFwx3';
    } else {
        return 'secp256k1:3tFRbMqmoa6AAALMrEFAYCEoHcqKxeW38YptwowBVBtXK1vo36HDbUWuR6EZmoK4JcH6HDkNMGGqP1ouV7VZUWya';
    }
}