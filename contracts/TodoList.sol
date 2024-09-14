// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;


    }

    mapping (uint => Task) public tasks;

    constructor() public{
        createTask("Made by Bryan Fury");
    }

    function createTask(string memory _content ) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);

    }


}