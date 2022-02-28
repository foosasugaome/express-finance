# Express Finance
This is my 2nd project for SEI bootcamp at General Assembly

## About the application
Web application for portfolio, tracking stocks, markets, and financial news. Real-Time stock, currencies and crypto information using Finnhub Stock API. The free API allows for access to several features like company news, basic financials, company earnings, crypto exchanges and symbols etc. Visit http://finnhub.io for more information.

## Features
*  Users can login and create a portfolio containing a list of stocks they own and view a snapshot of how their portfolio is  perfmorming.
*  Users can create a watchlist of stocks they are interested in.
*  User can read financial news about the company.

## Setting up the project
The application uses the following technologies/frameworks :
* axios
* node/express/ejs/express-ejs-layouts
* postgresql

Additional node packages are also needed :
* finnhub.js
* sequelize
* dotenv

Run `npm install` to install all dependencies

A free API key must be obtained from finnhub.io. This API key will be stored in the .env file. 

## ERD
![an imbedded draw.io png ERD](./express_finance.drawio.png)

Table definitions :
##### user
| field name   | data type   | description   |
|---|---|---|
| id | serial_primary_key | primary key  |
| username | varchar(255)   | user generated user name. unique   |
| firstname | varchar(25)  | user first name   |
| lastname | varchar(25)   | user last name   |
| email| varchar(50)   | email address   |
| password | varchar(255) | user password   |
| status | varchar(1) | user status. active or disabled |

##### portfolio
| field name   | data type   | description   |
|---|---|---|
| id | serial_primary_key | primary key  |
| userId | foreign_key | linked to user table pk |
| portfolioname | varchar(50) | portfolio name |
|dateadded | date | creation date of portfolio |

##### portfoliocontent
| field name   | data type   | description   |
|---|---|---|
| id | serial_primary_key | primary key  |
| portfolioId | foreign_key | linked to portfolio table pk |
| stockname | varchar(255) | stock name |
| symbol | varchar(10) | stock symbol |
| stockcount | integer(8) | number of this stock in the portfolio |
| dateadded | date | date added to portfolio |

##### usertransactions
| field name   | data type   | description   |
|---|---|---|
| id | serial_primary_key | primary key  |
| userId | foreign_key | linked to user table pk |
| portofliocontentId | foreign_key | linked to portfoliocontentId table pk |
| transdate | date | transaction date |
| symbol | varchar(10) | stock symbol |
| transtype | varchar(1) | transaction type. buy or sell |
| stockcount | integer (8) | number of stocks bought or sold in the transaction |
| price | double | purchase price of stock |

##### watchlist
| field name   | data type   | description   |
|---|---|---|
| id | serial_primary_key | primary key  |
| userId | foreign_key | linked to user table pk |
| stockname | varchar(255) | stock name |
| symbol | varchar(10) |  stock symbol |
| dateadded |  date | date stock added to watchlist |

## Application structure

#### Home page
* Displays financial news
* If user has not logged in, a `Login` and `Register` button/link will be displayed.
* If user is logged in, a `Logout` button/link will be displayed.

### Login page
* A `username` and `password` fields, and a submit button will be displayed. 
* A successful login will take them to their dashboard.

### Register page
* If the user has no account, they will be asked to register one.
* The following information will be required to create an account :
        1. Username (this will be used as for logins)
        2. First Name 
        3. Last Name
        4. Email address
        5. Password
* Once an account is successfuly created, they will be redirected to their dashboard.

### Dashboard
* The dashboard displays the user's account information, list of porfolios and watchlist.

### Portfolios page
* Displays the stocks in the portfolio.
* Shows information about how the stocks are performing.

### Watchlist page
* Displays the stocks in the user's watchlist.
* Shows information about how the stocks are performing.

### Search stocks
* This is tied to the search bar in the navigation. Any searches done will be displayed here.
* Buttons to add to `Portfolio`  or `Watchlist` will diplayed  besided the results.
* Links to each stocks information will be available here.

### Company profile
* This will display the company's financial information as well as stock prices. 

### Other page elements

##### Header
* Contains website logo
* Search bar for stock prices

##### Navigation bar
* Menu for navigating the website. 
* Menu might inlcude links to the Home page, News page, Portfolio page, Dashboard, Login/Register, and Logout.
* Localized current date and time


## Wireframe

![Home page](./wireframe_home.drawio.png)
> Home Page

![Login page](./wireframe_login.drawio.png)
> Login page

![Registration page](./wireframe_register.drawio.png)
> Registration Page 

![Stock search](./wireframe_search.drawio.png)
> Search results

![portfolio](./wireframe_portfolio.drawio.png)
> Portfolio page

![Watchlist page](./wireframe_watchlist.drawio.png)
> Watchhlist

![company profile page](./wireframe_companyprofile.drawio.png)
> Company Profile

![Dashboard](./wireframe_dashboard.drawio.png)
> User's dashboard

## MVP
1. Creation of registration and login page. All data will be store in PostgresSql.
2. Search and save stocks to portfolio and/or watchlist.
3. Display stock prices.
4. Show performance of stocks in the portfolio.

## Stretch goals
1. Show real-time stock prices in company profile page.
2. Add a crypto portfolio.




