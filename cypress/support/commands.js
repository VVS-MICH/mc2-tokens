Cypress.Commands.add("getAssetDetails", (assetName) => {
  cy.log("Asset Name:", assetName);

  // Function to format numbers: Only abbreviate to "K" for thousands
  const formatNumber = (number) => {
    if (number < 1) return "0"; // Display "0" for numbers smaller than 1

    const THOUSAND = 1000;

    if (number < THOUSAND) {
      return number.toFixed(2); // No abbreviation for numbers less than a thousand, 2 decimal places
    } else {
      return (Math.ceil((number / THOUSAND) * 100) / 100).toFixed(2) + "K";
    }
  };

  // converting the price strings to floats
  const parsePrice = (priceText) => {
    const cleanedText = priceText.replace(/[^0-9.]/g, ""); // remoiving non-numeric characters
    return parseFloat(cleanedText); // Converting to float
  };

  // converting the percentage strings to floats
  const parsePercentage = (percentageText) => {
    const cleanedText = percentageText.replace(/[^0-9.-]/g, ""); // Remove non-numeric characters except "-"
    return parseFloat(cleanedText); // Converting to float
  };

  // Visit the page
  cy.visit("https://mobula.io/home");

  // Locating the table and find the asset row
  cy.get("table.caption-bottom").within(() => {
    cy.contains("td", assetName)
      .should("be.visible")
      .parent()
      .then((parentRow) => {
        cy.log("Found asset row for:", assetName);

        // Extracting the price and percentage values from the correct cells
        const priceCellIndex = 2; // Adjusted index for the price column
        const percentageCellIndex = 3; // Adjusted index for the percentage column

        let price, percentage;

        cy.wrap(parentRow)
          .find("td")
          .eq(priceCellIndex)
          .invoke("text")
          .then((priceText) => {
            const priceFloat = parsePrice(priceText);
            price = formatNumber(priceFloat); // Formatting the price according to "K" for thousand rule
            cy.log("Formatted Price:", price);

            cy.wrap(parentRow)
              .find("td")
              .eq(percentageCellIndex)
              .invoke("text")
              .then((percentageText) => {
                percentage = parsePercentage(percentageText); // Cleaning and converting to float
                cy.log("Formatted Percentage:", percentage);

                // Reading existing fixture data to get what was saved
                cy.readFile("cypress/fixtures/asset.json").then((existingData) => {
                  const updatedData = { ...existingData };

                  // Update only the current asset without overwriting other assets
                  updatedData[assetName] = {
                    price,
                    percentage,
                  };

                  // Writing the updated data back to the fixture to keep the record for future use in the tests
                  cy.writeFile("cypress/fixtures/asset.json", updatedData, {
                    flag: "w",
                  });

                  cy.log(`Saved details for ${assetName} successfully.`);
                });
              });
          });
      });
  });
});