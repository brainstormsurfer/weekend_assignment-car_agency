const agencies = require("../data/agencies");
const customers = require("../data/customers");
const taxesAuthority = require("../data/taxesAuthority");

const carMarket = {
  // getAgencyByName
  // @param {string} - name
  // @return {Object} - agency object
  getAgencyByName : function (agencies, agencyName) {
    const agency = agencies.find((agency) => agency.agencyName === agencyName);
      if (!agency) {        
        console.log(`Agency named "${agencyName} not found`)
        return;
    }    
    return agency;
  },

  // getAgencyIdByName
  // @param {String} - name
  // @return {String} - agencyId
  getAgencyIdByName : function (agencies, agencyName) {
    const agency = this.getAgencyByName(agencies, agencyName)
    return agency ? agency.agencyId : "ID not found"
  },

  // getAllAgenciesName
  // @return {string[]} - agenciesNameArr - Array of all agencies name
  getAllAgenciesName : function (agencies) {return agencies.map(({agencyName}) => agencyName)},

  // getAllCarToBuy
  // @return {object[]} - allCarsToBuy - arrays of all cars objects
  getAllCarToBuy : function (agencies) {
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

  // getAllCarToBuyByAgencyId
  // @param {string} - id of agency
  // @return {object[]} - carsArray - arrays of all models objects of specific agency
  getAllCarToBuyByAgencyId : function (agencyId) {
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
    //linter comment to return the same type so giving up the following
    // return `Agency id: ${agencyId} not found`
    return [];
  },
  // getAllBrandsToBuyAgencyId
  // @param {string} - agencyId -  id of agency
  // @return {string[]} - arrOfBrands - arrays of all brands name in specific agency
  getAllBrandsToBuyByAgencyId : function (agencyId) {
    const carsOfAgency = this.getAllCarToBuyByAgencyId(agencyId);    
    if (carsOfAgency.length > 0) {
      let brandOfAgency = [];
      for (const { brand } of carsOfAgency) {
        brandOfAgency.push(brand);
      }
      return brandOfAgency;
    } 
    return []
  },

  // getCustomerByName
  // @param {string} - name
  // @return {Object} - customer
  getCustomerByName : function (name) {
      const customer = customers.filter(customer => customer.name.includes(name))
      if (customer[0]) {        
        return customer[0];      
      }    
      console.log(`"${name}" not found`);
      return null;
      
  },

  // getCustomerIdByName
  // @param {name}
  // @return {String} - customerId - The customer id
  getCustomerIdByName : function (name) {
    const customer = this.getCustomerByName(name)
    return customer ? customer.id : 'ID not found'
  },

  // getAllCustomersNames
  // @return {string[]} - customersNameArr -  Array of all customers name
  getAllCustomersNames : function (name) {},

  // getAllCustomerCars
  // @param {id} - costumerId - costumer id
  // @return {object[]} - customerCarsArr -  Array of all customer cars object
  getAllCustomerCars : function (id) {},

  // getCustomerCash
  // @param {id} - costumerId - costumer id
  // @return {number} - CustomerCash
  getCustomerCash : function (id) {},

  // setPropertyBrandToAllCars
  // set all cars model object the current brand
  setPropertyBrandToAllCars : function () {},

  // setNewCarToAgency
  // @param {string} - id of agency
  // @param {object} - carObject
  setNewCarToAgency : function (agencyId, carObject) {},

  // deleteCarFromAgency
  // @param {string} - id of agency
  // @param {string} -  Car id
  deleteCarFromAgency : function (marketObj, agencyId, carId) {},

  // decrementOrIncrementCashOfAgency
  // @param {string} - agencyId
  // @param {number} - amount - negative or positive amount
  // @return {number} - agencyCash
  decrementOrIncrementCashOfAgency : function (marketObj, agencyId, amount) {},

  // decrementOrIncrementCreditOfAgency
  // @param {string} - agencyId
  // @param {number} - amount - negative or positive amount
  // @return {number} - agencyCash
  decrementOrIncrementCreditOfAgency : function (marketObj, agencyId, amount) {},

  // setAmountOfCarsToBuyToAllAgency's
  // set a new property amountOfCars to all agency's, that represent the amount of cars available in the agency.
  // @return {objects[]} - sellers - array of all agency's
  setAmountOfCarsToBuyToAllAgency : function (carMarket) {},

  // setCarToCostumer
  // @param {string} - costumerId
  // @param {object} - carObject
  // @return {object[]} - allCarsOfCostumer
  setCarToCostumer : function (marketObj, customerId, carObj) {},

  // deleteCarOfCostumer
  // @param {string} - costumerId
  // @param {string} - carId
  // @return {object[]} - allCarsOfCostumer
  deleteCarOfCostumer : function (marketObj, customerId, carId) {},

  // decrementOrIncrementCashOfCostumer
  // @param {string} - costumerId
  // @param {number} - amount - negative or positive amount
  // @return {number} - costumerCash
  decrementOrIncrementCashOfCostumer : function (
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
  sortAndFilterByYearOfProduction : function (
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
  sortAndFilterByPrice : function (
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
  searchCar : function (
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
  sellCar : function (marketObj, agencyId, customerId, carModel) {},
  }


console.log(
  // carMarket.getAgencyByName(agencies,"Best Dal")
  // carMarket.getAgencyIdByName(agencies,"Best Deal")
  // carMarket.getAllAgenciesName(agencies)
  // carMarket.getAllCarToBuy(agencies)
  // carMarket.getAllCarToBuyByAgencyId("gNHjNFL12")
  // carMarket.getAllBrandsToBuyByAgencyId("gNHjNFL12")
  // carMarket.getCustomerByName("Phil")
  carMarket.getCustomerIdByName("Phil")
);
