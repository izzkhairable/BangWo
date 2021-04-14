Team: CS460 Team 6, Singapore Management University (SMU)
Members: Mohamed Izzat Khair, Joshua Tseng, Sebastin Goh, Sheffield Lok
Sponsor Organisation: Woodlands Health Campus (WHC)

#BangWo Volunteer Matching System (v1.0)

##Introduction
BangWo is the volunteer crowd-sourcing app for the elderly to find help in their daily activities. The name BangWo comes from the Chinese phrase that means “help me!”

This app is a proof-of-concept prototype built for the sponsoring organisation, WHC. This project falls under the SMU-X programme for the module CS460: Foundations of Cyber-Physical Systems. BangWo is a mobile-friendly, progressive web app built using HTML, CSS (Bootstrap), and Javascript.

Special thanks to our project mentor and facilitator,  Pius Lee, for guidance in this project!

##Key Features
* Account sign-up and login for elderly and volunteer users
* Creation of tasks by the elderly to request for help
* Real-time matching between elderly user and volunteer user via crowd-sourcing
* Map directions powered by Google Maps API
* Chat functionality between elderly and volunteer users
* An “Advice” section for volunteers to provide useful tips to other future volunteers
* Fun, descriptive stickers the elderly users can give to volunteers after the successful completion of a task
* “Help” sections for users throughout key areas of the app in case the user is unsure of how to proceed

##Dependencies
* Google Maps API Key: Used for location services. A new API Key will be needed to set up and inserted into the Javascript code to enable this functionality. Refer to: Google Maps API documentation.
* Bootstrap CSS: Used for styling of the app.
* Firebase Hosting: The app’s database and APIs were hosted on Firebase.

##Future Steps
Below is a list of features and steps for WHC to follow to ensure continuity and improvement of the BangWo app. We hope this list proves helpful for the future Programme Manager of this initiative for drafting technical requirements.
* Creation of Google Maps API key. This new key will need to be inserted into select pages of Javascript code that call on the Google Maps API.
* Deployment to a cloud hosting service such as Firebase, Azure, or AWS. URLs for API calls will need to be changed accordingly.
* Implementation of the following key aspects of the app, which were either out of scope or left out due to time constraints:
* Creation of tasks that can be scheduled ahead of time. Tasks currently can only be posted in real time.
* Creation of a privacy policy and user terms and conditions
* User moderation system to report bad actors and ensure user safety
* Admin interface and dashboard to monitor key metrics and perform master actions like user bans
* Translation for multiple languages (Malay, Mandarin Chinese, Tamil)
