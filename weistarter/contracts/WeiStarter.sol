// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract campaignFactory{
    Campaign[] private deployedCampaigns;

    function createCampaign(string memory _title, string memory _story,
     uint _target, uint _deadline, string memory _image) public{
        Campaign newCampaign = new Campaign(
                                msg.sender, _title, _story,
                                 _target, _deadline, _image);
        
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory){
        return deployedCampaigns;
    }
}


contract Campaign {

    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;     
    }

    Request[] private requests;

    address public owner;
    string private title;
    string private story; //campaign description
    uint private target;
    uint private deadline;
    uint private amountCollected;
    string private image;
    uint[] private donations;
    address[] private donators;
    mapping(address => bool) private donatorsMap;
    uint private donatorsCount;
 

    constructor(address _owner, string memory _title, string memory _story,
     uint _target, uint _deadline, string memory _image){
         
         require(deadline < block.timestamp, 
         "The deadline should be a date in the future.");

        owner = _owner;
        title = _title;
        story = _story;
        target = _target;
        deadline = _deadline;
        image = _image;
    }


    modifier restricted(){
        require(msg.sender == owner);
        _;
    }

    function donate() public payable{
        uint amount = msg.value;

        donatorsMap[msg.sender] = true;
        donators.push(msg.sender);
        donations.push(amount);
        amountCollected = amountCollected + amount;

        donatorsCount++;
    }

    function createRequest(string memory description, uint value,address payable recipient) public restricted{
        Request storage newRequest = requests.push();

        require(amountCollected >= target);
        
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.approvalCount = 0;       
}

    function approveRequest(uint index) public{
        Request storage request = requests[index];

        //ensuring the person has contributed
        require(donatorsMap[msg.sender]);

        //ensuring no address has voted or approved twice
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }

    function finalizeRequest(uint index) public{
        Request storage request = requests[index];

        require(request.approvalCount > (donatorsCount/2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getContractSummary() public view returns (address,string memory,string memory,uint, uint, string memory,
     uint,uint, address[] memory, uint[] memory ){
        return (
            owner,
            title,
            story,
            target,
            deadline,
            image,
            amountCollected,
            donatorsCount,
            donators,
            donations
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
 
}