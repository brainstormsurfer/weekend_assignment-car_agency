const agencies = require("../data/agencies");
let customers = require("../data/customers");
const taxesAuthority = require("../data/taxesAuthority");

const carMarket = {

  // ?? - getAgencyById --- not formally requested (yet useful)
  getAgencyById: function (agencyId) {
    const agency = agencies.find((agency) => agency.agencyId === agencyId);
    if (!agency) {
      console.log(`Could not find agency by ID ${agencyId}`);
      return null;
    }
    return agency;
  },

  // ?? - getAgencyById --- not formally requested (yet useful)
  getCustomerById: function (customerId) {
    const customer = customers.find((customer) => customer.id === customerId);
    if (!customer) {
      console.log(`Could not find customer by ID ${customerId}`);
      return null;
    }
    return customer;
  },

  // getAgencyByName
  // @param {string} - name
  // @return {Object} - agency object
  getAgencyByName: function (agencies, name) {
    const agency = agencies.find((agency) => agency.agencyName === name);
    if (!agency) {
      console.log(`Agency named "${name} not found`);
      return;
    }
    return agency;
  },

  // getAgencyIdByName
  // @param {String} - name
  // @return {String} - agencyId
  getAgencyIdByName: function (agencies, name) {
    const agency = this.getAgencyByName(agencies, name);
    return agency ? agency.agencyId : "ID not found";
  },

  // getAllAgenciesName
  // @return {string[]} - agenciesNameArr - Array of all agencies name
  getAllAgenciesName: function () {
    return agencies.map(({ agencyName }) => agencyName);
  },

  // getAllCarsToBuy
  // @return {object[]} - allCarsToBuy - arrays of all cars objects
  getAllCarsToBuy: function () {
    let carsArr = [];
    agencies.forEach((agency) => {
      let pairs = Object.entries(agency);
      for (const [key, value] of pairs) {
        if (key === "cars") {
          value.forEach(({ brand, models }) => {
            let existingBrand = carsArr.find((car) => car.brand === brand);
            if (existingBrand) {
              models.forEach(({ name }) => {
                if (!existingBrand.models.includes(name)) {
                  existingBrand.models.push(name);
                }
              });
            } else {
              let uniqueModels = models.map((model) => model.name);
              carsArr.push({ brand: brand, models: uniqueModels });
            }
          });
        }
      }
    });
    return carsArr;
  },

  // getAllCarsToBuyByAgencyId
  // @param {string} - id of agency
  // @return {object[]} - carsArray - arrays of all models objects of specific agency
  getAllCarsToBuyByAgencyId: function (agencyId) {
    // filtering out an array which contain the required agency obj as its single element (agency[0])
    const agency = agencies.filter((agency) => agency.agencyId === agencyId);
    if (agency.length > 0) {
      // an array of cars obj (brand and models names)
      const allAgencyCars = [];
      agency[0].cars.forEach(({ brand, models }) => {
        const carModels = models.map((model) => model.name);
        allAgencyCars.push({ brand: brand, models: carModels });
      });
      return allAgencyCars;
    }
    // According to Linter's comment to return the same type of data, I gave up the following :
    // return `Agency id: ${agencyId} not found`
    return [];
  },

  // getAllBrandsToBuyAgencyId
  // @param {string} - agencyId -  id of agency
  // @return {string[]} - arrOfBrands - arrays of all brands name in specific agency
  getAllBrandsToBuyByAgencyId: function (agencyId) {
    const carsOfAgency = this.getAllCarsToBuyByAgencyId(agencyId);
    if (carsOfAgency.length > 0) {
      let brandOfAgency = [];
      for (const { brand } of carsOfAgency) {
        brandOfAgency.push(brand);
      }
      return brandOfAgency;
    }
    return [];
  },

  // getCustomerByName
  // @param {string} - name
  // @return {Object} - customer
  getCustomerByName: function (name) {
    const customer = customers.filter((customer) =>
      customer.name.includes(name)
    );
    if (customer[0]) {
      return customer[0];
    }
    return null;
  },

  // getCustomerIdByName
  // @param {name}
  // @return {String} - customerId - The customer id
  getCustomerIdByName: function (name) {
    const customer = this.getCustomerByName(name);
    return customer ? customer.id : `ID not found by name: ${name}`;
  },

  // getAllCustomersNames
  // @return {string[]} - customersNameArr -  Array of all customers name
  getAllCustomersNames: function () {
    return customers.map(({ name }) => name);
  },

  // getAllCustomerCars
  // @param {id} - costumerId - costumer id
  // @return {object[]} - customerCarsArr -  Array of all customer cars object
  getAllCustomerCarsById: function (id) {
    const customer = customers.filter((customer) => id === customer.id);
    // According to Linter's comment to return the same type of data, I gave up the following :
    // return customer.length > 0 ? customer[0].cars : 'ID not found'
    return customer.length > 0 ? customer[0].cars : [];
  },

  // getCustomerCash
  // @param {id} - costumerId - costumer id
  // @return {number} - CustomerCash
  getCustomerCashById: function (id) {
    const customer = customers.filter((customer) => id === customer.id);
    if (customer.length > 0) {
      if (!customer[0].cash) {
        // Error returns a string (while success a number)
        console.log(`The customer ${customer[0].name} has no cash property`);
      }
      return customer[0].cash;
    }
    // Error returns a string (while success a number)
    return `Customer with ID: ${id} not found`;
  },

  // setPropertyBrandToAllCars
  // set all cars model object the current brand
  setPropertyBrandToAllCars: function () {
    const allCars = this.getAllCarsToBuy();
    for (const customer of customers) {      
        for (const customerCar of customer.cars) {
          let isMatchFound = false;
          for (const car of allCars) {
            if (car.models.includes(customerCar.name)) {
              customerCar.brand = car.brand.toUpperCase();
              isMatchFound = true;
              break;
            }
          }
          if (!isMatchFound) {
            console.log(
              `No match found to ${customer.name}'s model ${customerCar.name}`
            );
          } else {
            console.log(
              `${customer.name}'s model ${customerCar.name} updated with brand ${customerCar.brand}`
            );
          }        
      }
    }
  },

  // setNewCarToAgency
  // @param {string} - id of agency
  // @param {object} - carObject
  setNewCarToAgency: function (agencyId, carObject) {
    if (!carObject) {
      console.log('Something\'s wrong with the car object')
    }  
    const agency = this.getAgencyById(agencyId);
    if (!agency) {
      console.log('Agency not found');
    }
    agency.cars.push(carObject);    

    console.log(agency.cars);
  },

  // deleteCarFromAgency
  // @param {string} - id of agency
  // @param {string} -  Car id
  deleteCarFromAgency: function (agencyId, carId) {
    const agency = this.getAgencyById(agencyId);
    if (!agency) {
      console.log('Agency not found');
    }          
    const filteredCarsArr = agency.cars.filter((car) => car.carNumber !== carId)

    if (filteredCarsArr.length > 0) {
      agency.cars = filteredCarsArr
    }

    // ?? log to check if successfully delete
    console.log(`Cars list of ${agency.agencyName} agency without the deleted object:`)
    for (const car of agency.cars) {
          console.log(car.brand.toUpperCase());
          console.log(car.models)
    }
    
    return agency.cars
  },

// getDecrementOrIncrementString
getDecrementOrIncrement: function (oldVal, updatedByVal) {
  const newVal = oldVal + updatedByVal
  if (newVal > oldVal) {
    return 'increment'
  } else {
    return 'decrement'
  }
},

  // decrementOrIncrementCashOfAgency
  // @param {string} - agencyId
  // @param {number} - amount - negative or positive amount
  // @return {number} - agencyCash
  decrementOrIncrementCashOfAgency: function (agencyId, amount) {      
    const agency = this.getAgencyById(agencyId)
    if (agency) {
      const action = this.getDecrementOrIncrement(agency.cash, amount)
      console.log(`Agency cash before ${action}: ${agency.cash}`);
          agency.cash += amount
      console.log(`Agency cash after ${action}: ${agency.cash}`);
      }
      return agency.cash
  },

  // decrementOrIncrementCreditOfAgency
  // @param {string} - agencyId
  // @param {number} - amount - negative or positive amount
  // @return {number} - agencyCash
  decrementOrIncrementCreditOfAgency: function (agencyId, amount) {
    const agency = this.getAgencyById(agencyId)
    if (agency) {
      const action = this.getDecrementOrIncrement(agency.credit, amount)
      console.log(`Agency credit before ${action}: ${agency.credit}`);
          agency.credit += amount
      console.log(`Agency credit after ${action}: ${agency.credit}`);
      }
      return agency.credit
  },

  // setAmountOfCarsToBuyToAllAgency's
  // set a new property amountOfCars to all agency's, that represent the amount of cars available in the agency.
  // @return {objects[]} - sellers - array of all agency's
  setAmountOfCarsToBuyToAllAgency: function () {      
      agencies.forEach(agency => {
        agency.amountOfCars = 0
        for (const {models} of agency.cars) {
          console.log('car.models',models)
          agency.amountOfCars += models.length
        }
      })
      return agencies
  },

  // setCarToCostumer
  // @param {string} - costumerId
  // @param {object} - carObject
  // @return {object[]} - allCarsOfCostumer
  setCarToCostumer: function (customerId, carObj) {
    const customer = this.getCustomerById(customerId)
    if (customer.cash - )
    // const allCars = this.getAllCarsToBuy
    
    // check if customer have enough cash to buy car
    // if yes - check if car exists/available in the agency
                // if yes  - set him/her the requested car
                // if no - return an informative message
    // if no(t enough money) -
    // check for other cars available considering customer budget 
    // if yes - return an array of possibilities (as an obj)
    // if no - return an informative message of the problem (as an obj?)
  },

  // deleteCarOfCostumer
  // @param {string} - costumerId
  // @param {string} - carId
  // @return {object[]} - allCarsOfCostumer
  deleteCarOfCostumer: function (marketObj, customerId, carId) {},

  // decrementOrIncrementCashOfCostumer
  // @param {string} - costumerId
  // @param {number} - amount - negative or positive amount
  // @return {number} - costumerCash
  decrementOrIncrementCashOfCostumer: function (
    marketObj,
    customerId,
    amount
  ) {},

  //   sortAndFilterByYearOfProduction
  //   filter and Sort in a Ascending or Descending order all vehicles for sale by year of production.
  //   @param {object[]} - arrOfCars - array of cars
  //   @param {number} - fromYear - Will display vehicles starting this year
  //   @param {number} - toYear - Will display vehicles up to this year
  //   @param {boolean} - isAscendingOrder - true for ascending order, false for descending order
  //   @return {object[]} - arrayOfModels - array of sorted cars
  sortAndFilterByYearOfProduction: function (
    carArray,
    fromYear,
    toYear,
    isAscendingOrder
  ) {},

  //   sortAndFilterByPrice
  //   filter and Sort in a Ascending or Descending order all vehicles for sale by price of the cars.
  //   @param {object[]} - arrOfCars - array of cars
  //   @param {number} - fromPrice - Will display vehicles starting at this price
  //   @param {number} - fromPrice - Will display vehicles up to this price
  //   @param {boolean} - isAscendingOrder - true for ascending order, false for descending order
  //   @return {object[]} - arrayOfModels - array of sorted cars
  sortAndFilterByPrice: function (
    carArray,
    fromPrice,
    toPrice,
    isAscendingOrder
  ) {},

  //   searchCar
  //   @param {object[]} - arrOfCars - array of cars
  //   @param {number} - fromYear - Will display vehicles starting this year
  //   @param {number} - toYear - Will display vehicles up to this year
  //   @param {number} - fromPrice - Will display vehicles starting at this price
  //   @param {number} - fromPrice - Will display vehicles up to this price
  //   optional @param {string} - brand - Look only for cars of this brand
  searchCar: function (
    carArray,
    fromYear,
    toYear,
    fromPrice,
    toPrice,
    brand
  ) {},

  //   Sell ​​a car to a specific customer
  //   @param {string} - agencyId
  //   @param {string} - customerId
  //   @param {string} - carModel
  //   @return {object} - The object of the car purchased by the customer or an explanation message

  //      Instructions for handling taxes:
  //      - a. Subtract the vehicle amount + 17% (tax) from the customer's cash.
  //      - b. Add the vehicle value to the car agency cash.
  //      - c. Change the car owner's id to the customer's id.
  //      - d. Remove the car from the array of the agency's car models.
  //      - e. Add the car to the client cars array.
  //
  //      Taxes Authority:
  //      - f. Pay 17 percent of the vehicle value to the tax authority. (add the amount to totalTaxesPaid)
  //      - g. Increase the number of transactions made in one (numberOfTransactions)
  //      - h. Add the vehicle amount + tax to sumOfAllTransactions
  //     - Check that there is the requested vehicle at the agency in not return 'The vehicle does not exist at the agency'
  //     - Check that the customer has enough money to purchase the vehicle, if not return 'The customer does not have enough money'
  sellCar: function (marketObj, agencyId, customerId, carModel) {},
};


