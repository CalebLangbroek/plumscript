<h1 align=center>
  <img src="./images/plumscript.svg" width="500px" alt="plumscript logo" /><br />
</h1>
<p align=center>PlumScript is a small, interpreted programming language made with TypeScript.</p>

## About
[Try it out here.](https://plum.caleblangbroek.com)

```
fun add(int a, int b) {
    return a + b
}

int sum = add(5, 3)

# Prints 8
print(sum)
```

## Features
- Variables, functions, and type checking
- Error handling
- Iterators and conditionals
- Order of operations

## Getting Started
Before getting started make sure you have npm installed.

### Installing
First install the required dependencies by running the command below.
```
npm install
```

### Running
To run the project first compile the TypeScript files with the TypeScript compiler, then run the JavaScript files with Node.
```
tsc
npm start
```
You can also run the following command in a separate terminal to recompile after a file changes.
```
tsc -w
```

### Testing
To test the project run the following command.
```
npm test
```

## License
Distributed under the MIT License.
