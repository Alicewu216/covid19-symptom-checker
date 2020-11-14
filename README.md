# project1
repository link: https://github.com/Alicewu216/covid19-symptom-checker
deployed application link: https://alicewu216.github.io/covid19-symptom-checker/

This website is a COVID-19 Symptom Checker. Three APIs are utilized as databases. User can enter informations including age and developed symptoms for analysis. The first EndlessMEdical API will take in user inputs and provide a diagnosis of the top ten potential diseases. The website will also automtically find user's IP address, country, state, city information using the second Ipdata API, which is then passed onto the third Qoronavirus API to provide local COVID-19 statistics including current location, total tested number, total positive number, and total death count.

- upon loading the website:
- user will see instructions below header
- user will enter an age and click save
- then, user will select symptoms that she/he has developed by clicking symptom buttons provided
* Note: user can unselect symptom by click on the same symptom button again
- user will click analyze after all symptoms are picked
- with few seconds of delay, diagnosis result of top ten possible diseases will show up on the right hand side in the form of percentage progress bar
* Note: top three possible diseases's bars will be shown in yellow; if COVID-19 is a possible diagnosis, it's bar will be shown in red
- user can also see local COVID-19 statistics including current location, total tested number, total positive number, and total death count on the bottom of the page
- user can always restart analyze by modifying input of age, unselecting and reselecting symptom button

## a screen recording of application is attached below
![COVID-19 Symptom Checker](./Assests/COVID-19-Checker.gif)

