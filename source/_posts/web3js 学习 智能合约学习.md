---
categories: 区块链
title: web3js 学习 智能合约学习
tags:
  - Web3js
  - Ethereum
  - Solidity
  - truffle
  - ganache
date: 2018-7-3 18:39:00
---

接下来，我们会创建一个智能合约，发布并且完成智能合约的调用。

阅读本篇文章的所需要具备的基础

1. 熟悉 Solidity 基本的操作，可以书写 简单的智能合约
2. 电脑上安装 truffle 用于 sol的解析，当然你也可以使用 solcjs 进行 bin 以及 abi的编译
3. 电脑上安装 genache 用于创建一个 测试网络


![](/publicFiles/images/web3js 学习 智能合约学习/download.png "以太坊-图灵完备智能合约最佳实践者")

当然如果你只是想在电脑运行一份，聊天智能合约的话，只需要装一个  genache 就可以了，直接跳转到最下面就可以了。

<!-- more -->

## 创建 一个智能合约

````solidity
pragma solidity ^0.4.0;

contract Chat{

	bytes32[] messages;

	event ReceivedMessage(address fromuser,bytes32 message);

	function sendMessage(bytes32 message) public {
		messages.push(message);
		emit ReceivedMessage(msg.sender,message);
	}

	function test() public returns (bytes32){
		bytes32 name = "你好";
		return name;
	}
}
````

## 编译 智能合约

### 使用 solcjs 编译

使用命令

````shell
solcjs Chat.sol -o ./out  --bin --abi

## docs
solcjs [filepath] -o [outpath] [--bin or --abi]
````

### 使用 truffle 编译


## web3js 调用 以及 部署智能合约

### 部署智能合约

我们首先引入 web3js ，
````html

	<script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js"></script>
````
引用之后
````html
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

const abiString = '[{"constant":false,"inputs":[{"name":"message","type":"bytes32"}],"name":"sendMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"test","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fromuser","type":"address"},{"indexed":false,"name":"message","type":"bytes32"}],"name":"ReceivedMessage","type":"event"}]'

const binString = '0x608060405234801561001057600080fd5b50610184806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e12c9ca814610051578063f8a8fd6d14610082575b600080fd5b34801561005d57600080fd5b5061008060048036038101908080356000191690602001909291905050506100b5565b005b34801561008e57600080fd5b5061009761012b565b60405180826000191660001916815260200191505060405180910390f35b7f8772b97689ed084ec4a4d86ec0d3b5c75e46d77b4c0cc886c5aaaf602cbc93323382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182600019166000191681526020019250505060405180910390a150565b6000807fe4bda0e5a5bd0000000000000000000000000000000000000000000000000000905080915050905600a165627a7a72305820d65d0484d4c51b85359ec95f030a8f84b1ccd24f9e2f4b262bdf7a9a8a4ffb0c0029'



const Contract = web3.eth.contract(JSON.parse(abiString));

	// Deploy contract instance
const contractInstance = Contract.new({
    data: binS,
    from: web3.eth.coinbase,
    gas: 90000*2
}, (err, res) => {
    if (err) {
        console.log(err);
        return;
    }
    
    // If we have an address property, the contract was deployed
    if (res.address) {
        console.log('Contract address: ' + res.address);
    }
});
````

执行完成后，我们就可以获取到我们的智能合约部署的地址了。

### 获取智能合约 调用方法

````
const contract = web3.eth.contract(JSON.parse(abiS)).at('0xb5c0a3f96c6f0dd334c158ee766641f1df34ef98');

// 打印； call 方法，会出结果，但是不会影响到实际区块链
console.log(contract.test.call());

// 打印； sendTransaction方法，实际影响到区块链
console.log(contract.test.sendTransaction());
````

### 监听 event 事件儿

````js
this.contract.ReceivedMessage(function(error,result){
	// ...
})
````

使用该方法可以检测，智能合约中的  `ReceivedMessage` 事件儿。

## 运行一个聊天 DAPP

````soliduty
pragma solidity ^0.4.0;

contract Chat{

	bytes32[] messages;

	event ReceivedMessage(address fromuser,bytes32 message);

	function sendMessage(bytes32 message) public {
		messages.push(message);
		emit ReceivedMessage(msg.sender,message);
	}

	function test() public returns (bytes32){
		bytes32 name = "你好";
		return name;
	}
}
````

