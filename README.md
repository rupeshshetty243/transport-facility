# 🚗 Transport Facility Manager

A web application designed to help employees schedule, offer, and book rides with colleagues. Built as a technical assignment to demonstrate clean architecture, reactive state management, and pure CSS styling.

## 📋 Assignment Overview

* [cite_start]**Goal:** Build a facility for employees to share rides (pick-up/drop-off)[cite: 19].
* [cite_start]**Constraint:** No CSS frameworks allowed (Pure CSS only).
* [cite_start]**Framework:** Angular 20[cite: 42].

## 🌟 Key Features

### 1. Offer a Ride
* [cite_start]Employees can publish a ride with details: **Vehicle Type, Vehicle No, Vacant Seats, Time, Source, and Destination**[cite: 26].
* **Validation:**
    * Validates realistic seat counts (e.g., Bike = 1 seat).
    * Prevents invalid inputs (e.g., past times).

### 2. Find & Book a Ride
* [cite_start]**Smart Time Matching:** Displays rides only within a **+/- 60 minute buffer** of the user's requested time[cite: 24].
* [cite_start]**Filters:** Users can filter available rides by **Vehicle Type** (Car/Bike)[cite: 25].
* **Booking Logic:**
    * [cite_start]Prevents users from booking their own rides[cite: 36].
    * [cite_start]Prevents duplicate bookings by the same user[cite: 37].
    * [cite_start]**Real-time Updates:** Automatically decreases the "Vacant Seats" count upon successful booking[cite: 35].

## 🛠️ Tech Stack

* **Framework:** Angular 20 (Standalone Components)
* **State Management:** Angular Signals
* **Styling:** Native CSS3 (Flexbox, CSS Variables, Responsive Design) - *No Libraries used*
* **Forms:** Reactive Forms with Custom Validators

## 🚀 Live Demo

[**Click here to view the Live Application**](https://rupeshshetty243.github.io/transport-facility/)

*(Note: Replace the link above with your actual GitHub Pages URL after deployment)*

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/rupeshshetty243/transport-facility.git](https://github.com/rupeshshetty243/transport-facility.git)
    cd transport-facility
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/`.

4.  **Run Unit Tests**
    ```bash
    ng test
    ```

## 📦 Deployment

This project includes a dedicated script for GitHub Pages deployment.

```bash
npm run deploy
