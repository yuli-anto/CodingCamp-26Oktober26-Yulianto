# Requirements Document

## Introduction

The Expense & Budget Visualizer is a client-side web application built with HTML, CSS, and Vanilla JavaScript. It allows users to track personal expenses by recording transactions with a name, amount, and category. The app displays a running total balance, a scrollable transaction history with delete capability, and a pie chart that visualizes spending distribution by category. All data is persisted in the browser's Local Storage so it survives page refreshes without a backend server.

## Glossary

- **App**: The Expense & Budget Visualizer single-page web application.
- **Transaction**: A single expense entry consisting of an item name, a monetary amount, and a category.
- **Category**: One of three fixed classification labels — Food, Transport, or Fun — used to group transactions.
- **Transaction_List**: The scrollable UI component that renders all stored transactions.
- **Balance_Display**: The UI component at the top of the page that shows the sum of all transaction amounts.
- **Input_Form**: The HTML form through which the user enters a new transaction.
- **Validator**: The client-side logic that checks Input_Form field values before a transaction is saved.
- **Storage**: The browser Local Storage API used to persist transaction data client-side.
- **Chart**: The pie chart component (rendered via Chart.js) that visualises spending distribution by category.
- **Chart_Engine**: The Chart.js library instance responsible for rendering and updating the Chart.

## Requirements

### Requirement 1: Add a Transaction

**User Story:** As a user, I want to fill in a form with an item name, amount, and category so that I can record a new expense.

#### Acceptance Criteria

1. THE Input_Form SHALL contain a text field for item name with a maximum length of 100 characters, a numeric field for amount, and a dropdown selector with no option pre-selected by default and the options Food, Transport, and Fun.
2. WHEN the user submits the Input_Form with all fields filled and amount between 0.01 and 999,999,999.99 with up to 2 decimal places, THE App SHALL create a new Transaction and add it to Storage.
3. WHEN a Transaction is successfully saved, THE Input_Form SHALL reset all fields to their default empty/unselected state.
4. IF the user submits the Input_Form with any field empty, THEN THE Validator SHALL display an inline error message identifying which field is missing and SHALL prevent the Transaction from being saved.
5. IF the user submits the Input_Form with an amount that is zero, negative, greater than 999,999,999.99, or contains more than 2 decimal places, THEN THE Validator SHALL display an inline error message and SHALL prevent the Transaction from being saved.

### Requirement 2: Display Transaction List

**User Story:** As a user, I want to see a scrollable list of all my recorded expenses so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL render every Transaction stored in Storage in reverse chronological order, showing the item name, amount formatted as a currency value with two decimal places, and category for each entry.
2. IF the total rendered height of Transaction entries exceeds the visible height of the Transaction_List container, THEN THE Transaction_List SHALL become vertically scrollable.
3. WHEN a new Transaction is added to Storage, THE Transaction_List SHALL update to include the new entry within 1 second without requiring a page reload.
4. IF Storage contains no Transactions, THEN THE Transaction_List SHALL display a message indicating that no transactions have been recorded.

### Requirement 3: Delete a Transaction

**User Story:** As a user, I want to delete a transaction from the list so that I can correct mistakes or remove unwanted entries.

#### Acceptance Criteria

1. THE Transaction_List SHALL display a delete control for each Transaction entry.
2. WHEN the user activates the delete control for a Transaction, THE App SHALL prompt the user to confirm the deletion before proceeding.
3. WHEN the user confirms the deletion, THE App SHALL remove that Transaction from Storage.
4. WHEN a Transaction is removed from Storage, THE Transaction_List SHALL re-render to reflect the updated list without requiring a page reload.
5. IF the Transaction cannot be removed from Storage, THEN THE App SHALL display an error message indicating the deletion failed and retain the Transaction in the Transaction_List.
6. IF the Transaction_List contains no Transaction entries after a deletion, THEN THE Transaction_List SHALL display a message indicating no transactions exist.

### Requirement 4: Display Total Balance

**User Story:** As a user, I want to see my total spending displayed prominently so that I know how much I have spent overall.

#### Acceptance Criteria

1. THE Balance_Display SHALL show the net sum of all Transaction amounts currently in Storage, where each Transaction amount carries its sign (positive for income, negative for expense), formatted with a currency symbol prefix, a thousands separator, and exactly 2 decimal places (e.g., "$1,234.56").
2. WHEN a Transaction is added to Storage, THE Balance_Display SHALL update to reflect the new net total without requiring a page reload or additional user action.
3. WHEN a Transaction is removed from Storage, THE Balance_Display SHALL update to reflect the new net total without requiring a page reload or additional user action.
4. WHILE Storage contains no Transactions, THE Balance_Display SHALL show a total of zero formatted as "$0.00".
5. IF the net sum of all Transaction amounts is negative, THEN THE Balance_Display SHALL render the value with a leading minus sign (e.g., "-$50.00").

### Requirement 5: Visualize Spending by Category

**User Story:** As a user, I want to see a pie chart of my spending by category so that I can understand where my money is going.

#### Acceptance Criteria

1. THE Chart SHALL display one segment per Category that has at least one Transaction, where each segment's arc angle is proportional to that Category's share of the sum of all Transaction amounts.
2. WHEN a Transaction is added to Storage, THE Chart_Engine SHALL re-render the Chart within 1 second to reflect the updated category totals without requiring a page reload.
3. WHEN a Transaction is removed from Storage, THE Chart_Engine SHALL re-render the Chart within 1 second to reflect the updated category totals without requiring a page reload.
4. WHILE Storage contains no Transactions, THE Chart SHALL display a placeholder message indicating that no spending data is available to display.
5. THE Chart SHALL assign each Category a distinct colour such that no two simultaneously visible segments share the same colour, and the same Category is assigned the same colour for the lifetime of the current page session.

### Requirement 6: Persist Data Across Sessions

**User Story:** As a user, I want my transactions to be saved between page refreshes so that I do not lose my data when I close or reload the browser tab.

#### Acceptance Criteria

1. WHEN the App initialises, THE Storage SHALL load all previously saved Transactions and THE App SHALL render the Transaction_List, Balance_Display, and Chart based on the loaded data.
2. WHEN a Transaction is added or removed, THE App SHALL write the updated Transaction collection to Storage before updating the UI.
3. IF Storage is unavailable or returns a parse error on initialisation, THEN THE App SHALL initialise with an empty Transaction collection and display a warning message that remains visible while the user can still interact with all other UI elements.
4. IF a Storage write operation fails after a Transaction is added or removed, THEN THE App SHALL preserve the previously displayed Transaction collection in the UI and display an error message indicating that the change could not be saved.

### Requirement 7: Responsive and Accessible Layout

**User Story:** As a user, I want the app to be readable and usable on different screen sizes so that I can use it on both desktop and mobile devices.

#### Acceptance Criteria

1. THE App SHALL render such that no element's right edge exceeds the viewport width (scrollWidth equals clientWidth) at any viewport width between 320px and 1920px.
2. THE Input_Form, Transaction_List, Balance_Display, and Chart SHALL each expose an accessible name to screen readers via an `aria-label`, `aria-labelledby`, or a programmatically associated visible heading element.
3. WHEN keyboard focus moves to any interactive element in the App, THE App SHALL display a focus indicator with a contrast ratio of at least 3:1 between the indicator color and the adjacent background color.
4. THE App SHALL render every interactive element with a minimum tap target size of 44×44 CSS pixels on viewport widths of 320px to 1024px.
