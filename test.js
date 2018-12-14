let a = 1,b = 2;
let mod = {
    Person:function(){
        this.name = 'lili';
    },
};
mod.Person.prototype.showName = function () {
    console.log(this.name);
    return this.name;
};

let show = function () {
    console.log(a,b);
};

let sum = function () {
    console.log(a+b);
};
export default mod;
export {a,b,show,sum};