生成 abi 和 bin 字段
````

	const binS = "0x608060405234801561001057600080fd5b506101b6806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e12c9ca814610051578063f8a8fd6d14610082575b600080fd5b34801561005d57600080fd5b5061008060048036038101908080356000191690602001909291905050506100b5565b005b34801561008e57600080fd5b5061009761015d565b60405180826000191660001916815260200191505060405180910390f35b60008190806001815401808255809150509060018203906000526020600020016000909192909190915090600019169055507f8772b97689ed084ec4a4d86ec0d3b5c75e46d77b4c0cc886c5aaaf602cbc93323382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182600019166000191681526020019250505060405180910390a150565b6000807fe4bda0e5a5bd0000000000000000000000000000000000000000000000000000905080915050905600a165627a7a7230582077134383b2da18c9d2798d5b3f6d4e18d7dc3dd8a8f96ee8774d75ea8e6bca970029"

	const abiS = '[ { "anonymous": false, "inputs": [ { "indexed": false, "name": "fromuser", "type": "address" }, { "indexed": false, "name": "message", "type": "bytes32" } ], "name": "ReceivedMessage", "type": "event" }, { "constant": false, "inputs": [ { "name": "message", "type": "bytes32" } ], "name": "sendMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "test", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]'

````

index.html 界面

````html
<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js"></script>
</head>
<body>
选择用户【余额=地址】:<select id="users"></select>
<ul id="list"></ul> 
<input type="text" id="message" name="" placeholder="输入一些内容吧"><button onclick="App.sendMessage()">发送</button>
</body>
<script type="text/javascript">
	
window.App = {
	init: function(){

		const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

		const abiS = '[ { "anonymous": false, "inputs": [ { "indexed": false, "name": "fromuser", "type": "address" }, { "indexed": false, "name": "message", "type": "bytes32" } ], "name": "ReceivedMessage", "type": "event" }, { "constant": false, "inputs": [ { "name": "message", "type": "bytes32" } ], "name": "sendMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "test", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]'


		this.contract = web3.eth.contract(JSON.parse(abiS)).at('0xb5c0a3f96c6f0dd334c158ee766641f1df34ef98');

		// 如果 没有智能合约地址，需要使用下面的方法 进行 部署智能合约并且获取智能合约地址

		// const binS = "0x608060405234801561001057600080fd5b506101b6806100206000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e12c9ca814610051578063f8a8fd6d14610082575b600080fd5b34801561005d57600080fd5b5061008060048036038101908080356000191690602001909291905050506100b5565b005b34801561008e57600080fd5b5061009761015d565b60405180826000191660001916815260200191505060405180910390f35b60008190806001815401808255809150509060018203906000526020600020016000909192909190915090600019169055507f8772b97689ed084ec4a4d86ec0d3b5c75e46d77b4c0cc886c5aaaf602cbc93323382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182600019166000191681526020019250505060405180910390a150565b6000807fe4bda0e5a5bd0000000000000000000000000000000000000000000000000000905080915050905600a165627a7a7230582077134383b2da18c9d2798d5b3f6d4e18d7dc3dd8a8f96ee8774d75ea8e6bca970029"

		// const contractInstance = Contract.new({
		//     data: binS,
		//     from: web3.eth.coinbase,
		//     gas: 90000*2
		// }, (err, res) => {
		//     if (err) {
		//         console.log(err);
		//         return;
		//     }
		    
		//     // If we have an address property, the contract was deployed
		//     if (res.address) {
		//         console.log('Contract address: ' + res.address);
		//     }
		// });

		this.watch();
		this.setUsers();
	},
	addAnother:function(fromuser,message,gasused){
	    var ul = document.getElementById("list");
	    var li = document.createElement("li");
	    var children = ul.children.length + 1
	    li.setAttribute("id", "element"+children)
	    try {
	    	li.appendChild(document.createTextNode("来自："+fromuser+"消耗【"+gasused+"】"+":消息"+web3.toUtf8(message)));
		}catch(err){
	    	li.appendChild(document.createTextNode("来自："+fromuser+"下号【"+gasused+"】"+":消息["+err+"]"+message));
		}
	    ul.appendChild(li)
	},
	sendMessage:function(){
		const e = document.getElementById("users");
		const strUser = e.options[e.selectedIndex].value;
		const input_view = document.getElementById("message");
		this.contract.sendMessage.sendTransaction(input_view.value,{from: strUser });
		input_view.value = "";
	},
	watch:function(){

		this.contract.ReceivedMessage(function(error,result){
			this.addAnother(result.args.fromuser,result.args.message,web3.eth.getTransactionReceipt(result.transactionHash).gasUsed)
			this.setUsers();
		}.bind(this))
	},
	setUsers: function(){

		const datasource = web3.eth.accounts
		const select = document.getElementById("users");
		const select_index = select.selectedIndex == -1 ? 0 : select.selectedIndex
		select.options.length = 0;
		for (var i = datasource.length - 1; i >= 0; i--) {
			// console.log();
			const balance = web3.eth.getBalance(datasource[i]);
    		select.options[select.options.length] = new Option(balance+"="+datasource[i], datasource[i]);
		}
		select.selectedIndex = select_index
	}
}

window.addEventListener('load', () => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.init();
});

</script>
</html>
````

### 预览

![](/publicFiles/images/web3js 学习 智能合约学习/Kapture 2018-07-03 at 18.32.41.gif "聊天 智能合约预览")