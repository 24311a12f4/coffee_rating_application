# ☕ Coffee Rating Application

## 📌 Overview

The Coffee Rating Application is a full-stack web application that allows users to view a list of coffee items and vote for their favorites. Each vote updates the rating count in the database in real time through backend processing, demonstrating database operations, HTTP requests, and dynamic UI updates.

---

## 🚀 Features

- Display a list of coffee items
- Vote for your favorite coffee
- Real-time vote count updates
- Database integration
- Backend logic for handling votes
- Responsive and user-friendly interface

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap

### Backend
- Java
- Spring Boot
- Spring MVC
- Spring Data JPA

### Database
- MySQL

---

## 📂 Project Structure

```
Coffee-Rating-Application
│── src
│   ├── main
│   │   ├── java
│   │   ├── resources
│   │   │   ├── static
│   │   │   ├── templates
│   │   │   ├── application.properties
│── pom.xml
│── README.md
```

---

## ⚙️ Prerequisites

- Java 21 or later
- Maven
- MySQL
- IntelliJ IDEA / Eclipse
- Git

---

## ▶️ Running the Project

1. Clone the repository

```bash
git clone https://github.com/your-username/Coffee-Rating-Application.git
```

2. Navigate to the project folder

```bash
cd Coffee-Rating-Application
```

3. Configure MySQL in `application.properties`.

4. Build the project

```bash
mvn clean install
```

5. Run the application

```bash
mvn spring-boot:run
```

6. Open your browser

```
http://localhost:8080
```

---

## 📖 Usage

1. Open the application.
2. View the available coffee items.
3. Click the **Vote** button for your favorite coffee.
4. The vote count is updated instantly and stored in the database.

---

## 📸 Example

| Coffee | Votes |
|--------|------:|
| Espresso | 12 |
| Cappuccino | 18 |
| Latte | 25 |
| Mocha | 10 |

---

## 🎯 Future Enhancements

- User login and authentication
- Prevent multiple votes by the same user
- Coffee search and filtering
- Rating analytics and charts
- Admin dashboard
- Mobile-friendly interface

---

## 👨‍💻 Author

**Keerthi Chaithanya Rapolu**

---

## 📄 License

This project is developed for learning and internship purposes.
