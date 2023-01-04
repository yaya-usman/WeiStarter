// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract campaignFactory{
    address[] private deployedCampaigns;

    function createCampaign(uint minimum, string memory _title, string memory _story,
     uint _target, uint _deadline, string memory _image) public{
        address newCampaign = address(new Campaign(minimum, 
                                msg.sender, _title, _story,
                                 _target, _deadline, _image));
        
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory){
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
    uint private minDonation;
    uint[] private donations;
    address[] private donators;
    mapping(address => bool) private donatorsMap;
    uint private donatorsCount;
 

    constructor(uint minimum, address _owner, string memory _title, string memory _story,
     uint _target, uint _deadline, string memory _image){
         
         require(_deadline < block.timestamp, 
         "The deadline should be a date in the future.");

        owner = _owner;
        minDonation = minimum;
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

        require(amount >= minDonation);

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

    function getContractSummary() public view returns (address,uint, uint, uint, address[] memory, uint[] memory ){
        return (
            owner,
            minDonation,
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