const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { FileSystemWallet, Gateway,Wallets } = require('fabric-network');
let gateway;

module.exports.getContractInstance = async function() {
			// A gateway defines which peer is used to access Fabric network
			// It uses a common connection profile (CCP) to connect to a Fabric Peer
			// A CCP is defined manually in file connection-profile-mhrd.yaml
			gateway = new Gateway();
			
			// A wallet is where the credentials to be used for this transaction exist
			// Credentials for user MHRD_ADMIN was initially added to this wallet.
			//const wallet = await Wallets.newFileSystemWallet('../identity/user/user1/wallet');
			
			// What is the username of this Client user accessing the network?
			//const userName = 'user1';
			
			// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
			//let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));
			const ccpPath = path.resolve(__dirname, '../..', 'organizations', 'peerOrganizations', 'Org1', 'ccp-Org1.json');
	                console.log(ccpPath);
			let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
	                
	
			// Create a new file system based wallet for managing identities.
			const walletPath = path.join(process.cwd(), 'wallet');
			const wallet = await Wallets.newFileSystemWallet(walletPath);
			console.log(`Wallet path: ${walletPath}`);
			
			const identity = await wallet.get('User1@Org1');
			if (!identity) {
				console.log('An identity for the user "appUser" does not exist in the wallet');
				console.log('Run the registerUser.js application before retrying');
				return;
			}

			// await gateway.connect(ccp, { wallet, identity: 'User1@Org1', discovery: { enabled: true, asLocalhost: true } });
			await gateway.connect(ccp, { wallet, identity: 'User1@Org1', discovery: { enabled: true, asLocalhost: false } });
	

			// Access PaperNet network
			console.log('Use network channel: synergychannel.');

			const network = await gateway.getNetwork('mytestchannel');

			return  await network.getContract('collaborationcontract');
	}

	module.exports.getNetworkInstance = async function() {
		// A gateway defines which peer is used to access Fabric network
		// It uses a common connection profile (CCP) to connect to a Fabric Peer
		// A CCP is defined manually in file connection-profile-mhrd.yaml
		gateway = new Gateway();
		
		// A wallet is where the credentials to be used for this transaction exist
		// Credentials for user MHRD_ADMIN was initially added to this wallet.
		//const wallet = await Wallets.newFileSystemWallet('../identity/user/user1/wallet');
		
		// What is the username of this Client user accessing the network?
		//const userName = 'user1';
		
		// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
		//let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));
		const ccpPath = path.resolve(__dirname, '../..', 'organizations', 'peerOrganizations', 'Org1', 'ccp-Org1.json');
		let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

		// Create a new file system based wallet for managing identities.
		const walletPath = path.join(process.cwd(), 'wallet');
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Wallet path: ${walletPath}`);
		
		const identity = await wallet.get('User1@Org1');
		if (!identity) {
			console.log('An identity for the user "appUser" does not exist in the wallet');
			console.log('Run the registerUser.js application before retrying');
			return;
		}

		// await gateway.connect(ccp, { wallet, identity: 'User1@Org1', discovery: { enabled: true, asLocalhost: true } });
		await gateway.connect(ccp, { wallet, identity: 'User1@Org1', discovery: { enabled: true, asLocalhost: false } });


		// Access PaperNet network
		console.log('Use network channel for new services: synergychannel.');

		const network = await gateway.getNetwork('mytestchannel');
        return network;
		//return  await network.getContract('collaborationcontract');
}
  
	module.exports.disconnect = async function(){
		await gateway.disconnect();
	}
