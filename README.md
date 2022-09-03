# Node.js File System Exercise

![Node File System Exercise](/NodeFileSystemExercise.png?raw=true "Employee Data title")

## Getting Started

1. Open your command line and navigate to your repos directory (if you do not have a repos folder, then you can use mkdir repos to create one)
2. Use this template repository to start a new project in your repos folder: git clone <repo_name>
3. cd repo_name to navigate into your new repo directory
4. Start Visual Studio Code and select 'Open Folder'. Then select repo_name to open the folder in the editor (or just type code . in your terminal inside the repo directory)
5. Follow the instructions on the README.md file to complete exercises

## Exercise

### Steps

- Create a new project folder called node_fs
- Inside of node_fs, create the 4 following js files:
  - createFile.js
  - readFile.js
  - updateFile.js
  - deleteFile.js
- Inside of createFile.js:
- Require the fs module
- Implement the fs.writeFile() function, creating a txt file called HelloWorld.txt, with Hello, World! inside
- Use the async version
- Run node createFile.js to create the file
- Inside of readFile.js:
  - Require the fs module
  - Implement the fs.readFile()
  - You can either read the contents of the HelloWorld.txt file, or any other file you create in your project
  - Run node readFile.js to read the file to the console
- Inside of updateFile.js
  - Require the fs module
  - Using the appendFile() function, append some text to the end of your HelloWorld.txt
  - Run node update.js
- Inside of deleteFile.js
  - Require the fs module
  - Implement the fs.unlink()
  - Run node deleteFile.js

### BONUS

#### Part 1:

- Using both the http and fs module, create a server that sends an html page back to the client upon request. You must have at minimum two html pages with corresponding routes, and a 404 not found page.

#### Part 2:

- Create a custom logger for accounting for requests to your server. Each time a request event is emitted by your server, send the appropriate html file back, but also log the following information to a file: Request method, url, response status code, and timestamp
- The timestamp can be any format you like, but it a least should show the time of day that the request was made

### Additional Features
  This exercise demonstrates the use of ```Node.js``` ```fs```
module using asynchronuos calls to:

  * ```fs.readDirs()```
  * ```fs.readFile()```
  * ```fs.writeFile()```
  * ```fs.appendFile()```
  * ```fs.unlink()```

The response screens are presented after the promise is fulfilled.

The index screen displays all of the file names in the "scratchPad"
directory. The user can then enter a file name and select the
appropriate option from the drop down list
  * READ
  * ADD
  * UPDATE
  * APPEND
  * DELETE
            
A response screen is presented
for each type of operation except DELETE. Once the appropriate file operation has completed the user will be redirected back to the index page.

Webpack is being used to make a distributable. To build the project run the following:

- `npm install`
- `npm run build:dev`
- `npm start`

If running the ditributable directly run the following:

- `npm install`
- unzip the dist.zip file in the dist directory using the following:
  - `unzip -d NEW-DIRECTORY`
  - Navigate to the new directory and run:
    - `npm install`
    - Once complete run (to start server):
      - `node main.js` 




### Objective

- Create a server that responds to requests
- The server should have at least ‘/echo’, ‘/’, and ‘/about’ endpoints
- The server will account for ‘not found’ endpoints
- The ‘/echo’ endpoint will use the ReadStream response object to read the request body, and return the request body as the response body to the client
- The ‘/’ endpoint will respond as you wish
- The ‘/about’ endpoint will return a JSON response with information about yourself

### Steps

- Start in your `app.js` file
- Import the http module
- Using the http module, call the createServer
- Pass in a request handler callback function to the createServer method that receives request and response objects as parameters
- Add an event listener to the request object that listens for the ‘data’ event to be emitted from the ReadStream
- Store the chunks in an array
- Add an event listener to the request object that listens for the ‘end’ event to be emitted from the ReadStream
- Set a new variable ‘body’ equal to Buffer.concat(array).toString()
- Write a conditional statement that assesses the request url, and responds appropriately:
  - ‘/’ - Wildcard. Respond with whatever information you wish
  - ‘/about’ - Respond with an object that has information about yourself
  - ‘/echo’ - Respond with an object that, a minimum, includes the request method, url and body.
- Make sure to end your response with .end()
- Set your server to listen on port 3000
- Initiate the file using the node.js CLI

