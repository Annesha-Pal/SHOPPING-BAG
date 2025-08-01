# SHOPPING-BAG
This is a full-stack E-Commerce web application built using Angular 17 with PrimeNG and PrimeIcons for the frontend, and Spring Boot (Java) for the backend REST API.
The platform supports user authentication, product browsing, order management, and an admin interface for managing users and inventory.
🚀 Tech Stack
Frontend
Angular 17
PrimeNG
PrimeIcons
RxJS, TypeScript
Responsive design (SCSS)

Backend
Spring Boot (Java)
Spring Web, Spring Data JPA
REST API
MySQL 

Route	Description
/login	Login page
/register	Registration page
/home	Home page
/product/:id	Product details page
/profile	View/edit loggedin user profile
/orders	View past orders
/admin	Admin dashboard

SHOPPING_BAG/
├── Angular_ShopBag/                # Angular 17 app with PrimeNG
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # login, register, home, etc.
│   │   │   │── models/ 
│   │   │   ├── services/
│   │   │   ├── models/   
│   │   │   ├── guards/ 
│   │   │   ├── pipes/
│   │   │   ├── shared/
│   │   │   ├── layout/          #header, footer
│   │   │   └── app.module.ts
├── shop-service/                 # Spring Boot Java app
│   ├── src/main/java/
│   │   └── com/example/
│   │       ├── controller/
│   │       ├── model/
│   │       ├── service/            
│   │       └── dto/
│   │       └── repository/
│   └── application.properties
└── README.md

