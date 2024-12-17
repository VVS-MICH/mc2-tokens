describe("XRP page spec", () => {
    it("clicking on XRP token directs the user to the correct token page publicly", () => {
    const tokenShort = "XRP"; // defining the token abbreviation variable
    const tokenName = "XRP"; // defining the token name variable

    // Getting asset details for the token from mobula and saving them on the fixture file
    cy.getAssetDetails(tokenName);

    // Visiting the tokens page
    cy.visit("/tokens");

    // since the following actions are not on the same url, we wrap them in cy.origin
    cy.origin(
      "https://app.mc2.fi",
      { args: { tokenShort, tokenName } },
      ({ tokenShort, tokenName }) => {
        // Searching for and clicking the token using the abbreviated name
        cy.get('[placeholder="Search for tokens"]')
          .type(tokenShort, { force: true })
          .should("have.value", tokenShort);

        // Ensuring the card holder is visible
        cy.get(".card-holder").should("be.visible");

        // Finding and clicking on the card for the preferred token
        cy.get(".card-holder")
          .find(".text-main")
          .contains(tokenName)
          .should("have.text", tokenName)
          .click({ force: true });

        cy.url().should("include", `tokens/${tokenShort}`); // Asserting that the URL matches the expected token URL
        cy.wait(2000)
        cy.get(".time-holder").should("exist"); // Asserting that the chart is visible on the token page

        // Loading the fixture data
        cy.fixture("asset.json").then((fixtureData) => {
          // Log the fixture data to debug
          cy.log(JSON.stringify(fixtureData));

          // Check if the tokenName exists in the fixture data
         // expect(fixtureData).to.have.property(tokenName).and.to.be.an('object');

          // Extracting the price and percentage from the displayed asset data
          cy.get(".card-holder")
            .find(".text-main")
            .eq(1)
            .children(0)
            .invoke("text")
            .then((priceText) => {
              const price = parseFloat(priceText.replace(/[^0-9.-]+/g, "")); // Cleaning and parsing the price to just the number (raw price)

              // Asserting that the price is within 5% of the raw price from the fixture
              const tolerance = 0.05 * parseFloat(fixtureData[tokenName].price);
              expect(price).to.be.within(
                parseFloat(fixtureData[tokenName].price) - tolerance,
                parseFloat(fixtureData[tokenName].price) + tolerance,
                `Token price should be within 5% tolerance`
              );
            });

          cy.get(".card-holder")
            .find(".text-main")
            .eq(1)
            .children()
            .children()
            .eq(1)
            .invoke("text")
            .then((percentageText) => {
              // Ensuring percentageText is a string before using replace
              const percentage = parseFloat(
                percentageText.replace(/[^0-9.-]+/g, "")
              ); // Clean and parse the percentage to just the number (raw percentage)

              // Asserting that the percentage is within 5% of the raw percentage from the fixture
              const percentageTolerance =
                0.05 * parseFloat(fixtureData[tokenName].percentage);
              expect(percentage).to.be.within(
                parseFloat(fixtureData[tokenName].percentage) -
                  percentageTolerance,
                parseFloat(fixtureData[tokenName].percentage) +
                  percentageTolerance,
                `Token percentage should be within 5% tolerance`
              );
            });
        });
      }
    );
  });
}); 