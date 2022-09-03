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
