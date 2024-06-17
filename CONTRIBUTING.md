# Guidelines

The following are the project guidelines for contributing

### Spacing and indentation

- All the indentation must be equal to 4 spaces or tab.
- A single line of code must not contain more than 120 characters.
- Always put a semicolon ```;``` at the end of every line of code except function declarations and classes.

### Code cleanliness

- Do not leave code that logs to the console e.g. ```console.log(1)```
- Do not leave dead code i.e. code that is not working.
- Do not leave commented code that does not serve a purpose.

### Constants and variables

- Constants must always be in caps e.g. ```PI = 3.14```
- Variables must be in camelcase e.g. ```accountNumber```
- Do not write shortcuts for variables e.g. ```regNumber``` for ```registrationNumber```

### General

- Write a very short description of what a function does and the return type e.g. 
```javascript
  function fun() {
    /**
    description: This function calculates area of a circle.
    return: int
    last-updated: 2023/12/22
    **/
  }
```
- Use UI components from **antd** library or custom made components.
- Only the grid or flexbox capabilities can be used in **bootstrap**.
- Use the ***README.md*** file in the root of the project for application specific instructions.
- Create a new branch for a new feature.
- Create a pull request to have your changes merged to the production branch.