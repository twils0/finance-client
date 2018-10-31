# finance-client

### Demo

[Finance Client Demo](https://twils0.github.io/finance-client/demo)

The demo of this project has no backend. It makes no API calls, except to IEX for equity price and description information.

To login, please enter any email, password (more than 8 characters, at least one number, and at least one special character), and confirmation code (one or more characters). The demo will accept anything that conforms to the basic format it expects (i.e. 'test@test.com' would pass as an email; 'test.com' would not). Please click 'Continue' on the email verification form and either 'Yes' or 'No' on the device form.

Once logged in, you may:

- add any S&P 500 equity to your watchlist, by searching across ticker, name, sector/category, or exchange, in the search bar;
- click on an item in your watchlist to load more information about it;
- use the drag handle for each item to drag that item to a new position in your watchlist;
- click the unsubscribe button to remove the current item from your watchlist;
- visit the Account page, click the edit button, and edit account information;

### Project

This project works in conjunction with [finance-sls-lambda-node-db](https://github.com/twils0/finance-sls-lambda-node-db) and [finance-sls-lambda-node-stripe](https://github.com/twils0/finance-sls-lambda-node-stripe).

The overall project allows users to search for equities, by ticker, name, sector/category, or exchange, using PostgreSQL's full text search. Users can subscribe to view an equity's current price and description, provided by IEX, and to receive research emails, relevant to that equity, formatted and forwarded using AWS SES, SNS, and S3. The project includes custom login and sign up forms, using AWS Cogntio under the hood and including MFA and a custom email verification process that sends styled (template) emails with links, through a combination of AWS Lambda functions (Node), RDS, and SES. The sign up process uses a credit card input component from Stripe's React library and AWS Lambda functions (Node) to register the user as a customer with Stripe and to setup a recurring quarterly payment schedule, prorated for the first quarter.
