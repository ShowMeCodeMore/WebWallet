function generate_seed(pwd) {
    /*产生12个单词的助记词*/
	let new_seed = lightwallet.keystore.generateRandomSeed();

    /*产生钱包地址*/
	generate_addresses(new_seed,pwd);
}

/*可以选择生成多个地址，本项目中只生成一个地址*/
let totalAddresses = 1;
let keysotre;

function generate_addresses(seed,pwd) {

    /*输入我填写的密码*/
    let password = pwd;

    /*创建并显示地址，私钥和账户余额*/
    lightwallet.keystore.createVault({
		password: password,
	  	seedPhrase: seed
	}, function (err, ks) {
    	console.log(ks);
        keysotre = ks;
        console.log('KS4:'+keysotre)
        /*以用户密码作为输出，产生的Uint8类型的数组的对称密钥，这个密钥用于加密和解密keystore*/
	  	ks.keyFromPassword(password, function (err, pwDerivedKey) {
	    	if(err) {
	    		document.getElementById("info").innerHTML = err;
	    	} else {
                /*通过seed助记词密码在keystore产生totalAddresses个地址/私钥对。这个地址/私钥对可通过ks.getAddresses()函数调用返回*/
	    		ks.generateNewAddress(pwDerivedKey, totalAddresses);
                let addresses = ks.getAddresses();

                let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
	    		// let web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.135:8545"));

                let html = "";

	    		for(let count = 0; count < addresses.length; count++) {
                    let address = addresses[count];
                    let private_key = ks.exportPrivateKey(address, pwDerivedKey);
                    let balance = web3.eth.getBalance("0x" + address);

					html = html + "<li>";
					html = html + "<p><b>Address: </b>0x" + address + "</p>";
					html = html + "<p><b>Private Key: </b>0x" + private_key + "</p>";
					html = html + "<p><b>Balance: </b>" + web3.fromWei(balance, "ether") + " ether</p>";
		    		html = html + "</li>";
	    		}

	    		document.getElementById("list").innerHTML = html;
	    	}
	  	});
	});
}