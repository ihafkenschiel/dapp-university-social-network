pragma solidity >=0.5.0 <0.6.0;

contract SocialNetwork {
    string public name;
    uint256 public postCount = 0;
    mapping(uint256 => Post) public posts;

    struct Post {
        uint256 id;
        string content;
        uint256 tipAmount;
        address author;
    }

    event PostCreated(
        uint256 id,
        string content,
        uint256 tipAmount,
        address author
    );

    event PostTipped(
        uint256 id,
        string content,
        uint256 tipAmount,
        address payable author
    );

    constructor() public {
        name = "Handbook Social Network";
    }

    function createPost(string memory _content) public {
        // Require valid content
        require(bytes(_content).length > 0);
        postCount++;
        posts[postCount] = Post(postCount, _content, 0, msg.sender);
        // Trigger Event
        emit PostCreated(postCount, _content, 0, msg.sender);
    }

    function tipPost(uint _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);

        // Fetch the post
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = address(uint160(_post.author));
        // Pay the author
        _author.transfer(msg.value);
        // Increment the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post
        posts[_id] = _post;
        // Trigger an event
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    }
}
