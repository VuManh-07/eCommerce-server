const RedisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
  constructor() {
    console.log("iventory");
    RedisPubSubService.subscribe("purchase_events", (channel, message) => {
      console.log("Received channel::", channel);
      console.log("Received message::", message);
      InventoryServiceTest.updateInventory(message);
    });
  }

  static updateInventory(data) {
    const { productId, quantity } = JSON.parse(data);
    console.log("update inventory::", { productId, quantity });
  }
}

module.exports = new InventoryServiceTest();
