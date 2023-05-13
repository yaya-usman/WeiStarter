// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract CrowdFunding{

       struct Request{
        string title;
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount; //no of backers of this request 
        address[] approvers;
        string sampleImg;     
    }


     struct Campaign{
        address owner;
        string title;
        string description;
        uint target;
        uint deadline;
        uint amountCollected;
        string image;
        address[] donators;
        uint[] donations;
        uint donatorsCount;
        Request[] requests;
    }

 
    Campaign[] public campaigns;
    uint256 private numberOfCampaigns = 0;


    function createCampaign(address _owner, string memory _title, string memory _description,
     uint _target, uint _deadline,  
     string memory _image) public returns (uint) {
         
        Campaign storage campaign = campaigns.push();

        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;     

        numberOfCampaigns++;


        return numberOfCampaigns - 1;
}

    function donate(uint _idx) public payable{
            Campaign storage campaign = campaigns[_idx];
            uint amount = msg.value;

            campaign.donators.push(msg.sender);
            campaign.donations.push(amount);
            campaign.amountCollected = campaign.amountCollected + amount;

            campaign.donatorsCount++;
    

        }

    function getDonators(uint _idx) public view  returns (address[] memory, uint256[] memory) {
        return (campaigns[_idx].donators, campaigns[_idx].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }


     function createRequest(uint _idx, string memory _title, string memory _description, uint _value, string memory _sampleImg, address payable _recipient) public{
        Campaign storage campaign = campaigns[_idx];
        Request storage newRequest = campaign.requests.push();

        require(msg.sender ==  campaign.owner);
        require(msg.sender  != _recipient);
        require(campaign.amountCollected >= campaign.target);
        

        newRequest.title = _title;
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.sampleImg = _sampleImg;
        newRequest.approvalCount = 0;       
        }


    function getRequests(uint _idx) public view returns (Request[] memory){
        Campaign storage campaign = campaigns[_idx];

        return campaign.requests;
    }

   
    function approveRequest(uint _campaignIdx, uint _reqIdx) public{


        Campaign storage campaign = campaigns[_campaignIdx];
        Request storage request = campaign.requests[_reqIdx];

        require(msg.sender != campaign.owner);
        

        bool hasDonated = false;
        bool hasApproved = false;

        //ensuring the person has donated
        for(uint i=0; i<campaign.donators.length; i++){
            if(campaign.donators[i] == msg.sender){
                hasDonated = true;
            }
        }
        require(hasDonated);

        //ensuring no address has voted or approved twice
          for(uint i=0; i < request.approvers.length; i++){
            if(request.approvers[i] == msg.sender){
                hasApproved = true;
            }
        }
        
        require(!hasApproved);

        request.approvers.push(msg.sender);
        request.approvalCount++;
    }

    function finalizeRequest(uint _campaignIdx, uint _reqIdx) public{   
        Campaign storage campaign = campaigns[_campaignIdx];
        Request storage request = campaign.requests[_reqIdx];

        require(msg.sender == campaign.owner);
        
        require(request.approvalCount > (campaign.donatorsCount/2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
 
}