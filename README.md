# SpotEase 🚘

SpotEase is a mobile app built with React Native and Expo CLI to tackle parking challenges in Singapore’s dense urban environment. With limited spaces and fluctuating costs, finding parking can be frustrating and time-consuming.

SpotEase uses real-time data on parking availability to reduce search time and optimize navigation. Designed for commuters, ride-hailing drivers, and tourists, the app enhances convenience and improves the overall driving experience in high-demand areas.


Backend Github Link: [Link](https://github.com/JanuaryCJ/SC2006-backend-spotease-render.git)

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Tech Stack](#tech-stack)
3. [Develop](#develop)
4. [Contributors](#contributors)

<a id='folder-structure'></a>
## Folder Structure

```terminal
.
├── App_Development       # Contains the main application code
├── Final_Documentation   # SRS, Use Case Document, Diagrams, and Demo Script
├── Lab 1                 # Lab 1 Submission
├── Lab 2                 # Lab 2 Submission
├── Lab 3                 # Lab 3 Submission
└── README.md
```
The SRS appendix includes:

- Use Case Diagram and Descriptions

- Class Diagram / Key boundary and control classes

- State Machine Diagram / Dialog Map

- System Architecture Diagram

- Sequence Diagrams

- Unit Testing details
  
<a id='tech-stack'></a>

## 💻 Tech Stack

We built **SpotEase** with a powerful set of technologies:

### 🧱 Frontend
- **React Native & Expo CLI**  
  Handles UI, navigation, real-time updates, and location features

### 🗃️ Backend
- **MongoDB**  
  Stores user profiles, parking preferences, and search history

### 🌐 External APIs
- **OneMap API** – Geolocation and mapping services  
- **NEA 2-Hour Weather Forecast API** – Weather-based parking suggestions  
- **Car Park Availability API (data.gov.sg)** – Real-time car park availability (available lots, total lots, timestamp)

<a id='develop'></a>

## Develop

> To further develop this project, clone this repo and make sure you have the following prerequisites.

- [Node](https://nodejs.org/en/download/)
- [Expo Go](https://expo.dev/client) on your preferred device

> From your command line go to the folder directory and run the following scripts in the terminal.

1\. Clone the repo

```terminal
git clone https://github.com/spotease/SC2006-Software-Engineering-.git
```

2\. Go to project directory

```terminal
cd App_Development/spotease
```

3\. Install dependencies

```terminal
npm install
```

4\. Start the expo

```terminal
npx expo start
```

<a id='contributors'></a>

## Contributors

| Name           | Username       | Role           |
|----------------|----------------|----------------|
| Glynis Looi Xin Lin | [@glynislxl](https://github.com/glynislxl) | Front-End Developer |
| Lee Yun Jia | [@yunjialeee](https://github.com/yunjialeee) | Front-End Developer |
| Jan Chen Jie | [@JanuaryCJ](https://github.com/JanuaryCJ) | Back-End Developer |
| Lee Lin Yang Glenn | [@Ariesura](https://github.com/Ariesura) | Back-End Developer |
| Manasi Singh | [@manameme](https://github.com/manameme) | Back-End Developer |
| Kathri Arachchige Don Mayukhi Nimesha Siriwardana | [@mayukhii](https://github.com/mayukhii) | Front-End Developer |
