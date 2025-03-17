# GameBlocker Prank Service 

## Background

I created this service as a fun prank because my younger brother was spending too much time playing games on his laptop. Instead of constantly telling him to take a break, I thought it would be fun to make his games mysteriously shut down. This service allows you to remotely close specific games or applications running on a Windows machine, making it seem like an unexpected system issue. Of course, this is meant to be a harmless prank and should be used responsibly!

## Overview

The **GameBlocker Prank Service** is a Node.js application that runs as a Windows service and provides an API to:

- List all running processes.
- Terminate specified processes (e.g., games like Valorant, Minecraft) remotely via an API.
- Authenticate requests using Basic Authentication to prevent unauthorized access.

## Features

- Runs as a Windows service using `node-windows`.
- Provides a REST API with authentication.
- Allows remote process termination to prank users.

## How to Use

1. **Install the service** on your target Windows machine (e.g., your sibling's laptop).
2. **Ensure the API is accessible** by checking firewall settings (see the Firewall Configuration section below).
3. **Find the target machine's IP address or hostname** to use in API requests (see Finding the Target Machine section).
4. **Access the API from your phone or another computer** over the same Wi-Fi network.
5. **Use the API to check running processes** and identify the game you want to close.
6. **Trigger the shutdown API** to remotely close the selected game.
7. **Enjoy the confusion!** 🤣

## Installation

### Prerequisites

- Node.js installed on your system.
- Administrator privileges to install and run services.

### Install Dependencies

```sh
npm install express node-windows
```

### Set Up Environment Variables

Create a `.env` file in the same directory (optional, but recommended):

```
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=test
```

### Install as a Windows Service

Run the following command:

```sh
node server.js --install
```

This will install and start the GameBlocker Prank Service.

## Firewall Configuration

To allow access to the API from another device on the same network, you need to check your firewall settings:

1. Open **Windows Defender Firewall**.
2. Click on **Advanced Settings**.
3. Go to **Inbound Rules** and click **New Rule**.
4. Select **Port**, then click **Next**.
5. Choose **TCP** and enter **3000** (or the port your service runs on), then click **Next**.
6. Select **Allow the connection**, then click **Next**.
7. Ensure the rule applies to **Private and Public networks**, then click **Next**.
8. Give the rule a name (e.g., "GameBlocker API") and click **Finish**.

## Finding the Target Machine's IP or Hostname

To make API requests, you need to know the IP address or hostname of the machine running the service.

### Find the IP Address

1. Open **Command Prompt** on the target machine.
2. Run the following command:

   ```sh
   ipconfig
   ```

3. Look for the **IPv4 Address** under the active network connection (e.g., `192.168.1.100`).

### Find the Hostname

1. Open **Command Prompt**.
2. Run the following command:

   ```sh
   hostname
   ```

3. This will return the computer's hostname (e.g., `MyBrothersPC`).

Now you can use `http://192.168.1.100:3000` or `http://MyBrothersPC:3000` to access the API from another device.

## API Endpoints

### 1. Get Running Processes

#### Endpoint:

```
GET /processes
```

#### Headers:

```json
Authorization: Basic <base64-encoded username:password>
```

#### Response:

Returns a list of all running processes.

### 2. Shut Down Specified Processes

#### Endpoint:

```
POST /shutdown
```

#### Headers:

```json
Authorization: Basic <base64-encoded username:password>
Content-Type: application/json
```

#### Request Body:

```json
{
  "processes": ["valorant.exe", "minecraft.exe"]
}
```

#### Response:

```json
"Closed specified processes: SUCCESS_MESSAGE"
```

## Authentication

The API is secured using Basic Authentication. You need to pass the correct username and password in the `Authorization` header. Default credentials:

- **Username**: `admin`
- **Password**: `test`

## Running the Server Without Installing as a Service

You can also run the server manually without installing it as a Windows service:

```sh
node server.js
```

## Uninstalling the Service

To uninstall the Windows service, run:

```sh
node server.js --uninstall
```

This will stop and remove the service from Windows.

## Notes

- The service needs administrator privileges to terminate processes.
- Make sure to adjust the authentication credentials in production for security.
- This should be used as a harmless prank and not for malicious intent.
- Be ready to take the blame when your sibling gets suspicious! 😆

## Future Enhancements

- Provide a UI to manage processes more easily.

## License

This project is free to use and modify as needed.

## Author

Chaitanya Nirfarake

