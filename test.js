class Fruit {
    constructor() {
    }
}

const apple1 = new Fruit();
const apple2 = Object.create(Fruit.prototype);
const apple3 = new Object();
const apple4 = Object.create(null);
console.log(apple1, apple2, apple3, apple4);