// ?? ------- TESTS ------- //
console.log(
  // carMarket.getAgencyById('26_IPfHU1'),
  // carMarket.getCustomerById('BGHhjnE8'),
  // carMarket.getAgencyByName(agencies,"Best Dal")
  // carMarket.getAgencyIdByName(agencies,"Best Deal")
  // carMarket.getAllAgenciesName()
  // carMarket.getAllCarsToBuy()
  // carMarket.getAllCarsToBuyByAgencyId("gNHjNFL12")
  // carMarket.getAllBrandsToBuyByAgencyId("gNHjNFL12")
  // carMarket.getCustomerByName("Phil")
  // carMarket.getCustomerIdByName("Phail")
  // carMarket.getAllCustomersNames()
  // carMarket.getAllCustomerCarsById("5x2tMcX4R")
  // carMarket.getCustomerCashById("BGzHhjnE8")
  // carMarket.setPropertyBrandToAllCars()
  // carMarket.setNewCarToAgency("26_IPfHU1", {
  //   brand: "Honda",
  //   models: [
  //     {
  //       name: "Type-R",
  //       year: 2007,
  //       price: 160000,
  //       carNumber: "chill-4u",
  //       ownerId: "26_IPfHU1",
  //     }
  //   ]
  // })
// carMarket.setPropertyBrandToAllCars()
// carMarket.deleteCarFromAgency('26_IPfHU1', 'chill-4u')
    // carMarket.decrementOrIncrementCashOfAgency("Plyq5M5AZ", 20)
    // carMarket.decrementOrIncrementCreditOfAgency("Plyq5M5AZ", -220)
    // carMarket.setAmountOfCarsToBuyToAllAgency()
    carMarket.()
);


// ?? ---------------------- //