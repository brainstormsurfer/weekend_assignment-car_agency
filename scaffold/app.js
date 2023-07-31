const agencies = require("../data/agencies");
let customers = require("../data/customers");
const taxesAuthority = require("../data/taxesAuthority");

const carMarket = {
  // ? - getAgencyById
  getAgencyById: function (agencyId) {
    const agency = agencies.find((agency) => agency.agencyId === agencyId);
    if (!agency) {
      console.log(`Could not find agency by ID ${agencyId}`);
      return null;
    }
    return agency;
  },

  // ? - getAgencyById
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
    let allCars = [];
    agencies.forEach((agency) => {
      let agencyKeyValueArr = Object.entries(agency);
      for (const [key, value] of agencyKeyValueArr) {
        if (key === "cars") {
          value.forEach(({ brand, models }) => {
            let existingBrand = allCars.find((car) => {
              return car.brand === brand;
            });
            if (existingBrand) {
              models.forEach((model) => {
                if (!existingBrand.models.includes(model)) {
                  existingBrand.models.push(model);
                }
              });
            } else {
              let uniqueModels = [];
              models.forEach((model) => uniqueModels.push(model));
              allCars = [
                ...allCars.flat(),
                { brand: brand, models: uniqueModels },
              ];
            }
          });
        }
      }
    });

    console.log(
      "Clarification! Each obj of allCars array has 2 properties: A Brand (string) and an array of ALL MODELS OBJECTS of this brand"
    );
    return allCars;
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
    // matching a brand for all cars of each customer
    for (const customer of customers) {
      for (const customerCar of customer.cars) {
        let isMatchFound = false;
        for (const car of allCars) {
          const carModelsNames = car.models.map(({ name }) => name);
          if (carModelsNames.includes(customerCar.name)) {
            customerCar.brand = car.brand.toUpperCase();
            isMatchFound = true;
            // once finding a brand quitting the iteration
            break;
          }
        }
        if (isMatchFound) {
          console.log(
            `${customer.name}'s model ${customerCar.name} updated with brand ${customerCar.brand}`
          );
        } else {
          console.log(
            `No match found for ${customer.name}'s model ${customerCar.name}`
          );
        }
      }
    }
  },
  // // setNewCarToAgency
  // // @param {string} - id of agency
  // // @param {object} - carObject
  setNewCarToAgency: function (agencyId, carObject) {
    if (!carObject) {
      console.log("Something's wrong with the car object");
    }
    const agency = this.getAgencyById(agencyId);
    if (!agency) {
      console.log("Agency not found");
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
      console.log("Agency not found");
    }
    let carToDelete = {};
    agency.cars.forEach((car) => {
      const filteredModels = car.models.filter((model) => {
        if (model.carNumber === carId) {
          carToDelete = model;
        }
        return model.carNumber !== carId;
      });

      if (filteredModels.length === 0) {
        delete car.brand;
      }

      car.models = filteredModels;
      return car;
    });

    // ?? log to check if successfully delete
    console.log(
      `Updated cars list of "${
        agency.agencyName
      }" agency \n(without the deleted car: ${JSON.stringify(carToDelete)}) :`
    );
    for (const car of agency.cars) {
      console.log(car.brand.toUpperCase());
      console.log(car.models);
    }

    return agency.cars;
  },

  // ? getDecrementOrIncrementLiteral
  getDecrementOrIncrement: function (oldVal, updatedByVal) {
    const newVal = oldVal + updatedByVal;
    if (newVal < 0) {
      console.log(
        `Balance is ${Math.abs(newVal)} short. Transaction rejected!`
      );
      return "rejected";
    } else if (newVal > oldVal) {
      return "increment";
    } else {
      return "decrement";
    }
  },

  // decrementOrIncrementCashOfAgency
  // @param {string} - agencyId
  // @param {number} - amount - negative or positive amount
  // @return {number} - agencyCash
  decrementOrIncrementCashOfAgency: function (agencyId, amount) {
    const agency = this.getAgencyById(agencyId);
    const updatedCashValue = agency.cash + amount;
    if (agency) {
      const action = this.getDecrementOrIncrement(agency.cash, amount);
      if (action !== "rejected") {
        console.log(`Agency's cash before ${action}: ${agency.cash}`);
        agency.cash += updatedCashValue;
        console.log(`Agency's cash after ${action}: ${agency.cash}`);
        return agency.cash;
      } else return agency.cash;
    } else console.log("Agency not found");
  },

  // decrementOrIncrementCreditOfAgency
  // @param {string} - agencyId
  // @param {number} - amount - negative or positive amount
  // @return {number} - agencyCash
  decrementOrIncrementCreditOfAgency: function (agencyId, amount) {
    const agency = this.getAgencyById(agencyId);
    const updatedCashValue = agency.credit + amount;

    if (agency) {
      const action = this.getDecrementOrIncrement(agency.credit, amount);
      if (action !== "rejected") {
        console.log(`Agency's credit before ${action}: ${agency.credit}`);
        agency.credit = updatedCashValue;
        console.log(`Agency's credit after ${action}: ${agency.credit}`);
        return agency.credit;
      } else return agency.credit;
    } else console.log("Agency not found");
  },

  // setAmountOfCarsToBuyToAllAgency's
  // set a new property amountOfCars to all agency's, that represent the amount of cars available in the agency.
  // @return {objects[]} - sellers - array of all agency's
  setAmountOfCarsToBuyToAllAgency: function () {
    agencies.forEach((agency) => {
      agency.amountOfCars = 0;
      for (const { models } of agency.cars) {
        console.log("car.models", models);
        agency.amountOfCars += models.length;
      }
    });
    return agencies;
  },

  // setCarToCostumer
  // @param {string} - costumerId
  // @param {object} - carObject
  // @return {object[]} - allCarsOfCostumer
  setCarToCostumer: function (customerId, carObj) {
    // get customer
    const customer = this.getCustomerById(customerId);
    if (!customer) {
      console.log("customer not found");
      return [];
    }
    if (!carObj) {
      console.log("car not found");
    }
    const isLegitToBuyCar = customer.cash - carObj.price > 0 ? true : false;
    if (isLegitToBuyCar) {
      let agency = this.getAgencyById(carObj.ownerId);
      this.deleteCarFromAgency(agency.agencyId, carObj.carNumber);
      return customer.cars;
    } else {
      console.log(`Purchase isn't allow due to balance issue.`);
      return [];
    }
  },

  // deleteCarOfCostumer
  // @param {string} - costumerId
  // @param {string} - carId
  // @return {object[]} - allCarsOfCostumer
  deleteCarOfCostumer: function (customerId, carId) {
      const customer = 
  },

  // decrementOrIncrementCashOfCostumer
  // @param {string} - costumerId
  // @param {number} - amount - negative or positive amount
  // @return {number} - costumerCash
  decrementOrIncrementCashOfCostumer: function (customerId, amount) {
    const customer = this.getCustomerById(customerId);
    const updatedCashValue = customer.cash + amount;

    if (customer) {
      const action = this.getDecrementOrIncrement(customer.cash, amount);
      if (action !== "rejected") {
        console.log(`customer's cash before ${action}: ${customer.cash}`);
        customer.cash = updatedCashValue;
        console.log(`customer's cash after ${action}: ${customer.cash}`);
        return customer.cash;
      } else return customer.cash;
    } else console.log("Customer not found");
  },

  //   sortAndFilterByYearOfProduction
  //   filter and Sort in a Ascending or Descending order all vehicles for sale by year of production.
  //   @param {object[]} - arrOfCars - array of cars
  //   @param {number} - fromYear - Will display vehicles starting this year
  //   @param {number} - toYear - Will display vehicles up to this year
  //   @param {boolean} - isAscendingOrder - true for ascending order, false for descending order
  //   @return {object[]} - arrayOfModels - array of sorted cars
  sortAndFilterByYearOfProduction: function (
    fromYear,
    toYear,
    isAscendingOrder
  ) {
    const allCars = this.getAllCarsToBuy();
    const allModels = allCars.flatMap(({ models }) => models);
    const carsFilteredByYearsRange = allModels.filter(
      (car) => car.year >= fromYear && car.year <= toYear
    );
    carsFilteredByYearsRange.sort((a, b) => {
      if (isAscendingOrder) {
        return a.year - b.year;
      } else {
        return b.year - a.year;
      }
    });
    return carsFilteredByYearsRange;
  },

  //   sortAndFilterByPrice
  //   filter and Sort in a Ascending or Descending order all vehicles for sale by price of the cars.
  //   @param {object[]} - arrOfCars - array of cars
  //   @param {number} - fromPrice - Will display vehicles starting at this price
  //   @param {number} - fromPrice - Will display vehicles up to this price
  //   @param {boolean} - isAscendingOrder - true for ascending order, false for descending order
  //   @return {object[]} - arrayOfModels - array of sorted cars
  sortAndFilterByPrice: function (fromPrice, toPrice, isAscendingOrder) {
    const allCars = this.getAllCarsToBuy();
    const allModels = allCars.flatMap(({ models }) => models);
    const carsFilteredByYearsPrice = allModels.filter(
      (car) => car.price >= fromPrice && car.price <= toPrice
    );
    carsFilteredByYearsPrice.sort((a, b) => {
      if (isAscendingOrder) {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    return carsFilteredByYearsPrice;
  },

  //   searchCar
  //   @param {object[]} - arrOfCars - array of cars
  //   @param {number} - fromYear - Will display vehicles starting this year
  //   @param {number} - toYear - Will display vehicles up to this year
  //   @param {number} - fromPrice - Will display vehicles starting at this price
  //   @param {number} - fromPrice - Will display vehicles up to this price
  //   optional @param {string} - brand - Look only for cars of this brand
  searchCar: function (
    brand,
    fromYear,
    toYear,
    fromPrice,
    toPrice,
    isOptimalMatchOnly
  ) {
    const allCars = this.getAllCarsToBuy();
    let isYearsInRange = false;
    let isPriceInRange = false;
    let optimalMatch = [];
    let semiMatch = [];
    allCars.forEach((cars) => {
      if (cars.brand === brand) {
        cars.models.forEach((model) => {
          if (model.year >= fromYear && model.year <= toYear) {
            isYearsInRange = true;
          }
          if (model.price >= fromPrice && model.price <= toPrice) {
            isPriceInRange = true;
          }
          if (isYearsInRange && isPriceInRange) {
            optimalMatch.push({ optimalMatch: [brand, model] });
          } else if (
            (isYearsInRange || isPriceInRange) &&
            !isOptimalMatchOnly
          ) {
            semiMatch.push({ semiMatch: [brand, model] });
          }
          isYearsInRange = false;
          isPriceInRange = false;
        });
      }
    });
    if (!isOptimalMatchOnly) {
      if (optimalMatch.length > 0) {
        console.log(
          `Found ${optimalMatch.length} results which meet all of your requirements`
        );
        optimalMatch.forEach((car) => {
          console.log(car.optimalMatch[1]);
        });
      }
      if (semiMatch.length > 0) {
        console.log(
          `Found ${semiMatch.length} results which partially meets your requirement`
        );
        semiMatch.forEach((car) => {
          console.log(car.semiMatch[1]);
        });
      }
      return [...optimalMatch, ...semiMatch];
    } else if (optimalMatch.length > 0) {
      console.log(
        `Found ${optimalMatch.length} results which meet all of your requirements`
      );
      optimalMatch.forEach((car) => {
        console.log(car.optimalMatch[1]);
      });
      return optimalMatch;
    }
    console.log("There are no cars which currently meet your requirements");
    return [];
  },

  // if (filteredCars.length > 0 && isYearsInRange && isPriceInRange) {
  //   console.log(`${filteredCars.length} results meet your requirements`)
  // } else if (filteredCars.length > 0 && (isYearsInRange || isPriceInRange)) {
  //   console.log('Search was only partially successful');
  // } else {
  //   console.log('no cars meet your requirements currently')
  // }
  // },

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
  //   sellCar: function (marketObj, agencyId, customerId, carModel) {}

  // }
};
// ? ------- TESTS ------- //
console.log(
  // carMarket.getAgencyById('26_IPfHU1'),
  // carMarket.getCustomerById('BGHhjnE8'),
  // carMarket.getAgencyByName(agencies,"Best Dal")
  // carMarket.getAgencyIdByName(agencies,"Best Deal")
  // carMarket.getAllAgenciesName()

  // "CONSOOOOOoooLONG1",
  // ! carMarket.getAllCarsToBuy()
  // carMarket.getAllCarsToBuyByAgencyId("gNHjNFL12")
  // carMarket.getAllBrandsToBuyByAgencyId("gNHjNFL12")
  // carMarket.getCustomerByName("Phil")
  // carMarket.getCustomerIdByName("Phail")
  // carMarket.getAllCustomersNames()
  // carMarket.getAllCustomerCarsById("5x2tMcX4R")
  // carMarket.getCustomerCashById("BGzHhjnE8")
  // "CONSOOOOOoooLONG2",
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
  // carMarket.decrementOrIncrementCashOfAgency("Plyq5M5AZ", -20000)
  // carMarket.decrementOrIncrementCreditOfAgency("Plyq5M5AZ", -22000)
  // carMarket.setAmountOfCarsToBuyToAllAgency()
  // carMarket.setCarToCostumer("2RprZ1dbL", {
  //   name: "Hilux",
  //   year: 2005,
  //   price: 35005,
  //   carNumber: "MWXBG",
  //   ownerId: "Plyq5M5AZ",
  // })
  // carMarket.decrementOrIncrementCashOfCostumer("5x2tMcX4R", -50000)
  // carMarket.sortAndFilterByYearOfProduction(2000, 2005, true)
  // carMarket.sortAndFilterByPrice(20000, 200500, false)
  carMarket.sortAndFilterByPrice(20000, 200500, false)
  // carMarket.searchCar("bmw", 2015, 2020, 50000, 150000, false)
);

// ?? ---------------------- //
