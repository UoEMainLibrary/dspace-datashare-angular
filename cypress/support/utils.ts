import { Result, RunOptions, Spec } from 'axe-core';
import { Options } from 'cypress-axe';

// Log violations to terminal/commandline in a table format.
// Uses 'log' and 'table' tasks defined in ../plugins/index.ts
// Borrowed from https://github.com/component-driven/cypress-axe#in-your-spec-file
function terminalLog(violations: Result[]) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${violations.length === 1 ? 'was' : 'were'} detected`,
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, helpUrl, nodes }) => ({
      id,
      impact,
      description,
      helpUrl,
      nodes: nodes.length,
      html: nodes.map(node => node.html),
    }),
  );

  // Print violations as an array, since 'node.html' above often breaks table alignment
  cy.task('log', violationData);
  // Optionally, uncomment to print as a table
  // cy.task('table', violationData);

}

// Custom "testA11y()" method which checks accessibility using cypress-axe
// while also ensuring any violations are logged to the terminal (see terminalLog above)
// This method MUST be called after cy.visit(), as cy.injectAxe() must be called after page load
export const testA11y = (context?: any, options?: Options) => {
  cy.injectAxe();
  cy.configureAxe({
    rules: [
      // Disable color contrast checks as they are inaccurate / result in a lot of false positives
      // See also open issues in axe-core: https://github.com/dequelabs/axe-core/labels/color%20contrast
      { id: 'color-contrast', enabled: false },
    ],
  });

  // Run axe manually to capture & write violations BEFORE asserting
  cy.window({ log: false }).then((win) => {
    // Merge global rule config with test-specific options
    const mergedRules: Record<string, any> = { 'color-contrast': { enabled: false } };
    if (options && (options as any).rules) {
      Object.entries((options as any).rules).forEach(([ruleId, ruleOpts]: [string, any]) => {
        mergedRules[ruleId] = ruleOpts;
      });
    }
    const axeRunOptions: any = {
      rules: mergedRules,
    };

    return new Cypress.Promise((resolve) => {
      (win as any).axe.run(context || win.document, axeRunOptions, (err: any, results: any) => {
        resolve({ err, results });
      });
    });
  }).then((outcome: any) => {
    const { results } = outcome;
    if (results && results.violations && results.violations.length > 0) {
      // Write violations to file BEFORE the test fails
      const specName = Cypress.spec.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `cypress/results/a11y-violations-${specName}.json`;
      const violationData = results.violations.map(
        (v: any) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
          html: v.nodes.map((n: any) => n.html),
        }),
      );
      cy.writeFile(fileName, JSON.stringify(violationData, null, 2));
      cy.task('log', `A11Y VIOLATIONS FOUND: ${JSON.stringify(violationData)}`);
    }
  });

  // Now run the actual checkA11y which will assert & fail if violations exist
  cy.checkA11y(context, options, terminalLog);
};
