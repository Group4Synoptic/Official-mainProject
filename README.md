# Version History 10/06/2025 [Caetan DS] 

## Bug fixes (Trading requests/trades not showing correctly now fixed), graph added to the water demands page, additionally the ability to select the reservoir you'd like water from has now been added

* Graph shows the levels of the different water sources as seen here: 
![image](https://github.com/user-attachments/assets/f2003755-5b30-46c8-bcd1-82063ba65f73)

* This shows the current water available and the water available after a user makes a request.
* The graph code (using Chart.js) works simply by pulling reservoir data via the database and using the new API route (/reservoirs) this data is then plotted with two bars:

          *Blue bar (Water available): Takes the value of water available from the database

          *Green bar (Water after requests): Takes the requested value and minuses it from the water available.
  
* Ability to select reservoir:

![image](https://github.com/user-attachments/assets/8e9e4636-089d-4189-b38b-662b107117e6)


        * This still needs to be styled
# Version History 09/06/2025 [Caetan DS]

## Added the ability to trade in water for electricity and vice versa

* *Database schema has been adjusted to include a new table - update your database*

* Styling still needs to be added to all of the wdTrading page but all functionality should now be there


# Version History 08/06/2025 [Caetan DS]

## Current Water Requests functionality added

* *Database schema has been adjusted to take some new values - whether the request has been completed and the userid - you should update your database.*

* On page ([wdTrading.html](public/wdTrading.html)) load the database is read through to check if there are any requests from the user (user id checked versus the requests with that user id), this data is then presented to the user. 

        NOTE:  Someone needs to add the ability to reach this page somehow.

* I tried my best to make it easy for people doing the CSS to be able to adjust it to however they want it to look, heres what the layout looks like:
  
![Screenshot 2025-06-08 at 23 07 23](https://github.com/user-attachments/assets/f8fd8c58-02b5-43c8-863a-8996498f9536)


* To make it simple: 
    * ul tag ```id="water-requests-list"```
    * A new li element is made for each request with ```class = "request-item"```
    * Inside each li element there is a class for each piece of data, ```litres = "litres", urgency = "urgency", completed = "completed"```
    * I did add white space so the text isn't bunched up but you can remove that in [water-request.js](public/js/water-request.js) with the lines ```"item.appendChild(document.createTextNode(' '));"``` (make sure you change the socket.io function at the bottom as well)
* [wdTrading.html](public/wdTrading.html) Currently has css inline styling which should be removed, I just used that to test the functionality of the code - line to be removed when working on CSS:
```style="border: 2px solid #000; width: 70%; margin: 0 auto;"```
# Version History 06/06/2025 [Caetan DS]

## Database Functionality Added (For the login system - will integrate the water demand later)

* To set up the database use the [schema.sql](schema.sql) file inside of your pgadmin **you may need to enable VPN if off campus** (should be able to drag it in but you may have to open query tool then paste it in)

* The required packages *should* install when you run the program but to be sure run ```npm install express pg express-session dotenv``` in your terminal in vscode (cmd/ctrl + shift + p type: "create new terminal")to install the new required packages

* Next up as we all have different database usernames and passwords I've set up a .environment you need to do the following:

* 1. Create a file ".env" in your root folder (mainProject) as shown here (gitignore is used later)
     ![Screenshot 2025-06-06 at 02 55 32](https://github.com/user-attachments/assets/bdf1551f-5d39-4dca-b844-89aa2cbdfdee)


* 2. Add the following to that file: 
    ```
    PGUSER=your_db_username
    PGHOST=cmpstudb-01.cmp.uea.ac.uk
    PGDATABASE=your_db_name
    PGPASSWORD=your_db_password
    PGPORT=5432
    ```
* 3. Add that file to gitignore:
    * In VScode: cmd/ctrl + shift + p type: "create new terminal" Enter
    * "code .gitignore"
    * in the file that pops up, ".gitignore", add ".env" to it - this means that we won't be sharing our personal passwords between each other but should all have a baseline level of access to simulate the website
          *we could make this more of a live database where all of us can access it but that's more work and probably not required for the end solution- let me know, I could try*

## Login System

* The login system is really basic as of right now as it took a while to get everything working, I've currently just added simple buttons on index.html with no styling. But to summarise: 
          *Registration: takes the users data (user + pass) and stores it in the database checking basic info such as the username not already existing.
          *Login: Checks the users entered data vs the database to check if there is a match
          *Sessions: Using [express-session](https://www.npmjs.com/package/express-session) to create a session inside the browser allowing the user to stay logged in     
    * *I'll leave the styling to someone else and focus on functionality*
    *  We may be able to make this more complex if there's reason to do so based on our previous modules.

* These buttons redirect to their related page e.g the login button redirects to [login.html](public/login.html) and the register button to [register.html](public/register.html) 
    * Again, these pages have *no styling* let me know if any of this needs to be changed functionality wise.

* Sessions are working as intended, users can leave the page and return to it and their details should be saved for a day
 
     * *this can be adjusted if you guys think that's not long enough/too long*

## Contacts page 

* Contacts page now has full json functionality, user's messages' are sent to the json file [contacts.json](public/json/contact.json)

## Additional Features/Fixes

* As a test harness I've added a piece of text saying "Welcome Guest"(No user logged in) or "Welcome [username]"(When logged in) this is located in [index.html](public/index.html) under the id "welcome-message" *in case anyone wants to style it or remove it* - I added it to test that sessions were working correctly

* Changed the structure of the directory so we now have css, js and json folders containing their respective files just to make everything a bit neater

* Missing hamburgers + js for hamburger functionality on certain pages added for mobile users

### Notes

* If anyone's struggling to do any of the previous setup just let me know 

* anyone working on the main code should add to this so we can all understand any changes made (just follow the general [structure](https://wordpress.com/support/markdown-quick-reference/) and make a new heading e.g "# Version History 06/06/2025 [CDS]")
