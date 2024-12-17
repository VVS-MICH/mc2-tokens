describe("Tokens page spec", () => {
  it("user is able to access the token list publicly", () => {
    // Asserting that the user is on the token page by page URL and content/search result area title
    cy.visit("/tokens");
    cy.url().should("contain", "tokens");
    cy.get(".ais-InstantSearch")
      .find(".text-main")
      .first()
      .should("have.text", "Tokens");
  });
});
