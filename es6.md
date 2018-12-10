# ES6 注意的笔记

## ES 与 JS

ES（ECMAScript）可以理解为一个标准，JS（JavaScript）理解为一个标准的实现。

## var 与 let

var和let都是定义变量的。它们的区别如下：

- var只有两种作用域：

    1. 全局作用域
    2. 函数内的局部作用域

- let只要遇到代码块（用`{}`包含起来的代码部分）就是一个作用域。

``` js
var a = 1;
function foo () {
    if(false){
        var a = 2;
    }
    console.log(a);
}
foo();
//以上代码执行结果为undefined。
//在函数foo中，a变量被提升到函数内最顶部了，但是并没有给a赋值，故输出undefined。
```

## const

const用于定义常量（最好定义常量写成大写的，比较符合语法规范）。一旦被定义了就不能改变了。**const声明和赋值必须同时完成，不能分开写。**
const的作用域与let的一样。

``` js
let user = {name:'lili',age:18};
const SUPER_USER = user;
console.log(SUPER_USER);//输出{name:'lili',age:18}
SUPER_USER.age = 20;
console.log(SUPER_USER);//输出{name:'lili',age:20}
```

``` js
let user = {name:'lili',age:18};
const SUPER_USER = user;
console.log(SUPER_USER);//输出{name:'lili',age:18}
SUPER_USER = {};//报错
console.log(SUPER_USER);//不执行，无输出
```

出现以上情况的原因是：对象赋值的时候是把**对象的指针**赋值。代码段1只是修改了值，并没有修改指针，不是修改了赋值，故并没有报错；而代码段2是把新的对象指针赋值给常量了，修改了赋值，故报错。

## 变量的结构赋值

- 数组
    ``` js
    let [a,b,c] = [1,2,3];
    console.log(a,b,c);//1,2,3
    //----------------------------
    let [a, ,c] = [1,2,3];
    console.log(a,c);//1,3
    //----------------------------
    let [a,b,c] = [1,2];
    console.log(a);//1
    console.log(b);//2
    console.log(c);//undefined
    //----------------------------
    let [a,...c] = [1,2,3];
    console.log(a);//1
    console.log(c);//[2,3]
    //----------------------------
    let [...a,c] = [1,2,3];
    console.log(a);//[1,2]
    console.log(c);//3
    //----------------------------（指定默认值）
    let [a,b,c = 'default',d = 'default'] = [1,2,3];
    console.log(a);//1
    console.log(b);//2
    console.log(c);//3
    console.log(d);//'defualt'
    ```
    总结：数组的解构赋值中，顺序（索引）非常重要，如果顺序乱了，赋值就不正确了。
- 对象
    ``` js
    let obj = {
        a: 1,
        b: 2
    };
    //----------------------------
    let {a,b} = obj;
    console.log(a,b);//1,2
    //----------------------------
    let {a,c} = obj;
    console.log(a);//1
    console.log(c);//undefined
    //----------------------------
    let {a:A,b} = obj;//解构赋值重命名
    console.log(A);//1
    // 其实`let {a,b} = obj`相当于`let {a:a,b:b} = obj`。这里只不过简写了。
    console.log(b);//2
    console.log(a);//报错，a is not defined
    //----------------------------
    let a = 0;
    console.log(a);//0
    //{a,b} = obj;//这样会报语法错误，js解析器会把花括号中的内容解析为代码块
    ({a,b} = obj);//这样写就会处理成语句
    console.log(a);//1
    //----------------------------（指定默认值）
    let {a = 1,b = 2} = {a: 10};
    console.log(a);//10
    console.log(b);//2
    //----------------------------（重命名后再指定默认值）
    let {a:A = 1,b = 2} = {a: 10};
    console.log(A);//10
    console.log(b);//2
    console.log(a);//报错，a is not defined
    //----------------------------
    let obj1 = {
        arr:[
            'heihei',
            {
                a: 1
            }
        ]
    };
    let {arr:[greet,{a}]} = obj1;
    console.log(greet);//'heihei'
    console.log(a);//1
    console.log(arr);//报错，arr is not defined
    //----------------------------（对象解构赋值可以结构方法）
    let {floor,pow} = Math;
    console.log(floor(1.1));//1
    console.log(floor(1.9));//1
    ```
    总结：对象的解构赋值中，顺序不再重要，名称非常重要。
- 其他
    ``` js
    // 解构字符串
    let { length } = 'you';
    console.log(length);//3
    let {a,b,c} = 'you';
    console.log(a);//y
    console.log(b);//o
    console.log(c);//u
    // 解构函数传参
    let arr = [1,2];
    let obj = { b:2, a:1 };
    let obj1 = { a:1 };
        //传统方法
    test(arr[0],arr[1]);
    function test(a,b) {
        console.log(a);//1
        console.log(b);//2
    }
        //es6（数组传参）
    test1(arr);
    function test1([a,b]) {
        console.log(a);//1
        console.log(b);//2
    }
        //es6（对象传参）--不用在意参数的顺序
    test2(obj);
    function test2({a,b}) {
        console.log(a);//1
        console.log(b);//2
    }
        //es6（设置参数默认值）
    test3(obj1);
    function test3({a,b = 10}) {
        console.log(a);//1
        console.log(b);//10
        //传统方法：b = b || 10;
    }
    ```

## 新增字符串方法

- 判断字符串中是否存在某子串
    ``` js
    let str = 'you';
    //传统方法
    console.log(str.indexOf('y') !== -1);//true
    //es6
    console.log(str.includes('y'));//true
    //es6判断开头的子串
    console.log(str.startsWith('y'));//true
    //es6判断结束的子串
    console.log(str.endsWith('u'));//true
    ```
- 重复字符串
    ``` js
    let str = 'you';
    console.log(str.repeat(3));//youyouyou
    ```

## 模板字符串

将字符串用``包括起来。模板里面可以直接写变量（通过特殊语法），且模板里面还可以嵌套模板。

``` js
// 传统方法
var title1 = '2018新款 女士 雪地靴';
var tpl1 = '<div>'+
            '<span>'+ title1 +'</span>'
            +'</div>';
// es6方法
let title2 = '2018新款 羊绒毛衣';
let des = '男士';
let tpl2 = `
    <div>
        <span>${title2 + `<span>${des}</span>` }</span>
    </div>
`
console.log(tpl2);
// <div>
//     <span>2018新款 羊绒毛衣<span>男士</span></span>
// </div>
```

## 新的数据类型 —— Symbol

原来的基本数据类型：Number、String、Bool、Object、null、undefined。（Array属于Object）

现在要再新加一种数据类型Symbol。**Symbol每次创建的时候值都不一样。**

``` js
let a = Symbol();
//Symbol里面可以加一个字符串用来描述这个symbol，不影响值。例：let a = Symbol('this a symbol');
let b = Symbol();
console.log(a === b);//false
```

**Symbol的最大用处：作为一个对象的属性名称，防止对象的属性名被重写。**
稍等
还需要重新理解