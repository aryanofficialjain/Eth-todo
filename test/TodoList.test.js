const TodoList = artifacts.require("./TodoList.sol")

contract('TodoList', (accounts) => {
    before(async () => {
        this.todoList = await TodoList.deployed();

    })

    it('deploys successfully', async () => {
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)

    })

    it('list tasks', async () => {
        const taskcount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskcount)
        assert.equal(task.id.toNumber(), taskcount.toNumber())
        assert.equal(task.content, 'Made by Bryan Fury')
        assert.equal(task.completed, false)
        assert.equal(taskcount.toNumber(), 1)

    })

    it('creates tasks', async () => {
        const result = await this.todoList.createTask('A new task')
        const taskcount = await this.todoList.taskCount();
        assert.equal(taskcount, 2)
        console.log(result);
        
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'A new task')
        assert.equal(event.completed, false)


    })
})