App = {
    loading: false,
    contracts: {},

    load: async () => {
        console.log("App loading ...");
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            window.alert("Please connect to Metamask.");
        }

        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                await ethereum.enable();
            } catch (error) {
                console.error("User denied account access");
            }
        } else if (window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);
        } else {
            console.log('Non-Ethereum browser detected. Please try MetaMask.');
        }
    },

    loadAccount: async () => {
        const accounts = await web3.eth.getAccounts();
        App.account = accounts[0];
        console.log("Account:", App.account);
    },

    loadContract: async () => {
        const todolist = await $.getJSON('TodoList.json');
        App.contracts.TodoList = TruffleContract(todolist);
        App.contracts.TodoList.setProvider(App.web3Provider);

        App.todolist = await App.contracts.TodoList.deployed();
    },

    render: async () => {
        if (App.loading) return;

        App.setLoading(true);

        // Display the account
        $("#account").html(App.account);

        // Render Tasks
        await App.renderTask();

        App.setLoading(false);
    },

    renderTask: async () => {
        const taskCount = await App.todolist.taskCount();
        const $taskTemplate = $('.taskTemplate');

        for (let i = 1; i <= taskCount; i++) {
            const task = await App.todolist.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2];

            // Clone the task template and update the content
            const $newTaskTemplate = $taskTemplate.clone();
            $newTaskTemplate.find('.content').html(taskContent);
            $newTaskTemplate.find('input')
                .prop('name', taskId)
                .prop('checked', taskCompleted);

            // Make the template visible
            $newTaskTemplate.show();

            // Add the task to the correct list
            if (taskCompleted) {
                $("#completedTaskList").append($newTaskTemplate);
            } else {
                $("#taskList").append($newTaskTemplate);
            }
        }
    },

    createTask: async() => {
        App.setLoading(false)
        const content = $('#newTask').val();
        await App.todolist.createTask(content, { from: App.account });
        window.location.reload()
    },

    setLoading: (boolean) => {
        App.loading = boolean;
        const loader = $('#loader');
        const content = $('#content');
        if (boolean) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
    }
};

$(() => {
    $(window).load(() => {
        App.load();
    });
});