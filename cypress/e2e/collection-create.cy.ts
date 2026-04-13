beforeEach(() => {
  cy.visit('/collections/create?parent='.concat(Cypress.env('DSPACE_TEST_COMMUNITY')));
  cy.loginViaForm(Cypress.env('DSPACE_TEST_ADMIN_USER'), Cypress.env('DSPACE_TEST_ADMIN_PASSWORD'));
});

it('should show loading component while saving', () => {
  const title = 'Test Collection Title';
  cy.get('#title').type(title);

  // Intercept the POST to slow the response, ensuring ds-loading is visible
  cy.intercept('POST', '/server/api/core/collections', (req) => {
    req.on('response', (res) => {
      res.setDelay(1000);
    });
  }).as('createCollection');

  cy.get('button[type="submit"]').click();

  cy.get('ds-loading').should('be.visible');
});
