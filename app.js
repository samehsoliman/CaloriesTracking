// Storage Controller

const storageCtrl = (function () {
  // public functions
  return {
    // get items local storage
    getItemsLS: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    // set items local storage
    addItemsLS: function (item) {
      let items = storageCtrl.getItemsLS();;
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items));
    },

    // update items local storage
    updateItemsLS: function (itemUpdate) {
      let items = storageCtrl.getItemsLS();
      items.forEach((item, idx) => {
        if (item.id === itemUpdate.id) {
          // items.splice(idx,1,itemUpdate);
          item.name = itemUpdate.name;
          item.calories = itemUpdate.calories;
        }
      })
      localStorage.setItem('items', JSON.stringify(items))
    },

    // delete items local storage
    deleteItemsLS: function (id) {
      let items = storageCtrl.getItemsLS();
      items.forEach((item, idx) => {
        if (item.id === id) {
          items.splice(idx,1);
        }
      })
      localStorage.setItem('items', JSON.stringify(items))
    },

    // clear items local storage
    clearItemsLS: function(){
      localStorage.removeItem('items');
    }
  }
})()

// Item Controller
const itemCtrl = (function () {
  // item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data
  const data = {
    items: storageCtrl.getItemsLS(),
    // items: [
    //   // { id: 1, name: "Egg", calories: 200 },
    //   // { id: 2, name: "Burger", calories: 400 },
    //   // { id: 3, name: "Salad", calories: 300 }
    // ],
    currentItem: null,
    totalCalories: 0
  }

  return {

    // get items
    getItems: function () {
      return data.items;
    },

    // add item
    addItem: function (item) {
      let id;
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }
      const newItem = new Item(id, item.name, parseInt(item.calories));
      data.items.push(newItem);
      return newItem;
    },

    // get total calories
    getTotalCalories: function () {
      let totalCalories = 0;
      data.items.forEach(item => {
        totalCalories += item.calories;
      })
      return totalCalories;
    },

    // get Item by id
    getItemById: function (id) {
      let currItem = null;
      data.items.forEach(item => {
        if (item.id === id) {
          currItem = item;
        }
      })
      return currItem;
    },

    // set current item
    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    // getCurrent Item
    getCurrentItem: function () {
      return data.currentItem;
    },

    // update item
    updateItem: function (updateItem) {
      let itm = null;
      data.items.forEach(item => {
        if (data.currentItem.id === item.id) {
          item.name = updateItem.name;
          item.calories = parseInt(updateItem.calories);
          itm = item;
        }
      })
      return itm;
    },

    // delete item
    deleteItem: function (id) {
      data.items.forEach((item, idx) => {
        if (item.id === id) {
          data.items.splice(idx, 1);
        }
      })
    },

    // clear items
    clearItems: function () {
      data.items = [];
    }
  }

})();


// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    totalCalories: '.total-calories',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    collectionItem: '.collection-item',
    collectionItemId: '#item-'
  }


  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fa fa-pencil"></i>
        </a>
      </li>
        `
        document.querySelector(UISelectors.itemList).innerHTML = html;
      })
    },

    // get Inputs
    getInput: function () {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value
      }
    },

    // add list item
    addListItem: function (item) {
      this.showList();
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="fa fa-pencil"></i>
            </a>
      `
      document.querySelector(UISelectors.itemList).appendChild(li);

    },

    // clear input
    clearInput: function () {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },

    // hide list
    hideList: function () {
      if (itemCtrl.getItems().length === 0) {
        document.querySelector(UISelectors.itemList).style.display = 'none';
      }
    },

    // show list
    showList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'block';
    },

    // update total calories
    updateTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    // clear edit state
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';

    },

    // show edit state
    showEditState: function () {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';

    },

    // add item to form
    addItemToForm: function () {
      document.querySelector(UISelectors.itemName).value = itemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalories).value = itemCtrl.getCurrentItem().calories;
    },

    // update list item
    updateListItem: function (item) {
      document.querySelector(`${UISelectors.collectionItemId}${item.id}`).innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fa fa-pencil"></i>
        </a>
      `
    },

    // delete list item
    deleteListItem: function (id) {
      document.querySelector(`#item-${id}`).remove();
    },

    // clear list items
    clearListItems: function () {
      document.querySelector(UISelectors.itemList).innerHTML = '';
    },

    // get Selectors
    getSelectors: function () {
      return UISelectors;
    }
  }
})();

