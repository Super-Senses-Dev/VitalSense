# Vital Sense
![Vital Sense: Caring for little souls](https://supersenses.tn/vital-sense-demo/images/logo.png)
## Project Overview
This project is a demo to showcase the [Super Senses](https://supersenses.tn) solution "Vital Sense".

Vital Sense is a health-focused platform that allows parents to monitor their child's body temperature over time. Using advanced AI techniques, the app processes uploaded pictures of temperature measurements and extracts the values to generate a graphical report. This report can be shared with health professionals for better medical assessment.

## Features
- ✨ Image-Based Temperature Extraction: Parents can upload images of temperature measurements, and the system will automatically extract the temperature data.
- 📈 Graph Generation: The extracted temperature data is displayed in a clear graph that can be downloaded and shared with health professionals.
- 🔒 Data Privacy: All data and images are stored exclusively in the browser’s local storage. Pictures are sent to the server solely for processing and are not retained.
- 🌐 Bilingual Interface: The application supports both English and French.

## Demo
Check out the live demo [here](https://supersenses.tn/vital-sense-demo).

## Technology Stack
- Frontend: Angular 18.
- Backend: Node.js + Express.js.

## How to Run the Project

### Prerequisites
- Make sure you have Node installed on your system.
- To run this demo, you need an OpenAI API key.

Clone the repository:
```sh
git clone https://github.com/Super-Senses-Dev/VitalSense.git
```
Navigate to the project directory:
```sh
cd VitalSense
```

### Backend
1. Navigate to the backend directory:
    ```sh
    cd back
    ```
2. Install the required packages:
    ```sh
    npm install
    ```
3. Create a `.env` file under the back directory.

4. Copy the content of `.sample_env` to `.env` file

5. Make sure to affect the value of `OPENAI_TOKEN` in `.env` file by your own key.

6. Run the backend:
    ```sh
    node index
    ```

### Frontend
1. Navigate to the frontend directory
    ```sh
    cd front
    ```

2. Install the required packages:
    ```sh
    npm install
    ```

3. Run the Angular app:
    ```sh
    npm start
    ```

4. Open `http://localhost:4200/` in your browser

## License
This project is licensed under the MIT License.

## Contact
For any questions or feedback, please contact technique@supersenses.tn.
