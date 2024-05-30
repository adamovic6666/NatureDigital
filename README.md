# NATURE DIGITAL

## Drupal

### Get image endpoint

```
/getImage/{image_style}/{fileId}?responseType=file
```

Type: GET

Headers: none

Params:

- image_style - image style name (for example **mobile_medium**) or if you want
to get the original image use **original**
- fileId - image file ID

Query params:
- responseType - **file** or **object** depending on what you want to get. File
is used by default so you can omit this query param if you want a file.

Body: none

Return type: file | object

### User login endpoint

```
/userLogin?_format=json
```

Type: GET

Headers:

- Authorization: Basic [credentials]

Params: none

Body: none

Return type: json {message: "token value"}

### User logout endpoint

```
/userLogout?_format=json
```

Type: GET

Headers:

- Authorization: Bearer Token [token]

Params: none

Body: none

Return type: json {message: "User logged out."}

### User delete endpoint

```
/userDelete?_format=json
```

Type: GET

Headers:

- Authorization: Bearer Token [token]

Params: none

Body: none

Return type: json {message: "User account deleted."}

### User register endpoint

```
/userRegister?_format=json
```

Type: POST

Headers: none

Params: none

Body: {"username": "some_user", "email": "some_email", "password": "some_pass"}

Return type: json {"message": "User registered.", "drupalId": "172"}

### User update endpoint

```
/userUpdate?_format=json
```

Type: POST

Headers:

- Authorization: Bearer Token [token]

Params: none

Body: {"username": "some_user", "email": "some_email", "newPassword": "some_new_pass", "confirmNewPassword": "some_new_pass"}

Return type: json {"message": "User updated."}

## Mongo

- MongoDB DEV instance:

```
mongodb://studiopresent:studio%2324%2B%2B%2B%2B@10.1.3.237:27017
```

Use MongoDB Compass (https://www.mongodb.com/products/compass) for querying,
optimizing, and analyzing your MongoDB data.

## Monorepo

All the scripts below are run from the root of the project

adding new packages

```
yarn init-package [package-name]
```

### App

Installing all the dependencies for app

```
yarn install-rn
```

Downloads and install new pods #iOS only

```
yarn pod-install
```

Starts Metro Bundler

```
yarn start
```

Run the application on the specified system

```
yarn android
```

or

```
yarn ios
```

### Web

Installing all the dependencies for web

```
yarn install
```

Starting web app

```
yarn dev:web
```

## Author

![Studio Present](https://www.drupal.org/files/styles/grid-3/public/sp-emal-potpis.png)

https://www.studiopresent.com