// App 
const app = (function (itemCtrl, UICtrl) {
  // Load event listners
  const loadEventListners = function () {
    const UISelectors = UICtrl.getSelectors();
    document.querySelector(UISelectors.addBtn).addEventListener('click', addItemSubmit);

    // edit event 
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

    // disable enter
    document.addEventListener('keypress', function (e) {
      if (e.keCode === 13 || e.which === 13) {
        e.preventDefault();
      }
    })

    // update event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItemSubmit);

    // delete event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItemSubmit);

    // back event
    document.querySelector(UISelectors.backBtn).addEventListener('click', backItemSubmit);

    // clear all event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearItemSubmit);

  }

  // add Item Submit
  const addItemSubmit = function (e) {
    const input = UICtrl.getInput();

    if (input.name !== '' && input.calories !== '') {
      const newItem = itemCtrl.addItem(input);

      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = itemCtrl.getTotalCalories();

      // update total calories
      UICtrl.updateTotalCalories(totalCalories);

      // add item ls
      storageCtrl.addItemsLS(newItem);

      // clear form
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // update item submit
  const updateItemSubmit = function (e) {
    const item = UICtrl.getInput();

    // update item data
    const updatedItem = itemCtrl.updateItem(item);

    // update item UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = itemCtrl.getTotalCalories();

    // update total calories
    UICtrl.updateTotalCalories(totalCalories);

    // update item ls
    storageCtrl.updateItemsLS(updatedItem);

    // clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // delete item submit
  const deleteItemSubmit = function (e) {
    const id = itemCtrl.getCurrentItem().id;

    // delete item data structure
    itemCtrl.deleteItem(id);

    // delete item UI
    UICtrl.deleteListItem(id);

    // get total calories
    const totalCalories = itemCtrl.getTotalCalories();

    // update total calories
    UICtrl.updateTotalCalories(totalCalories);

    // clear edit state
    UICtrl.clearEditState();

    // delete item ls
    storageCtrl.deleteItemsLS(id);

    // hide list
    UICtrl.hideList();

    e.preventDefault();
  }

  // clear item submit
  const clearItemSubmit = function (e) {
    // clear items data structure
    itemCtrl.clearItems();

    // clear items UI
    UICtrl.clearListItems();

    // get total calories
    const totalCalories = itemCtrl.getTotalCalories();

    // update total calories
    UICtrl.updateTotalCalories(totalCalories);

    // clear items ls
    storageCtrl.clearItemsLS();

    // hide list
    UICtrl.hideList();

    e.preventDefault();
  }

  // back item submit
  const backItemSubmit = function (e) {
    UICtrl.clearEditState();
    e.preventDefault();
  }

  // item edit click
  const itemEditClick = function (e) {
    if (e.target.parentElement.parentElement.classList.contains('collection-item')) {
      const idList = e.target.parentElement.parentElement.id;
      const idArr = idList.split('-');
      const item = itemCtrl.getItemById(parseInt(idArr[1]));

      // set current item
      itemCtrl.setCurrentItem(item);

      // add item to form
      UICtrl.addItemToForm();

      // show edit state
      UICtrl.showEditState();
    }

    e.preventDefault();
  }

  return {
    init: function () {
      console.log('App init ...')
      const items = itemCtrl.getItems();

      // clear edit state
      UICtrl.clearEditState();

      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);

        // get total calories
        const totalCalories = itemCtrl.getTotalCalories();

        // update total calories
        UICtrl.updateTotalCalories(totalCalories);

      }
      loadEventListners();
    }
  }

})(itemCtrl, UICtrl)

app.init();

