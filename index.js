/**
 * Author: Neelesh Rambally
 * Date : 22/1/2018
 */
const express = require('express');
const bodyParser = require('body-parser');
var requestPost = require('request');
var multer = require('multer');
var upload = multer();
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

/**
 * This function uses the "request" module to make a POST request to the google recaptcha service
 * the response from the service contains the validation result of the user. Based on this the method
 * will return a true or false result.
 * */
function checkRecaptcha(request) {
  console.log(request.body.key);
  if (request.body.key === undefined || request.body.key === ''
      || request.body.key === null) {
    console.log("No Captcha Selected");
    return false;
  } else {
    try {
      var secretKey = "**************";/*Your secrete key goes here*/
      var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret="
          + secretKey + "&response=" + request.body.key + "&remoteip="
          + request.connection.remoteAddress;
      requestPost(verificationUrl, function (error, response, body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
          console.log("Not Verfied");
          return false;
        } else {
          console.log("Verification Successful")
          return true;
        }
      });
    } catch (err) {
      console.log('Captcha Error: ' + err);
    }
  }
}


app.post('/reCAPTCHA-Check', upload.array(),
    function (request, response, next) {
  /*check the captcha result*/
      if (checkRecaptcha(request) === false) {
        response.writeHead(202, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({"Result": "Verification Failure"}));
      } else {
        console.log(request.body.key);
        console.log(request.body.email);
        console.log(request.body.password);
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({"Result": "Verification Success"}));
      }
    });

app.listen(2080, () => {
  console.log('Server running on http://127.0.0.1:2080');
});