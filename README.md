Website: coffee.leoding.com

# Context

It is a well-known, among my friends, fact that I frequent the same coffee shop to do my work. 
Occasionally, they'll want to pop by to also do work or simply just to say "hi".
Before they head off towards the coffee shop, they'll send me a text to make sure that I am actually there, to which I'll respond with a simple "yes" or "no".
There exists a flaw in this system: I miss the text.
This causes either my friends to not come by assuming that I'm not there or worse they do show up, and I'm actually not there.
Thus, I decided to create this project so that my friends could check if I'm at the coffee shop or not without the need for texting.

# Goal

As one might've seen, this is the second version of this project idea. 
The first version focused on simply being able to create a web application and to practice Docker and Golang which, at the time, I had just learned.
For this second version, I had recently learned React and thus wanted to recreate the website using the new skill.

# Technologies

***Docker*** containerizes different portions of the project (frontend, backend, networking).

***React*** creates the interactive visual components.
***Axios*** sends HTTP requests and properly handles the responses.
***CSS*** alters the React components in order to look better.

***Golang*** handles HTTP requests, manages the database, and deals with session authentication and user authentication.

***PostgreSQL*** is the database of choice to store admin credentials, status values, and session values.

***AWS*** hosts the project. Elastic Beanstalk and Relational Database Service are the main services being used.

***Github Workflows/Actions*** automatically deploys to AWS.

# Project Pages

### Status Page

This is the primary page that everyone will see. 
It simply displays the current status on the screen along with specified color indicators.

### Admin Page

The admin page requires one to login before being able to change any values. 
After logging in, a panel will be displayed allowing the admin to change what the current status is.
Once the status change is submitted by the admin, the status will be reflected on the main page.